import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function DepartmentManager({ show, onClose, departments }) {
    const [editingDepartment, setEditingDepartment] = useState(null);
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        code: '',
        description: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (editingDepartment) {
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
        setData({
            name: department.name,
            code: department.code,
            description: department.description || ''
        });
    };

    const handleDelete = (department) => {
        if (confirm('Are you sure you want to delete this department?')) {
            router.delete(route('departments.destroy', department.id));
        }
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl">
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Manage Departments
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <form onSubmit={handleSubmit} className="space-y-4">
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

                            <div className="flex justify-end">
                                <PrimaryButton type="submit" disabled={processing}>
                                    {editingDepartment ? 'Update' : 'Create'} Department
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>

                    <div className="border-l pl-6">
                        <h3 className="font-medium text-gray-900 mb-4">Existing Departments</h3>
                        <div className="space-y-4 max-h-[400px] overflow-y-auto">
                            {departments.map(department => (
                                <div key={department.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                    <div>
                                        <h4 className="font-medium">{department.name}</h4>
                                        <p className="text-sm text-gray-500">{department.code}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEdit(department)}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            <FaEdit className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(department)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <FaTrash className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
} 