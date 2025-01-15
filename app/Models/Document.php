<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Document extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title',
        'file_path',
        'file_name',
        'file_type',
        'file_size',
        'category_id',
        'description',
        'tags',
        'metadata',
        'documentable_type',
        'documentable_id',
        'status'
    ];

    protected $casts = [
        'tags' => 'array',
        'metadata' => 'array',
        'file_size' => 'integer',
        'documentable_id' => 'integer',
    ];

    protected $attributes = [
        'status' => 'active',
        'tags' => '[]',
        'metadata' => '[]'
    ];

    protected $appends = ['formatted_size'];

    public function category(): BelongsTo
    {
        return $this->belongsTo(DocumentCategory::class);
    }

    public function versions(): HasMany
    {
        return $this->hasMany(DocumentVersion::class);
    }

    public function shares(): HasMany
    {
        return $this->hasMany(DocumentShare::class);
    }

    public function documentable(): MorphTo
    {
        return $this->morphTo();
    }

    public function getFormattedSizeAttribute(): string
    {
        $bytes = $this->file_size;
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        
        for ($i = 0; $bytes > 1024; $i++) {
            $bytes /= 1024;
        }
        
        return round($bytes, 2) . ' ' . $units[$i];
    }

    public function getIconAttribute(): string
    {
        return match ($this->file_type) {
            'pdf' => 'pdf',
            'doc', 'docx' => 'word',
            'xls', 'xlsx' => 'excel',
            'jpg', 'jpeg', 'png', 'gif' => 'image',
            default => 'file'
        };
    }
} 