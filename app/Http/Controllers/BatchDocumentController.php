<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use ZipArchive;

class BatchDocumentController extends Controller
{
    public function download(Request $request)
    {
        $validated = $request->validate([
            'documents' => 'required|array',
            'documents.*' => 'exists:documents,id'
        ]);

        $documents = Document::whereIn('id', $validated['documents'])->get();
        
        if ($documents->isEmpty()) {
            return back()->with('error', 'No documents selected.');
        }

        // For single document, return direct download
        if ($documents->count() === 1) {
            $document = $documents->first();
            $filePath = Storage::disk('public')->path($document->file_path);
            
            if (!file_exists($filePath)) {
                return back()->with('error', 'File not found.');
            }

            return response()->file($filePath, [
                'Content-Type' => Storage::disk('public')->mimeType($document->file_path),
                'Content-Disposition' => 'attachment; filename="' . $document->file_name . '"'
            ]);
        }

        // For multiple documents, create a zip file
        $zip = new ZipArchive();
        $zipFileName = 'documents-' . now()->format('Y-m-d-His') . '.zip';
        $tempPath = storage_path('app/temp');
        
        if (!file_exists($tempPath)) {
            mkdir($tempPath, 0755, true);
        }
        
        $zipPath = $tempPath . '/' . $zipFileName;

        if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) === TRUE) {
            foreach ($documents as $document) {
                $filePath = Storage::disk('public')->path($document->file_path);
                if (file_exists($filePath)) {
                    $content = file_get_contents($filePath);
                    if ($content !== false) {
                        $zip->addFromString($document->file_name, $content);
                    }
                }
            }
            $zip->close();

            if (file_exists($zipPath)) {
                return response()->download($zipPath, $zipFileName, [
                    'Content-Type' => 'application/zip',
                ])->deleteFileAfterSend(true);
            }
        }

        return back()->with('error', 'Could not create zip file.');
    }

    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'documents' => 'required|array',
            'documents.*' => 'exists:documents,id'
        ]);

        $documents = Document::whereIn('id', $validated['documents'])->get();
        
        foreach ($documents as $document) {
            Storage::disk('public')->delete($document->file_path);
            $document->delete();
        }

        return back()->with('success', count($validated['documents']) . ' documents deleted successfully.');
    }

    public function move(Request $request)
    {
        $validated = $request->validate([
            'documents' => 'required|array',
            'documents.*' => 'exists:documents,id',
            'category_id' => 'required|exists:document_categories,id'
        ]);

        Document::whereIn('id', $validated['documents'])
            ->update(['category_id' => $validated['category_id']]);

        return back()->with('success', count($validated['documents']) . ' documents moved successfully.');
    }
} 