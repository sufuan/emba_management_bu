<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Applicant;
use App\Models\Session;
use App\Services\ApplicantService;
use App\Services\PDFService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ApplicantController extends Controller
{
    protected ApplicantService $applicantService;
    protected PDFService $pdfService;

    public function __construct(ApplicantService $applicantService, PDFService $pdfService)
    {
        $this->applicantService = $applicantService;
        $this->pdfService = $pdfService;
    }

    /**
     * List all applicants with filters.
     */
    public function index(Request $request)
    {
        $query = Applicant::with(['session', 'uploads']);

        // Filter by session
        if ($request->filled('session_id')) {
            $query->where('session_id', $request->session_id);
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('form_no', 'like', "%{$search}%")
                    ->orWhere('admission_roll', 'like', "%{$search}%");
            });
        }

        $applicants = $query->latest()->paginate(15)->withQueryString();
        $sessions = Session::all();

        return Inertia::render('Admin/Applicants/Index', [
            'applicants' => $applicants,
            'sessions' => $sessions,
            'filters' => $request->only(['session_id', 'status', 'search']),
            'statuses' => config('admission.statuses'),
        ]);
    }

    /**
     * Show single applicant details.
     */
    public function show(Applicant $applicant)
    {
        $applicant->load(['session', 'uploads', 'pdfLogs']);

        return Inertia::render('Admin/Applicants/Show', [
            'applicant' => $applicant,
            'statuses' => config('admission.statuses'),
        ]);
    }

    /**
     * Update applicant status.
     */
    public function updateStatus(Request $request, Applicant $applicant)
    {
        $validated = $request->validate([
            'status' => 'required|in:submitted,pending,verified',
        ]);

        $applicant->update(['status' => $validated['status']]);

        return back()->with('success', 'Status updated successfully.');
    }

    /**
     * Delete applicant.
     */
    public function destroy(Applicant $applicant)
    {
        $applicant->delete();

        return redirect()->route('admin.applicants.index')
            ->with('success', 'Applicant deleted successfully.');
    }

    /**
     * Bulk update status.
     */
    public function bulkUpdateStatus(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:applicants,id',
            'status' => 'required|in:submitted,pending,verified',
        ]);

        Applicant::whereIn('id', $validated['ids'])
            ->update(['status' => $validated['status']]);

        return back()->with('success', 'Status updated for selected applicants.');
    }

    /**
     * Export applicants to PDF.
     */
    public function exportPdf(Request $request)
    {
        $query = Applicant::with('session');

        if ($request->filled('session_id')) {
            $query->where('session_id', $request->session_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $applicants = $query->get();

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.applicants-list', [
            'applicants' => $applicants,
        ]);

        return $pdf->download('applicants_list.pdf');
    }
}
