<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Document;

class DocumentPolicy
{
    public function view(User $user, Document $document)
    {
        if ($document->user_id === $user->id) return true;
        
        $share = $document->shares()
            ->where('user_id', $user->id)
            ->where(function ($query) {
                $query->whereNull('expires_at')
                      ->orWhere('expires_at', '>', now());
            })
            ->first();
            
        return $share !== null;
    }

    public function edit(User $user, Document $document)
    {
        if ($document->user_id === $user->id) return true;
        
        $share = $document->shares()
            ->where('user_id', $user->id)
            ->whereIn('permission_type', ['edit', 'admin'])
            ->where(function ($query) {
                $query->whereNull('expires_at')
                      ->orWhere('expires_at', '>', now());
            })
            ->first();
            
        return $share !== null;
    }

    public function admin(User $user, Document $document)
    {
        if ($document->user_id === $user->id) return true;
        
        $share = $document->shares()
            ->where('user_id', $user->id)
            ->where('permission_type', 'admin')
            ->where(function ($query) {
                $query->whereNull('expires_at')
                      ->orWhere('expires_at', '>', now());
            })
            ->first();
            
        return $share !== null;
    }
} 