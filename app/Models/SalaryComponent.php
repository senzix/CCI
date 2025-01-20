<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SalaryComponent extends Model
{
    protected $fillable = [
        'name',
        'type',
        'is_taxable',
        'is_fixed',
        'amount',
        'percentage'
    ];

    protected $casts = [
        'is_taxable' => 'boolean',
        'is_fixed' => 'boolean',
        'amount' => 'decimal:2',
        'percentage' => 'decimal:2'
    ];

    public function calculateAmount($baseSalary)
    {
        if ($this->is_fixed) {
            return $this->amount;
        }
        
        return ($baseSalary * $this->percentage) / 100;
    }
} 