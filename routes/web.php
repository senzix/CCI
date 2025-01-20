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
use App\Http\Controllers\GrantCategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\PositionController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\LeaveRequestController;
use App\Http\Controllers\PayrollController;
use App\Http\Controllers\PayrollPeriodController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Student Management Routes
    Route::get('/students/generate-registration', [StudentController::class, 'generateRegistrationNumber'])
        ->name('students.generate-registration');
    Route::resource('students', StudentController::class);
    Route::resource('classes', StudentClassController::class);
    Route::resource('class-assignments', ClassAssignmentController::class);

    // Employee Management Routes
    Route::prefix('employees')->name('employees.')->group(function () {
        Route::get('/', [EmployeeController::class, 'index'])->name('index');
        Route::get('/create', [EmployeeController::class, 'create'])->name('create');
        Route::post('/', [EmployeeController::class, 'store'])->name('store');
        Route::get('/{employee}', [EmployeeController::class, 'show'])->name('show');
        Route::get('/{employee}/edit', [EmployeeController::class, 'edit'])->name('edit');
        Route::put('/{employee}', [EmployeeController::class, 'update'])->name('update');
        Route::delete('/{employee}', [EmployeeController::class, 'destroy'])->name('destroy');
        Route::put('/{employee}/status', [EmployeeController::class, 'updateStatus'])->name('update-status');
        Route::post('/{employee}/reset-password', [EmployeeController::class, 'resetPassword'])->name('reset-password');
    });

    // Department Routes
    Route::prefix('departments')->name('departments.')->group(function () {
        Route::get('/', [DepartmentController::class, 'index'])->name('index');
        Route::post('/', [DepartmentController::class, 'store'])->name('store');
        Route::put('/{department}', [DepartmentController::class, 'update'])->name('update');
        Route::delete('/{department}', [DepartmentController::class, 'destroy'])->name('destroy');
    });

    // Position Routes
    Route::prefix('positions')->name('positions.')->group(function () {
        Route::get('/', [PositionController::class, 'index'])->name('index');
        Route::post('/', [PositionController::class, 'store'])->name('store');
        Route::put('/{position}', [PositionController::class, 'update'])->name('update');
        Route::delete('/{position}', [PositionController::class, 'destroy'])->name('destroy');
    });

    // Attendance Routes
    Route::prefix('attendance')->name('attendance.')->group(function () {
        Route::get('/', [AttendanceController::class, 'index'])->name('index');
        Route::post('/', [AttendanceController::class, 'store'])->name('store');
        Route::put('/{attendance}', [AttendanceController::class, 'update'])->name('update');
        Route::delete('/{attendance}', [AttendanceController::class, 'destroy'])->name('destroy');
    });

    // Leave Request Routes
    Route::prefix('leave-requests')->name('leave-requests.')->group(function () {
        Route::get('/', [LeaveRequestController::class, 'index'])->name('index');
        Route::post('/', [LeaveRequestController::class, 'store'])->name('store');
        Route::put('/{leaveRequest}', [LeaveRequestController::class, 'update'])->name('update');
        Route::put('/{leaveRequest}/approve', [LeaveRequestController::class, 'approve'])->name('approve');
        Route::put('/{leaveRequest}/reject', [LeaveRequestController::class, 'reject'])->name('reject');
        Route::delete('/{leaveRequest}', [LeaveRequestController::class, 'destroy'])->name('destroy');
    });

    // Payroll Routes
    Route::prefix('payroll')->name('payroll.')->group(function () {
        Route::get('/', [PayrollController::class, 'index'])->name('index');
        Route::post('/generate', [PayrollController::class, 'generate'])->name('generate');
        Route::get('/{payroll}', [PayrollController::class, 'show'])->name('show');
        Route::put('/{payroll}', [PayrollController::class, 'update'])->name('update');
        Route::delete('/{payroll}', [PayrollController::class, 'destroy'])->name('destroy');
        Route::get('/{payroll}/download', [PayrollController::class, 'download'])->name('download');
        Route::put('/{payroll}/mark-paid', [PayrollController::class, 'markPaid'])->name('mark-paid');
    });

    // Payroll Period Routes
    Route::prefix('payroll-periods')->name('payroll-periods.')->group(function () {
        Route::get('/', [PayrollPeriodController::class, 'index'])->name('index');
        Route::post('/', [PayrollPeriodController::class, 'store'])->name('store');
        Route::put('/{period}', [PayrollPeriodController::class, 'update'])->name('update');
        Route::delete('/{period}', [PayrollPeriodController::class, 'destroy'])->name('destroy');
    });

    // Project Routes
    Route::get('/project', function () {
        return Inertia::render('Modules/Project/Index');
    })->name('project.index');

    // Account Routes
    Route::get('/account', function () {
        return Inertia::render('Modules/Account/Index');
    })->name('account.index');

    // Document Management Routes
    Route::prefix('documents')->name('documents.')->group(function () {
        // Document Trash Routes
        Route::get('/trash', [DocumentController::class, 'trash'])->name('trash');
        Route::post('/{document}/restore', [DocumentController::class, 'restore'])->name('restore');
        Route::delete('/{document}/force', [DocumentController::class, 'forceDelete'])->name('force-delete');
        
        // Batch Operations
        Route::post('/batch/download', [BatchDocumentController::class, 'download'])->name('batch.download');
        Route::delete('/batch', [BatchDocumentController::class, 'destroy'])->name('batch.destroy');
        Route::post('/batch/move', [BatchDocumentController::class, 'move'])->name('batch.move');
        
        // Regular document routes
        Route::get('/', [DocumentController::class, 'index'])->name('index');
        Route::post('/', [DocumentController::class, 'store'])->name('store');
        Route::get('/{document}', [DocumentController::class, 'show'])->name('show');
        Route::delete('/{document}', [DocumentController::class, 'destroy'])->name('destroy');
        Route::get('/{document}/download', [DocumentController::class, 'download'])->name('download');
        
        // Document Versions
        Route::post('/{document}/versions', [DocumentVersionController::class, 'store'])->name('versions.store');
        Route::get('/{document}/versions/{version}', [DocumentVersionController::class, 'show'])->name('versions.show');
        Route::delete('/{document}/versions/{version}', [DocumentVersionController::class, 'destroy'])->name('versions.destroy');
        
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
    Route::post('grants/{grant}/expenditures', [GrantController::class, 'addExpenditure'])
        ->name('grants.expenditures.store');   
    Route::put('grants/{grant}/expenditures/{expenditure}', [GrantController::class, 'updateExpenditure'])
    ->name('grants.expenditures.update');

    // Grant Categories
    Route::resource('grant-categories', GrantCategoryController::class)->except(['index', 'create', 'edit', 'show']);
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/api/classes/list', [StudentClassController::class, 'getClasses'])->name('classes.list');
Route::middleware(['auth'])->group(function () {
    Route::get('/expenditures/{expenditure}/receipt/download', [GrantController::class, 'downloadReceipt'])
        ->name('expenditures.download-receipt');
    
    Route::get('/expenditures/{expenditure}/receipt/view', [GrantController::class, 'viewReceipt'])
        ->name('expenditures.view-receipt');

    Route::get('/payroll', [PayrollController::class, 'index'])->name('payroll.index');
    Route::post('/payroll/generate', [PayrollController::class, 'generate'])->name('payroll.generate');
    Route::put('/payroll/{payroll}/mark-paid', [PayrollController::class, 'markPaid'])->name('payroll.mark-paid');
    Route::get('/payroll/{payroll}/download', [PayrollController::class, 'download'])->name('payroll.download');
    
    Route::resource('payroll-periods', PayrollPeriodController::class)->except(['show']);
});

require __DIR__.'/auth.php';
