<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            // Beneficiary Management
            ['name' => 'View Students', 'code' => 'students.view', 'group' => 'Beneficiary Management'],
            ['name' => 'Create Students', 'code' => 'students.create', 'group' => 'Beneficiary Management'],
            ['name' => 'Edit Students', 'code' => 'students.edit', 'group' => 'Beneficiary Management'],
            ['name' => 'Delete Students', 'code' => 'students.delete', 'group' => 'Beneficiary Management'],
            ['name' => 'Manage Classes', 'code' => 'classes.manage', 'group' => 'Beneficiary Management'],

            // Attendance Management
            ['name' => 'View Attendance', 'code' => 'attendance.view', 'group' => 'Attendance'],
            ['name' => 'Record Attendance', 'code' => 'attendance.record', 'group' => 'Attendance'],
            ['name' => 'Manage Leave Requests', 'code' => 'leave.manage', 'group' => 'Attendance'],

            // Project Management
            ['name' => 'View Projects', 'code' => 'projects.view', 'group' => 'Project Management'],
            ['name' => 'Create Projects', 'code' => 'projects.create', 'group' => 'Project Management'],
            ['name' => 'Edit Projects', 'code' => 'projects.edit', 'group' => 'Project Management'],
            ['name' => 'Delete Projects', 'code' => 'projects.delete', 'group' => 'Project Management'],

            // Grants Management
            ['name' => 'View Grants', 'code' => 'grants.view', 'group' => 'Grants Management'],
            ['name' => 'Create Grants', 'code' => 'grants.create', 'group' => 'Grants Management'],
            ['name' => 'Edit Grants', 'code' => 'grants.edit', 'group' => 'Grants Management'],
            ['name' => 'Delete Grants', 'code' => 'grants.delete', 'group' => 'Grants Management'],
            ['name' => 'Manage Grant Categories', 'code' => 'grants.categories', 'group' => 'Grants Management'],

            // Documents Management
            ['name' => 'View Documents', 'code' => 'documents.view', 'group' => 'Documents'],
            ['name' => 'Upload Documents', 'code' => 'documents.upload', 'group' => 'Documents'],
            ['name' => 'Download Documents', 'code' => 'documents.download', 'group' => 'Documents'],
            ['name' => 'Edit Documents', 'code' => 'documents.edit', 'group' => 'Documents'],
            ['name' => 'Delete Documents', 'code' => 'documents.delete', 'group' => 'Documents'],
            ['name' => 'Share Documents', 'code' => 'documents.share', 'group' => 'Documents'],
            ['name' => 'Manage Categories', 'code' => 'documents.categories', 'group' => 'Documents'],
            ['name' => 'Move Documents', 'code' => 'documents.move', 'group' => 'Documents'],

            // Accounts Management
            ['name' => 'View Accounts', 'code' => 'accounts.view', 'group' => 'Accounts'],
            ['name' => 'Create Transactions', 'code' => 'accounts.create', 'group' => 'Accounts'],
            ['name' => 'Edit Transactions', 'code' => 'accounts.edit', 'group' => 'Accounts'],
            ['name' => 'Delete Transactions', 'code' => 'accounts.delete', 'group' => 'Accounts'],

            // Payroll Management
            ['name' => 'View Payroll', 'code' => 'payroll.view', 'group' => 'Payroll'],
            ['name' => 'Generate Payroll', 'code' => 'payroll.generate', 'group' => 'Payroll'],
            ['name' => 'Edit Payroll', 'code' => 'payroll.edit', 'group' => 'Payroll'],
            ['name' => 'Manage Payroll Periods', 'code' => 'payroll.periods', 'group' => 'Payroll'],

            // Employee Management
            ['name' => 'View Employees', 'code' => 'employees.view', 'group' => 'Employee Management'],
            ['name' => 'Create Employees', 'code' => 'employees.create', 'group' => 'Employee Management'],
            ['name' => 'Edit Employees', 'code' => 'employees.edit', 'group' => 'Employee Management'],
            ['name' => 'Delete Employees', 'code' => 'employees.delete', 'group' => 'Employee Management'],
            ['name' => 'Manage Departments', 'code' => 'departments.manage', 'group' => 'Employee Management'],
            ['name' => 'Manage Positions', 'code' => 'positions.manage', 'group' => 'Employee Management'],
            
            // Department Management
            ['name' => 'View Departments', 'code' => 'departments.view', 'group' => 'Department Management'],
            ['name' => 'Create Departments', 'code' => 'departments.create', 'group' => 'Department Management'],
            ['name' => 'Edit Departments', 'code' => 'departments.edit', 'group' => 'Department Management'],
            ['name' => 'Delete Departments', 'code' => 'departments.delete', 'group' => 'Department Management'],
            
            // Position Management
            ['name' => 'View Positions', 'code' => 'positions.view', 'group' => 'Position Management'],
            ['name' => 'Create Positions', 'code' => 'positions.create', 'group' => 'Position Management'],
            ['name' => 'Edit Positions', 'code' => 'positions.edit', 'group' => 'Position Management'],
            ['name' => 'Delete Positions', 'code' => 'positions.delete', 'group' => 'Position Management'],
            
            // Class Management
            ['name' => 'View Classes', 'code' => 'classes.view', 'group' => 'Class Management'],
            ['name' => 'Create Classes', 'code' => 'classes.create', 'group' => 'Class Management'],
            ['name' => 'Edit Classes', 'code' => 'classes.edit', 'group' => 'Class Management'],
            ['name' => 'Delete Classes', 'code' => 'classes.delete', 'group' => 'Class Management'],
            
            // System Settings
            ['name' => 'Manage System Settings', 'code' => 'settings.manage', 'group' => 'System Settings'],
            ['name' => 'View Reports', 'code' => 'reports.view', 'group' => 'Reports'],
            ['name' => 'Export Data', 'code' => 'data.export', 'group' => 'Data Management'],
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(
                ['code' => $permission['code']],
                $permission
            );
        }
    }
} 