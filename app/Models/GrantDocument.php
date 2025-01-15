<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GrantDocument extends Model
{
    protected $fillable = [
        'grant_id',
        'title',
        'file_path',
        'type'
    ];

    public function grant(): BelongsTo
    {
        return $this->belongsTo(Grant::class);
    }
}