import { useState } from 'react';
import { router } from '@inertiajs/react';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import DeleteConfirmationModal from '@/Components/DeleteConfirmationModal';
import Pagination from '@/Components/Pagination';

export default function EmployeeList({ employees, onEdit, can = {} }) {
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, employee: null });

    const handleDelete = () => {
        router.delete(route('employees.destroy', deleteModal.employee.id), {
            onSuccess: () => setDeleteModal({ isOpen: false, employee: null }),
        });
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Employee
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Department
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Position
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {employees.data.map((employee) => (
                        <tr key={employee.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                        {/* Add employee photo/avatar here */}
                                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                            <span className="text-gray-500 font-medium">
                                                {employee.first_name[0]}{employee.last_name[0]}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            {employee.first_name} {employee.last_name}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {employee.email}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{employee.position.department.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{employee.position.title}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                    ${employee.employment_status === 'full-time' ? 'bg-primary-100 text-primary-800' : 
                                      employee.employment_status === 'part-time' ? 'bg-secondary-100 text-secondary-800' : 
                                      'bg-gray-100 text-gray-800'}`}>
                                    {employee.employment_status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => router.get(route('employees.show', employee.id))}
                                        className="text-primary-600 hover:text-primary-900"
                                        title="View Details"
                                    >
                                        <FaEye className="h-4 w-4" />
                                    </button>

                                    {can.edit_employees && (
                                        <button
                                            onClick={() => onEdit(employee)}
                                            className="text-primary-600 hover:text-primary-900"
                                            title="Edit Employee"
                                        >
                                            <FaEdit className="h-4 w-4" />
                                        </button>
                                    )}

                                    {can.delete_employees && (
                                        <button
                                            onClick={() => setDeleteModal({ isOpen: true, employee })}
                                            className="text-secondary-600 hover:text-secondary-900"
                                            title="Delete Employee"
                                        >
                                            <FaTrash className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="px-6 py-4">
                <Pagination links={employees.links} />
            </div>

            <DeleteConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, employee: null })}
                onConfirm={handleDelete}
                title="Delete Employee"
                message={`Are you sure you want to delete ${deleteModal.employee?.first_name} ${deleteModal.employee?.last_name}? This action cannot be undone.`}
            />
        </div>
    );
} 