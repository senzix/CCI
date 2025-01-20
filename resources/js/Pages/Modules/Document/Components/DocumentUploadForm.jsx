import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useForm, router } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import TextArea from '@/Components/TextArea';
import { FaCloudUploadAlt } from 'react-icons/fa';

export default function DocumentUploadForm({ 
    isOpen, 
    onClose, 
    documentableType, 
    documentableId,
    categories,
    defaultCategory 
}) {
    console.log('DocumentUploadForm Props:', {
        documentableType,
        documentableId,
        defaultCategory
    });

    const [dragActive, setDragActive] = useState(false);

    const { data, setData, post, processing, errors, reset, progress } = useForm({
        title: '',
        file: null,
        category_id: defaultCategory || '',
        description: '',
        tags: '[]',
        documentable_type: documentableType,
        documentable_id: documentableId
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitting form with data:', data);
        
        const formData = new FormData();
        formData.append('file', data.file);
        formData.append('title', data.title);
        formData.append('category_id', data.category_id);
        formData.append('description', data.description || '');
        
        if (data.documentable_type && data.documentable_id) {
            formData.append('documentable_type', data.documentable_type);
            formData.append('documentable_id', data.documentable_id);
        }
        
        post(route('documents.store'), formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                console.log('Upload successful');
                reset();
                onClose();
                if (data.documentable_type === 'grant') {
                    router.reload({ only: ['grant'] });
                } else {
                    router.reload({ only: ['documents'] });
                }
            },
            onError: (errors) => {
                console.error('Upload failed:', errors);
                alert('Failed to upload document: ' + Object.values(errors).flat().join('\n'));
            }
        });
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setData('file', e.dataTransfer.files[0]);
        }
    };

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog onClose={onClose} className="relative z-50">
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500/75" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
                                <form onSubmit={handleSubmit}>
                                    <div className="space-y-6">
                                        <div>
                                            <h2 className="text-lg font-medium text-gray-900">
                                                Upload Document
                                            </h2>
                                            <p className="mt-1 text-sm text-gray-600">
                                                Upload a new document to the system
                                            </p>
                                        </div>

                                        <div
                                            className={`relative border-2 border-dashed rounded-lg p-6 ${
                                                dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                                            }`}
                                            onDragEnter={handleDrag}
                                            onDragLeave={handleDrag}
                                            onDragOver={handleDrag}
                                            onDrop={handleDrop}
                                        >
                                            <input
                                                type="file"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                onChange={e => setData('file', e.target.files[0])}
                                            />
                                            <div className="text-center">
                                                <FaCloudUploadAlt className="mx-auto h-12 w-12 text-gray-400" />
                                                <p className="mt-2 text-sm text-gray-600">
                                                    Drag and drop your file here, or click to select
                                                </p>
                                                {data.file && (
                                                    <p className="mt-2 text-sm text-blue-600 font-medium">
                                                        {data.file.name}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <InputError message={errors.file} className="mt-2" />

                                        {progress && (
                                            <div className="relative pt-1">
                                                <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-200">
                                                    <div
                                                        style={{ width: `${progress}%` }}
                                                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        <div>
                                            <InputLabel htmlFor="title" value="Title" />
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
                                            <InputLabel htmlFor="category" value="Category" />
                                            <select
                                                id="category"
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm 
                                                    focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50
                                                    text-gray-700 text-sm
                                                    bg-white
                                                    appearance-none cursor-pointer
                                                    pl-3 pr-10 py-2.5
                                                    hover:border-gray-400 transition-colors duration-200"
                                                value={data.category_id}
                                                onChange={e => {
                                                    console.log('Selected category:', e.target.value);
                                                    setData('category_id', e.target.value);
                                                }}
                                                style={{
                                                    backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                                                    backgroundPosition: 'right 0.5rem center',
                                                    backgroundSize: '1.5em 1.5em',
                                                    backgroundRepeat: 'no-repeat'
                                                }}
                                            >
                                                <option value="" className="text-gray-500">Select a category</option>
                                                {categories?.map(category => (
                                                    <option 
                                                        key={category.id} 
                                                        value={category.id}
                                                        className="py-2 text-gray-700"
                                                    >
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <InputError message={errors.category_id} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="description" value="Description" />
                                            <TextArea
                                                id="description"
                                                className="mt-1 block w-full"
                                                value={data.description}
                                                onChange={e => setData('description', e.target.value)}
                                            />
                                            <InputError message={errors.description} className="mt-2" />
                                        </div>

                                        <div className="flex justify-end space-x-3">
                                            <button
                                                type="button"
                                                onClick={onClose}
                                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={processing || !data.file}
                                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
                                            >
                                                Upload
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
} 