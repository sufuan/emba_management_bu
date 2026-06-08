<?php

namespace App\Services;

use App\Models\Applicant;
use App\Models\ApplicantUser;
use App\Models\Session;
use App\Models\Upload;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class ApplicantService
{
    /**
     * Create a new applicant with all related data.
     */
    public function createApplicant(array $data, ?UploadedFile $photo = null, ?ApplicantUser $authenticatedUser = null): Applicant
    {
        return DB::transaction(function () use ($data, $photo, $authenticatedUser) {
            // Get session from data or find active session from database
            $sessionId = $data['session_id'] ?? Session::where('is_active', true)->firstOrFail()->id;
            $session = Session::findOrFail($sessionId);

            // Generate form number and admission roll
            $formNo = $this->generateFormNumber($session);
            $admissionRoll = $this->generateAdmissionRoll($session);

            // Create applicant
            $applicant = Applicant::create([
                'session_id' => $sessionId,
                'applicant_user_id' => $authenticatedUser?->id,
                'full_name' => $data['full_name'],
                'fathers_name' => $data['fathers_name'],
                'mothers_name' => $data['mothers_name'],
                'dob' => $data['dob'],
                'nid' => $data['nid'],
                'phone' => $data['phone'],
                'email' => $data['email'],
                'present_address' => $data['present_address'] ?? null,
                'permanent_address' => $data['permanent_address'] ?? null,
                'subject_choice' => 'Management',
                'experience_json' => $data['experience_json'] ?? null,
                'education_json' => $data['education_json'] ?? null,
                'payment_transaction_id' => $data['payment_transaction_id'] ?? null,
                'payment_method' => $data['payment_method'] ?? null,
                'payment_amount' => $data['payment_amount'] ?? null,
                'payment_date' => $data['payment_date'] ?? now(),
                'form_no' => $formNo,
                'admission_roll' => $admissionRoll,
                'status' => 'submitted',
                'submitted_at' => now(),
            ]);

            // If authenticated user, link applicant to user and update name/phone
            if ($authenticatedUser) {
                $authenticatedUser->update([
                    'applicant_id' => $applicant->id,
                    'name' => $data['full_name'],
                    'phone' => $data['phone'],
                ]);
            }

            // Handle file uploads
            if ($photo) {
                $this->handleUpload($applicant, $photo, 'passport_photo');
            }

            return $applicant->fresh(['uploads', 'session']);
        });
    }

    /**
     * Generate a unique form number for the session.
     * Format: {PREFIX}-{YEAR}-{SERIAL}
     */
    public function generateFormNumber(Session $session): string
    {
        $prefix = config('admission.form_no_prefix', 'EMBA');
        $lastApplicant = Applicant::where('session_id', $session->id)
            ->orderBy('id', 'desc')
            ->first();

        $serial = 1;
        if ($lastApplicant && $lastApplicant->form_no) {
            // Extract serial from last form number
            $parts = explode('-', $lastApplicant->form_no);
            $serial = (int) end($parts) + 1;
        }

        return sprintf('%s-%d-%04d', $prefix, $session->year_start, $serial);
    }

    /**
     * Generate admission roll number.
     * Format: EMBA {YEAR} {SERIAL}
     */
    public function generateAdmissionRoll(Session $session): string
    {
        $lastApplicant = Applicant::where('session_id', $session->id)
            ->orderBy('id', 'desc')
            ->first();

        $serial = 1;
        if ($lastApplicant && $lastApplicant->admission_roll) {
            // Extract serial from last admission roll
            preg_match('/(\d+)$/', $lastApplicant->admission_roll, $matches);
            $serial = isset($matches[1]) ? (int) $matches[1] + 1 : 1;
        }

        return sprintf('EMBA %d %04d', $session->year_start, $serial);
    }

    /**
     * Handle file upload and create upload record.
     */
    public function handleUpload(Applicant $applicant, UploadedFile $file, string $type): Upload
    {
        $session = $applicant->session;
        $extension = 'jpg'; // Always save as JPG for consistency and better compression
        $filename = $type === 'passport_photo' ? 'photo' : 'signature';
        
        // Storage path: sessions/{session_id}/applicants/{applicant_id}/
        $path = sprintf(
            'sessions/%d/applicants/%d/%s.%s',
            $session->id,
            $applicant->id,
            $filename,
            $extension
        );

        // Process image using Intervention Image v3
        $manager = new ImageManager(new Driver());
        $image = $manager->read($file->getRealPath());
        
        // Resize to 300x300 maintaining aspect ratio and crop from center
        $image->cover(300, 300);
        
        // Encode as JPEG with 85% quality to balance size and quality
        $encodedImage = $image->toJpeg(85);
        
        // Store the processed image
        Storage::disk('public')->put($path, (string) $encodedImage);

        // Get file size after processing
        $fileSize = Storage::disk('public')->size($path);

        // Update applicant path
        $pathField = $type === 'passport_photo' ? 'photo_path' : 'signature_path';
        $applicant->update([$pathField => $path]);

        // Create upload record
        return Upload::create([
            'applicant_id' => $applicant->id,
            'type' => $type,
            'file_path' => $path,
            'size_bytes' => $fileSize,
            'width' => 300,
            'height' => 300,
        ]);
    }

    /**
     * Update applicant status.
     */
    public function updateStatus(Applicant $applicant, string $status): Applicant
    {
        $applicant->update(['status' => $status]);
        return $applicant->fresh();
    }

    /**
     * Get applicants by session with optional filters.
     */
    public function getApplicantsBySession(int $sessionId, array $filters = [])
    {
        $query = Applicant::where('session_id', $sessionId)
            ->with(['session', 'uploads']);

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('form_no', 'like', "%{$search}%");
            });
        }

        return $query->orderBy('created_at', 'desc')->paginate(15);
    }
}

