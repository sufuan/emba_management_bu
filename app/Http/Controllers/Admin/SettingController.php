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

        return Inertia::render('Admin/Settings', [
            'applyNowEnabled' => config('admission.apply_now_enabled'),
            'activeSessionId' => $activeSession?->id,
            'sessions' => $sessions,
            'uploadConfig' => config('admission.uploads'),
            'paymentSettings' => Setting::getPaymentSettings(),
            'requireApplicantAuth' => Setting::getValue('require_applicant_auth', true),
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
        $validated = $request->validate([
            'payment_fee' => 'required|numeric|min:0',
            'payment_bkash_number' => 'nullable|string|max:20',
            'payment_bkash_enabled' => 'nullable|boolean',
            'payment_nagad_number' => 'nullable|string|max:20',
            'payment_nagad_enabled' => 'nullable|boolean',
            'payment_rocket_number' => 'nullable|string|max:20',
            'payment_rocket_enabled' => 'nullable|boolean',
            'payment_bank_name' => 'nullable|string|max:255',
            'payment_bank_account' => 'nullable|string|max:50',
            'payment_bank_enabled' => 'nullable|boolean',
        ]);

        // Ensure boolean values are properly set (false if not present)
        $validated['payment_bkash_enabled'] = $validated['payment_bkash_enabled'] ?? false;
        $validated['payment_nagad_enabled'] = $validated['payment_nagad_enabled'] ?? false;
        $validated['payment_rocket_enabled'] = $validated['payment_rocket_enabled'] ?? false;
        $validated['payment_bank_enabled'] = $validated['payment_bank_enabled'] ?? false;

        // Ensure at least one payment method is enabled
        $enabledMethods = array_filter([
            $validated['payment_bkash_enabled'],
            $validated['payment_nagad_enabled'],
            $validated['payment_rocket_enabled'],
            $validated['payment_bank_enabled'],
        ]);

        if (empty($enabledMethods)) {
            return back()->withErrors(['payment' => 'At least one payment method must be enabled.']);
        }

        foreach ($validated as $key => $value) {
            Setting::setValue($key, $value);
        }

        // Clear all payment-related cache
        \Illuminate\Support\Facades\Cache::forget('payment_settings');
        
        return back()->with('success', 'Payment settings updated successfully.');
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
