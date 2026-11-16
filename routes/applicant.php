<?php

use App\Http\Controllers\Applicant\AuthenticatedApplicantSessionController;
use App\Http\Controllers\Applicant\PasswordResetOtpController;
use App\Http\Controllers\Applicant\RegisteredApplicantController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest:applicant')->prefix('applicant')->name('applicant.')->group(function () {
    Route::get('register', [RegisteredApplicantController::class, 'create'])
        ->name('register');

    Route::post('register', [RegisteredApplicantController::class, 'store']);

    Route::get('login', [AuthenticatedApplicantSessionController::class, 'create'])
        ->name('login');

    Route::post('login', [AuthenticatedApplicantSessionController::class, 'store']);

    Route::get('forgot-password', [PasswordResetOtpController::class, 'create'])
        ->name('password.request');

    Route::post('forgot-password', [PasswordResetOtpController::class, 'store'])
        ->name('password.email');

    Route::post('forgot-password/resend', [PasswordResetOtpController::class, 'resend'])
        ->name('password.otp.resend');

    Route::get('reset-password-otp', [PasswordResetOtpController::class, 'edit'])
        ->name('password.otp.form');

    Route::post('reset-password-otp', [PasswordResetOtpController::class, 'update'])
        ->name('password.otp.reset');
});

Route::middleware('auth:applicant')->prefix('applicant')->name('applicant.')->group(function () {
    Route::post('logout', [AuthenticatedApplicantSessionController::class, 'destroy'])
        ->name('logout');
});
