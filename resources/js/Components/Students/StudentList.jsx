import { 
    FaEdit, 
    FaTrash, 
    FaEye
} from 'react-icons/fa';
import { router } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';
import { Link } from '@inertiajs/react';
import { useState } from 'react';
import DeleteConfirmationModal from '@/Components/DeleteConfirmationModal';

export default function StudentList({ students, viewMode = 'table', onEdit }) {
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        studentId: null,
        studentName: ''
    });

    const handleDelete = (student) => {
        setDeleteModal({
            isOpen: true,
            studentId: student.id,
            studentName: student.name
        });
    };

    const confirmDelete = () => {
        router.delete(route('students.destroy', deleteModal.studentId), {
            onSuccess: () => {
                setDeleteModal({ isOpen: false, studentId: null, studentName: '' });
            },
        });
    };

    return (
        <>
            {viewMode === 'table' ? (
                <div>
                    <div className="overflow-x-auto bg-white rounded-lg shadow">
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 tracking-wider">
                                        Student
                                    </th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 tracking-wider">
                                        Registration No.
                                    </th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 tracking-wider">
                                        Class
                                    </th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 tracking-wider">
                                        Status
                                    </th>
                                    <th className="relative px-3 py-2">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {students.data.map((student) => (
                                    <tr key={student.id} className="hover:bg-gray-50">
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {student.photo_path ? (
                                                    <img className="h-6 w-6 rounded-full" src={`/storage/${student.photo_path}`} alt="" />
                                                ) : (
                                                    <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center">
                                                        <span className="text-xs text-gray-500">{student.name.charAt(0)}</span>
                                                    </div>
                                                )}
                                                <div className="ml-2">
                                                    <div className="text-xs font-medium text-gray-900">{student.name}</div>
                                                    <div className="text-xs text-gray-500">{student.guardian_name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                            {student.registration_number}
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                            {student.class?.name || 'Not Assigned'}
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${student.status === 'active' ? 'bg-green-100 text-green-800' : 
                                                  student.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                                  'bg-gray-100 text-gray-800'}`}>
                                                {student.status}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            <Link 
                                                href={route('students.show', student.id)} 
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                <FaEye className="inline w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => onEdit(student)}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                <FaEdit className="inline w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(student)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <FaTrash className="inline w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4">
                        <Pagination links={students.links} />
                    </div>
                </div>
            ) : (
                <div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {students.data.map((student) => (
                            <div key={student.id} className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        {student.photo_path ? (
                                            <img className="h-12 w-12 rounded-full" src={`/storage/${student.photo_path}`} alt="" />
                                        ) : (
                                            <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                                                <span className="text-gray-500 text-sm">{student.name.charAt(0)}</span>
                                            </div>
                                        )}
                                        <div className="ml-4">
                                            <h3 className="text-lg font-medium text-gray-900">{student.name}</h3>
                                            <p className="text-sm text-gray-500">{student.registration_number}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <div className="text-sm text-gray-500">
                                            Class: {student.class?.name || 'Not Assigned'}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Guardian: {student.guardian_name}
                                        </div>
                                    </div>
                                    <div className="mt-4 flex justify-between items-center">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full
                                            ${student.status === 'active' ? 'bg-green-100 text-green-800' : 
                                              student.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                              'bg-gray-100 text-gray-800'}`}
                                        >
                                            {student.status}
                                        </span>
                                        <div className="space-x-2">
                                            <Link 
                                                href={route('students.show', student.id)} 
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                <FaEye className="inline w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => onEdit(student)}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                <FaEdit className="inline w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(student)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <FaTrash className="inline w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mt-4 border-t pt-4">
                                        <div className="text-sm font-medium text-gray-900 mb-2">Class History</div>
                                        {student.class_assignments?.map((assignment) => (
                                            <div key={assignment.id} className="text-sm text-gray-500 mb-1">
                                                <span className="font-medium">{assignment.class.name}</span>
                                                <span className="mx-1">•</span>
                                                <span>{new Date(assignment.start_date).toLocaleDateString()}</span>
                                                {assignment.end_date && (
                                                    <>
                                                        <span className="mx-1">to</span>
                                                        <span>{new Date(assignment.end_date).toLocaleDateString()}</span>
                                                    </>
                                                )}
                                                {!assignment.end_date && (
                                                    <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">
                                                        Current
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4">
                        <Pagination links={students.links} />
                    </div>
                </div>
            )}

            <DeleteConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, studentId: null, studentName: '' })}
                onConfirm={confirmDelete}
                title="Delete Student"
                message={`Are you sure you want to delete ${deleteModal.studentName}? This action cannot be undone.`}
            />
        </>
    );
} 