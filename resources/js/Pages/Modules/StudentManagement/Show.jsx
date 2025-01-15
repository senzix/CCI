import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { format, parseISO } from 'date-fns';
import { FaArrowLeft, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { router } from '@inertiajs/react';
import StudentForm from '@/Components/Students/StudentForm';
import { useState } from 'react';
import DeleteConfirmationModal from '@/Components/DeleteConfirmationModal';

export default function Show({ student, classes }) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    const handleDelete = () => {
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        router.delete(route('students.destroy', student.id));
        setIsDeleteModalOpen(false);
    };

    const handleEdit = () => {
        setEditingStudent(student);
        setIsFormOpen(true);
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Student - ${student.name}`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center">
                            <button
                                onClick={() => router.get(route('students.index'))}
                                className="mr-4 text-gray-600 hover:text-gray-900"
                            >
                                <FaArrowLeft className="h-5 w-5" />
                            </button>
                            <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                                Student Details
                            </h2>
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={handleEdit}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                                <FaEdit className="h-4 w-4 mr-2" />
                                Edit
                            </button>
                            <button
                                onClick={handleDelete}
                                className="inline-flex items-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50"
                            >
                                <FaTrash className="h-4 w-4 mr-2" />
                                Delete
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        Personal Information
                                    </h3>
                                    <div className="flex items-center mb-6">
                                        {student.photo_path ? (
                                            <img 
                                                className="h-24 w-24 rounded-full object-cover" 
                                                src={`/storage/${student.photo_path}`} 
                                                alt={student.name} 
                                            />
                                        ) : (
                                            <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                                                <span className="text-2xl text-gray-500">
                                                    {student.name.charAt(0)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <dl className="grid grid-cols-1 gap-4">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Name</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{student.name}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Registration Number</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{student.registration_number}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {formatDate(student.date_of_birth)}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Class Group</dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {classes.find(c => c.id === student.student_class_id)?.name || 'Not Assigned'}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Status</dt>
                                            <dd className="mt-1">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                    ${student.status === 'active' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-yellow-100 text-yellow-800'}`}
                                                >
                                                    {student.status}
                                                </span>
                                            </dd>
                                        </div>
                                    </dl>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        Guardian Information
                                    </h3>
                                    <dl className="grid grid-cols-1 gap-4">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Guardian Name</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{student.guardian_name}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Contact Number</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{student.guardian_contact}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Email</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{student.guardian_email || '-'}</dd>
                                        </div>
                                    </dl>
                                </div>

                                {student.special_needs_category && (
                                    <div className="sm:col-span-2">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                                            Special Education Details
                                        </h3>
                                        <dl className="grid grid-cols-1 gap-4">
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Category</dt>
                                                <dd className="mt-1 text-sm text-gray-900">{student.special_needs_category}</dd>
                                            </div>
                                            {student.special_requirements && (
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">Requirements</dt>
                                                    <dd className="mt-1 text-sm text-gray-900">{student.special_requirements}</dd>
                                                </div>
                                            )}
                                        </dl>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 bg-white shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium text-gray-900">Class History</h3>
                                <span className="text-sm text-gray-500">
                                    {student.class_assignments?.length || 0} classes
                                </span>
                            </div>

                            <div className="relative">
                                {/* Timeline line */}
                                <div className="absolute left-2.5 top-0 h-full w-0.5 bg-gray-200"></div>

                                <div className="space-y-6">
                                    {student.class_assignments?.map((assignment) => (
                                        <div key={assignment.id} className="relative flex items-start group">
                                            {/* Timeline dot */}
                                            <div className={`absolute left-0 mt-1.5 w-5 h-5 rounded-full border-2 bg-white
                                                ${!assignment.end_date 
                                                    ? 'border-green-500 group-hover:border-green-600' 
                                                    : 'border-gray-300 group-hover:border-gray-400'}`}
                                            >
                                            </div>

                                            {/* Content */}
                                            <div className="ml-10 flex-grow">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <span className="text-sm font-medium text-gray-900">
                                                            {assignment.class.name}
                                                        </span>
                                                        {!assignment.end_date && (
                                                            <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                                                Current
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="text-xs text-gray-500">
                                                        {assignment.end_date 
                                                            ? `${formatDate(assignment.start_date)} - ${formatDate(assignment.end_date)}`
                                                            : `Since ${formatDate(assignment.start_date)}`
                                                        }
                                                    </span>
                                                </div>
                                                {assignment.class.type && (
                                                    <p className="mt-1 text-sm text-gray-500">
                                                        {assignment.class.type === 'special_ed' ? 'Special Education' : 'Regular Class'}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {!student.class_assignments?.length && (
                                <div className="text-center py-6 text-sm text-gray-500">
                                    No class history available
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <StudentForm 
                isOpen={isFormOpen}
                onClose={() => {
                    setIsFormOpen(false);
                    setEditingStudent(null);
                }}
                student={editingStudent}
                classes={classes}
            />

            <DeleteConfirmationModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Student"
                message="Are you sure you want to delete this student? This action cannot be undone."
            />
        </AuthenticatedLayout>
    );
} 