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
        Schema::create('applicants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('session_id')->constrained('admission_sessions')->onDelete('cascade');
            $table->string('full_name');
            $table->string('fathers_name');
            $table->string('mothers_name');
            $table->date('dob');
            $table->string('nid', 500); // Encrypted NID
            $table->string('phone');
            $table->string('email');
            $table->string('photo_path')->nullable();
            $table->string('signature_path')->nullable();
            $table->string('form_no')->nullable(); // Auto-generated per session
            $table->string('admission_roll')->nullable(); // Auto-generated per session
            $table->string('subject_choice'); // Management, Finance, etc.
            $table->json('experience_json')->nullable(); // Total years/months + details
            $table->json('education_json')->nullable(); // SSC/HSC/Bachelor/Master data
            $table->enum('status', ['submitted', 'pending', 'verified'])->default('submitted');
            $table->timestamp('submitted_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('applicants');
    }
};
