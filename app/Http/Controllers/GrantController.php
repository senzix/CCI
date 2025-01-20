<?php

namespace App\Http\Controllers;

use App\Models\Grant;
use App\Models\GrantCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use App\Models\DocumentCategory;
use App\Models\GrantExpenditure;

class GrantController extends Controller
{
    public function index()
    {
        return Inertia::render('Modules/Grant/Index', [
            'grants' => Grant::query()
                ->with('category')
                ->when(request('search'), function($query, $search) {
                    $query->where('title', 'like', "%{$search}%")
                        ->orWhere('reference_number', 'like', "%{$search}%")
                        ->orWhere('funding_agency', 'like', "%{$search}%");
                })
                ->when(request('status'), function($query, $status) {
                    if ($status !== 'all') {
                        $query->where('status', $status);
                    }
                })
                ->when(request('category'), function($query, $category) {
                    if ($category !== 'all') {
                        $query->where('category_id', $category);
                    }
                })
                ->orderBy('created_at', 'desc')
                ->paginate(10)
                ->withQueryString(),
            'categories' => GrantCategory::all(),
            'filters' => request()->all(),
            'stats' => [
                'total_grants' => Grant::count(),
                'active_grants' => Grant::where('status', 'active')->count(),
                'total_amount' => Grant::sum('amount'),
                'received_amount' => Grant::sum('amount_received'),
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'reference_number' => 'required|string|unique:grants',
            'category_id' => 'required|exists:grant_categories,id',
            'amount' => 'required|numeric|min:0',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'funding_agency' => 'required|string|max:255',
            'status' => 'required|in:draft,submitted,approved,rejected,active,completed',
            'description' => 'nullable|string',
            'objectives' => 'nullable|string',
            'requirements' => 'nullable|string',
            'contact_person' => 'nullable|string|max:255',
            'contact_email' => 'nullable|email|max:255',
            'contact_phone' => 'nullable|string|max:255',
            'amount_received' => 'nullable|numeric|min:0',
            'amount_spent' => 'nullable|numeric|min:0',
            'documents' => 'nullable|array',
            'documents.*.file' => 'required|file|max:10240', // 10MB max
            'documents.*.type' => 'required|string',
        ]);

        $grant = Grant::create($validated);

        if ($request->hasFile('documents')) {
            foreach ($request->file('documents') as $document) {
                $path = $document['file']->store('grant-documents', 'public');
                $grant->documents()->create([
                    'title' => $document['file']->getClientOriginalName(),
                    'file_path' => $path,
                    'type' => $document['type'],
                ]);
            }
        }

        return redirect()->route('grants.show', $grant)
            ->with('success', 'Grant created successfully.');
    }

    public function show(Grant $grant)
    {
        return Inertia::render('Modules/Grant/Show', [
            'grant' => $grant->load(['documents.category', 'expenditures']),
            'documentCategories' => DocumentCategory::all()
        ]);
    }

    public function update(Request $request, Grant $grant)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'reference_number' => 'required|string|unique:grants,reference_number,' . $grant->id,
            'category_id' => 'required|exists:grant_categories,id',
            'amount' => 'required|numeric|min:0',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'funding_agency' => 'required|string|max:255',
            'status' => 'required|in:draft,submitted,approved,rejected,active,completed',
            'description' => 'nullable|string',
            'objectives' => 'nullable|string',
            'requirements' => 'nullable|string',
            'contact_person' => 'nullable|string|max:255',
            'contact_email' => 'nullable|email|max:255',
            'contact_phone' => 'nullable|string|max:255',
            'amount_received' => 'nullable|numeric|min:0',
            'amount_spent' => 'nullable|numeric|min:0',
            'new_documents' => 'nullable|array',
            'new_documents.*.file' => 'required|file|max:10240',
            'new_documents.*.type' => 'required|string',
        ]);

        $grant->update($validated);

        if ($request->hasFile('new_documents')) {
            foreach ($request->file('new_documents') as $document) {
                $path = $document['file']->store('grant-documents', 'public');
                $grant->documents()->create([
                    'title' => $document['file']->getClientOriginalName(),
                    'file_path' => $path,
                    'type' => $document['type'],
                ]);
            }
        }

        return redirect()->back()
            ->with('success', 'Grant updated successfully.');
    }

    public function destroy(Grant $grant)
    {
        // Delete associated documents from storage
        foreach ($grant->documents as $document) {
            Storage::disk('public')->delete($document->file_path);
        }

        $grant->delete();

        return redirect()->route('grants.index')
            ->with('success', 'Grant deleted successfully.');
    }

    public function addExpenditure(Request $request, Grant $grant)
    {
        $validated = $request->validate([
            'description' => 'required|string',
            'amount' => 'required|numeric|min:0',
            'date' => 'required|date',
            'category' => 'required|string',
            'receipt_number' => 'nullable|string',
            'receipt_file' => 'nullable|file|max:5120', // 5MB max
            'notes' => 'nullable|string',
        ]);

        if ($request->hasFile('receipt_file')) {
            $validated['receipt_file'] = $request->file('receipt_file')
                ->store('grant-receipts', 'public');
        }

        $grant->expenditures()->create($validated);
        $grant->increment('amount_spent', $validated['amount']);

        return redirect()->back()
            ->with('success', 'Expenditure recorded successfully.');
    }

    public function removeDocument(Grant $grant, GrantDocument $document)
    {
        if ($document->grant_id !== $grant->id) {
            abort(403);
        }

        Storage::disk('public')->delete($document->file_path);
        $document->delete();

        return redirect()->back()
            ->with('success', 'Document removed successfully.');
    }

    public function updateExpenditure(Request $request, Grant $grant, GrantExpenditure $expenditure)
    {
        $validated = $request->validate([
            'description' => 'required|string',
            'amount' => 'required|numeric|min:0',
            'date' => 'required|date',
            'category' => 'required|string',
            'receipt_number' => 'nullable|string',
            'receipt_file' => 'nullable|file|max:5120', // 5MB max
            'notes' => 'nullable|string',
        ]);

        // Calculate the difference in amount to update grant's total spent
        $amountDifference = $validated['amount'] - $expenditure->amount;

        if ($request->hasFile('receipt_file')) {
            // Delete old receipt file if it exists
            if ($expenditure->receipt_file) {
                Storage::disk('public')->delete($expenditure->receipt_file);
            }
            $validated['receipt_file'] = $request->file('receipt_file')
                ->store('grant-receipts', 'public');
        }

        $expenditure->update($validated);
        
        // Update grant's amount_spent
        if ($amountDifference != 0) {
            $grant->increment('amount_spent', $amountDifference);
        }

        return redirect()->back()
            ->with('success', 'Expenditure updated successfully.');
    }

    // I'll continue with more controller methods in the next part...
} 