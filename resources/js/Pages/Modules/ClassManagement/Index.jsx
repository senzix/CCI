import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useCallback, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFilter } from 'react-icons/fa';
import Modal from '@/Components/Modal';
import { useForm, router } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import debounce from 'lodash/debounce';
import Pagination from '@/Components/Pagination';
import DeleteConfirmationModal from '@/Components/DeleteConfirmationModal';

export default function ClassManagement({ classes }) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingClass, setEditingClass] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState('all');
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        classId: null,
        className: ''
    });

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        type: 'regular',
        capacity: '',
        description: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingClass) {
            put(route('classes.update', editingClass.id), {
                onSuccess: () => {
                    setIsFormOpen(false);
                    setEditingClass(null);
                    reset();
                }
            });
        } else {
            post(route('classes.store'), {
                onSuccess: () => {
                    setIsFormOpen(false);
                    reset();
                }
            });
        }
    };

    const handleSearch = useCallback(
        debounce((query) => {
            router.get(route('classes.index'), { 
                search: query, 
                type: selectedType 
            }, {
                preserveState: true,
                preserveScroll: true,
                replace: true
            });
        }, 300),
        [selectedType]
    );

    useEffect(() => {
        handleSearch(searchQuery);
    }, [searchQuery]);

    useEffect(() => {
        router.get(route('classes.index'), { 
            search: searchQuery, 
            type: selectedType 
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true
        });
    }, [selectedType]);

    const handleDelete = (classItem) => {
        setDeleteModal({
            isOpen: true,
            classId: classItem.id,
            className: classItem.name
        });
    };

    const confirmDelete = () => {
        router.delete(route('classes.destroy', deleteModal.classId), {
            onSuccess: () => {
                setDeleteModal({ isOpen: false, classId: null, className: '' });
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-base font-semibold text-gray-900">
                        Class Management
                        <span className="ml-2 text-sm font-normal text-gray-500">
                            ({classes.data.length} classes)
                        </span>
                    </h2>
                    <div className="flex items-center space-x-1">
                        <button
                            onClick={() => setIsFormOpen(true)}
                            className="inline-flex items-center px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
                        >
                            <FaPlus className="w-3 h-3 mr-1" />
                            Add Class
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Class Management" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-3 flex items-center justify-between">
                        <div className="flex-1 max-w-2xl flex items-center space-x-2">
                            <div className="relative flex-1 max-w-xs">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full h-8 pl-8 pr-3 text-xs border-gray-300 rounded-md"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <FaSearch className="absolute left-2.5 top-2.5 h-3 w-3 text-gray-400" />
                            </div>
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="h-8 text-xs border-gray-300 rounded-md"
                            >
                                <option value="all">All Types</option>
                                <option value="regular">Regular</option>
                                <option value="special_ed">Special Education</option>
                            </select>
                        </div>
                    </div>

                    {/* Class List */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Class Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Capacity
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Description
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Student Count
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {classes.data.map((classItem) => (
                                    <tr key={classItem.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{classItem.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${classItem.type === 'special_ed' 
                                                    ? 'bg-purple-100 text-purple-800' 
                                                    : 'bg-green-100 text-green-800'}`}
                                            >
                                                {classItem.type === 'special_ed' ? 'Special Ed' : 'Regular'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {classItem.capacity}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {classItem.description}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {classItem.student_count} / {classItem.capacity}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {classItem.available_seats} seats available
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                                <div 
                                                    className="bg-blue-600 h-1.5 rounded-full" 
                                                    style={{ width: `${(classItem.student_count / classItem.capacity) * 100}%` }}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button 
                                                onClick={() => {
                                                    setEditingClass(classItem);
                                                    setData(classItem);
                                                    setIsFormOpen(true);
                                                }}
                                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                                            >
                                                <FaEdit className="h-4 w-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(classItem)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <FaTrash className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6">
                        <Pagination links={classes.links} />
                    </div>
                </div>
            </div>

            {/* Class Form Modal */}
            <Modal show={isFormOpen} onClose={() => {
                setIsFormOpen(false);
                setEditingClass(null);
                reset();
            }}>
                <form onSubmit={handleSubmit} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        {editingClass ? 'Edit Class' : 'Add New Class'}
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="name" value="Class Name" />
                            <TextInput
                                id="name"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="type" value="Class Type" />
                            <select
                                id="type"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                value={data.type}
                                onChange={(e) => setData('type', e.target.value)}
                            >
                                <option value="regular">Regular</option>
                                <option value="special_ed">Special Education</option>
                            </select>
                            <InputError message={errors.type} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="capacity" value="Capacity" />
                            <TextInput
                                id="capacity"
                                type="number"
                                className="mt-1 block w-full"
                                value={data.capacity}
                                onChange={(e) => setData('capacity', e.target.value)}
                            />
                            <InputError message={errors.capacity} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="description" value="Description" />
                            <textarea
                                id="description"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                rows="3"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                            />
                            <InputError message={errors.description} className="mt-2" />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                        <SecondaryButton onClick={() => {
                            setIsFormOpen(false);
                            setEditingClass(null);
                            reset();
                        }}>
                            Cancel
                        </SecondaryButton>
                        <PrimaryButton type="submit" disabled={processing}>
                            {editingClass ? 'Update' : 'Create'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            <DeleteConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, classId: null, className: '' })}
                onConfirm={confirmDelete}
                title="Delete Class"
                message={`Are you sure you want to delete ${deleteModal.className}? This action cannot be undone and will remove all associated student assignments.`}
            />
        </AuthenticatedLayout>
    );
} 