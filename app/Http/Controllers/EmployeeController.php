<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Department;
use App\Models\Position;
use App\Models\User;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        $query = Employee::with(['position', 'position.department', 'user', 'user.permissions'])
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
            'departments' => Department::with('positions')->get(),
            'positions' => Position::with('department')->get(),
            'filters' => $request->only(['search', 'department', 'status']),
            'permissions' => Permission::all(),
            'can' => [
                'view_employees' => $request->user()->hasPermission('employees.view'),
                'create_employees' => $request->user()->hasPermission('employees.create'),
                'edit_employees' => $request->user()->hasPermission('employees.edit'),
                'delete_employees' => $request->user()->hasPermission('employees.delete'),
                'manage_departments' => $request->user()->hasPermission('departments.manage'),
                'view_departments' => $request->user()->hasPermission('departments.view'),
                'create_departments' => $request->user()->hasPermission('departments.create'),
                'edit_departments' => $request->user()->hasPermission('departments.edit'),
                'delete_departments' => $request->user()->hasPermission('departments.delete'),
                'view_positions' => $request->user()->hasPermission('positions.view'),
                'create_positions' => $request->user()->hasPermission('positions.create'),
                'edit_positions' => $request->user()->hasPermission('positions.edit'),
                'delete_positions' => $request->user()->hasPermission('positions.delete'),
            ]
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
            'password' => 'nullable|min:6',
        ]);

        // Create user account
        $user = User::create([
            'name' => $validated['first_name'] . ' ' . $validated['last_name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password'] ?? 'password123'),
            'position_id' => $validated['position_id'],
            'status' => 'active'
        ]);

        // Sync permissions
        if ($request->has('permissions')) {
            $user->permissions()->sync($request->permissions);
        }

        // Generate employee ID
        $employeeCount = Employee::count() + 1;
        $employeeId = 'EMP' . str_pad($employeeCount, 3, '0', STR_PAD_LEFT);

        // Create employee
        $validated['user_id'] = $user->id;
        $validated['employee_id'] = $employeeId;

        Employee::create($validated);

        return redirect()->back()->with('success', 'Employee created successfully.');
    }

    public function show(Request $request, Employee $employee)
    {
        $employee->load(['position', 'position.department', 'user', 'user.permissions']);
        
        return Inertia::render('Modules/Employee/Show', [
            'employee' => $employee,
            'can' => [
                'edit_employees' => $request->user()->hasPermission('employees.edit'),
                'delete_employees' => $request->user()->hasPermission('employees.delete'),
            ]
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
            'password' => 'nullable|min:6',
            'permissions' => 'array'
        ]);

        $employee->update($validated);

        // Update associated user
        $updateData = [
            'name' => $validated['first_name'] . ' ' . $validated['last_name'],
            'email' => $validated['email'],
            'position_id' => $validated['position_id'],
        ];

        if (!empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        $employee->user->update($updateData);

        // Sync permissions
        if ($request->has('permissions')) {
            $employee->user->permissions()->sync($request->permissions);
        }

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
            'positions' => Position::with('department')->get(),
            'permissions' => Permission::all()
        ]);
    }

    public function edit(Employee $employee)
    {
        $employee->load(['position.department', 'user.permissions']);
        
        return response()->json([
            'employee' => array_merge($employee->toArray(), [
                'permissions' => $employee->user->permissions->pluck('id')->toArray()
            ]),
            'departments' => Department::all(),
            'positions' => Position::all(),
            'permissions' => Permission::all()
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