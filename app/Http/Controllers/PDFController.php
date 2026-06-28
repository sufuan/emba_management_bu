<?php

namespace App\Http\Controllers;

use App\Models\Applicant;
use App\Services\PDFService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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
     * Primary: storage/app/public/pdf/offline-form.pdf (admin-uploaded via Storage disk)
     * Fallback 1: public/pdf/offline-form.pdf (legacy location)
     * Fallback 2: pdf/offline-form.pdf at base path
     */
    public function downloadOfflineForm()
    {
        // Primary: Storage public disk (storage/app/public/pdf/offline-form.pdf)
        if (Storage::disk('public')->exists('pdf/offline-form.pdf')) {
            $path = Storage::disk('public')->path('pdf/offline-form.pdf');
            return response()->download($path, 'offline-form.pdf', [
                'Content-Type' => 'application/pdf',
            ]);
        }

        // Fallback 1: legacy public/pdf/ directory
        $legacyPath = public_path('pdf/offline-form.pdf');
        if (file_exists($legacyPath)) {
            return response()->download($legacyPath, 'offline-form.pdf', [
                'Content-Type' => 'application/pdf',
            ]);
        }

        // Fallback 2: base_path pdf directory
        $backupPath = base_path('pdf/offline-form.pdf');
        if (file_exists($backupPath)) {
            return response()->download($backupPath, 'offline-form.pdf', [
                'Content-Type' => 'application/pdf',
            ]);
        }

        abort(404, 'Offline application form not found.');
    }

    /**
     * Upload a new offline application form PDF (admin only).
     * Stores into storage/app/public/pdf/offline-form.pdf via Storage disk.
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

        $file = $request->file('offline_form_pdf');

        // Store using Laravel Storage public disk — works reliably on all hosting
        Storage::disk('public')->putFileAs('pdf', $file, 'offline-form.pdf');

        // Also write to public/pdf/ for direct URL access / legacy fallback
        $publicDest = public_path('pdf');
        if (!is_dir($publicDest)) {
            mkdir($publicDest, 0755, true);
        }
        $file->move($publicDest, 'offline-form.pdf');

        return back()->with('success', 'Offline application form updated successfully.');
    }
}

