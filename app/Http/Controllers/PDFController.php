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
     *
     * On shared hosting, streaming files through PHP is unreliable (output buffering,
     * memory limits, connection resets). Instead, we redirect the browser directly to
     * the public file URL so Apache/Nginx serves it — far more stable.
     *
     * Fallback: If the file is not in the public/ directory (e.g. base_path),
     * we stream it via PHP with output buffer cleared.
     */
    public function downloadOfflineForm()
    {
        $publicRelative = 'pdf/offline-form.pdf';
        $publicAbsolute = public_path($publicRelative);

        // Primary: file is in public/ — redirect so the web server serves it directly.
        // The public/pdf/.htaccess forces Content-Disposition: attachment.
        if (file_exists($publicAbsolute)) {
            // Bust cache so browser always fetches fresh copy
            $bust = '?v=' . filemtime($publicAbsolute);
            return redirect(asset($publicRelative) . $bust);
        }

        // Fallback: file is outside public/ — stream via PHP with buffer cleared
        $backupPath = base_path('pdf/offline-form.pdf');
        if (file_exists($backupPath)) {
            // Clear any output buffers to prevent partial-transfer errors
            while (ob_get_level()) {
                ob_end_clean();
            }
            return response()->download($backupPath, 'offline-form.pdf', [
                'Content-Type'   => 'application/pdf',
                'Cache-Control'  => 'no-store, no-cache',
                'Pragma'         => 'no-cache',
            ]);
        }

        abort(404, 'Offline application form not found.');
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

