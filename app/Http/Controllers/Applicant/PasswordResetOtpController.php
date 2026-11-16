<?php

namespace App\Http\Controllers\Applicant;

use App\Http\Controllers\Controller;
use App\Mail\ApplicantPasswordOtpMail;
use App\Models\ApplicantUser;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
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
 * Guard rails: 60-second resend cooldown, max 5 sends per hour,
 * max 5 wrong-code attempts (code is then invalidated), single use.
 */
class PasswordResetOtpController extends Controller
{
    private const OTP_TTL_MINUTES = 10;
    private const RESEND_COOLDOWN_SECONDS = 60;
    private const MAX_SENDS_PER_HOUR = 5;
    private const MAX_ATTEMPTS = 5;
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
            $attempts = (int) Cache::get($this->attemptsKey($email), 0) + 1;
            Cache::put($this->attemptsKey($email), $attempts, now()->addHour());

            if ($attempts >= self::MAX_ATTEMPTS) {
                DB::table('password_reset_tokens')->where('email', $email)->delete();
                Cache::forget($this->attemptsKey($email));

                throw ValidationException::withMessages([
                    'otp' => 'Too many incorrect attempts. This code has been cancelled — please request a new code.',
                ]);
            }

            throw ValidationException::withMessages([
                'otp' => 'The code you entered is incorrect. Please check your email and try again.',
            ]);
        }

        $user = ApplicantUser::where('email', $email)->first();

        if (! $user) {
            DB::table('password_reset_tokens')->where('email', $email)->delete();

            throw ValidationException::withMessages([
                'otp' => 'This account no longer exists. Please create a new account.',
            ]);
        }

        $user->forceFill([
            'password' => Hash::make($request->input('password')),
            'remember_token' => null,
        ])->save();

        DB::table('password_reset_tokens')->where('email', $email)->delete();
        Cache::forget($this->attemptsKey($email));
        Cache::forget($this->sendsKey($email));
        $request->session()->forget(self::SESSION_KEY);

        return redirect()->route('applicant.login')
            ->with('status', 'Your password has been reset successfully. Please sign in with your new password.');
    }

    /**
     * Shared send logic for the first send and for resends.
     */
    private function sendOtp(string $email, string $statusMessage): RedirectResponse
    {
        // Resend cooldown: one code per minute at most.
        $existing = DB::table('password_reset_tokens')->where('email', $email)->first();

        if ($existing && now()->diffInSeconds($existing->created_at) < self::RESEND_COOLDOWN_SECONDS) {
            $wait = self::RESEND_COOLDOWN_SECONDS - now()->diffInSeconds($existing->created_at);

            throw ValidationException::withMessages([
                'email' => "A code was just sent. Please wait {$wait} seconds before requesting another one.",
            ]);
        }

        // Hourly send cap.
        $sends = (int) Cache::get($this->sendsKey($email), 0);

        if ($sends >= self::MAX_SENDS_PER_HOUR) {
            throw ValidationException::withMessages([
                'email' => 'Too many codes requested for this email. Please try again after some time.',
            ]);
        }

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

        Cache::put($this->sendsKey($email), $sends + 1, now()->addHour());
        Cache::forget($this->attemptsKey($email));

        session([self::SESSION_KEY => $email]);

        return redirect()->route('applicant.password.otp.form')
            ->with('status', $statusMessage);
    }

    private function attemptsKey(string $email): string
    {
        return 'applicant_otp_attempts:' . sha1(strtolower($email));
    }

    private function sendsKey(string $email): string
    {
        return 'applicant_otp_sends:' . sha1(strtolower($email));
    }
}
