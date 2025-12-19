<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\JobController;
use App\Http\Controllers\Api\AdminController;

// =====================================================
// PUBLIC ROUTES
// =====================================================
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/jobs', [JobController::class, 'index']);
Route::get('/jobs/{id}', [JobController::class, 'show']);
Route::get('/categories', [JobController::class, 'categories']);
Route::get('/featured-jobs', [JobController::class, 'featuredJobs']);
Route::get('/urgent-jobs', [JobController::class, 'urgentJobs']);

// =====================================================
// PROTECTED ROUTES
// =====================================================
Route::middleware('auth:sanctum')->group(function () {
    
    // =====================================================
    // AUTH ROUTES
    // =====================================================
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);
    
    // =====================================================
    // STUDENT ROUTES
    // =====================================================
    // Job Applications
    Route::post('/jobs/{id}/apply', [JobController::class, 'apply']);
    Route::get('/my-applications', [JobController::class, 'myApplications']);
    
    // Saved Jobs
    Route::post('/jobs/{id}/save', [JobController::class, 'saveJob']);
    Route::delete('/jobs/{id}/unsave', [JobController::class, 'unsaveJob']);
    Route::get('/saved-jobs', [JobController::class, 'savedJobs']);
    
    // =====================================================
    // COMPANY ROUTES
    // =====================================================
    // Job Management
    Route::post('/jobs', [JobController::class, 'store']);
    Route::put('/jobs/{id}', [JobController::class, 'update']);
    Route::delete('/jobs/{id}', [JobController::class, 'destroy']);
    Route::get('/my-jobs', [JobController::class, 'myJobs']);
    
    // Application Management
    Route::get('/jobs/{id}/applications', [JobController::class, 'jobApplications']);
    Route::put('/applications/{id}/status', [JobController::class, 'updateApplicationStatus']);
    
    // =====================================================
    // ADMIN ROUTES
    // =====================================================
    Route::prefix('admin')->group(function () {
        // Dashboard & Analytics
        Route::get('/stats', [AdminController::class, 'stats']);
        Route::get('/analytics', [AdminController::class, 'analytics']);
        
        // User Management
        Route::get('/users', [AdminController::class, 'users']);
        Route::get('/users/{id}', [AdminController::class, 'getUser']);
        Route::put('/users/{id}/toggle-status', [AdminController::class, 'toggleUserStatus']);
        Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);
        
        // Verification Management
        Route::get('/pending-verifications', [AdminController::class, 'pendingVerifications']);
        Route::put('/students/{id}/verify', [AdminController::class, 'verifyStudent']);
        Route::put('/companies/{id}/verify', [AdminController::class, 'verifyCompany']);
        
        // Job Moderation
        Route::get('/jobs', [AdminController::class, 'jobs']);
        Route::get('/jobs/pending', [AdminController::class, 'pendingJobs']);
        Route::put('/jobs/{id}/moderate', [AdminController::class, 'moderateJob']);
        Route::put('/jobs/{id}/toggle-featured', [AdminController::class, 'toggleFeatured']);
        Route::put('/jobs/{id}/toggle-urgent', [AdminController::class, 'toggleUrgent']);
        
        // Reports Management
        Route::get('/reports', [AdminController::class, 'reports']);
        Route::put('/reports/{id}/handle', [AdminController::class, 'handleReport']);
    });
});