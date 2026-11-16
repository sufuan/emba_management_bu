<?php

namespace App\Http\Controllers\Applicant;

use App\Http\Controllers\Controller;
use App\Mail\ApplicantPasswordOtpMail;
use App\Models\ApplicantUser;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

/**
 * OTP-based password recovery for applicant accounts.
 *
 * Flow: applicant enters their registered email -> a 6-digit code is
 * emailed (stored hashed in password_reset_tokens, 10-minute validity)
 * -> applicant submits the code together with a new password.
 *
 * Owner decision 2026-11-16: NO barriers of any kind — no resend
 * cooldown, no send cap, no wrong-attempt limit. Codes are single-use
 * and expire after 10 minutes. Duplicate emails are allowed, so a
 * successful reset updates EVERY account registered with that email.
 */
class PasswordResetOtpController extends Controller
{
    private const OTP_TTL_MINUTES = 10;
    private const SESSION_KEY = 'applicant_password_reset_email';

    /**
     * Show the "forgot password" form (step 1: enter email).
     */
    public function create(): Response
    {
        return Inertia::render('Applicant/Auth/ForgotPassword', [
            'status' => session('status'),
        ]);
    }

    /**
     * Send the OTP code to the applicant's registered email.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|string|lowercase|email|max:255',
        ]);

        $email = $request->input('email');

        $user = ApplicantUser::where('email', $email)->first();

        if (! $user) {
            throw ValidationException::withMessages([
                'email' => 'This email is not registered. Please create an account first.',
            ]);
        }

        return $this->sendOtp($email, 'A 6-digit code has been sent to your email address.');
    }

    /**
     * Resend the OTP code (same rules as the first send).
     */
    public function resend(Request $request): RedirectResponse
    {
        $email = $request->session()->get(self::SESSION_KEY);

        if (! $email) {
            return redirect()->route('applicant.password.request')
                ->withErrors(['email' => 'Please enter your email address first.']);
        }

        return $this->sendOtp($email, 'A new code has been sent to your email address.');
    }

    /**
     * Show the reset form (step 2: code + new password).
     */
    public function edit(Request $request): Response|RedirectResponse
    {
        $email = $request->session()->get(self::SESSION_KEY);

        if (! $email) {
            return redirect()->route('applicant.password.request');
        }

        return Inertia::render('Applicant/Auth/ResetPasswordOtp', [
            'email' => $email,
            'status' => session('status'),
        ]);
    }

    /**
     * Verify the OTP and set the new password.
     */
    public function update(Request $request): RedirectResponse
    {
        $request->validate([
            'otp' => 'required|string|digits:6',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ], [
            'otp.digits' => 'The code must be exactly 6 digits.',
        ]);

        $email = $request->session()->get(self::SESSION_KEY);

        if (! $email) {
            return redirect()->route('applicant.password.request')
                ->withErrors(['email' => 'Your session has expired. Please request a new code.']);
        }

        $record = DB::table('password_reset_tokens')->where('email', $email)->first();

        if (! $record) {
            throw ValidationException::withMessages([
                'otp' => 'No valid code was found for this email. Please request a new code.',
            ]);
        }

        if (now()->diffInMinutes($record->created_at) >= self::OTP_TTL_MINUTES) {
            DB::table('password_reset_tokens')->where('email', $email)->delete();

            throw ValidationException::withMessages([
                'otp' => 'This code has expired. Please request a new code.',
            ]);
        }

        if (! Hash::check($request->input('otp'), $record->token)) {
            throw ValidationException::withMessages([
                'otp' => 'The code you entered is incorrect. Please check your email and try again.',
            ]);
        }

        // Duplicate emails are allowed: reset EVERY account with this email
        // so the new password works no matter which account signs in.
        $users = ApplicantUser::where('email', $email)->get();

        if ($users->isEmpty()) {
            DB::table('password_reset_tokens')->where('email', $email)->delete();

            throw ValidationException::withMessages([
                'otp' => 'This account no longer exists. Please create a new account.',
            ]);
        }

        $passwordHash = Hash::make($request->input('password'));

        foreach ($users as $user) {
            $user->forceFill([
                'password' => $passwordHash,
                'remember_token' => null,
            ])->save();
        }

        DB::table('password_reset_tokens')->where('email', $email)->delete();
        $request->session()->forget(self::SESSION_KEY);

        return redirect()->route('applicant.login')
            ->with('status', 'Your password has been reset successfully. Please sign in with your new password.');
    }

    /**
     * Shared send logic for the first send and for resends.
     * No cooldown and no send cap — a new code can be requested
     * at any time, as often as the applicant wants.
     */
    private function sendOtp(string $email, string $statusMessage): RedirectResponse
    {
        $otp = (string) random_int(100000, 999999);

        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $email],
            ['token' => Hash::make($otp), 'created_at' => now()]
        );

        try {
            Mail::to($email)->send(new ApplicantPasswordOtpMail($otp));
        } catch (\Throwable $e) {
            Log::error('Applicant OTP mail failed', ['email' => $email, 'error' => $e->getMessage()]);
            DB::table('password_reset_tokens')->where('email', $email)->delete();

            throw ValidationException::withMessages([
                'email' => 'We could not send the email right now. Please try again in a few minutes.',
            ]);
        }

        session([self::SESSION_KEY => $email]);

        return redirect()->route('applicant.password.otp.form')
            ->with('status', $statusMessage);
    }
}
