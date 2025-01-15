<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\DocumentCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class DocumentController extends Controller
{
    public function index()
    {
        $query = Document::query()
            ->with('category')
            ->when(request('search'), function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                      ->orWhere('file_name', 'like', "%{$search}%");
            })
            ->when(request('category'), function ($query, $category) {
                if ($category !== 'all') {
                    $query->where('category_id', $category);
                }
            })
            ->when(request('type') && request('type') !== 'all', function ($query, $type) {
                $type = request('type');
                
                switch($type) {
                    case 'pdf':
                        $query->whereIn('file_type', ['pdf', 'PDF']);
                        break;
                    case 'docx':
                        $query->whereIn('file_type', [
                            'doc', 'docx', 'DOC', 'DOCX',
                            'rtf', 'RTF', 'odt', 'ODT'
                        ]);
                        break;
                    case 'xlsx':
                        $query->whereIn('file_type', [
                            'xls', 'xlsx', 'XLS', 'XLSX',
                            'csv', 'CSV', 'ods', 'ODS'
                        ]);
                        break;
                    case 'jpg':
                        $query->whereIn('file_type', [
                            'jpg', 'jpeg', 'JPG', 'JPEG',
                            'png', 'PNG', 'gif', 'GIF',
                            'bmp', 'BMP', 'webp', 'WEBP',
                            'svg', 'SVG', 'tiff', 'TIFF'
                        ]);
                        break;
                    case 'ppt':
                        $query->whereIn('file_type', [
                            'ppt', 'pptx', 'PPT', 'PPTX',
                            'odp', 'ODP', 'key', 'KEY'
                        ]);
                        break;
                    case 'txt':
                        $query->whereIn('file_type', [
                            'txt', 'TXT', 'md', 'MD',
                            'text', 'TEXT'
                        ]);
                        break;
                    case 'zip':
                        $query->whereIn('file_type', [
                            'zip', 'ZIP', 'rar', 'RAR',
                            '7z', '7Z', 'tar', 'TAR',
                            'gz', 'GZ'
                        ]);
                        break;
                    default:
                        $query->where('file_type', $type);
                }
            })
            ->when(request('date_from'), function ($query, $dateFrom) {
                $query->whereDate('created_at', '>=', $dateFrom);
            })
            ->when(request('date_to'), function ($query, $dateTo) {
                $query->whereDate('created_at', '<=', $dateTo);
            })
            ->when(request('sort_by') && request('sort_direction'), function ($query) {
                $query->orderBy(request('sort_by'), request('sort_direction'));
            }, function ($query) {
                $query->orderBy('created_at', 'desc');
            });

        return inertia('Modules/Document/Index', [
            'documents' => $query->paginate(20)->withQueryString(),
            'filters' => request()->all(['search', 'category', 'type', 'date_from', 'date_to', 'sort_by', 'sort_direction']),
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
                'documentable_id' => 'nullable|integer',
                'description' => 'nullable|string',
                'tags' => 'nullable|json',
            ]);

            $file = $request->file('file');
            
            // Get the file extension instead of mime type
            $extension = strtolower($file->getClientOriginalExtension());
            
            $path = $file->store('documents', 'public');

            $document = Document::create([
                'title' => $validated['title'],
                'file_path' => $path,
                'file_name' => $file->getClientOriginalName(),
                'file_type' => $extension,  // Save just the extension
                'file_size' => $file->getSize(),
                'category_id' => $validated['category_id'],
                'description' => $validated['description'] ?? null,
                'tags' => json_decode($validated['tags'] ?? '[]'),
                'documentable_type' => $validated['documentable_type'] ?? null,
                'documentable_id' => $validated['documentable_id'] ?? null,
            ]);

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
} 