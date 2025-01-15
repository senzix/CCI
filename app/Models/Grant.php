<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Grant extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title',
        'reference_number',
        'category_id',
        'amount',
        'start_date',
        'end_date',
        'funding_agency',
        'status',
        'description',
        'objectives',
        'requirements',
        'contact_person',
        'contact_email',
        'contact_phone',
        'amount_received',
        'amount_spent'
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'amount' => 'decimal:2',
        'amount_received' => 'decimal:2',
        'amount_spent' => 'decimal:2',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(GrantCategory::class, 'category_id');
    }

    public function documents(): MorphMany
    {
        return $this->morphMany(Document::class, 'documentable');
    }

    public function expenditures(): HasMany
    {
        return $this->hasMany(GrantExpenditure::class);
    }

    public function getRemainingAmountAttribute()
    {
        return $this->amount_received - $this->amount_spent;
    }

    public function getProgressPercentageAttribute()
    {
        if ($this->amount == 0) return 0;
        return ($this->amount_received / $this->amount) * 100;
    }

    public function getStatusColorAttribute()
    {
        return match($this->status) {
            'draft' => 'gray',
            'submitted' => 'blue',
            'approved' => 'green',
            'rejected' => 'red',
            'active' => 'indigo',
            'completed' => 'purple',
            default => 'gray'
        };
    }
} 