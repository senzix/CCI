<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\StudentClassController;
use App\Http\Controllers\ClassAssignmentController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\DocumentVersionController;
use App\Http\Controllers\BatchDocumentController;
use App\Http\Controllers\DocumentShareController;
use App\Http\Controllers\DocumentCategoryController;
use App\Http\Controllers\GrantController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // Student Management Routes
    Route::get('/students/generate-registration', [StudentController::class, 'generateRegistrationNumber'])
        ->name('students.generate-registration');
    Route::resource('students', StudentController::class);
    Route::resource('classes', StudentClassController::class);
    Route::resource('class-assignments', ClassAssignmentController::class);

    // Attendance Routes
    Route::get('/attendance', function () {
        return Inertia::render('Modules/Attendance/Index');
    })->name('attendance.index');

    // Project Routes
    Route::get('/project', function () {
        return Inertia::render('Modules/Project/Index');
    })->name('project.index');

    // Document Routes
    // Route::get('/document', function () {
    //     return Inertia::render('Modules/Document/Index');
    // })->name('document.index');

    // Account Routes
    Route::get('/account', function () {
        return Inertia::render('Modules/Account/Index');
    })->name('account.index');

    // Payroll Routes
    Route::get('/payroll', function () {
        return Inertia::render('Modules/Payroll/Index');
    })->name('payroll.index');

    // Document Management Routes
    Route::prefix('documents')->name('documents.')->group(function () {
        Route::get('/', [DocumentController::class, 'index'])->name('index');
        Route::post('/', [DocumentController::class, 'store'])->name('store');
        Route::get('/{document}', [DocumentController::class, 'show'])->name('show');
        Route::delete('/{document}', [DocumentController::class, 'destroy'])->name('destroy');
        Route::get('/{document}/download', [DocumentController::class, 'download'])->name('download');
        
        // Document Versions
        Route::post('/{document}/versions', [DocumentVersionController::class, 'store'])->name('versions.store');
        Route::get('/{document}/versions/{version}', [DocumentVersionController::class, 'show'])->name('versions.show');
        Route::delete('/{document}/versions/{version}', [DocumentVersionController::class, 'destroy'])->name('versions.destroy');
        
        // Batch Operations
        Route::post('/batch/download', [BatchDocumentController::class, 'download'])->name('batch.download');
        Route::delete('/batch', [BatchDocumentController::class, 'destroy'])->name('batch.destroy');
        Route::post('/batch/move', [BatchDocumentController::class, 'move'])->name('batch.move');
        
        // Document Sharing
        Route::post('/{document}/share', [DocumentShareController::class, 'store'])->name('share.store');
        Route::delete('/{document}/share/{share}', [DocumentShareController::class, 'destroy'])->name('share.destroy');
        Route::get('/share/users', [DocumentShareController::class, 'users'])->name('share.users');

        // Document Categories
        Route::prefix('categories')->name('categories.')->group(function () {
            Route::get('/', [DocumentCategoryController::class, 'index'])->name('index');
            Route::post('/', [DocumentCategoryController::class, 'store'])->name('store');
            Route::put('/{category}', [DocumentCategoryController::class, 'update'])->name('update');
            Route::delete('/{category}', [DocumentCategoryController::class, 'destroy'])->name('destroy');
        });
    });

    // Grant Management Routes
    Route::resource('grants', GrantController::class);
    Route::get('grants/{grant}/expenditures', [GrantController::class, 'expenditures'])->name('grants.expenditures');
    Route::post('grants/{grant}/expenditures', [GrantController::class, 'storeExpenditure'])->name('grants.expenditures.store');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/api/classes/list', [StudentClassController::class, 'getClasses'])->name('classes.list');

require __DIR__.'/auth.php';
