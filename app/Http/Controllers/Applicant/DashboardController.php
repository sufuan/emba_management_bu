<?php

namespace App\Http\Controllers\Applicant;

use App\Http\Controllers\Controller;
use App\Models\Session;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the applicant dashboard.
     */
    public function index(Request $request): Response
    {
        $user = $request->user('applicant');
        $applicant = $user->applicant;

        // Get active session and settings for the application form
        $activeSession = Session::where('is_active', true)->first();
        $settings = Setting::first();

        return Inertia::render('Applicant/Dashboard', [
            'user' => $user,
            'applicant' => $applicant ? $applicant->load('session') : null,
            'session' => $activeSession,
            'subjectChoices' => config('admission.subject_choices', ['Management']),
            'uploadConfig' => config('admission.upload_config'),
            'paymentSettings' => [
                'payment_fee' => $settings?->payment_fee ?? 500,
                'payment_bkash_number' => $settings?->payment_bkash_number,
                'payment_nagad_number' => $settings?->payment_nagad_number,
                'payment_rocket_number' => $settings?->payment_rocket_number,
                'payment_bank_name' => $settings?->payment_bank_name,
                'payment_bank_account' => $settings?->payment_bank_account,
            ],
        ]);
    }

    /**
     * Display my application page (create or preview).
     */
    public function myApplication(Request $request): Response
    {
        $user = $request->user('applicant');
        $applicant = $user->applicant;

        // Get active session and settings for the application form
        $activeSession = Session::where('is_active', true)->first();
        $settings = Setting::first();

        return Inertia::render('Application/MyApplication', [
            'user' => $user,
            'applicant' => $applicant ? $applicant->load('session') : null,
            'session' => $activeSession,
            'subjectChoices' => config('admission.subject_choices', ['Management']),
            'uploadConfig' => config('admission.upload_config'),
            'paymentSettings' => [
                'payment_fee' => $settings?->payment_fee ?? 500,
                'payment_bkash_number' => $settings?->payment_bkash_number,
                'payment_nagad_number' => $settings?->payment_nagad_number,
                'payment_rocket_number' => $settings?->payment_rocket_rocket_number,
                'payment_bank_name' => $settings?->payment_bank_name,
                'payment_bank_account' => $settings?->payment_bank_account,
            ],
        ]);
    }
}
