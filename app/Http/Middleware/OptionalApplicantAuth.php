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
                return redirect()->route('applicant.register')
                    ->with('info', 'Please register to apply for admission.');
            }
        }

        return $next($request);
    }
}
