import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import TextArea from '@/Components/TextArea';
import { FaCloudUploadAlt } from 'react-icons/fa';

export default function VersionUploadForm({ isOpen, onClose, document }) {
    const { data, setData, post, processing, errors, reset, progress } = useForm({
        file: null,
        change_notes: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!data.file) {
            alert('Please select a file');
            return;
        }

        const formData = new FormData();
        formData.append('file', data.file);
        formData.append('change_notes', data.change_notes);
        
        post(route('documents.versions.store', document.id), formData, {
            forceFormData: true,
            onSuccess: () => {
                reset();
                onClose();
                window.location.reload();
            },
            onError: (errors) => {
                console.error('Version upload failed:', errors);
                alert('Failed to upload version: ' + Object.values(errors).flat().join('\n'));
            },
        });
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
                                <div className="mb-4">
                                    <h2 className="text-lg font-medium text-gray-900">
                                        Upload New Version
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-600">
                                        Upload a new version of "{document.title}"
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <InputLabel htmlFor="file" value="File" />
                                        <div className="mt-1">
                                            <div className="flex items-center justify-center w-full">
                                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                        <FaCloudUploadAlt className="w-8 h-8 mb-4 text-gray-500" />
                                                        <p className="mb-2 text-sm text-gray-500">
                                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                                        </p>
                                                    </div>
                                                    <input
                                                        id="file"
                                                        type="file"
                                                        className="hidden"
                                                        onChange={e => setData('file', e.target.files[0])}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                        {data.file && (
                                            <p className="mt-2 text-sm text-blue-600">
                                                Selected file: {data.file.name}
                                            </p>
                                        )}
                                        <InputError message={errors.file} className="mt-2" />
                                    </div>

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
                                        <InputLabel htmlFor="change_notes" value="Change Notes" />
                                        <TextArea
                                            id="change_notes"
                                            className="mt-1 block w-full"
                                            value={data.change_notes}
                                            onChange={e => setData('change_notes', e.target.value)}
                                            placeholder="Describe the changes in this version..."
                                        />
                                        <InputError message={errors.change_notes} className="mt-2" />
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
                                            Upload Version
                                        </button>
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