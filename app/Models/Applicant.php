<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class Applicant extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'session_id',
        'applicant_user_id',
        'full_name',
        'fathers_name',
        'mothers_name',
        'dob',
        'nid',
        'phone',
        'email',
        'present_address',
        'permanent_address',
        'photo_path',
        'signature_path',
        'form_no',
        'admission_roll',
        'subject_choice',
        'experience_json',
        'education_json',
        'payment_transaction_id',
        'payment_method',
        'payment_amount',
        'payment_date',
        'status',
        'submitted_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'nid' => 'encrypted',
        'dob' => 'date',
        'experience_json' => 'array',
        'education_json' => 'array',
        'payment_amount' => 'decimal:2',
        'payment_date' => 'datetime',
        'submitted_at' => 'datetime',
    ];

    /**
     * Get the session that this applicant belongs to.
     */
    public function session(): BelongsTo
    {
        return $this->belongsTo(Session::class);
    }

    /**
     * Get the applicant user (if registered).
     */
    public function applicantUser(): BelongsTo
    {
        return $this->belongsTo(ApplicantUser::class);
    }

    /**
     * Get all uploads for this applicant.
     */
    public function uploads(): HasMany
    {
        return $this->hasMany(Upload::class);
    }

    /**
     * Get all PDF logs for this applicant.
     */
    public function pdfLogs(): HasMany
    {
        return $this->hasMany(PdfLog::class);
    }

    /**
     * Base64 data URI for applicant photo.
     */
    public function getPhotoBase64Attribute(): ?string
    {
        if (!$this->photo_path) {
            return null;
        }

        $disk = Storage::disk('public');
        $fullPath = $disk->path($this->photo_path);
        if (!is_file($fullPath)) {
            return null;
        }

        $data = @file_get_contents($fullPath);
        if ($data === false) {
            return null;
        }

        $ext = strtolower(pathinfo($fullPath, PATHINFO_EXTENSION));
        $mime = match ($ext) {
            'jpg', 'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'gif' => 'image/gif',
            default => 'image/jpeg',
        };

        return 'data:' . $mime . ';base64,' . base64_encode($data);
    }

    /**
     * Base64 data URI for applicant signature.
     */
    public function getSignatureBase64Attribute(): ?string
    {
        if (!$this->signature_path) {
            return null;
        }

        $disk = Storage::disk('public');
        $fullPath = $disk->path($this->signature_path);
        if (!is_file($fullPath)) {
            return null;
        }

        $data = @file_get_contents($fullPath);
        if ($data === false) {
            return null;
        }

        $ext = strtolower(pathinfo($fullPath, PATHINFO_EXTENSION));
        $mime = match ($ext) {
            'jpg', 'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'gif' => 'image/gif',
            default => 'image/jpeg',
        };

        return 'data:' . $mime . ';base64,' . base64_encode($data);
    }

    /**
     * Get the account type of the applicant.
     */
    public function getAccountTypeAttribute(): string
    {
        return $this->applicant_user_id ? 'Registered' : 'Guest';
    }
}
