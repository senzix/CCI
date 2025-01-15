<?php

namespace App\Mail;

use App\Models\Document;
use App\Models\DocumentShare;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class DocumentShared extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Document $document,
        public DocumentShare $share
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Document Shared: {$this->document->title}",
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.documents.shared',
            with: [
                'url' => route('documents.show', $this->document->id),
                'documentTitle' => $this->document->title,
                'permissionType' => $this->share->permission_type,
                'expiresAt' => $this->share->expires_at,
                'sharedByName' => $this->share->sharedBy->name,
            ],
        );
    }
} 