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
use App\Http\Controllers\ProjectController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard - no permission needed since access is controlled in the component
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Student Management Routes
    Route::prefix('students')->name('students.')->middleware('permission:students.view')->group(function () {
        Route::get('/', [StudentController::class, 'index'])->name('index');
        Route::get('/{student}', [StudentController::class, 'show'])->name('show');
        Route::post('/', [StudentController::class, 'store'])->middleware('permission:students.create')->name('store');
        Route::put('/{student}', [StudentController::class, 'update'])->middleware('permission:students.edit')->name('update');
        Route::delete('/{student}', [StudentController::class, 'destroy'])->middleware('permission:students.delete')->name('destroy');
        Route::get('/generate-registration', [StudentController::class, 'generateRegistrationNumber'])->name('generate-registration');
    });

    // Class Management
    Route::prefix('classes')->name('classes.')->middleware('permission:classes.view')->group(function () {
        Route::get('/', [StudentClassController::class, 'index'])->name('index');
        Route::post('/', [StudentClassController::class, 'store'])->middleware('permission:classes.create')->name('store');
        Route::put('/{class}', [StudentClassController::class, 'update'])->middleware('permission:classes.edit')->name('update');
        Route::delete('/{class}', [StudentClassController::class, 'destroy'])->middleware('permission:classes.delete')->name('destroy');
    });

    // Employee Management Routes
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

    // Department & Position Management
    Route::prefix('departments')->name('departments.')->middleware('permission:departments.view')->group(function () {
        Route::get('/', [DepartmentController::class, 'index'])->name('index');
        Route::post('/', [DepartmentController::class, 'store'])->middleware('permission:departments.create')->name('store');
        Route::put('/{department}', [DepartmentController::class, 'update'])->middleware('permission:departments.edit')->name('update');
        Route::delete('/{department}', [DepartmentController::class, 'destroy'])->middleware('permission:departments.delete')->name('destroy');
    });
    Route::prefix('positions')->name('positions.')->middleware('permission:positions.view')->group(function () {
        Route::get('/', [PositionController::class, 'index'])->name('index');
        Route::post('/', [PositionController::class, 'store'])->middleware('permission:positions.create')->name('store');
        Route::put('/{position}', [PositionController::class, 'update'])->middleware('permission:positions.edit')->name('update');
        Route::delete('/{position}', [PositionController::class, 'destroy'])->middleware('permission:positions.delete')->name('destroy');
    });

    // Attendance Management
    Route::prefix('attendance')->name('attendance.')->middleware('permission:attendance.view')->group(function () {
        Route::get('/', [AttendanceController::class, 'index'])->name('index');
        Route::post('/', [AttendanceController::class, 'store'])->middleware('permission:attendance.record')->name('store');
        Route::put('/{attendance}', [AttendanceController::class, 'update'])->middleware('permission:attendance.record')->name('update');
        Route::delete('/{attendance}', [AttendanceController::class, 'destroy'])->middleware('permission:attendance.record')->name('destroy');
    });

    // Leave Request Management
    Route::prefix('leave-requests')->name('leave-requests.')->group(function () {
        Route::get('/', [LeaveRequestController::class, 'index'])->name('index');
        Route::post('/', [LeaveRequestController::class, 'store'])->name('store');
        Route::put('/{leaveRequest}', [LeaveRequestController::class, 'update'])->name('update');
        Route::put('/{leaveRequest}/approve', [LeaveRequestController::class, 'approve'])->name('approve');
        Route::put('/{leaveRequest}/reject', [LeaveRequestController::class, 'reject'])->name('reject');
        Route::delete('/{leaveRequest}', [LeaveRequestController::class, 'destroy'])->name('destroy');
    });

    // Document Management
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

    // Grant Management
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
    Route::resource('grant-categories', GrantCategoryController::class)->except(['show']);

    // Payroll Management
    Route::prefix('payroll')->name('payroll.')->middleware('permission:payroll.view')->group(function () {
        Route::get('/', [PayrollController::class, 'index'])->name('index');
        Route::post('/generate', [PayrollController::class, 'generate'])->middleware('permission:payroll.generate')->name('generate');
        Route::put('/{payroll}', [PayrollController::class, 'update'])->middleware('permission:payroll.edit')->name('update');
        Route::delete('/{payroll}', [PayrollController::class, 'destroy'])->middleware('permission:payroll.edit')->name('destroy');
        Route::put('/{payroll}/mark-paid', [PayrollController::class, 'markPaid'])->name('mark-paid');
        Route::get('/{payroll}/download', [PayrollController::class, 'download'])->name('download');
    });

    Route::resource('payroll-periods', PayrollPeriodController::class)->except(['show']);
});

// Profile routes (no special permissions needed)
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

    // Add these new routes
    Route::post('/positions', [PositionController::class, 'store'])->name('positions.store');
    Route::delete('/positions/{position}', [PositionController::class, 'destroy'])->name('positions.destroy');
});

// Project Management
Route::prefix('projects')->name('projects.')->middleware('permission:projects.view')->group(function () {
    Route::get('/', [ProjectController::class, 'index'])->name('index');
    Route::get('/create', [ProjectController::class, 'create'])->middleware('permission:projects.create')->name('create');
    Route::post('/', [ProjectController::class, 'store'])->middleware('permission:projects.create')->name('store');
    Route::get('/{project}', [ProjectController::class, 'show'])->name('show');
    Route::get('/{project}/edit', [ProjectController::class, 'edit'])->middleware('permission:projects.edit')->name('edit');
    Route::put('/{project}', [ProjectController::class, 'update'])->middleware('permission:projects.edit')->name('update');
    Route::delete('/{project}', [ProjectController::class, 'destroy'])->middleware('permission:projects.delete')->name('destroy');
});

require __DIR__.'/auth.php';
