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
}
