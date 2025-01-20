<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Grant;
use App\Models\Document;
use App\Models\PayrollRecord;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class DashboardController extends Controller
{
    public function index()
    {
        // Get the counts first
        $activeStudents = Student::where('status', 'active')->count();
        $specialEdStudents = Student::whereNotNull('special_needs_category')
            ->where('status', 'active')
            ->count();
        $pendingStudents = Student::where('status', 'pending')->count();

        // Get grant counts and amounts
        $activeGrants = Grant::where('status', 'active')->count();
        $totalGrantAmount = Grant::where('status', 'active')->sum('amount');

        // Get total active documents
        $totalDocuments = Document::where('status', 'active')
            ->whereNull('deleted_at')
            ->count();

        // Log the values
        Log::info('Dashboard Stats:', [
            'active' => $activeStudents,
            'special_ed' => $specialEdStudents,
            'pending' => $pendingStudents
        ]);

        // Create the data array
        $data = [
            'stats' => [
                'active_students' => $activeStudents,
                'special_ed_students' => $specialEdStudents,
                'pending_assessments' => $pendingStudents,
                'active_grants' => $activeGrants,
                'total_grant_amount' => $totalGrantAmount,
                'total_files' => $totalDocuments,
                'pending_payments' => PayrollRecord::where('payment_status', 'pending')->count(),
            ]
        ];

        // Log the final data array
        Log::info('Data being passed to Inertia:', $data);

        // Return with explicit data array
        return Inertia::render('Dashboard', $data);
    }
} 