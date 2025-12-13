<?php

use App\Http\Controllers\Applicant\AuthenticatedApplicantSessionController;
use App\Http\Controllers\Applicant\RegisteredApplicantController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest:applicant')->prefix('applicant')->name('applicant.')->group(function () {
    Route::get('register', [RegisteredApplicantController::class, 'create'])
        ->name('register');

    Route::post('register', [RegisteredApplicantController::class, 'store']);

    Route::get('login', [AuthenticatedApplicantSessionController::class, 'create'])
        ->name('login');

    Route::post('login', [AuthenticatedApplicantSessionController::class, 'store']);
});

Route::middleware('auth:applicant')->prefix('applicant')->name('applicant.')->group(function () {
    Route::post('logout', [AuthenticatedApplicantSessionController::class, 'destroy'])
        ->name('logout');
});
