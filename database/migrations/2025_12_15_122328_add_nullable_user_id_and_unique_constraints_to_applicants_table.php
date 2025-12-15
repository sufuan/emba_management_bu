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
            // Add applicant_user_id as nullable foreign key
            $table->foreignId('applicant_user_id')->nullable()->after('id')->constrained('applicant_users')->onDelete('set null');
            
            // Add unique constraints for email and NID
            $table->unique('email');
            $table->unique('nid');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('applicants', function (Blueprint $table) {
            // Drop unique constraints
            $table->dropUnique(['email']);
            $table->dropUnique(['nid']);
            
            // Drop foreign key and column
            $table->dropForeign(['applicant_user_id']);
            $table->dropColumn('applicant_user_id');
        });
    }
};
