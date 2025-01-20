<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\DocumentCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class DocumentController extends Controller
{
    public function index(Request $request)
    {
        $query = Document::query()
            ->with(['category'])
            ->when($request->search, function ($query, $search) {
                $query->where('title', 'like', "%{$search}%");
            })
            ->when($request->category, function ($query, $category) {
                $query->where('category_id', $category);
            })
            ->when($request->type, function ($query, $type) {
                $query->where('file_type', 'like', "%{$type}%");
            })
            ->when($request->date_from, function ($query, $date) {
                $query->whereDate('created_at', '>=', $date);
            })
            ->when($request->date_to, function ($query, $date) {
                $query->whereDate('created_at', '<=', $date);
            });

        // Handle grant documents inclusion
        if (!$request->boolean('include_grants')) {
            $query->whereNull('documentable_type');
        } else {
            $query->where(function ($q) {
                $q->whereNull('documentable_type')
                  ->orWhere('documentable_type', 'App\\Models\\Grant');
            });
        }

        return inertia('Modules/Document/Index', [
            'documents' => $query->latest()->paginate(20)->withQueryString(),
            'filters' => array_merge($request->all([
                'search', 
                'category', 
                'type',
                'date_from', 
                'date_to'
            ]), [
                'include_grants' => $request->boolean('include_grants')
            ]),
            'categories' => DocumentCategory::all(),
        ]);
    }

    public function store(Request $request)
    {
        \Log::info('Document upload request:', $request->all());
        
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'file' => 'required|file|max:10240',
                'category_id' => 'required|exists:document_categories,id',
                'documentable_type' => 'nullable|string|in:grant',
                'documentable_id' => 'nullable|integer|exists:grants,id',
                'description' => 'nullable|string',
                'tags' => 'nullable|json',
            ]);

            $file = $request->file('file');
            $extension = strtolower($file->getClientOriginalExtension());
            
            // Store file in the correct directory
            $path = $file->store('documents', 'public');

            // Create document with proper documentable fields
            $document = Document::create([
                'title' => $validated['title'],
                'file_path' => $path,
                'file_name' => $file->getClientOriginalName(),
                'file_type' => $extension,
                'file_size' => $file->getSize(),
                'category_id' => $validated['category_id'],
                'description' => $validated['description'] ?? null,
                'tags' => json_decode($validated['tags'] ?? '[]'),
                'documentable_type' => $validated['documentable_type'] ? 'App\\Models\\Grant' : null,
                'documentable_id' => $validated['documentable_id'],
            ]);

            \Log::info('Document created:', $document->toArray());

            return back()->with('success', 'Document uploaded successfully');
        } catch (\Exception $e) {
            \Log::error('Document upload failed:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return back()->withErrors([
                'error' => 'Failed to upload document: ' . $e->getMessage()
            ]);
        }
    }

    public function show(Document $document)
    {
        if (!auth()->user()->can('view', $document)) {
            abort(403);
        }

        return Inertia::render('Modules/Document/Show', [
            'document' => $document->load(['category', 'versions', 'shares']),
            'canEdit' => auth()->user()->can('edit', $document),
            'canAdmin' => auth()->user()->can('admin', $document),
        ]);
    }

    public function destroy(Document $document)
    {
        Storage::disk('public')->delete($document->file_path);
        $document->delete();

        return redirect()->route('documents.index')
            ->with('success', 'Document deleted successfully.');
    }

    public function download(Document $document)
    {
        return Storage::disk('public')->download(
            $document->file_path,
            $document->file_name
        );
    }

    public function trash()
    {
        $trashedDocuments = Document::onlyTrashed()
            ->with('category')
            ->orderBy('deleted_at', 'desc')
            ->paginate(20);

        return Inertia::render('Modules/Document/Trash', [
            'documents' => $trashedDocuments
        ]);
    }

    public function restore($id)
    {
        $document = Document::onlyTrashed()->findOrFail($id);
        $document->restore();

        return redirect()->back()
            ->with('success', 'Document restored successfully');
    }

    public function forceDelete($id)
    {
        $document = Document::onlyTrashed()->findOrFail($id);
        Storage::disk('public')->delete($document->file_path);
        $document->forceDelete();

        return redirect()->back()
            ->with('success', 'Document permanently deleted');
    }
} 