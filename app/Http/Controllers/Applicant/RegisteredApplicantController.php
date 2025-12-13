<?php

namespace App\Http\Controllers\Applicant;

use App\Http\Controllers\Controller;
use App\Models\ApplicantUser;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredApplicantController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Applicant/Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|string|lowercase|email|max:255|unique:' . ApplicantUser::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = ApplicantUser::create([
            'name' => $request->email, // Use email as name temporarily
            'email' => $request->email,
            'phone' => 'pending', // Placeholder for phone
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));

        Auth::guard('applicant')->login($user);

        return redirect()->route('applicant.application.create');
    }
}
