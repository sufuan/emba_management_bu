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
        Schema::table('applicants', function (Blueprint $table) {
            // Add applicant_user_id as nullable foreign key
            $table->foreignId('applicant_user_id')->nullable()->after('id')->constrained('applicant_users')->onDelete('set null');
            
            // Add unique constraint for email
            $table->unique('email');
        });
        
        // Add unique constraint for NID (varchar column)
        DB::statement('ALTER TABLE applicants ADD UNIQUE KEY applicants_nid_unique (nid)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop NID unique constraint
        DB::statement('ALTER TABLE applicants DROP INDEX applicants_nid_unique');
        
        Schema::table('applicants', function (Blueprint $table) {
            // Drop unique constraint
            $table->dropUnique(['email']);
            
            // Drop foreign key and column
            $table->dropForeign(['applicant_user_id']);
            $table->dropColumn('applicant_user_id');
        });
    }
};
