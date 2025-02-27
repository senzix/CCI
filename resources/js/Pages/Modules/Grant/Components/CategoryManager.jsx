import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function CategoryManager({ categories = [], isOpen, onClose }) {
    const [editingCategory, setEditingCategory] = useState(null);
    
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        description: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (editingCategory) {
            put(route('grant-categories.update', editingCategory.id), {
                onSuccess: () => {
                    reset();
                    setEditingCategory(null);
                }
            });
        } else {
            post(route('grant-categories.store'), {
                onSuccess: () => reset()
            });
        }
    };

    const handleDelete = (categoryId) => {
        if (confirm('Are you sure you want to delete this category?')) {
            router.delete(route('grant-categories.destroy', categoryId));
        }
    };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="2xl">
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-medium">
                        Manage Grant Categories
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="mb-6">
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <InputLabel htmlFor="name" value="Category Name" />
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
                            <InputLabel htmlFor="description" value="Description" />
                            <TextInput
                                id="description"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                            />
                            <InputError message={errors.description} className="mt-2" />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center px-4 py-2 bg-primary-500 hover:bg-primary-600 text-gray-900 font-medium rounded-md"
                            >
                                {editingCategory ? 'Update' : 'Add'} Category
                            </button>
                        </div>
                    </div>
                </form>

                <div className="border-t pt-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">
                        Existing Categories
                    </h3>
                    <div className="space-y-2">
                        {categories.map((category) => (
                            <div 
                                key={category.id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                            >
                                <div>
                                    <h4 className="text-sm font-medium">{category.name}</h4>
                                    <p className="text-sm text-gray-500">{category.description}</p>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setEditingCategory(category)}
                                        className="p-1.5 text-gray-600 hover:text-blue-600 rounded-md"
                                    >
                                        <FaEdit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(category.id)}
                                        className="p-1.5 text-gray-600 hover:text-secondary-500 rounded-md"
                                    >
                                        <FaTrash className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Modal>
    );
} 