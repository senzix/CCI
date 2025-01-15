import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import SelectInput from '@/Components/SelectInput';
import TextArea from '@/Components/TextArea';

export default function ExpenditureForm({ isOpen, onClose, grantId }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        category: '',
        receipt_number: '',
        receipt_file: null,
        notes: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('grants.expenditures.store', grantId), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    const categories = [
        { value: 'equipment', label: 'Equipment' },
        { value: 'supplies', label: 'Supplies' },
        { value: 'services', label: 'Services' },
        { value: 'travel', label: 'Travel' },
        { value: 'salaries', label: 'Salaries' },
        { value: 'other', label: 'Other' },
    ];

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

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <InputLabel htmlFor="amount" value="Amount" />
                                                <TextInput
                                                    id="amount"
                                                    type="number"
                                                    step="0.01"
                                                    className="mt-1 block w-full"
                                                    value={data.amount}
                                                    onChange={e => setData('amount', e.target.value)}
                                                />
                                                <InputError message={errors.amount} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="date" value="Date" />
                                                <TextInput
                                                    id="date"
                                                    type="date"
                                                    className="mt-1 block w-full"
                                                    value={data.date}
                                                    onChange={e => setData('date', e.target.value)}
                                                />
                                                <InputError message={errors.date} className="mt-2" />
                                            </div>
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="category" value="Category" />
                                            <SelectInput
                                                id="category"
                                                className="mt-1 block w-full"
                                                value={data.category}
                                                onChange={e => setData('category', e.target.value)}
                                                options={categories}
                                            />
                                            <InputError message={errors.category} className="mt-2" />
                                        </div>

                                        <div className="flex justify-end space-x-2">
                                            <button
                                                type="button"
                                                onClick={onClose}
                                                className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
                                            >
                                                Record Expenditure
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