<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
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