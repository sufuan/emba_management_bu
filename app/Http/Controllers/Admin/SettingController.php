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

        return Inertia::render('Admin/Settings', [
            'applyNowEnabled' => config('admission.apply_now_enabled'),
            'activeSessionId' => config('admission.active_session_id'),
            'sessions' => $sessions,
            'uploadConfig' => config('admission.uploads'),
            'paymentSettings' => Setting::getPaymentSettings(),
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

        $this->updateEnvValue('ADMISSION_ACTIVE_SESSION_ID', $validated['session_id']);

        // Also update the session's is_active flag
        Session::where('is_active', true)->update(['is_active' => false]);
        Session::find($validated['session_id'])->update(['is_active' => true]);

        // Clear config cache
        Artisan::call('config:clear');

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
            'payment_bkash_enabled' => 'boolean',
            'payment_nagad_number' => 'nullable|string|max:20',
            'payment_nagad_enabled' => 'boolean',
            'payment_rocket_number' => 'nullable|string|max:20',
            'payment_rocket_enabled' => 'boolean',
            'payment_bank_name' => 'nullable|string|max:255',
            'payment_bank_account' => 'nullable|string|max:50',
            'payment_bank_enabled' => 'boolean',
        ]);

        foreach ($validated as $key => $value) {
            Setting::setValue($key, $value);
        }

        return back()->with('success', 'Payment settings updated successfully.');
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
