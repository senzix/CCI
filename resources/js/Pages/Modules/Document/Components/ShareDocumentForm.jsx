import { Fragment, useState } from 'react';
import { Dialog, Transition, Combobox } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import SelectInput from '@/Components/SelectInput';
import { FaUsers, FaSearch } from 'react-icons/fa';

export default function ShareDocumentForm({ isOpen, onClose, document }) {
    const [users, setUsers] = useState([]);
    const [query, setQuery] = useState('');

    const { data, setData, post, processing, errors, reset } = useForm({
        user_id: '',
        permission_type: 'view',
        expires_at: '',
    });

    const searchUsers = async (search) => {
        if (!search) return;
        
        try {
            const response = await axios.get(route('documents.share.users'), {
                params: { search }
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Error searching users:', error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('documents.share.store', document.id), {
            onSuccess: () => {
                reset();
                onClose();
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
                                        Share Document
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-600">
                                        Share "{document.title}" with other users
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <InputLabel htmlFor="user" value="User" />
                                        <Combobox
                                            value={data.user_id}
                                            onChange={value => setData('user_id', value)}
                                        >
                                            <div className="relative mt-1">
                                                <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left border border-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-300 sm:text-sm">
                                                    <Combobox.Input
                                                        className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                                                        displayValue={(id) => users.find(user => user.id === id)?.name}
                                                        onChange={(event) => {
                                                            setQuery(event.target.value);
                                                            searchUsers(event.target.value);
                                                        }}
                                                    />
                                                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                                                        <FaSearch className="h-4 w-4 text-gray-400" />
                                                    </Combobox.Button>
                                                </div>
                                                <Transition
                                                    as={Fragment}
                                                    leave="transition ease-in duration-100"
                                                    leaveFrom="opacity-100"
                                                    leaveTo="opacity-0"
                                                >
                                                    <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                        {users.map((user) => (
                                                            <Combobox.Option
                                                                key={user.id}
                                                                value={user.id}
                                                                className={({ active }) =>
                                                                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                                                        active ? 'bg-blue-600 text-white' : 'text-gray-900'
                                                                    }`
                                                                }
                                                            >
                                                                {({ selected, active }) => (
                                                                    <>
                                                                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                                                            {user.name} ({user.email})
                                                                        </span>
                                                                    </>
                                                                )}
                                                            </Combobox.Option>
                                                        ))}
                                                    </Combobox.Options>
                                                </Transition>
                                            </div>
                                        </Combobox>
                                        <InputError message={errors.user_id} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="permission_type" value="Permission Type" />
                                        <select
                                            id="permission_type"
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            value={data.permission_type}
                                            onChange={e => setData('permission_type', e.target.value)}
                                        >
                                            <option value="view">View Only (can only download)</option>
                                            <option value="edit">Can Edit (upload new versions)</option>
                                            <option value="admin">Admin Access (can share and delete)</option>
                                        </select>
                                        <InputError message={errors.permission_type} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="expires_at" value="Expires At (Optional)" />
                                        <TextInput
                                            id="expires_at"
                                            type="datetime-local"
                                            className="mt-1 block w-full"
                                            value={data.expires_at}
                                            onChange={e => setData('expires_at', e.target.value)}
                                        />
                                        <InputError message={errors.expires_at} className="mt-2" />
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
                                            disabled={processing}
                                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
                                        >
                                            Share Document
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