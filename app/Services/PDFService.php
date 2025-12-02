<?php

namespace App\Services;

use App\Models\Applicant;
use App\Models\PdfLog;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

class PDFService
{
    /**
     * Generate Application Form PDF.
     */
    public function generateApplicationPDF(Applicant $applicant): string
    {
        $applicant->load(['session', 'uploads']);

        $pdf = Pdf::loadView('pdf.application-form', [
            'applicant' => $applicant,
            'session' => $applicant->session,
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

        $pdf = Pdf::loadView('pdf.application-form', [
            'applicant' => $applicant,
            'session' => $applicant->session,
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

        $pdf = Pdf::loadView('pdf.application-form', [
            'applicant' => $applicant,
            'session' => $applicant->session,
        ]);

        return $pdf->stream('application_preview.pdf');
    }
}

