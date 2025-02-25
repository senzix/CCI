import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { FaArrowLeft } from 'react-icons/fa';

export default function Show({ employee }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Employee Details
                    </h2>
                    <Link
                        href={route('employees.index')}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-primary-700 bg-white hover:bg-primary-50"
                    >
                        <FaArrowLeft className="mr-2 h-4 w-4 text-primary-500" />
                        Back to List
                    </Link>
                </div>
            }
        >
            <Head title="Employee Details" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                                <dl className="grid grid-cols-1 gap-4">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Employee ID</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{employee.employee_id}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{`${employee.first_name} ${employee.last_name}`}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Email</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{employee.email}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Phone</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{employee.phone}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{employee.date_of_birth}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Address</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{employee.address}</dd>
                                    </div>
                                </dl>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Employment Information</h3>
                                <dl className="grid grid-cols-1 gap-4">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Department</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{employee.position.department.name}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Position</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{employee.position.title}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Employment Status</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{employee.employment_status}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Hire Date</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{employee.hire_date}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Salary</dt>
                                        <dd className="mt-1 text-sm text-gray-900">${employee.salary}</dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 