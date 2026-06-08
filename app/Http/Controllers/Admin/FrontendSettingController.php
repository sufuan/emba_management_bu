<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FrontendSettingController extends Controller
{
    /**
     * Show frontend settings page.
     */
    public function index()
    {
        return Inertia::render('Admin/FrontendSettings', [
            'homeSettings' => Setting::getByGroup('home_page'),
            'aboutSettings' => Setting::getByGroup('about_page'),
        ]);
    }

    /**
     * Update frontend settings.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'group' => 'required|string|in:home_page,about_page',
            'settings' => 'required|array',
        ]);

        foreach ($validated['settings'] as $key => $value) {
            $setting = Setting::where('key', $key)->first();
            
            $type = match(true) {
                is_bool($value) => 'boolean',
                is_numeric($value) => 'number',
                is_array($value) => 'json',
                default => 'string',
            };

            $storedValue = is_bool($value) ? ($value ? '1' : '0') : 
                           (is_array($value) ? json_encode($value) : $value);

            if ($setting) {
                $setting->update(['value' => $storedValue, 'type' => $type, 'group' => $validated['group']]);
            } else {
                Setting::create([
                    'key' => $key, 
                    'value' => $storedValue, 
                    'type' => $type, 
                    'group' => $validated['group']
                ]);
            }

            \Illuminate\Support\Facades\Cache::forget("setting_{$key}");
        }

        return back()->with('success', ucfirst(str_replace('_', ' ', $validated['group'])) . ' updated successfully.');
    }
}
