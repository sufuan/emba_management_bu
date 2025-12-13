<?php

namespace App\Http\Controllers;

use App\Models\Session;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Display the home page.
     */
    public function index()
    {
        $applyNowEnabled = config('admission.apply_now_enabled');
        $activeSessionId = config('admission.active_session_id');
        $activeSession = null;

        if ($activeSessionId) {
            $activeSession = Session::where('id', $activeSessionId)
                ->where('is_active', true)
                ->first();
            
            if ($activeSession) {
                $activeSession->append('formatted_name');
            }
        }

        // Get applicant user if authenticated
        $applicantUser = auth('applicant')->user();
        $hasSubmittedApplication = false;

        if ($applicantUser) {
            $hasSubmittedApplication = $applicantUser->applicant_id !== null;
        }

        return Inertia::render('Home', [
            'applyNowEnabled' => $applyNowEnabled,
            'activeSession' => $activeSession,
            'applicantAuth' => $applicantUser,
            'hasSubmittedApplication' => $hasSubmittedApplication,
        ]);
    }

    /**
     * Display about page.
     */
    public function about()
    {
        return Inertia::render('About');
    }

    /**
     * Display admission info page.
     */
    public function admissionInfo()
    {
        $applyNowEnabled = config('admission.apply_now_enabled');
        $activeSessionId = config('admission.active_session_id');
        $activeSession = null;

        if ($activeSessionId) {
            $activeSession = Session::where('id', $activeSessionId)
                ->where('is_active', true)
                ->first();
            
            if ($activeSession) {
                $activeSession->append('formatted_name');
            }
        }

        // Get applicant user if authenticated
        $applicantUser = auth('applicant')->user();
        $hasSubmittedApplication = false;

        if ($applicantUser) {
            $hasSubmittedApplication = $applicantUser->applicant_id !== null;
        }

        return Inertia::render('AdmissionInfo', [
            'applyNowEnabled' => $applyNowEnabled,
            'activeSession' => $activeSession,
            'applicantAuth' => $applicantUser,
            'hasSubmittedApplication' => $hasSubmittedApplication,
        ]);
    }

    /**
     * Display applications closed page.
     */
    public function closed()
    {
        return Inertia::render('Closed');
    }
}
