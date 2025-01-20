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
        \Log::info('Starting batch download', ['documents' => $request->documents]);

        $validated = $request->validate([
            'documents' => 'required|array',
            'documents.*' => 'exists:documents,id'
        ]);

        $documents = Document::whereIn('id', $validated['documents'])
            ->select('id', 'file_path', 'file_name')
            ->get();
        
        \Log::info('Found documents', ['count' => $documents->count(), 'documents' => $documents->toArray()]);

        if ($documents->isEmpty()) {
            return back()->with('error', 'No documents selected.');
        }

        // For single document, return direct download
        if ($documents->count() === 1) {
            $document = $documents->first();
            
            if (Storage::disk('public')->exists($document->file_path)) {
                return Storage::disk('public')->download(
                    $document->file_path,
                    $document->file_name,
                    [
                        'Content-Type' => Storage::disk('public')->mimeType($document->file_path)
                    ]
                );
            }

            \Log::error('File not found', [
                'document_id' => $document->id,
                'file_path' => $document->file_path
            ]);
            
            return back()->with('error', 'File not found.');
        }

        // For multiple documents, create a zip file
        $zip = new ZipArchive();
        $zipFileName = 'documents-' . now()->format('Y-m-d-His') . '.zip';
        $tempPath = storage_path('app/temp');
        
        \Log::info('Creating zip file', [
            'temp_path' => $tempPath,
            'zip_file' => $zipFileName
        ]);

        if (!file_exists($tempPath)) {
            mkdir($tempPath, 0755, true);
        }
        
        $zipPath = $tempPath . '/' . $zipFileName;

        $zipResult = $zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE);
        \Log::info('Zip open result', ['result' => $zipResult]);

        if ($zipResult === TRUE) {
            foreach ($documents as $document) {
                try {
                    $filePath = Storage::disk('public')->path($document->file_path);
                    \Log::info('Processing document', [
                        'document_id' => $document->id,
                        'file_path' => $filePath,
                        'exists' => file_exists($filePath)
                    ]);

                    if (file_exists($filePath)) {
                        $zipEntryName = $document->id . '_' . $document->file_name;
                        $fileContents = file_get_contents($filePath);
                        
                        if ($fileContents !== false) {
                            $addResult = $zip->addFromString($zipEntryName, $fileContents);
                            \Log::info('Added file to zip', [
                                'document_id' => $document->id,
                                'success' => $addResult
                            ]);
                        } else {
                            \Log::error('Could not read file contents', [
                                'document_id' => $document->id,
                                'file_path' => $filePath
                            ]);
                        }
                    }
                } catch (\Exception $e) {
                    \Log::error('Error processing document', [
                        'document_id' => $document->id,
                        'file_path' => $document->file_path,
                        'error' => $e->getMessage(),
                        'trace' => $e->getTraceAsString()
                    ]);
                    continue;
                }
            }
            
            $closeResult = $zip->close();
            \Log::info('Zip close result', ['success' => $closeResult]);

            if (file_exists($zipPath)) {
                \Log::info('Sending zip file', [
                    'path' => $zipPath,
                    'size' => filesize($zipPath)
                ]);

                return response()->download($zipPath, $zipFileName, [
                    'Content-Type' => 'application/zip',
                ])->deleteFileAfterSend(true);
            }
        }

        \Log::error('Failed to create zip file', [
            'zip_path' => $zipPath,
            'exists' => file_exists($zipPath)
        ]);

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
            $document->delete();
        }

        return back()->with('success', count($validated['documents']) . ' documents moved to trash.');
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