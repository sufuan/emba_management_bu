<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add enabled toggles for each payment method
        DB::table('settings')->insert([
            ['key' => 'payment_bkash_enabled', 'value' => '1', 'type' => 'boolean', 'group' => 'payment', 'label' => 'Enable bKash', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'payment_nagad_enabled', 'value' => '1', 'type' => 'boolean', 'group' => 'payment', 'label' => 'Enable Nagad', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'payment_rocket_enabled', 'value' => '1', 'type' => 'boolean', 'group' => 'payment', 'label' => 'Enable Rocket', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'payment_bank_enabled', 'value' => '1', 'type' => 'boolean', 'group' => 'payment', 'label' => 'Enable Bank Transfer', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('settings')->whereIn('key', [
            'payment_bkash_enabled',
            'payment_nagad_enabled',
            'payment_rocket_enabled',
            'payment_bank_enabled',
        ])->delete();
    }
};
