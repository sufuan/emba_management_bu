<?php

namespace App\Http\Middleware;

use App\Models\Session;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckApplyNow
{
    /**
     * Handle an incoming request.
     * Checks if Apply Now is enabled and active session exists.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $applyNowEnabled = config('admission.apply_now_enabled');
        $activeSessionId = config('admission.active_session_id');

        // Check if Apply Now is disabled
        if (!$applyNowEnabled) {
            if ($request->wantsJson() || $request->header('X-Inertia')) {
                return response()->json([
                    'message' => 'Applications are currently closed.',
                    'apply_now_enabled' => false,
                ], 403);
            }
            return redirect()->route('admission.closed');
        }

        // Check if active session exists
        if (!$activeSessionId) {
            if ($request->wantsJson() || $request->header('X-Inertia')) {
                return response()->json([
                    'message' => 'No active admission session.',
                    'apply_now_enabled' => false,
                ], 403);
            }
            return redirect()->route('admission.closed');
        }

        // Verify session exists and is active
        $session = Session::where('id', $activeSessionId)
            ->where('is_active', true)
            ->first();

        if (!$session) {
            if ($request->wantsJson() || $request->header('X-Inertia')) {
                return response()->json([
                    'message' => 'Active admission session not found.',
                    'apply_now_enabled' => false,
                ], 403);
            }
            return redirect()->route('admission.closed');
        }

        // Share session data with request
        $request->merge(['active_session' => $session]);

        return $next($request);
    }
}
