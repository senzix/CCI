<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GrantExpenditure extends Model
{
    protected $fillable = [
        'grant_id',
        'description',
        'amount',
        'date',
        'category',
        'receipt_number',
        'receipt_file',
        'notes'
    ];

    protected $casts = [
        'date' => 'date',
        'amount' => 'decimal:2'
    ];

    public function grant(): BelongsTo
    {
        return $this->belongsTo(Grant::class);
    }
} 