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

        // Check if Apply Now is disabled
        if (!$applyNowEnabled) {
            return redirect()->route('home')->with('error', 'Applications are currently closed.');
        }

        // Get active session from database
        $session = Session::where('is_active', true)->first();

        if (!$session) {
            return redirect()->route('home')->with('error', 'No active admission session. Please contact admin.');
        }

        // Share session data with request
        $request->merge(['active_session' => $session]);

        return $next($request);
    }
}
