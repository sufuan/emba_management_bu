<?php

namespace App\Http\Controllers;

use App\Models\Applicant;
use App\Models\Session;
use App\Models\Setting;
use App\Services\ApplicantService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ApplicantController extends Controller
{
    protected ApplicantService $applicantService;

    public function __construct(ApplicantService $applicantService)
    {
        $this->applicantService = $applicantService;
    }

    /**
     * Show application form.
     */
    public function create(Request $request)
    {
        $activeSession = Session::where('id', config('admission.active_session_id'))
            ->where('is_active', true)
            ->firstOrFail();

        $requireAuth = Setting::getValue('require_applicant_auth', true);
        $authenticatedUser = $request->user('applicant');

        return Inertia::render('Application/Create', [
            'session' => $activeSession,
            'subjectChoices' => config('admission.subject_choices'),
            'uploadConfig' => config('admission.uploads'),
            'paymentSettings' => Setting::getPaymentSettings(),
            'requireAuth' => $requireAuth,
            'userEmail' => $authenticatedUser?->email,
        ]);
    }

    /**
     * Store new application.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'fathers_name' => 'required|string|max:255',
            'mothers_name' => 'required|string|max:255',
            'dob' => 'required|date|before:today',
            'nid' => 'required|string|regex:/^[0-9]+$/|min:10|max:17|unique:applicants,nid',
            'phone' => 'required|string|max:20',
            'email' => 'required|email|max:255|unique:applicants,email',
            'present_address' => 'required|string|max:500',
            'permanent_address' => 'required|string|max:500',
            'experience_json' => 'nullable|string',
            'education_json' => 'nullable|string',
            'payment_transaction_id' => 'required|string|max:100',
            'payment_method' => 'required|string|max:50',
            'payment_amount' => 'required|numeric|min:0',
            'passport_photo' => 'required|image|mimes:jpg,jpeg,png|max:200|dimensions:width=300,height=300',
        ]);

        // Parse JSON strings to arrays
        $validated['education_json'] = json_decode($validated['education_json'] ?? '[]', true) ?: [];
        $validated['experience_json'] = json_decode($validated['experience_json'] ?? '[]', true) ?: [];
        $validated['payment_date'] = now();

        $applicant = $this->applicantService->createApplicant(
            $validated,
            $request->file('passport_photo'),
            $request->user('applicant') // Pass authenticated user or null
        );

        return redirect()->route('application.preview', $applicant->id)
            ->with('success', 'Application submitted successfully!');
    }

    /**
     * Preview application before downloading.
     */
    public function preview(Applicant $applicant)
    {
        $applicant->load(['session', 'uploads']);
        
        // Append formatted_name to session
        if ($applicant->session) {
            $applicant->session->append('formatted_name');
        }

        // Append base64 image attributes for client rendering
        $applicant->append(['photo_base64', 'signature_base64']);

        return Inertia::render('Application/Preview', [
            'applicant' => $applicant,
        ]);
    }

    /**
     * Verify application by form number (QR code).
     */
    public function verify(string $formNo)
    {
        $applicant = Applicant::with('session')
            ->where('form_no', $formNo)
            ->first();

        return Inertia::render('Application/Verify', [
            'applicant' => $applicant,
            'formNo' => $formNo,
        ]);
    }
}
