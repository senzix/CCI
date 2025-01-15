<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Student extends Model
{
    protected $fillable = [
        'name',
        'registration_number',
        'photo_path',
        'student_class_id',
        'special_needs_category',
        'special_requirements',
        'status',
        'date_of_birth',
        'guardian_name',
        'guardian_contact',
        'guardian_email',
    ];

    public function classAssignments(): HasMany
    {
        return $this->hasMany(StudentClassAssignment::class)
                    ->orderBy('start_date', 'desc');
    }

    public function currentClass(): HasOne
    {
        return $this->hasOne(StudentClassAssignment::class)
            ->whereNull('end_date')
            ->latest('start_date');
    }

    public function class()
    {
        return $this->belongsTo(StudentClass::class, 'student_class_id');
    }
}