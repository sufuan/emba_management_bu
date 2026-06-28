<?php

namespace App\Http\Controllers;

use App\Models\Applicant;
use App\Services\PDFService;
use Illuminate\Http\Request;

class PDFController extends Controller
{
    protected PDFService $pdfService;

    public function __construct(PDFService $pdfService)
    {
        $this->pdfService = $pdfService;
    }

    /**
     * Download application form PDF.
     */
    public function downloadApplication(Applicant $applicant)
    {
        return $this->pdfService->downloadApplicationPDF($applicant);
    }

    /**
     * Download admit card PDF (included in application PDF).
     */
    public function downloadAdmitCard(Applicant $applicant)
    {
        // Admit card is now part of the application PDF
        return $this->pdfService->downloadApplicationPDF($applicant);
    }

    /**
     * Stream/Preview application form PDF.
     */
    public function previewApplication(Applicant $applicant)
    {
        return $this->pdfService->streamApplicationPDF($applicant);
    }

    /**
     * Download the offline application form PDF.
     * Primary: public/pdf/offline-form.pdf (admin-uploaded)
     * Fallback: pdf/offline-form.pdf at base path
     */
    public function downloadOfflineForm()
    {
        $dynamicPath = public_path('pdf/offline-form.pdf');
        $backupPath  = base_path('pdf/offline-form.pdf');

        if (file_exists($dynamicPath)) {
            $path = $dynamicPath;
        } elseif (file_exists($backupPath)) {
            $path = $backupPath;
        } else {
            abort(404, 'Offline application form not found.');
        }

        return response()->download($path, 'offline-form.pdf', [
            'Content-Type'        => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="offline-form.pdf"',
        ]);
    }

    /**
     * Upload a new offline application form PDF (admin only).
     * Saves to public/pdf/offline-form.pdf (web-accessible directory).
     */
    public function uploadOfflineForm(Request $request)
    {
        $request->validate([
            'offline_form_pdf' => [
                'required',
                'file',
                'mimes:pdf',
                'max:10240', // 10 MB
            ],
        ], [
            'offline_form_pdf.required' => 'Please select a PDF file to upload.',
            'offline_form_pdf.mimes'    => 'The file must be a PDF.',
            'offline_form_pdf.max'      => 'The PDF must not be larger than 10 MB.',
        ]);

        $destination = public_path('pdf');

        // Ensure the directory exists with proper permissions
        if (!is_dir($destination)) {
            mkdir($destination, 0755, true);
        }

        // Move uploaded file, overwriting any existing one
        $request->file('offline_form_pdf')->move($destination, 'offline-form.pdf');

        return back()->with('success', 'Offline application form updated successfully.');
    }
}

