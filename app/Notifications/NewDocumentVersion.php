<?php

namespace App\Notifications;

use App\Models\Document;
use App\Models\DocumentVersion;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class NewDocumentVersion extends Notification
{
    use Queueable;

    public function __construct(
        public Document $document,
        public DocumentVersion $version
    ) {}

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("New Version Available: {$this->document->title}")
            ->line("A new version ({$this->version->version_number}) has been uploaded for the document: {$this->document->title}")
            ->line($this->version->change_notes ? "Change Notes: {$this->version->change_notes}" : '')
            ->action('View Document', route('documents.show', $this->document->id))
            ->line('Thank you for using our application!');
    }

    public function toArray($notifiable): array
    {
        return [
            'document_id' => $this->document->id,
            'version_id' => $this->version->id,
            'version_number' => $this->version->version_number,
            'title' => $this->document->title,
            'change_notes' => $this->version->change_notes,
        ];
    }
} 