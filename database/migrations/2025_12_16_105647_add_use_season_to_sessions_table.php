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
        Schema::table('admission_sessions', function (Blueprint $table) {
            // Add use_season column with default false
            $table->boolean('use_season')->default(false)->after('season');
        });

        // Update existing sessions to use_season = true to preserve current behavior
        DB::table('admission_sessions')->update(['use_season' => true]);

        // Make season column nullable
        Schema::table('admission_sessions', function (Blueprint $table) {
            $table->string('season')->nullable()->change();
        });

        // Drop the old unique constraint
        Schema::table('admission_sessions', function (Blueprint $table) {
            $table->dropUnique('unique_session_season');
        });

        // Add new unique constraint that includes use_season
        Schema::table('admission_sessions', function (Blueprint $table) {
            $table->unique(['year_start', 'year_end', 'season', 'use_season'], 'unique_session_season_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop the new unique constraint
        Schema::table('admission_sessions', function (Blueprint $table) {
            $table->dropUnique('unique_session_season_type');
        });

        // Restore the old unique constraint
        Schema::table('admission_sessions', function (Blueprint $table) {
            $table->unique(['year_start', 'year_end', 'season'], 'unique_session_season');
        });

        // Make season column not nullable again
        Schema::table('admission_sessions', function (Blueprint $table) {
            $table->string('season')->nullable(false)->change();
        });

        // Set all use_season to true before removing the column
        DB::table('admission_sessions')->update(['use_season' => true]);

        // Remove use_season column
        Schema::table('admission_sessions', function (Blueprint $table) {
            $table->dropColumn('use_season');
        });
    }
};
