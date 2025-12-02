<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Applicant extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'session_id',
        'full_name',
        'fathers_name',
        'mothers_name',
        'dob',
        'nid',
        'phone',
        'email',
        'photo_path',
        'signature_path',
        'form_no',
        'admission_roll',
        'subject_choice',
        'experience_json',
        'education_json',
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
}
