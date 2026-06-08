<?php

namespace App\Http\Controllers;

use App\Models\Applicant;
use App\Services\PDFService;

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
     * Download the static offline application form PDF.
     */
    public function downloadOfflineForm()
    {
        $path = base_path('pdf/offline-form.pdf');

        if (!file_exists($path)) {
            abort(404, 'Offline application form not found.');
        }

        return response()->file($path, [
            'Content-Type'        => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="offline-form.pdf"',
        ]);
    }
}
