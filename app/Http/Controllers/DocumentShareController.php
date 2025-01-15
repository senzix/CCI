<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\DocumentShare;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\DocumentShared;

class DocumentShareController extends Controller
{
    public function store(Request $request, Document $document)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'permission_type' => 'required|in:view,edit,admin',
            'expires_at' => 'nullable|date|after:now',
        ]);

        $share = $document->shares()->create([
            'user_id' => $validated['user_id'],
            'permission_type' => $validated['permission_type'],
            'expires_at' => $validated['expires_at'],
        ]);

        $user = User::find($validated['user_id']);
        Mail::to($user->email)->queue(new DocumentShared($document, $share));

        return back()->with('success', 'Document shared successfully.');
    }

    public function destroy(Document $document, DocumentShare $share)
    {
        if ($share->document_id !== $document->id) {
            abort(403);
        }

        $share->delete();

        return back()->with('success', 'Share access revoked successfully.');
    }

    public function users(Request $request)
    {
        return User::where('name', 'like', "%{$request->search}%")
            ->orWhere('email', 'like', "%{$request->search}%")
            ->limit(10)
            ->get(['id', 'name', 'email']);
    }
} 