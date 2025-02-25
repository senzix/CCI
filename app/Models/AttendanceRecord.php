<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Carbon\Carbon;

class AttendanceRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'date',
        'clock_in',
        'clock_out',
        'status',
        'notes'
    ];

    protected $casts = [
        'date' => 'date',
        'clock_in' => 'datetime',
        'clock_out' => 'datetime'
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function getWorkHoursAttribute()
    {
        if (!$this->clock_in || !$this->clock_out) {
            return 0;
        }

        return $this->clock_in->diffInHours($this->clock_out);
    }

    public static function getMonthlyRate()
    {
        $startOfMonth = Carbon::now()->startOfMonth();
        $endOfMonth = Carbon::now()->endOfMonth();
        
        $totalWorkDays = self::whereBetween('date', [$startOfMonth, $endOfMonth])->count();
        $presentDays = self::whereBetween('date', [$startOfMonth, $endOfMonth])
            ->whereIn('status', ['present', 'late'])
            ->count();

        if ($totalWorkDays === 0) {
            return 0;
        }

        return round(($presentDays / $totalWorkDays) * 100, 2);
    }
} 