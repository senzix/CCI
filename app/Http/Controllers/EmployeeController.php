<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Department;
use App\Models\Position;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        $query = Employee::with(['position', 'position.department'])
            ->when($request->search, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('employee_id', 'like', "%{$search}%");
                });
            })
            ->when($request->department, function ($query, $department) {
                $query->whereHas('position', function ($query) use ($department) {
                    $query->where('department_id', $department);
                });
            })
            ->when($request->status, function ($query, $status) {
                $query->where('employment_status', $status);
            });

        return Inertia::render('Modules/Employee/Index', [
            'employees' => $query->paginate(10)->withQueryString(),
            'departments' => Department::all(),
            'positions' => Position::with('department')->get(),
            'filters' => $request->only(['search', 'department', 'status'])
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:employees',
            'phone' => 'required|string|max:20',
            'position_id' => 'required|exists:positions,id',
            'employment_status' => 'required|in:full-time,part-time,contract',
            'date_of_birth' => 'required|date',
            'hire_date' => 'required|date',
            'salary' => 'required|numeric|min:0',
            'address' => 'required|string',
            'emergency_contact_name' => 'required|string|max:255',
            'emergency_contact_phone' => 'required|string|max:20',
        ]);

        // Create user account
        $user = User::create([
            'name' => $validated['first_name'] . ' ' . $validated['last_name'],
            'email' => $validated['email'],
            'password' => Hash::make('password'), // Default password
        ]);

        // Generate employee ID
        $employeeCount = Employee::count() + 1;
        $employeeId = 'EMP' . str_pad($employeeCount, 3, '0', STR_PAD_LEFT);

        // Create employee
        $validated['user_id'] = $user->id;
        $validated['employee_id'] = $employeeId;

        Employee::create($validated);

        return redirect()->back()->with('success', 'Employee created successfully.');
    }

    public function show(Employee $employee)
    {
        return Inertia::render('Modules/Employee/Show', [
            'employee' => $employee->load(['position', 'position.department', 'user'])
        ]);
    }

    public function update(Request $request, Employee $employee)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:employees,email,' . $employee->id,
            'phone' => 'required|string|max:20',
            'position_id' => 'required|exists:positions,id',
            'employment_status' => 'required|in:full-time,part-time,contract',
            'date_of_birth' => 'required|date',
            'hire_date' => 'required|date',
            'salary' => 'required|numeric|min:0',
            'address' => 'required|string',
            'emergency_contact_name' => 'required|string|max:255',
            'emergency_contact_phone' => 'required|string|max:20',
        ]);

        $employee->update($validated);

        // Update associated user
        $employee->user->update([
            'name' => $validated['first_name'] . ' ' . $validated['last_name'],
            'email' => $validated['email'],
        ]);

        return redirect()->back()->with('success', 'Employee updated successfully.');
    }

    public function destroy(Employee $employee)
    {
        // Soft delete the employee
        $employee->delete();
        
        return redirect()->back()->with('success', 'Employee deleted successfully.');
    }

    public function create()
    {
        return Inertia::render('Modules/Employee/Create', [
            'departments' => Department::with('positions')->get(),
            'positions' => Position::with('department')->get()
        ]);
    }

    public function edit(Employee $employee)
    {
        return Inertia::render('Modules/Employee/Edit', [
            'employee' => $employee->load(['position', 'position.department', 'user']),
            'departments' => Department::with('positions')->get(),
            'positions' => Position::with('department')->get()
        ]);
    }

    public function updateStatus(Request $request, Employee $employee)
    {
        $validated = $request->validate([
            'employment_status' => 'required|in:full-time,part-time,contract,terminated'
        ]);

        $employee->update($validated);

        return redirect()->back()->with('success', 'Employee status updated successfully.');
    }

    public function resetPassword(Employee $employee)
    {
        $employee->user->update([
            'password' => Hash::make('password')
        ]);

        return redirect()->back()->with('success', 'Employee password has been reset.');
    }
} 