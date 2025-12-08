<?php

namespace App\Services;

use App\Models\Applicant;
use App\Models\PdfLog;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;
use Picqer\Barcode\BarcodeGeneratorPNG;

class PDFService
{
    /**
     * Generate Barcode as base64 PNG for PDF embedding.
     */
    protected function generateBarcodeBase64(string $code): string
    {
        $generator = new BarcodeGeneratorPNG();
        $barcode = $generator->getBarcode($code, $generator::TYPE_CODE_128, 2, 40);
        
        return 'data:image/png;base64,' . base64_encode($barcode);
    }

    /**
     * Generate Application Form PDF.
     */
    public function generateApplicationPDF(Applicant $applicant): string
    {
        $applicant->load(['session', 'uploads']);

        // Generate barcode
        $barcodeBase64 = $this->generateBarcodeBase64($applicant->form_no);

        $pdf = Pdf::loadView('pdf.application-form', [
            'applicant' => $applicant,
            'session' => $applicant->session,
            'barcodeBase64' => $barcodeBase64,
        ]);

        $pdf->setPaper('A4', 'portrait');

        // Generate storage path
        $path = sprintf(
            'sessions/%d/applicants/%d/application.pdf',
            $applicant->session_id,
            $applicant->id
        );

        // Store PDF
        Storage::disk('public')->put($path, $pdf->output());

        // Log PDF generation
        PdfLog::create([
            'applicant_id' => $applicant->id,
            'pdf_type' => 'application',
            'generated_at' => now(),
        ]);

        return $path;
    }

    /**
     * Generate Admit Card PDF.
     */
    public function generateAdmitCardPDF(Applicant $applicant): string
    {
        $applicant->load(['session', 'uploads']);

        $pdf = Pdf::loadView('pdf.admit-card', [
            'applicant' => $applicant,
            'session' => $applicant->session,
        ]);

        $pdf->setPaper('A4', 'portrait');

        // Generate storage path
        $path = sprintf(
            'sessions/%d/applicants/%d/admit_card.pdf',
            $applicant->session_id,
            $applicant->id
        );

        // Store PDF
        Storage::disk('public')->put($path, $pdf->output());

        // Log PDF generation
        PdfLog::create([
            'applicant_id' => $applicant->id,
            'pdf_type' => 'admit_card',
            'generated_at' => now(),
        ]);

        return $path;
    }

    /**
     * Download Application PDF.
     */
    public function downloadApplicationPDF(Applicant $applicant)
    {
        $applicant->load(['session', 'uploads']);

        // Generate barcode
        $barcodeBase64 = $this->generateBarcodeBase64($applicant->form_no);

        $pdf = Pdf::loadView('pdf.application-form', [
            'applicant' => $applicant,
            'session' => $applicant->session,
            'barcodeBase64' => $barcodeBase64,
        ]);

        $filename = sprintf('application_%s.pdf', $applicant->form_no);

        return $pdf->download($filename);
    }

    /**
     * Download Admit Card PDF.
     */
    public function downloadAdmitCardPDF(Applicant $applicant)
    {
        $applicant->load(['session', 'uploads']);

        $pdf = Pdf::loadView('pdf.admit-card', [
            'applicant' => $applicant,
            'session' => $applicant->session,
        ]);

        $filename = sprintf('admit_card_%s.pdf', $applicant->admission_roll);

        return $pdf->download($filename);
    }

    /**
     * Stream PDF for preview.
     */
    public function streamApplicationPDF(Applicant $applicant)
    {
        $applicant->load(['session', 'uploads']);

        // Generate barcode
        $barcodeBase64 = $this->generateBarcodeBase64($applicant->form_no);

        $pdf = Pdf::loadView('pdf.application-form', [
            'applicant' => $applicant,
            'session' => $applicant->session,
            'barcodeBase64' => $barcodeBase64,
        ]);

        return $pdf->stream('application_preview.pdf');
    }
}

