import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useForm, router } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import TextArea from '@/Components/TextArea';
import InputError from '@/Components/InputError';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import DeleteConfirmationModal from '@/Components/DeleteConfirmationModal';

export default function CategoryManagementModal({ isOpen, onClose, categories = [] }) {
    const [editingCategory, setEditingCategory] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        description: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingCategory) {
            put(route('documents.categories.update', editingCategory.id), {
                onSuccess: () => {
                    reset();
                    setEditingCategory(null);
                },
            });
        } else {
            post(route('documents.categories.store'), {
                onSuccess: () => {
                    reset();
                },
            });
        }
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setData({
            name: category.name,
            description: category.description || '',
        });
    };

    const handleDeleteClick = (category) => {
        setCategoryToDelete(category);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        router.delete(route('documents.categories.destroy', categoryToDelete.id), {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setCategoryToDelete(null);
            },
        });
    };

    const handleClose = () => {
        reset();
        setEditingCategory(null);
        onClose();
    };

    return (
        <>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-40" onClose={handleClose}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                        {editingCategory ? 'Edit Category' : 'Add New Category'}
                                    </Dialog.Title>

                                    <form onSubmit={handleSubmit} className="mt-4">
                                        <div className="space-y-4">
                                            <div>
                                                <InputLabel htmlFor="name" value="Name" />
                                                <TextInput
                                                    id="name"
                                                    type="text"
                                                    value={data.name}
                                                    onChange={e => setData('name', e.target.value)}
                                                    className="mt-1 block w-full"
                                                    required
                                                />
                                                <InputError message={errors.name} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="description" value="Description" />
                                                <TextArea
                                                    id="description"
                                                    value={data.description}
                                                    onChange={e => setData('description', e.target.value)}
                                                    className="mt-1 block w-full"
                                                    rows={3}
                                                />
                                                <InputError message={errors.description} className="mt-2" />
                                            </div>
                                        </div>

                                        <div className="mt-6 flex justify-end space-x-3">
                                            <button
                                                type="button"
                                                onClick={handleClose}
                                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="px-4 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-md disabled:opacity-50"
                                            >
                                                {editingCategory ? 'Update' : 'Create'}
                                            </button>
                                        </div>
                                    </form>

                                    <div className="mt-8">
                                        <h3 className="text-sm font-medium text-gray-900">Existing Categories</h3>
                                        <div className="mt-4 divide-y divide-gray-200">
                                            {categories.map(category => (
                                                <div key={category.id} className="py-3 flex items-center justify-between">
                                                    <div>
                                                        <h4 className="text-sm font-medium text-gray-900">{category.name}</h4>
                                                        {category.description && (
                                                            <p className="text-sm text-gray-500">{category.description}</p>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            onClick={() => handleEdit(category)}
                                                            className="p-1 text-gray-500 hover:text-gray-700"
                                                        >
                                                            <FaEdit className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteClick(category)}
                                                            className="p-1 text-secondary-500 hover:text-secondary-700"
                                                        >
                                                            <FaTrash className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            <Transition appear show={isDeleteModalOpen} as={Fragment}>
                <div className="relative z-50">
                    <DeleteConfirmationModal
                        isOpen={isDeleteModalOpen}
                        onClose={() => {
                            setIsDeleteModalOpen(false);
                            setCategoryToDelete(null);
                        }}
                        onConfirm={handleDeleteConfirm}
                        title="Delete Category"
                        message={`Are you sure you want to delete "${categoryToDelete?.name}"? This action cannot be undone and will affect all documents in this category.`}
                    />
                </div>
            </Transition>
        </>
    );
} 