<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Apply Now Toggle
    |--------------------------------------------------------------------------
    |
    | This option controls whether the "Apply Now" button is visible and
    | accessible on the frontend. When disabled, applicants cannot submit
    | new applications.
    |
    */
    'apply_now_enabled' => env('ADMISSION_APPLY_NOW_ENABLED', false),

    /*
    |--------------------------------------------------------------------------
    | Active Session ID
    |--------------------------------------------------------------------------
    |
    | This option specifies the currently active admission session ID.
    | All new applications will be associated with this session.
    |
    */
    'active_session_id' => env('ADMISSION_ACTIVE_SESSION_ID', null),

    /*
    |--------------------------------------------------------------------------
    | Form Number Prefix
    |--------------------------------------------------------------------------
    |
    | The prefix used when generating form numbers for applicants.
    | Format: {prefix}{year}{serial} e.g., EMBA-2025-0001
    |
    */
    'form_no_prefix' => env('ADMISSION_FORM_NO_PREFIX', 'EMBA'),

    /*
    |--------------------------------------------------------------------------
    | Upload Constraints
    |--------------------------------------------------------------------------
    |
    | Constraints for passport photo and signature uploads.
    |
    */
    'uploads' => [
        'passport_photo' => [
            'max_size_kb' => 200,
            'width' => 300,
            'height' => 300,
            'allowed_types' => ['jpg', 'jpeg', 'png'],
        ],
        'signature' => [
            'max_size_kb' => 200,
            'width' => 300,
            'height' => 80,
            'allowed_types' => ['jpg', 'jpeg', 'png'],
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Subject Choices
    |--------------------------------------------------------------------------
    |
    | Available subject choices for EMBA program.
    |
    */
    'subject_choices' => [
        'Management',
        'Finance',
        'Marketing',
        'Human Resource Management',
        'Accounting',
    ],

    /*
    |--------------------------------------------------------------------------
    | Application Statuses
    |--------------------------------------------------------------------------
    |
    | Available statuses for applications.
    |
    */
    'statuses' => [
        'submitted' => 'Submitted',
        'pending' => 'Pending Review',
        'verified' => 'Verified',
    ],
];

