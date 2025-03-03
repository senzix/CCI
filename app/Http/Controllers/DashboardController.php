<?php

namespace App\Http\Controllers;

use App\Models\Grant;
use App\Models\Document;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        // Get grant counts and amounts
        $activeGrants = Grant::where('status', 'active')->count();
        $totalGrantAmount = Grant::where('status', 'active')->sum('amount');

        // Get total active documents
        $totalDocuments = Document::where('status', 'active')
            ->whereNull('deleted_at')
            ->count();

        // Create the data array
        $data = [
            'stats' => [
                'active_grants' => $activeGrants,
                'total_grant_amount' => $totalGrantAmount,
                'total_files' => $totalDocuments,
            ],
            'auth' => [
                'user' => array_merge(
                    $request->user()->only(['id', 'name', 'email']),
                    [
                        'permissions' => $request->user()->permissions->pluck('code'),
                        'is_admin' => $request->user()->isAdmin(),
                    ]
                )
            ]
        ];

        // Log the final data array
        Log::info('Data being passed to Inertia:', $data);

        // Return with explicit data array
        return Inertia::render('Dashboard', $data);
    }
}