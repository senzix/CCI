<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Department;
use App\Models\Position;
use App\Models\Employee;
use App\Models\LeaveType;
use App\Models\SalaryComponent;
use App\Models\PayrollPeriod;
use App\Models\AttendanceRecord;
use App\Models\LeaveRequest;
use App\Models\PayrollRecord;

class EmployeeManagementSeeder extends Seeder
{
    public function run(): void
    {
        // Create Users first
        $users = [
            [
                'name' => 'John Doe',
                'email' => 'john.doe@school.com',
                'password' => Hash::make('password'),
            ],
            [
                'name' => 'Sarah Smith',
                'email' => 'sarah.smith@school.com',
                'password' => Hash::make('password'),
            ],
            [
                'name' => 'Michael Johnson',
                'email' => 'michael.johnson@school.com',
                'password' => Hash::make('password'),
            ],
        ];

        foreach ($users as $userData) {
            User::create($userData);
        }

        // Create Departments
        $departments = [
            ['name' => 'Administration', 'code' => 'ADMIN'],
            ['name' => 'Teaching Staff', 'code' => 'TEACH'],
            ['name' => 'Special Education', 'code' => 'SPED'],
            ['name' => 'Support Staff', 'code' => 'SUPP']
        ];

        foreach ($departments as $dept) {
            Department::create($dept);
        }

        // Create Positions
        $positions = [
            ['title' => 'Principal', 'code' => 'PRIN', 'department_id' => 1, 'base_salary' => 80000],
            ['title' => 'Teacher', 'code' => 'TCHR', 'department_id' => 2, 'base_salary' => 50000],
            ['title' => 'Special Ed Teacher', 'code' => 'SPED', 'department_id' => 3, 'base_salary' => 55000],
            ['title' => 'Administrative Assistant', 'code' => 'ADMA', 'department_id' => 1, 'base_salary' => 35000]
        ];

        foreach ($positions as $pos) {
            Position::create($pos);
        }

        // Create Leave Types
        $leaveTypes = [
            ['name' => 'Annual Leave', 'annual_allowance' => 14, 'paid' => true],
            ['name' => 'Sick Leave', 'annual_allowance' => 10, 'paid' => true],
            ['name' => 'Maternity Leave', 'annual_allowance' => 90, 'paid' => true],
            ['name' => 'Unpaid Leave', 'annual_allowance' => 30, 'paid' => false]
        ];

        foreach ($leaveTypes as $type) {
            LeaveType::create($type);
        }

        // Create Salary Components
        $salaryComponents = [
            [
                'name' => 'Housing Allowance',
                'type' => 'allowance',
                'is_taxable' => false,
                'is_fixed' => true,
                'amount' => 500.00
            ],
            [
                'name' => 'Transportation Allowance',
                'type' => 'allowance',
                'is_taxable' => false,
                'is_fixed' => true,
                'amount' => 300.00
            ],
            [
                'name' => 'Income Tax',
                'type' => 'deduction',
                'is_taxable' => false,
                'is_fixed' => false,
                'percentage' => 10.00
            ]
        ];

        foreach ($salaryComponents as $component) {
            SalaryComponent::create($component);
        }

        // Create Sample Employees
        $employees = [
            [
                'employee_id' => 'EMP001',
                'user_id' => 1, // Make sure this user exists
                'position_id' => 1, // Principal
                'first_name' => 'John',
                'last_name' => 'Doe',
                'email' => 'john.doe@school.com',
                'phone' => '555-0100',
                'date_of_birth' => '1980-01-15',
                'hire_date' => '2020-01-01',
                'employment_status' => 'full-time',
                'salary' => 80000,
                'address' => '123 Main St, City',
                'emergency_contact_name' => 'Jane Doe',
                'emergency_contact_phone' => '555-0101'
            ],
            [
                'employee_id' => 'EMP002',
                'user_id' => 2, // Make sure this user exists
                'position_id' => 2, // Teacher
                'first_name' => 'Sarah',
                'last_name' => 'Smith',
                'email' => 'sarah.smith@school.com',
                'phone' => '555-0102',
                'date_of_birth' => '1985-03-20',
                'hire_date' => '2021-08-15',
                'employment_status' => 'full-time',
                'salary' => 50000,
                'address' => '456 Oak Ave, City',
                'emergency_contact_name' => 'Mike Smith',
                'emergency_contact_phone' => '555-0103'
            ],
            [
                'employee_id' => 'EMP003',
                'user_id' => 3, // Make sure this user exists
                'position_id' => 3, // Special Ed Teacher
                'first_name' => 'Michael',
                'last_name' => 'Johnson',
                'email' => 'michael.johnson@school.com',
                'phone' => '555-0104',
                'date_of_birth' => '1982-07-10',
                'hire_date' => '2020-08-15',
                'employment_status' => 'full-time',
                'salary' => 55000,
                'address' => '789 Pine St, City',
                'emergency_contact_name' => 'Lisa Johnson',
                'emergency_contact_phone' => '555-0105'
            ]
        ];

        foreach ($employees as $employee) {
            Employee::create($employee);
        }

        // Create Payroll Periods
        $payrollPeriods = [
            [
                'name' => 'March 2024',
                'start_date' => '2024-03-01',
                'end_date' => '2024-03-31',
                'payment_date' => '2024-04-05',
                'status' => 'active'
            ],
            [
                'name' => 'April 2024',
                'start_date' => '2024-04-01',
                'end_date' => '2024-04-30',
                'payment_date' => '2024-05-05',
                'status' => 'pending'
            ]
        ];

        foreach ($payrollPeriods as $period) {
            PayrollPeriod::create($period);
        }

        // Create Sample Attendance Records
        $attendanceRecords = [
            [
                'employee_id' => 1,
                'date' => '2024-03-20',
                'clock_in' => '08:00:00',
                'clock_out' => '17:00:00',
                'status' => 'present',
                'notes' => null
            ],
            [
                'employee_id' => 2,
                'date' => '2024-03-20',
                'clock_in' => '08:15:00',
                'clock_out' => '17:00:00',
                'status' => 'late',
                'notes' => 'Traffic delay'
            ],
            [
                'employee_id' => 3,
                'date' => '2024-03-20',
                'clock_in' => null,
                'clock_out' => null,
                'status' => 'absent',
                'notes' => 'Sick leave'
            ]
        ];

        foreach ($attendanceRecords as $record) {
            AttendanceRecord::create($record);
        }

        // Create Sample Leave Requests
        $leaveRequests = [
            [
                'employee_id' => 1,
                'leave_type_id' => 1,
                'start_date' => '2024-04-01',
                'end_date' => '2024-04-05',
                'status' => 'approved',
                'reason' => 'Annual vacation'
            ],
            [
                'employee_id' => 2,
                'leave_type_id' => 2,
                'start_date' => '2024-03-25',
                'end_date' => '2024-03-26',
                'status' => 'pending',
                'reason' => 'Medical appointment'
            ]
        ];

        foreach ($leaveRequests as $request) {
            LeaveRequest::create($request);
        }

        // Create Sample Payroll Records
        $payrollRecords = [
            [
                'employee_id' => 1,
                'payroll_period_id' => 1,
                'basic_salary' => 5000.00,
                'gross_salary' => 5800.00,
                'total_deductions' => 500.00,
                'net_salary' => 5300.00,
                'allowances' => json_encode([
                    ['name' => 'Housing Allowance', 'amount' => 500.00],
                    ['name' => 'Transportation Allowance', 'amount' => 300.00]
                ]),
                'deductions' => json_encode([
                    ['name' => 'Income Tax', 'amount' => 500.00]
                ]),
                'payment_status' => 'pending'
            ],
            [
                'employee_id' => 2,
                'payroll_period_id' => 1,
                'basic_salary' => 4000.00,
                'gross_salary' => 4800.00,
                'total_deductions' => 400.00,
                'net_salary' => 4400.00,
                'allowances' => json_encode([
                    ['name' => 'Housing Allowance', 'amount' => 500.00],
                    ['name' => 'Transportation Allowance', 'amount' => 300.00]
                ]),
                'deductions' => json_encode([
                    ['name' => 'Income Tax', 'amount' => 400.00]
                ]),
                'payment_status' => 'pending'
            ]
        ];

        foreach ($payrollRecords as $record) {
            PayrollRecord::create($record);
        }
    }
} 