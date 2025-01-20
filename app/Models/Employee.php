<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Employee extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'employee_id',
        'user_id',
        'position_id',
        'first_name',
        'last_name',
        'email',
        'phone',
        'date_of_birth',
        'hire_date',
        'employment_status',
        'salary',
        'address',
        'emergency_contact_name',
        'emergency_contact_phone',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function position(): BelongsTo
    {
        return $this->belongsTo(Position::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }
} 