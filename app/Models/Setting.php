<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Setting extends Model
{
    protected $fillable = ['key', 'value', 'type', 'group', 'label'];

    /**
     * Get a setting value by key.
     */
    public static function getValue(string $key, $default = null)
    {
        $setting = Cache::remember("setting_{$key}", 3600, function () use ($key) {
            return self::where('key', $key)->first();
        });

        if (!$setting) {
            return $default;
        }

        return match ($setting->type) {
            'number' => (float) $setting->value,
            'boolean' => filter_var($setting->value, FILTER_VALIDATE_BOOLEAN),
            'json' => json_decode($setting->value, true),
            default => $setting->value,
        };
    }

    /**
     * Set a setting value.
     */
    public static function setValue(string $key, $value): void
    {
        $setting = self::where('key', $key)->first();

        if ($setting) {
            $setting->update(['value' => $value]);
        } else {
            self::create(['key' => $key, 'value' => $value]);
        }

        Cache::forget("setting_{$key}");
    }

    /**
     * Get all settings by group.
     */
    public static function getByGroup(string $group): array
    {
        return self::where('group', $group)->get()->pluck('value', 'key')->toArray();
    }

    /**
     * Get all payment settings.
     */
    public static function getPaymentSettings(): array
    {
        return [
            'payment_fee' => self::getValue('payment_fee', 500),
            'payment_bkash_number' => self::getValue('payment_bkash_number', '01XXXXXXXXX'),
            'payment_bkash_enabled' => self::getValue('payment_bkash_enabled', true),
            'payment_nagad_number' => self::getValue('payment_nagad_number', '01XXXXXXXXX'),
            'payment_nagad_enabled' => self::getValue('payment_nagad_enabled', true),
            'payment_rocket_number' => self::getValue('payment_rocket_number', '01XXXXXXXXX'),
            'payment_rocket_enabled' => self::getValue('payment_rocket_enabled', true),
            'payment_bank_name' => self::getValue('payment_bank_name', 'Sonali Bank, University of Barishal Branch'),
            'payment_bank_account' => self::getValue('payment_bank_account', 'XXXXXXXXXXXXXX'),
            'payment_bank_enabled' => self::getValue('payment_bank_enabled', true),
        ];
    }
}
