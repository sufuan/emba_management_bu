<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('applicants', function (Blueprint $table) {
            $table->string('payment_transaction_id')->nullable()->after('education_json');
            $table->string('payment_method')->nullable()->after('payment_transaction_id');
            $table->decimal('payment_amount', 10, 2)->nullable()->after('payment_method');
            $table->timestamp('payment_date')->nullable()->after('payment_amount');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('applicants', function (Blueprint $table) {
            $table->dropColumn(['payment_transaction_id', 'payment_method', 'payment_amount', 'payment_date']);
        });
    }
};
