import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DeleteConfirmationModal from '@/Components/DeleteConfirmationModal';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

export default function DepartmentManager({ show, onClose, departments = [], positions = [], can = {} }) {
    const [editingDepartment, setEditingDepartment] = useState(null);
    const [showPositionForm, setShowPositionForm] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        type: null, // 'department' or 'position'
        item: null
    });

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        code: '',
        description: '',
        // Position fields
        title: '',
        position_code: '',
        base_salary: '',
        department_id: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (showPositionForm) {
            post(route('positions.store'), {
                onSuccess: () => {
                    reset();
                    setShowPositionForm(false);
                }
            });
        } else if (editingDepartment) {
            put(route('departments.update', editingDepartment.id), {
                onSuccess: () => {
                    reset();
                    setEditingDepartment(null);
                }
            });
        } else {
            post(route('departments.store'), {
                onSuccess: () => reset()
            });
        }
    };

    const handleEdit = (department) => {
        setEditingDepartment(department);
        setShowPositionForm(false);
        setData({
            name: department.name,
            code: department.code,
            description: department.description || ''
        });
    };

    const handleDelete = () => {
        if (deleteModal.type === 'department') {
            router.delete(route('departments.destroy', deleteModal.item.id), {
                onSuccess: () => setDeleteModal({ isOpen: false, type: null, item: null })
            });
        } else if (deleteModal.type === 'position') {
            router.delete(route('positions.destroy', deleteModal.item.id), {
                onSuccess: () => setDeleteModal({ isOpen: false, type: null, item: null })
            });
        }
    };

    const handleAddPosition = (department) => {
        setSelectedDepartment(department);
        setShowPositionForm(true);
        setEditingDepartment(null);
        setData({
            title: '',
            position_code: '',
            base_salary: '',
            department_id: department.id
        });
    };

    const handleDeletePosition = (position) => {
        setDeleteModal({
            isOpen: true,
            type: 'position',
            item: position
        });
    };

    const handleDeleteDepartment = (department) => {
        setDeleteModal({
            isOpen: true,
            type: 'department',
            item: department
        });
    };

    return (
        <>
            <Modal show={show} onClose={onClose} maxWidth="5xl">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-medium text-gray-900">
                            {showPositionForm ? `Add Position to ${selectedDepartment?.name}` : 'Manage Departments'}
                        </h2>
                        {showPositionForm && (
                            <SecondaryButton onClick={() => setShowPositionForm(false)}>
                                Back to Departments
                            </SecondaryButton>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {showPositionForm ? (
                                    <>
                                        <div>
                                            <InputLabel htmlFor="title" value="Position Title" />
                                            <TextInput
                                                id="title"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={data.title}
                                                onChange={e => setData('title', e.target.value)}
                                            />
                                            <InputError message={errors.title} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="position_code" value="Position Code" />
                                            <TextInput
                                                id="position_code"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={data.position_code}
                                                onChange={e => setData('position_code', e.target.value)}
                                            />
                                            <InputError message={errors.position_code} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="base_salary" value="Base Salary" />
                                            <TextInput
                                                id="base_salary"
                                                type="number"
                                                className="mt-1 block w-full"
                                                value={data.base_salary}
                                                onChange={e => setData('base_salary', e.target.value)}
                                            />
                                            <InputError message={errors.base_salary} className="mt-2" />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div>
                                            <InputLabel htmlFor="name" value="Department Name" />
                                            <TextInput
                                                id="name"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={data.name}
                                                onChange={e => setData('name', e.target.value)}
                                            />
                                            <InputError message={errors.name} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="code" value="Department Code" />
                                            <TextInput
                                                id="code"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={data.code}
                                                onChange={e => setData('code', e.target.value)}
                                            />
                                            <InputError message={errors.code} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="description" value="Description" />
                                            <textarea
                                                id="description"
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                                value={data.description}
                                                onChange={e => setData('description', e.target.value)}
                                                rows="3"
                                            />
                                            <InputError message={errors.description} className="mt-2" />
                                        </div>
                                    </>
                                )}

                                <div className="flex justify-end">
                                    <PrimaryButton type="submit" disabled={processing}>
                                        {showPositionForm ? 'Add Position' : editingDepartment ? 'Update Department' : 'Create Department'}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>

                        <div className="border-l pl-6">
                            <h3 className="font-medium text-gray-900 mb-4">Departments & Positions</h3>
                            <div className="space-y-6 max-h-[500px] overflow-y-auto">
                                {departments.map(department => (
                                    <div key={department.id} className="space-y-2">
                                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                            <div>
                                                <h4 className="font-medium">{department.name}</h4>
                                                <p className="text-sm text-gray-500">{department.code}</p>
                                            </div>
                                            <div className="flex space-x-2">
                                                {can.create_positions && (
                                                    <button
                                                        onClick={() => handleAddPosition(department)}
                                                        className="text-primary-600 hover:text-primary-800"
                                                        title="Add Position"
                                                    >
                                                        <FaPlus className="h-4 w-4" />
                                                    </button>
                                                )}
                                                {can.edit_departments && (
                                                    <button
                                                        onClick={() => handleEdit(department)}
                                                        className="text-primary-600 hover:text-primary-800"
                                                        title="Edit Department"
                                                    >
                                                        <FaEdit className="h-4 w-4" />
                                                    </button>
                                                )}
                                                {can.delete_departments && (
                                                    <button
                                                        onClick={() => handleDeleteDepartment(department)}
                                                        className="text-secondary-600 hover:text-secondary-800"
                                                        title="Delete Department"
                                                    >
                                                        <FaTrash className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {/* Positions list */}
                                        <div className="ml-4 space-y-2">
                                            {positions
                                                .filter(position => position.department_id === department.id)
                                                .map(position => (
                                                    <div key={position.id} className="flex justify-between items-center p-2 bg-gray-100 rounded">
                                                        <div>
                                                            <h5 className="text-sm font-medium">{position.title}</h5>
                                                            <p className="text-xs text-gray-500">
                                                                {position.code} - Base Salary: ${position.base_salary}
                                                            </p>
                                                        </div>
                                                        {can.delete_positions && (
                                                            <button
                                                                onClick={() => handleDeletePosition(position)}
                                                                className="text-secondary-600 hover:text-secondary-800"
                                                                title="Delete Position"
                                                            >
                                                                <FaTrash className="h-3 w-3" />
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>

            <DeleteConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, type: null, item: null })}
                onConfirm={handleDelete}
                title={`Delete ${deleteModal.type === 'department' ? 'Department' : 'Position'}`}
                message={`Are you sure you want to delete this ${deleteModal.type}? This action cannot be undone.${
                    deleteModal.type === 'department' 
                        ? ' All positions in this department will also be deleted.'
                        : ''
                }`}
            />
        </>
    );
} 