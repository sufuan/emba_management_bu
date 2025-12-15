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
        $query = Applicant::with(['session', 'uploads', 'applicantUser']);

        // Filter by session
        if ($request->filled('session_id')) {
            $query->where('session_id', $request->session_id);
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by account type
        if ($request->filled('account_type')) {
            if ($request->account_type === 'registered') {
                $query->whereNotNull('applicant_user_id');
            } elseif ($request->account_type === 'guest') {
                $query->whereNull('applicant_user_id');
            }
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

        $applicants = $query->latest()->paginate(15)->withQueryString()->through(function ($applicant) {
            return [
                'id' => $applicant->id,
                'full_name' => $applicant->full_name,
                'email' => $applicant->email,
                'phone' => $applicant->phone,
                'form_no' => $applicant->form_no,
                'admission_roll' => $applicant->admission_roll,
                'status' => $applicant->status,
                'submitted_at' => $applicant->submitted_at,
                'session' => $applicant->session,
                'account_type' => $applicant->account_type, // Add accessor for Registered/Guest
            ];
        });

        $sessions = Session::all();

        return Inertia::render('Admin/Applicants/Index', [
            'applicants' => $applicants,
            'sessions' => $sessions,
            'filters' => $request->only(['session_id', 'status', 'search', 'account_type']),
            'statuses' => config('admission.statuses'),
        ]);
    }

    /**
     * Show single applicant details.
     */
    public function show(Applicant $applicant)
    {
        $applicant->load(['session', 'uploads', 'pdfLogs']);
        // Provide base64 for images to avoid /storage dependency in admin show
        $applicant->append(['photo_base64', 'signature_base64']);

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

        // Add search filter
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

        $applicants = $query->latest()->get();

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.applicants-list', [
            'applicants' => $applicants,
        ]);

        return $pdf->download('applicants_list_' . now()->format('Y-m-d') . '.pdf');
    }

    /**
     * Export applicants to Excel.
     */
    public function exportExcel(Request $request)
    {
        $query = Applicant::with('session');

        if ($request->filled('session_id')) {
            $query->where('session_id', $request->session_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Add search filter
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

        $applicants = $query->latest()->get();

        // Create CSV content
        $filename = 'applicants_list_' . now()->format('Y-m-d') . '.csv';
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ];

        $callback = function() use ($applicants) {
            $file = fopen('php://output', 'w');
            
            // CSV Header
            fputcsv($file, [
                'Form No',
                'Admission Roll',
                'Full Name',
                'Father\'s Name',
                'Mother\'s Name',
                'Date of Birth',
                'NID',
                'Phone',
                'Email',
                'Present Address',
                'Permanent Address',
                'Status',
                'Session',
                'Submitted At'
            ]);

            // CSV Rows
            foreach ($applicants as $applicant) {
                fputcsv($file, [
                    $applicant->form_no,
                    $applicant->admission_roll,
                    $applicant->full_name,
                    $applicant->fathers_name,
                    $applicant->mothers_name,
                    $applicant->dob?->format('d/m/Y'),
                    $applicant->nid,
                    $applicant->phone,
                    $applicant->email,
                    $applicant->present_address,
                    $applicant->permanent_address,
                    ucfirst($applicant->status),
                    $applicant->session->session_name ?? 'N/A',
                    $applicant->submitted_at?->format('d M, Y h:i A')
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
