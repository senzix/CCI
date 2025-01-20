<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PayrollPeriod extends Model
{
    protected $fillable = [
        'name',
        'start_date',
        'end_date',
        'payment_date',
        'status'
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'payment_date' => 'date'
    ];

    public function payrollRecords(): HasMany
    {
        return $this->hasMany(PayrollRecord::class);
    }
} 