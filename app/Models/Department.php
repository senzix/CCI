<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Department extends Model
{
    protected $fillable = ['name', 'code', 'description'];

    public function positions(): HasMany
    {
        return $this->hasMany(Position::class);
    }
} 