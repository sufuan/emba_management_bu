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
     * Download admit card PDF.
     */
    public function downloadAdmitCard(Applicant $applicant)
    {
        // Only verified applicants can download admit card
        if ($applicant->status !== 'verified') {
            abort(403, 'Admit card not available yet. Please wait for verification.');
        }

        return $this->pdfService->downloadAdmitCardPDF($applicant);
    }

    /**
     * Stream/Preview application form PDF.
     */
    public function previewApplication(Applicant $applicant)
    {
        return $this->pdfService->streamApplicationPDF($applicant);
    }
}
