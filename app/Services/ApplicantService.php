<?php

namespace App\Services;

use App\Models\Applicant;
use App\Models\Session;
use App\Models\Upload;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ApplicantService
{
    /**
     * Create a new applicant with all related data.
     */
    public function createApplicant(array $data, ?UploadedFile $photo = null, ?UploadedFile $signature = null): Applicant
    {
        return DB::transaction(function () use ($data, $photo, $signature) {
            $sessionId = $data['session_id'] ?? config('admission.active_session_id');
            $session = Session::findOrFail($sessionId);

            // Generate form number and admission roll
            $formNo = $this->generateFormNumber($session);
            $admissionRoll = $this->generateAdmissionRoll($session);

            // Create applicant
            $applicant = Applicant::create([
                'session_id' => $sessionId,
                'full_name' => $data['full_name'],
                'fathers_name' => $data['fathers_name'],
                'mothers_name' => $data['mothers_name'],
                'dob' => $data['dob'],
                'nid' => $data['nid'], // Will be auto-encrypted by model cast
                'phone' => $data['phone'],
                'email' => $data['email'],
                'subject_choice' => $data['subject_choice'],
                'experience_json' => $data['experience_json'] ?? null,
                'education_json' => $data['education_json'] ?? null,
                'form_no' => $formNo,
                'admission_roll' => $admissionRoll,
                'status' => 'submitted',
                'submitted_at' => now(),
            ]);

            // Handle file uploads
            if ($photo) {
                $this->handleUpload($applicant, $photo, 'passport_photo');
            }

            if ($signature) {
                $this->handleUpload($applicant, $signature, 'signature');
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
        $prefix = config('admission.form_no_prefix', 'mba');
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
     * Format: mba {YEAR} {SERIAL}
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

        return sprintf('mba %d %04d', $session->year_start, $serial);
    }

    /**
     * Handle file upload and create upload record.
     */
    public function handleUpload(Applicant $applicant, UploadedFile $file, string $type): Upload
    {
        $session = $applicant->session;
        $extension = $file->getClientOriginalExtension();
        $filename = $type === 'passport_photo' ? 'photo' : 'signature';
        
        // Storage path: sessions/{session_id}/applicants/{applicant_id}/
        $path = sprintf(
            'sessions/%d/applicants/%d/%s.%s',
            $session->id,
            $applicant->id,
            $filename,
            $extension
        );

        // Store the file
        Storage::disk('public')->put($path, file_get_contents($file->getRealPath()));

        // Get image dimensions
        $imageInfo = getimagesize($file->getRealPath());
        $width = $imageInfo[0] ?? null;
        $height = $imageInfo[1] ?? null;

        // Update applicant path
        $pathField = $type === 'passport_photo' ? 'photo_path' : 'signature_path';
        $applicant->update([$pathField => $path]);

        // Create upload record
        return Upload::create([
            'applicant_id' => $applicant->id,
            'type' => $type,
            'file_path' => $path,
            'size_bytes' => $file->getSize(),
            'width' => $width,
            'height' => $height,
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

