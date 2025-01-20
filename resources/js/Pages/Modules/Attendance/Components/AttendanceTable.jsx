import { router } from '@inertiajs/react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import DeleteConfirmationModal from '@/Components/DeleteConfirmationModal';
import { useState } from 'react';

export default function AttendanceTable({ attendance, onEdit }) {
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, record: null });

    const handleDelete = () => {
        router.delete(route('attendance.destroy', deleteModal.record.id), {
            onSuccess: () => setDeleteModal({ isOpen: false, record: null }),
        });
    };

    const getStatusBadgeColor = (status) => {
        const colors = {
            present: 'bg-green-100 text-green-800',
            absent: 'bg-red-100 text-red-800',
            late: 'bg-yellow-100 text-yellow-800',
            'half-day': 'bg-orange-100 text-orange-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
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
                            Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Clock In
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Clock Out
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
                    {attendance.map((record) => (
                        <tr key={record.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="text-sm font-medium text-gray-900">
                                        {record.employee.first_name} {record.employee.last_name}
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                    {new Date(record.date).toLocaleDateString()}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                    {record.clock_in}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                    {record.clock_out}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(record.status)}`}>
                                    {record.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => onEdit(record)}
                                        className="text-indigo-600 hover:text-indigo-900"
                                    >
                                        <FaEdit className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => setDeleteModal({ isOpen: true, record })}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        <FaTrash className="h-4 w-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <DeleteConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, record: null })}
                onConfirm={handleDelete}
                title="Delete Attendance Record"
                message="Are you sure you want to delete this attendance record? This action cannot be undone."
            />
        </div>
    );
} 