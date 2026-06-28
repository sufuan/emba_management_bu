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
     * DEBUG: Show path info — visit /offline-form-debug to diagnose.
     * REMOVE this method after fixing the issue.
     */
    public function debugOfflineForm()
    {
        $publicPath   = public_path('pdf/offline-form.pdf');
        $basePath     = base_path('pdf/offline-form.pdf');
        $assetUrl     = asset('pdf/offline-form.pdf');

        echo '<pre>';
        echo "public_path('pdf/offline-form.pdf') = " . $publicPath . "\n";
        echo "file_exists(public_path)            = " . (file_exists($publicPath) ? 'YES' : 'NO') . "\n";
        echo "is_readable(public_path)             = " . (is_readable($publicPath)  ? 'YES' : 'NO') . "\n";
        echo "filesize(public_path)                = " . (file_exists($publicPath) ? filesize($publicPath) . ' bytes' : 'N/A') . "\n";
        echo "\n";
        echo "base_path('pdf/offline-form.pdf')   = " . $basePath . "\n";
        echo "file_exists(base_path)               = " . (file_exists($basePath) ? 'YES' : 'NO') . "\n";
        echo "\n";
        echo "asset('pdf/offline-form.pdf')        = " . $assetUrl . "\n";
        echo "\n";
        echo "__DIR__                              = " . __DIR__ . "\n";
        echo "PHP version                          = " . PHP_VERSION . "\n";
        echo "memory_limit                         = " . ini_get('memory_limit') . "\n";
        echo "max_execution_time                   = " . ini_get('max_execution_time') . "\n";
        echo '</pre>';
        exit;
    }

    /**
     * Download the offline application form PDF.
     *
     * Uses raw chunked output to avoid Laravel response/buffering issues
     * that cause intermittent "file not available" errors on shared hosting.
     */
    public function downloadOfflineForm()
    {
        // Resolve the file path
        $path = public_path('pdf/offline-form.pdf');

        if (!file_exists($path) || !is_readable($path)) {
            $path = base_path('pdf/offline-form.pdf');
        }

        if (!file_exists($path) || !is_readable($path)) {
            abort(404, 'Offline application form not found.');
        }

        $filesize = filesize($path);

        // Kill ALL output buffers — critical on shared hosting
        while (ob_get_level() > 0) {
            ob_end_clean();
        }

        // Send headers directly — bypasses Laravel response pipeline entirely
        header('Content-Type: application/pdf');
        header('Content-Disposition: attachment; filename="offline-form.pdf"');
        header('Content-Length: ' . $filesize);
        header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
        header('Pragma: no-cache');
        header('Expires: 0');
        header('X-Content-Type-Options: nosniff');

        // Flush headers to the browser immediately
        if (function_exists('fastcgi_finish_request')) {
            // not applicable here — skip
        }
        flush();

        // Stream file in 8KB chunks — prevents memory_limit issues
        $handle = fopen($path, 'rb');
        if ($handle === false) {
            abort(500, 'Could not open file for reading.');
        }

        while (!feof($handle)) {
            echo fread($handle, 8192);
            flush();
        }

        fclose($handle);
        exit;
    }

    /**
     * Upload a new offline application form PDF (admin only).
     */
    public function uploadOfflineForm(Request $request)
    {
        $request->validate([
            'offline_form_pdf' => [
                'required',
                'file',
                'mimes:pdf',
                'max:10240',
            ],
        ], [
            'offline_form_pdf.required' => 'Please select a PDF file to upload.',
            'offline_form_pdf.mimes'    => 'The file must be a PDF.',
            'offline_form_pdf.max'      => 'The PDF must not be larger than 10 MB.',
        ]);

        $destination = public_path('pdf');

        if (!is_dir($destination)) {
            mkdir($destination, 0755, true);
        }

        $request->file('offline_form_pdf')->move($destination, 'offline-form.pdf');

        return back()->with('success', 'Offline application form updated successfully.');
    }
}
