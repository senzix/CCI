<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Department;
use App\Models\Position;
use App\Models\Employee;
// Remove or comment out the Role import
// use App\Models\Role;

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
            // Create or update user
            $user = User::firstOrCreate(
                ['email' => $employeeData['user']['email']],
                $employeeData['user']
            );

            // Comment out or remove the role assignment code
            /*
            if (!$user->is_admin) {
                $staffRole = Role::where('name', 'Staff')->first();
                if ($staffRole) {
                    $user->roles()->syncWithoutDetaching([$staffRole->id]);
                }
            }
            */

            // Create or update employee
            $employeeData['employee']['user_id'] = $user->id;
            Employee::firstOrCreate(
                ['email' => $employeeData['employee']['email']],
                $employeeData['employee']
            );
        }
    }
} 