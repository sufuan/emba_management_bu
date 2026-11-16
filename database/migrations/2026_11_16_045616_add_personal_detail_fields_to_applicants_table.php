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
            $table->string('name_bengali')->nullable()->after('full_name');
            $table->string('nationality')->nullable()->default('Bangladeshi')->after('mothers_name');
            $table->string('blood_group')->nullable()->after('nationality');
            $table->string('marital_status')->nullable()->after('blood_group'); // Married / Unmarried
            // Break present_address into sub-fields
            $table->string('present_house')->nullable()->after('present_address');
            $table->string('present_road')->nullable()->after('present_house');
            $table->string('present_village')->nullable()->after('present_road');
            $table->string('present_post_office')->nullable()->after('present_village');
            $table->string('present_upazila')->nullable()->after('present_post_office');
            $table->string('present_district')->nullable()->after('present_upazila');
            // Break permanent_address into sub-fields
            $table->string('permanent_house')->nullable()->after('permanent_address');
            $table->string('permanent_road')->nullable()->after('permanent_house');
            $table->string('permanent_village')->nullable()->after('permanent_road');
            $table->string('permanent_post_office')->nullable()->after('permanent_village');
            $table->string('permanent_upazila')->nullable()->after('permanent_post_office');
            $table->string('permanent_district')->nullable()->after('permanent_upazila');
            // Emergency contact
            $table->string('emergency_contact_name')->nullable()->after('permanent_district');
            $table->string('emergency_contact_phone')->nullable()->after('emergency_contact_name');
            $table->text('emergency_contact_address')->nullable()->after('emergency_contact_phone');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('applicants', function (Blueprint $table) {
            $table->dropColumn([
                'name_bengali',
                'nationality',
                'blood_group',
                'marital_status',
                'present_house',
                'present_road',
                'present_village',
                'present_post_office',
                'present_upazila',
                'present_district',
                'permanent_house',
                'permanent_road',
                'permanent_village',
                'permanent_post_office',
                'permanent_upazila',
                'permanent_district',
                'emergency_contact_name',
                'emergency_contact_phone',
                'emergency_contact_address',
            ]);
        });
    }
};
