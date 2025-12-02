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
        }

        return Inertia::render('Home', [
            'applyNowEnabled' => $applyNowEnabled,
            'activeSession' => $activeSession,
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
        }

        return Inertia::render('AdmissionInfo', [
            'applyNowEnabled' => $applyNowEnabled,
            'activeSession' => $activeSession,
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
