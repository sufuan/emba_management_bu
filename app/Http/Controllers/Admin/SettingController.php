<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Session;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Inertia\Inertia;

class SettingController extends Controller
{
    /**
     * Show settings page.
     */
    public function index()
    {
        $sessions = Session::orderBy('year_start', 'desc')->get();
        
        // Get active session from database
        $activeSession = Session::where('is_active', true)->first();

        $dynamicPdfPath = public_path('pdf/offline-form.pdf');

        return Inertia::render('Admin/Settings', [
            'applyNowEnabled' => config('admission.apply_now_enabled'),
            'activeSessionId' => $activeSession?->id,
            'sessions' => $sessions,
            'uploadConfig' => config('admission.uploads'),
            'paymentSettings' => Setting::getPaymentSettings(),
            'requireApplicantAuth' => Setting::getValue('require_applicant_auth', true),
            'offlineFormInfo' => [
                'exists'      => file_exists($dynamicPdfPath),
                'uploaded_at' => file_exists($dynamicPdfPath)
                    ? date('d M Y, h:i A', filemtime($dynamicPdfPath))
                    : null,
                'size_kb'     => file_exists($dynamicPdfPath)
                    ? round(filesize($dynamicPdfPath) / 1024, 1)
                    : null,
            ],
        ]);
    }

    /**
     * Toggle Apply Now status.
     * Note: This updates the .env file. For production, consider using a database setting.
     */
    public function toggleApplyNow(Request $request)
    {
        // Toggle the current value
        $currentValue = config('admission.apply_now_enabled');
        $newValue = !$currentValue;

        $this->updateEnvValue('ADMISSION_APPLY_NOW_ENABLED', $newValue ? 'true' : 'false');

        // Clear config cache
        Artisan::call('config:clear');

        return back()->with('success', 'Apply Now status updated successfully.');
    }

    /**
     * Update active session.
     */
    public function updateActiveSession(Request $request)
    {
        $validated = $request->validate([
            'session_id' => 'required|exists:admission_sessions,id',
        ]);

        // Deactivate all sessions
        Session::where('is_active', true)->update(['is_active' => false]);
        
        // Activate the selected session
        Session::find($validated['session_id'])->update(['is_active' => true]);

        return back()->with('success', 'Active session updated successfully.');
    }

    /**
     * Update payment settings.
     */
    public function updatePaymentSettings(Request $request)
    {
        try {
            $validated = $request->validate([
                'payment_fee'           => 'required|numeric|min:0',
                'payment_bkash_number'  => 'nullable|max:20',
                'payment_bkash_enabled' => 'nullable',
                'payment_nagad_number'  => 'nullable|max:20',
                'payment_nagad_enabled' => 'nullable',
                'payment_rocket_number' => 'nullable|max:20',
                'payment_rocket_enabled'=> 'nullable',
                'payment_bank_name'     => 'nullable|max:255',
                'payment_bank_account'  => 'nullable|max:50',
                'payment_bank_enabled'  => 'nullable',
            ]);

            // Normalize: convert null string fields to empty string so Setting::setValue stores type='string'
            foreach (['payment_bkash_number', 'payment_nagad_number', 'payment_rocket_number', 'payment_bank_name', 'payment_bank_account'] as $key) {
                $validated[$key] = $validated[$key] ?? '';
            }

            // Explicitly cast boolean fields — Inertia may send true/false/1/0/"true"/"false"
            $booleanKeys = [
                'payment_bkash_enabled',
                'payment_nagad_enabled',
                'payment_rocket_enabled',
                'payment_bank_enabled',
            ];

            foreach ($booleanKeys as $key) {
                $val = $validated[$key] ?? false;
                $validated[$key] = filter_var($val, FILTER_VALIDATE_BOOLEAN);
            }

            // Save every validated setting
            foreach ($validated as $key => $value) {
                Setting::setValue($key, $value);
            }

            // Clear per-key caches (the pattern used by Setting::getValue)
            $cacheKeys = [
                'payment_fee', 'payment_bkash_number', 'payment_bkash_enabled',
                'payment_nagad_number', 'payment_nagad_enabled',
                'payment_rocket_number', 'payment_rocket_enabled',
                'payment_bank_name', 'payment_bank_account', 'payment_bank_enabled',
            ];
            foreach ($cacheKeys as $key) {
                \Illuminate\Support\Facades\Cache::forget("setting_{$key}");
            }

            return back()->with('success', 'Payment settings updated successfully.');

        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Payment settings save failed: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'input' => $request->all(),
            ]);
            return back()->withErrors(['payment' => 'Failed to save settings: ' . $e->getMessage()]);
        }
    }

    /**
     * Toggle Applicant Authentication requirement.
     */
    public function toggleApplicantAuth(Request $request)
    {
        $currentValue = Setting::getValue('require_applicant_auth', true);
        $newValue = !$currentValue;

        Setting::setValue('require_applicant_auth', $newValue);

        return back()->with('success', 'Applicant authentication setting updated successfully.');
    }

    /**
     * Helper to update .env values.
     */
    private function updateEnvValue(string $key, string $value): void
    {
        $envPath = base_path('.env');
        $contents = file_get_contents($envPath);

        if (str_contains($contents, "{$key}=")) {
            $contents = preg_replace(
                "/^{$key}=.*/m",
                "{$key}={$value}",
                $contents
            );
        } else {
            $contents .= "\n{$key}={$value}";
        }

        file_put_contents($envPath, $contents);
    }
}
