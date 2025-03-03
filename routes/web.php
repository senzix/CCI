<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\DocumentVersionController;
use App\Http\Controllers\BatchDocumentController;
use App\Http\Controllers\DocumentShareController;
use App\Http\Controllers\DocumentCategoryController;
use App\Http\Controllers\GrantController;
use App\Http\Controllers\GrantCategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\PositionController;
use App\Http\Controllers\ProjectController;

// Welcome page - public access
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Routes that require authentication
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard - no permission needed since access is controlled in the component
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // ===== EMPLOYEE MANAGEMENT MODULE =====
    Route::prefix('employees')->name('employees.')->middleware('permission:employees.view')->group(function () {
        Route::get('/', [EmployeeController::class, 'index'])->name('index');
        Route::get('/{employee}', [EmployeeController::class, 'show'])->name('show');
        Route::post('/', [EmployeeController::class, 'store'])->middleware('permission:employees.create')->name('store');
        Route::put('/{employee}', [EmployeeController::class, 'update'])->middleware('permission:employees.edit')->name('update');
        Route::delete('/{employee}', [EmployeeController::class, 'destroy'])->middleware('permission:employees.delete')->name('destroy');
        Route::get('/create', [EmployeeController::class, 'create'])->middleware('permission:employees.create')->name('create');
        Route::get('/{employee}/edit', [EmployeeController::class, 'edit'])->middleware('permission:employees.edit')->name('edit');
        Route::put('/{employee}/status', [EmployeeController::class, 'updateStatus'])->name('update-status');
        Route::post('/{employee}/reset-password', [EmployeeController::class, 'resetPassword'])->name('reset-password');
    });

    // Department Management
    Route::prefix('departments')->name('departments.')->middleware('permission:departments.view')->group(function () {
        Route::get('/', [DepartmentController::class, 'index'])->name('index');
        Route::post('/', [DepartmentController::class, 'store'])->middleware('permission:departments.create')->name('store');
        Route::put('/{department}', [DepartmentController::class, 'update'])->middleware('permission:departments.edit')->name('update');
        Route::delete('/{department}', [DepartmentController::class, 'destroy'])->middleware('permission:departments.delete')->name('destroy');
    });

    // Position Management
    Route::prefix('positions')->name('positions.')->middleware('permission:positions.view')->group(function () {
        Route::get('/', [PositionController::class, 'index'])->name('index');
        Route::post('/', [PositionController::class, 'store'])->middleware('permission:positions.create')->name('store');
        Route::put('/{position}', [PositionController::class, 'update'])->middleware('permission:positions.edit')->name('update');
        Route::delete('/{position}', [PositionController::class, 'destroy'])->middleware('permission:positions.delete')->name('destroy');
    });

    // ===== DOCUMENT MANAGEMENT MODULE =====
    Route::prefix('documents')->name('documents.')->middleware('auth')->group(function () {
        Route::get('/', [DocumentController::class, 'index'])
            ->middleware('permission:documents.view')
            ->name('index');
        
        Route::post('/upload', [DocumentController::class, 'store'])
            ->middleware('permission:documents.upload')
            ->name('store');
        
        Route::delete('/{document}', [DocumentController::class, 'destroy'])
            ->middleware('permission:documents.delete')
            ->name('destroy');
        
        Route::post('/{document}/share', [DocumentController::class, 'share'])
            ->middleware('permission:documents.share')
            ->name('share');
        
        Route::get('/download/{document}', [DocumentController::class, 'download'])
            ->middleware('permission:documents.download')
            ->name('download');
            
        Route::get('/trash', [DocumentController::class, 'trash'])
            ->middleware('permission:documents.view')
            ->name('trash');
        
        Route::post('/trash/{document}/restore', [DocumentController::class, 'restore'])
            ->middleware('permission:documents.delete')
            ->name('restore');
        
        Route::delete('/trash/{document}', [DocumentController::class, 'forceDelete'])
            ->middleware('permission:documents.delete')
            ->name('force-delete');

        // Batch operation routes
        Route::post('/batch/download', [BatchDocumentController::class, 'download'])
            ->middleware('permission:documents.download')
            ->name('batch.download');
        
        Route::post('/batch/move', [BatchDocumentController::class, 'move'])
            ->middleware('permission:documents.move')
            ->name('batch.move');
        
        Route::delete('/batch/destroy', [BatchDocumentController::class, 'destroy'])
            ->middleware('permission:documents.delete')
            ->name('batch.destroy');
    });

    // ===== GRANT MANAGEMENT MODULE =====
    Route::prefix('grants')->name('grants.')->middleware('permission:grants.view')->group(function () {
        Route::get('/', [GrantController::class, 'index'])->name('index');
        Route::post('/', [GrantController::class, 'store'])->middleware('permission:grants.create')->name('store');
        Route::get('/{grant}', [GrantController::class, 'show'])->name('show');
        Route::put('/{grant}', [GrantController::class, 'update'])->middleware('permission:grants.edit')->name('update');
        Route::delete('/{grant}', [GrantController::class, 'destroy'])->middleware('permission:grants.delete')->name('destroy');
        Route::get('/{grant}/expenditures', [GrantController::class, 'expenditures'])->name('expenditures');
        Route::post('/{grant}/expenditures', [GrantController::class, 'addExpenditure'])->name('expenditures.store');
        Route::put('/{grant}/expenditures/{expenditure}', [GrantController::class, 'updateExpenditure'])->name('expenditures.update');
    });

    // Grant Categories
    Route::resource('grant-categories', GrantCategoryController::class)->except(['show'])
        ->middleware('permission:grants.categories');

    // ===== PROJECT MANAGEMENT MODULE =====
    Route::prefix('projects')->name('projects.')->middleware('permission:projects.view')->group(function () {
        Route::get('/', [ProjectController::class, 'index'])->name('index');
        Route::get('/create', [ProjectController::class, 'create'])->middleware('permission:projects.create')->name('create');
        Route::post('/', [ProjectController::class, 'store'])->middleware('permission:projects.create')->name('store');
        Route::get('/{project}', [ProjectController::class, 'show'])->name('show');
        Route::get('/{project}/edit', [ProjectController::class, 'edit'])->middleware('permission:projects.edit')->name('edit');
        Route::put('/{project}', [ProjectController::class, 'update'])->middleware('permission:projects.edit')->name('update');
        Route::delete('/{project}', [ProjectController::class, 'destroy'])->middleware('permission:projects.delete')->name('destroy');
    });
});

// Profile routes (no special permissions needed)
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Expenditure receipt routes
    Route::get('/expenditures/{expenditure}/receipt/download', [GrantController::class, 'downloadReceipt'])
        ->name('expenditures.download-receipt');
    
    Route::get('/expenditures/{expenditure}/receipt/view', [GrantController::class, 'viewReceipt'])
        ->name('expenditures.view-receipt');
});

require __DIR__.'/auth.php';
