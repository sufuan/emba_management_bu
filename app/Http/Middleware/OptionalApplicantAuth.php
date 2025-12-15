<?php

namespace App\Http\Middleware;

use App\Models\Setting;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class OptionalApplicantAuth
{
    /**
     * Handle an incoming request.
     * Conditionally enforces authentication based on require_applicant_auth setting.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if authentication is required for applicants
        $requireAuth = Setting::getValue('require_applicant_auth', true);

        // If authentication is required, enforce auth:applicant guard
        if ($requireAuth) {
            if (!Auth::guard('applicant')->check()) {
                if ($request->expectsJson() || $request->header('X-Inertia')) {
                    return response()->json([
                        'message' => 'Please login to continue.',
                        'redirect' => route('applicant.login'),
                    ], 401);
                }

                return redirect()->route('applicant.login')
                    ->with('warning', 'Please login to continue with your application.');
            }
        }

        return $next($request);
    }
}
