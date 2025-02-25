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
use App\Models\Role;

class EmployeeManagementSeeder extends Seeder
{
    public function run(): void
    {
        // Create Departments
        $departments = [
            ['name' => 'Administration', 'code' => 'ADMIN'],
            ['name' => 'Teaching Staff', 'code' => 'TEACH'],
            ['name' => 'Special Education', 'code' => 'SPED'],
            ['name' => 'Support Staff', 'code' => 'SUPP']
        ];

        foreach ($departments as $dept) {
            Department::firstOrCreate(
                ['code' => $dept['code']],
                $dept
            );
        }

        // Create Positions
        $positions = [
            [
                'title' => 'Principal',
                'code' => 'PRIN',
                'department_id' => Department::where('code', 'ADMIN')->first()->id,
                'base_salary' => 75000
            ],
            [
                'title' => 'Teacher',
                'code' => 'TCHR',
                'department_id' => Department::where('code', 'TEACH')->first()->id,
                'base_salary' => 50000
            ],
            [
                'title' => 'Special Ed Teacher',
                'code' => 'SPED',
                'department_id' => Department::where('code', 'SPED')->first()->id,
                'base_salary' => 55000
            ],
            [
                'title' => 'Administrative Assistant',
                'code' => 'ADMA',
                'department_id' => Department::where('code', 'ADMIN')->first()->id,
                'base_salary' => 35000
            ]
        ];

        foreach ($positions as $pos) {
            Position::firstOrCreate(
                ['code' => $pos['code']],
                $pos
            );
        }

        // Create Sample Users and Employees
        $employees = [
            [
                'user' => [
                    'name' => 'John Doe',
                    'email' => 'john.doe@school.com',
                    'password' => Hash::make('password'),
                    'is_admin' => false,
                    'status' => 'active'
                ],
                'employee' => [
                    'employee_id' => 'EMP001',
                    'position_id' => Position::where('code', 'PRIN')->first()->id,
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
                ]
            ],
            [
                'user' => [
                    'name' => 'Sarah Smith',
                    'email' => 'sarah.smith@school.com',
                    'password' => Hash::make('password'),
                    'is_admin' => false,
                    'status' => 'active'
                ],
                'employee' => [
                    'employee_id' => 'EMP002',
                    'position_id' => Position::where('code', 'TCHR')->first()->id,
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
                ]
            ]
        ];

        foreach ($employees as $employeeData) {
            // Create user first
            $user = User::firstOrCreate(
                ['email' => $employeeData['user']['email']],
                $employeeData['user']
            );

            // Then create employee with user_id
            $employeeData['employee']['user_id'] = $user->id;
            Employee::firstOrCreate(
                ['email' => $employeeData['employee']['email']],
                $employeeData['employee']
            );
        }

        // Create Leave Types
        $leaveTypes = [
            ['name' => 'Annual Leave', 'annual_allowance' => 14, 'paid' => true],
            ['name' => 'Sick Leave', 'annual_allowance' => 10, 'paid' => true],
            ['name' => 'Maternity Leave', 'annual_allowance' => 90, 'paid' => true],
            ['name' => 'Unpaid Leave', 'annual_allowance' => 30, 'paid' => false]
        ];

        foreach ($leaveTypes as $type) {
            LeaveType::firstOrCreate(
                ['name' => $type['name']],
                $type
            );
        }

        // Create Sample Attendance Records only for created employees
        $createdEmployees = Employee::all();
        foreach ($createdEmployees as $index => $employee) {
            AttendanceRecord::create([
                'employee_id' => $employee->id,
                'date' => '2024-03-20',
                'clock_in' => $index === 0 ? '08:00:00' : '08:15:00',
                'clock_out' => '17:00:00',
                'status' => $index === 0 ? 'present' : 'late',
                'notes' => $index === 0 ? null : 'Traffic delay'
            ]);
        }

        // Create Sample Leave Requests only for created employees
        if (count($createdEmployees) > 0) {
            LeaveRequest::create([
                'employee_id' => $createdEmployees[0]->id,
                'leave_type_id' => LeaveType::where('name', 'Annual Leave')->first()->id,
                'start_date' => '2024-04-01',
                'end_date' => '2024-04-05',
                'status' => 'approved',
                'reason' => 'Annual vacation'
            ]);

            if (count($createdEmployees) > 1) {
                LeaveRequest::create([
                    'employee_id' => $createdEmployees[1]->id,
                    'leave_type_id' => LeaveType::where('name', 'Sick Leave')->first()->id,
                    'start_date' => '2024-03-25',
                    'end_date' => '2024-03-26',
                    'status' => 'pending',
                    'reason' => 'Medical appointment'
                ]);
            }
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
            SalaryComponent::firstOrCreate(
                ['name' => $component['name']],
                $component
            );
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
            PayrollPeriod::firstOrCreate(
                ['name' => $period['name']],
                $period
            );
        }

        // Create Sample Payroll Records only for created employees
        if (count($createdEmployees) > 0) {
            foreach ($createdEmployees as $employee) {
                PayrollRecord::create([
                    'employee_id' => $employee->id,
                    'payroll_period_id' => PayrollPeriod::where('name', 'March 2024')->first()->id,
                    'basic_salary' => $employee->salary / 12,
                    'gross_salary' => ($employee->salary / 12) + 800,
                    'total_deductions' => ($employee->salary / 12) * 0.1,
                    'net_salary' => ($employee->salary / 12) + 800 - (($employee->salary / 12) * 0.1),
                    'allowances' => json_encode([
                        ['name' => 'Housing Allowance', 'amount' => 500.00],
                        ['name' => 'Transportation Allowance', 'amount' => 300.00]
                    ]),
                    'deductions' => json_encode([
                        ['name' => 'Income Tax', 'amount' => ($employee->salary / 12) * 0.1]
                    ]),
                    'payment_status' => 'pending'
                ]);
            }
        }
    }
} 