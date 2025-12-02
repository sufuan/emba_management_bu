<?php

namespace App\Http\Controllers;

use App\Models\Applicant;
use App\Models\Session;
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

        return Inertia::render('Application/Create', [
            'session' => $activeSession,
            'subjectChoices' => config('admission.subject_choices'),
            'uploadConfig' => config('admission.uploads'),
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
            'nid' => 'required|string|max:20',
            'phone' => 'required|string|max:20',
            'email' => 'required|email|max:255',
            'subject_choice' => 'required|string',
            'experience_json' => 'nullable|string',
            'education_json' => 'nullable|string',
            'passport_photo' => 'required|image|mimes:jpg,jpeg,png|max:200|dimensions:width=300,height=300',
            'signature' => 'required|image|mimes:jpg,jpeg,png|max:200|dimensions:width=300,height=80',
        ]);

        // Parse JSON strings to arrays
        $validated['education_json'] = json_decode($validated['education_json'] ?? '[]', true) ?: [];
        $validated['experience_json'] = json_decode($validated['experience_json'] ?? '[]', true) ?: [];

        $applicant = $this->applicantService->createApplicant(
            $validated,
            $request->file('passport_photo'),
            $request->file('signature')
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

        return Inertia::render('Application/Preview', [
            'applicant' => $applicant,
        ]);
    }

    /**
     * Track application status.
     */
    public function track(Request $request)
    {
        return Inertia::render('Application/Track');
    }

    /**
     * Search application by form number or phone.
     */
    public function search(Request $request)
    {
        $validated = $request->validate([
            'search' => 'required|string|min:3',
        ]);

        $applicant = Applicant::where('form_no', $validated['search'])
            ->orWhere('phone', $validated['search'])
            ->orWhere('email', $validated['search'])
            ->first();

        if (!$applicant) {
            return back()->with('error', 'No application found.');
        }

        return redirect()->route('application.status', $applicant->id);
    }

    /**
     * Show application status.
     */
    public function status(Applicant $applicant)
    {
        $applicant->load(['session', 'uploads']);

        return Inertia::render('Application/Status', [
            'applicant' => $applicant,
        ]);
    }
}
