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
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->string('type')->default('string'); // string, number, boolean, json
            $table->string('group')->default('general');
            $table->string('label')->nullable();
            $table->timestamps();
        });

        // Insert default payment settings
        DB::table('settings')->insert([
            ['key' => 'payment_fee', 'value' => '500', 'type' => 'number', 'group' => 'payment', 'label' => 'Application Fee (BDT)', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'payment_bkash_number', 'value' => '01XXXXXXXXX', 'type' => 'string', 'group' => 'payment', 'label' => 'bKash Number', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'payment_nagad_number', 'value' => '01XXXXXXXXX', 'type' => 'string', 'group' => 'payment', 'label' => 'Nagad Number', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'payment_rocket_number', 'value' => '01XXXXXXXXX', 'type' => 'string', 'group' => 'payment', 'label' => 'Rocket Number', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'payment_bank_name', 'value' => 'Sonali Bank, University of Barishal Branch', 'type' => 'string', 'group' => 'payment', 'label' => 'Bank Name & Branch', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'payment_bank_account', 'value' => 'XXXXXXXXXXXXXX', 'type' => 'string', 'group' => 'payment', 'label' => 'Bank Account Number', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
