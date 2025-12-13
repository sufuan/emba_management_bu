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
        Schema::table('admission_sessions', function (Blueprint $table) {
            $table->enum('season', ['summer', 'fall'])->default('fall')->after('session_name');
        });

        // Update existing records to set season as 'fall'
        DB::table('admission_sessions')->update([
            'season' => 'fall'
        ]);

        // Add unique constraint to prevent duplicate season+year combinations
        Schema::table('admission_sessions', function (Blueprint $table) {
            $table->unique(['year_start', 'year_end', 'season'], 'unique_session_season');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('admission_sessions', function (Blueprint $table) {
            $table->dropUnique('unique_session_season');
            $table->dropColumn('season');
        });
    }
};
