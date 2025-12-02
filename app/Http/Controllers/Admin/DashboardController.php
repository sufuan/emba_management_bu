<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Applicant;
use App\Models\Session;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Admin dashboard with statistics.
     */
    public function index()
    {
        $activeSessionId = config('admission.active_session_id');
        $activeSession = $activeSessionId ? Session::find($activeSessionId) : null;

        // Get statistics
        $stats = [
            'total' => Applicant::count(),
            'submitted' => Applicant::where('status', 'submitted')->count(),
            'pending' => Applicant::where('status', 'pending')->count(),
            'verified' => Applicant::where('status', 'verified')->count(),
        ];

        // Recent applications
        $recentApplicants = Applicant::with('session')
            ->latest('submitted_at')
            ->take(10)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentApplicants' => $recentApplicants,
            'activeSession' => $activeSession,
        ]);
    }
}
