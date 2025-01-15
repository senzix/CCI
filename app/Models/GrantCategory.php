<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GrantCategory extends Model
{
    protected $fillable = [
        'name',
        'description',
    ];

    public function grants(): HasMany
    {
        return $this->hasMany(Grant::class, 'category_id');
    }
} 