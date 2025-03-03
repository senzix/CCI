import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import EmployeeList from './Components/EmployeeList';
import EmployeeForm from './Components/EmployeeForm';
import DepartmentManager from './Components/DepartmentManager';
import SearchFilters from './Components/SearchFilters';
import { FaPlus, FaSitemap } from 'react-icons/fa';

export default function Index({ employees, departments, positions, filters, permissions, can }) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [isDepartmentManagerOpen, setIsDepartmentManagerOpen] = useState(false);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">
                            Employee Management
                        </h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Manage employee information and departments
                        </p>
                    </div>
                    <div className="flex space-x-2">
                        {can.manage_departments && (
                            <button
                                onClick={() => setIsDepartmentManagerOpen(true)}
                                className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                <FaSitemap className="mr-1.5 h-4 w-4 text-primary-500" />
                                Manage Departments
                            </button>
                        )}
                        {can.create_employees && (
                            <button
                                onClick={() => {
                                    setIsFormOpen(true);
                                }}
                                className="inline-flex items-center px-2.5 py-1.5 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-md text-sm"
                            >
                                <FaPlus className="mr-1.5 h-4 w-4" />
                                Add Employee
                            </button>
                        )}
                    </div>
                </div>
            }
        >
            <Head title="Employee Management" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-4 lg:px-6">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <SearchFilters 
                            filters={filters}
                            departments={departments}
                        />
                        
                        <EmployeeList
                            employees={employees}
                            onEdit={(employee) => {
                                setEditingEmployee(employee);
                                setIsFormOpen(true);
                            }}
                            can={can}
                        />
                    </div>
                </div>
            </div>

            <EmployeeForm
                show={isFormOpen}
                onClose={() => {
                    setIsFormOpen(false);
                    setEditingEmployee(null);
                }}
                employee={editingEmployee}
                departments={departments}
                positions={positions}
                permissions={permissions}
            />

            <DepartmentManager
                show={isDepartmentManagerOpen}
                onClose={() => setIsDepartmentManagerOpen(false)}
                departments={departments}
                positions={positions}
                can={can}
            />
        </AuthenticatedLayout>
    );
} 