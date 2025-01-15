<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StudentClass extends Model
{
    protected $fillable = ['name', 'type', 'capacity', 'description'];

    protected $appends = ['student_count', 'available_seats'];

    public function students(): HasMany
    {
        return $this->hasMany(StudentClassAssignment::class);
    }

    public function getStudentCountAttribute(): int
    {
        return $this->students()->count();
    }

    public function getAvailableSeatsAttribute(): int
    {
        return max(0, $this->capacity - $this->student_count);
    }
} 