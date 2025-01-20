<?php

namespace App\Http\Controllers;

use App\Models\AttendanceRecord;
use App\Models\Employee;
use App\Models\LeaveRequest;
use App\Models\LeaveType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    public function index()
    {
        return Inertia::render('Modules/Attendance/Index', [
            'attendance' => AttendanceRecord::with('employee')->get(),
            'employees' => Employee::all(),
            'leaveRequests' => LeaveRequest::with(['employee', 'leaveType'])->get(),
            'leaveTypes' => LeaveType::all(),
            'stats' => [
                'attendance_rate' => $this->calculateAttendanceRate(),
                'present_today' => AttendanceRecord::whereDate('date', today())
                    ->where('status', 'present')
                    ->count(),
                'absent_today' => AttendanceRecord::whereDate('date', today())
                    ->where('status', 'absent')
                    ->count(),
                'on_leave' => LeaveRequest::where('status', 'approved')
                    ->whereDate('start_date', '<=', today())
                    ->whereDate('end_date', '>=', today())
                    ->count(),
            ]
        ]);
    }

    private function calculateAttendanceRate()
    {
        $totalEmployees = Employee::count();
        if ($totalEmployees === 0) return 0;

        $presentToday = AttendanceRecord::whereDate('date', today())
            ->whereIn('status', ['present', 'late'])
            ->count();

        $onLeave = LeaveRequest::where('status', 'approved')
            ->whereDate('start_date', '<=', today())
            ->whereDate('end_date', '>=', today())
            ->count();

        return round((($presentToday + $onLeave) / $totalEmployees) * 100);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'date' => 'required|date',
            'clock_in' => 'required|date_format:H:i',
            'clock_out' => 'nullable|date_format:H:i|after:clock_in',
            'status' => 'required|in:present,absent,late,half-day',
            'notes' => 'nullable|string'
        ]);

        AttendanceRecord::create($validated);

        return redirect()->back()->with('success', 'Attendance recorded successfully.');
    }

    public function update(Request $request, AttendanceRecord $attendance)
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'date' => 'required|date',
            'clock_in' => 'required|date_format:H:i',
            'clock_out' => 'nullable|date_format:H:i|after:clock_in',
            'status' => 'required|in:present,absent,late,half-day',
            'notes' => 'nullable|string'
        ]);

        $attendance->update($validated);

        return redirect()->back()->with('success', 'Attendance updated successfully.');
    }

    public function destroy(AttendanceRecord $attendance)
    {
        $attendance->delete();
        return redirect()->back()->with('success', 'Attendance record deleted successfully.');
    }
} 