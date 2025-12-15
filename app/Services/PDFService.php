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
     * Get university logo as base64 data URI.
     */
    protected function getLogoBase64(): ?string
    {
        // Logo is in root directory after moving public contents
        $path = base_path('logo/university_logo.png');
        if (!is_file($path)) {
            return null;
        }
        $data = @file_get_contents($path);
        if ($data === false) {
            return null;
        }
        return 'data:image/png;base64,' . base64_encode($data);
    }

    /**
     * Get applicant photo as base64 data URI from storage public disk.
     */
    protected function getPhotoBase64(?string $photoPath): ?string
    {
        if (!$photoPath) {
            return null;
        }
        $fullPath = Storage::disk('public')->path($photoPath);
        if (!is_file($fullPath)) {
            return null;
        }
        $data = @file_get_contents($fullPath);
        if ($data === false) {
            return null;
        }
        $ext = strtolower(pathinfo($fullPath, PATHINFO_EXTENSION));
        $mime = match ($ext) {
            'jpg', 'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'gif' => 'image/gif',
            default => 'image/jpeg',
        };
        return 'data:' . $mime . ';base64,' . base64_encode($data);
    }

    /**
     * Generate Application Form PDF.
     */
    public function generateApplicationPDF(Applicant $applicant): string
    {
        $applicant->load(['session', 'uploads']);

        // Generate barcode and embed assets
        $barcodeBase64 = $this->generateBarcodeBase64($applicant->form_no);
        $logoBase64 = $this->getLogoBase64();
        $photoBase64 = $this->getPhotoBase64($applicant->photo_path);

        $pdf = Pdf::loadView('pdf.application-form', [
            'applicant' => $applicant,
            'session' => $applicant->session,
            'barcodeBase64' => $barcodeBase64,
            'logoBase64' => $logoBase64,
            'photoBase64' => $photoBase64,
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
     * Download Application PDF.
     */
    public function downloadApplicationPDF(Applicant $applicant)
    {
        $applicant->load(['session', 'uploads']);

        // Generate barcode and embed assets
        $barcodeBase64 = $this->generateBarcodeBase64($applicant->form_no);
        $logoBase64 = $this->getLogoBase64();
        $photoBase64 = $this->getPhotoBase64($applicant->photo_path);

        $pdf = Pdf::loadView('pdf.application-form', [
            'applicant' => $applicant,
            'session' => $applicant->session,
            'barcodeBase64' => $barcodeBase64,
            'logoBase64' => $logoBase64,
            'photoBase64' => $photoBase64,
        ]);

        $filename = sprintf('application_%s.pdf', $applicant->form_no);

        return $pdf->download($filename);
    }



    /**
     * Stream PDF for preview.
     */
    public function streamApplicationPDF(Applicant $applicant)
    {
        $applicant->load(['session', 'uploads']);

        // Generate barcode and embed assets
        $barcodeBase64 = $this->generateBarcodeBase64($applicant->form_no);
        $logoBase64 = $this->getLogoBase64();
        $photoBase64 = $this->getPhotoBase64($applicant->photo_path);

        $pdf = Pdf::loadView('pdf.application-form', [
            'applicant' => $applicant,
            'session' => $applicant->session,
            'barcodeBase64' => $barcodeBase64,
            'logoBase64' => $logoBase64,
            'photoBase64' => $photoBase64,
        ]);

        return $pdf->stream('application_preview.pdf');
    }
}

