<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\DocumentVersion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DocumentVersionController extends Controller
{
    public function store(Request $request, Document $document)
    {
        $validated = $request->validate([
            'file' => 'required|file|max:10240', // 10MB max
            'change_notes' => 'nullable|string',
        ]);

        $file = $request->file('file');
        $path = $file->store('documents/versions', 'public');

        // Get the latest version number and increment
        $latestVersion = $document->versions()
            ->orderByDesc('version_number')
            ->first();
        
        $versionNumber = $latestVersion 
            ? $this->incrementVersion($latestVersion->version_number)
            : '1.0.0';

        $version = $document->versions()->create([
            'file_path' => $path,
            'version_number' => $versionNumber,
            'change_notes' => $validated['change_notes'],
            'created_by' => auth()->id(),
        ]);

        return back()->with('success', 'New version uploaded successfully.');
    }

    public function show(Document $document, DocumentVersion $version)
    {
        if ($version->document_id !== $document->id) {
            abort(403);
        }

        return Storage::disk('public')->download(
            $version->file_path,
            $document->file_name
        );
    }

    public function destroy(Document $document, DocumentVersion $version)
    {
        if ($version->document_id !== $document->id) {
            abort(403);
        }

        if ($document->versions()->count() <= 1) {
            return back()->with('error', 'Cannot delete the only version of a document.');
        }

        Storage::disk('public')->delete($version->file_path);
        $version->delete();

        return back()->with('success', 'Version deleted successfully.');
    }

    private function incrementVersion(string $version): string
    {
        $parts = explode('.', $version);
        $parts[2] = (int)$parts[2] + 1;
        
        // If patch number exceeds 9, increment minor version
        if ($parts[2] > 9) {
            $parts[1] = (int)$parts[1] + 1;
            $parts[2] = 0;
            
            // If minor version exceeds 9, increment major version
            if ($parts[1] > 9) {
                $parts[0] = (int)$parts[0] + 1;
                $parts[1] = 0;
            }
        }
        
        return implode('.', $parts);
    }
} 