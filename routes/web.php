<?php

use App\Http\Controllers\ApplicantController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PDFController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\ApplicantController as AdminApplicantController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\SessionController as AdminSessionController;
use App\Http\Controllers\Admin\SettingController as AdminSettingController;
use App\Http\Middleware\CheckApplyNow;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/about', [HomeController::class, 'about'])->name('about');
Route::get('/admission-closed', [HomeController::class, 'closed'])->name('admission.closed');

/*
|--------------------------------------------------------------------------
| Applicant Authentication Routes
|--------------------------------------------------------------------------
*/
require __DIR__.'/applicant.php';

/*
|--------------------------------------------------------------------------
| Applicant Dashboard (Protected by Applicant Auth Only)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:applicant')->prefix('applicant')->name('applicant.')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\Applicant\DashboardController::class, 'index'])->name('dashboard');
    Route::get('/my-application', [\App\Http\Controllers\Applicant\DashboardController::class, 'myApplication'])->name('application');
});

/*
|--------------------------------------------------------------------------
| Application Routes (Protected by OptionalApplicantAuth + CheckApplyNow Middleware)
|--------------------------------------------------------------------------
*/
Route::middleware(['optional.applicant.auth', CheckApplyNow::class])->prefix('applicant')->name('applicant.')->group(function () {
    Route::get('/apply', [ApplicantController::class, 'create'])->name('application.create');
    Route::post('/apply', [ApplicantController::class, 'store'])->name('application.store');
    Route::post('/validate-phone', [ApplicantController::class, 'validatePhone'])->name('application.validatePhone');
});


Route::get('/application/{applicant}/preview', [ApplicantController::class, 'preview'])->name('application.preview');

// QR Code Verification (public)
Route::get('/verify/{formNo}', [ApplicantController::class, 'verify'])->name('application.verify');

// PDF Downloads (public)
Route::get('/application/{applicant}/pdf/download', [PDFController::class, 'downloadApplication'])->name('pdf.application.download');
Route::get('/application/{applicant}/pdf/preview', [PDFController::class, 'previewApplication'])->name('pdf.application.preview');
Route::get('/application/{applicant}/admit-card/download', [PDFController::class, 'downloadAdmitCard'])->name('pdf.admit-card.download');

/*
|--------------------------------------------------------------------------
| Admin Routes (Protected by Auth Middleware)
|--------------------------------------------------------------------------
*/
// Redirect /admin to login if not authenticated
Route::get('/admin', function () {
    return redirect()->route('login');
})->middleware('guest');

Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    // Dashboard
    Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');

    // Applicants Management
    Route::get('/applicants', [AdminApplicantController::class, 'index'])->name('applicants.index');
    Route::get('/applicants/{applicant}', [AdminApplicantController::class, 'show'])->name('applicants.show');
    Route::patch('/applicants/{applicant}/status', [AdminApplicantController::class, 'updateStatus'])->name('applicants.update-status');
    Route::delete('/applicants/{applicant}', [AdminApplicantController::class, 'destroy'])->name('applicants.destroy');
    Route::post('/applicants/bulk-status', [AdminApplicantController::class, 'bulkUpdateStatus'])->name('applicants.bulk-status');
    Route::get('/applicants-export', [AdminApplicantController::class, 'exportPdf'])->name('applicants.export');
    Route::get('/applicants-export-excel', [AdminApplicantController::class, 'exportExcel'])->name('applicants.export-excel');

    // Sessions Management
    Route::get('/sessions', [AdminSessionController::class, 'index'])->name('sessions.index');
    Route::get('/sessions/create', [AdminSessionController::class, 'create'])->name('sessions.create');
    Route::post('/sessions', [AdminSessionController::class, 'store'])->name('sessions.store');
    Route::get('/sessions/{session}/edit', [AdminSessionController::class, 'edit'])->name('sessions.edit');
    Route::put('/sessions/{session}', [AdminSessionController::class, 'update'])->name('sessions.update');
    Route::delete('/sessions/{session}', [AdminSessionController::class, 'destroy'])->name('sessions.destroy');
    Route::post('/sessions/{session}/activate', [AdminSessionController::class, 'setActive'])->name('sessions.activate');

    // Settings
    Route::get('/settings', [AdminSettingController::class, 'index'])->name('settings.index');
    Route::post('/settings/toggle-apply', [AdminSettingController::class, 'toggleApplyNow'])->name('settings.toggle-apply');
    Route::post('/settings/toggle-auth', [AdminSettingController::class, 'toggleApplicantAuth'])->name('settings.toggle-auth');
    Route::post('/settings/active-session', [AdminSettingController::class, 'updateActiveSession'])->name('settings.active-session');
    Route::post('/settings/payment', [AdminSettingController::class, 'updatePaymentSettings'])->name('settings.payment');

    // Sessions - add PATCH route for activate
    Route::patch('/sessions/{session}/activate', [AdminSessionController::class, 'setActive'])->name('sessions.activate-patch');

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
