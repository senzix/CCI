import { Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import SelectInput from '@/Components/SelectInput';
import TextArea from '@/Components/TextArea';

export default function GrantForm({ isOpen, onClose, grant = null, categories }) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        title: grant?.title || '',
        reference_number: grant?.reference_number || '',
        category_id: grant?.category_id || '',
        amount: grant?.amount || '',
        start_date: grant?.start_date || '',
        end_date: grant?.end_date || '',
        funding_agency: grant?.funding_agency || '',
        status: grant?.status || 'draft',
        description: grant?.description || '',
        objectives: grant?.objectives || '',
        requirements: grant?.requirements || '',
        contact_person: grant?.contact_person || '',
        contact_email: grant?.contact_email || '',
        contact_phone: grant?.contact_phone || '',
        amount_received: grant?.amount_received || '0',
        amount_spent: grant?.amount_spent || '0',
        documents: [],
    });

    useEffect(() => {
        if (isOpen) {
            reset();
            if (grant) {
                setData({
                    title: grant.title,
                    reference_number: grant.reference_number,
                    category_id: grant.category_id,
                    amount: grant.amount,
                    start_date: grant.start_date,
                    end_date: grant.end_date,
                    funding_agency: grant.funding_agency,
                    status: grant.status,
                    description: grant.description,
                    objectives: grant.objectives,
                    requirements: grant.requirements,
                    contact_person: grant.contact_person,
                    contact_email: grant.contact_email,
                    contact_phone: grant.contact_phone,
                    amount_received: grant.amount_received,
                    amount_spent: grant.amount_spent,
                    documents: [],
                });
            }
        }
    }, [isOpen, grant]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (grant) {
            put(route('grants.update', grant.id), {
                onSuccess: () => onClose(),
            });
        } else {
            post(route('grants.store'), {
                onSuccess: () => onClose(),
            });
        }
    };

    const statusOptions = [
        { value: 'draft', label: 'Draft' },
        { value: 'submitted', label: 'Submitted' },
        { value: 'approved', label: 'Approved' },
        { value: 'rejected', label: 'Rejected' },
        { value: 'active', label: 'Active' },
        { value: 'completed', label: 'Completed' },
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
                            <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
                                <form onSubmit={handleSubmit}>
                                    <div className="space-y-6">
                                        <div className="border-b border-gray-200 pb-4">
                                            <h2 className="text-lg font-medium">
                                                {grant ? 'Edit Grant' : 'Create New Grant'}
                                            </h2>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
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
                                                <InputLabel htmlFor="reference_number" value="Reference Number" />
                                                <TextInput
                                                    id="reference_number"
                                                    type="text"
                                                    className="mt-1 block w-full"
                                                    value={data.reference_number}
                                                    onChange={e => setData('reference_number', e.target.value)}
                                                />
                                                <InputError message={errors.reference_number} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="category_id" value="Category" />
                                                <SelectInput
                                                    id="category_id"
                                                    className="mt-1 block w-full"
                                                    value={data.category_id}
                                                    onChange={e => setData('category_id', e.target.value)}
                                                    options={categories.map(cat => ({ value: cat.id, label: cat.name }))}
                                                />
                                                <InputError message={errors.category_id} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="amount" value="Amount (₹)" />
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
                                                <InputLabel htmlFor="start_date" value="Start Date" />
                                                <TextInput
                                                    id="start_date"
                                                    type="date"
                                                    className="mt-1 block w-full"
                                                    value={data.start_date}
                                                    onChange={e => setData('start_date', e.target.value)}
                                                />
                                                <InputError message={errors.start_date} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="end_date" value="End Date" />
                                                <TextInput
                                                    id="end_date"
                                                    type="date"
                                                    className="mt-1 block w-full"
                                                    value={data.end_date}
                                                    onChange={e => setData('end_date', e.target.value)}
                                                />
                                                <InputError message={errors.end_date} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="funding_agency" value="Funding Agency" />
                                                <TextInput
                                                    id="funding_agency"
                                                    type="text"
                                                    className="mt-1 block w-full"
                                                    value={data.funding_agency}
                                                    onChange={e => setData('funding_agency', e.target.value)}
                                                />
                                                <InputError message={errors.funding_agency} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="status" value="Status" />
                                                <SelectInput
                                                    id="status"
                                                    className="mt-1 block w-full"
                                                    value={data.status}
                                                    onChange={e => setData('status', e.target.value)}
                                                    options={statusOptions}
                                                />
                                                <InputError message={errors.status} className="mt-2" />
                                            </div>

                                            <div className="col-span-2">
                                                <InputLabel htmlFor="description" value="Description" />
                                                <TextArea
                                                    id="description"
                                                    className="mt-1 block w-full"
                                                    value={data.description}
                                                    onChange={e => setData('description', e.target.value)}
                                                    rows={3}
                                                />
                                                <InputError message={errors.description} className="mt-2" />
                                            </div>

                                            <div className="col-span-2">
                                                <InputLabel htmlFor="objectives" value="Objectives" />
                                                <TextArea
                                                    id="objectives"
                                                    className="mt-1 block w-full"
                                                    value={data.objectives}
                                                    onChange={e => setData('objectives', e.target.value)}
                                                    rows={3}
                                                />
                                                <InputError message={errors.objectives} className="mt-2" />
                                            </div>

                                            <div className="col-span-2">
                                                <InputLabel htmlFor="requirements" value="Requirements" />
                                                <TextArea
                                                    id="requirements"
                                                    className="mt-1 block w-full"
                                                    value={data.requirements}
                                                    onChange={e => setData('requirements', e.target.value)}
                                                    rows={3}
                                                />
                                                <InputError message={errors.requirements} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="contact_person" value="Contact Person" />
                                                <TextInput
                                                    id="contact_person"
                                                    type="text"
                                                    className="mt-1 block w-full"
                                                    value={data.contact_person}
                                                    onChange={e => setData('contact_person', e.target.value)}
                                                />
                                                <InputError message={errors.contact_person} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="contact_email" value="Contact Email" />
                                                <TextInput
                                                    id="contact_email"
                                                    type="email"
                                                    className="mt-1 block w-full"
                                                    value={data.contact_email}
                                                    onChange={e => setData('contact_email', e.target.value)}
                                                />
                                                <InputError message={errors.contact_email} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="contact_phone" value="Contact Phone" />
                                                <TextInput
                                                    id="contact_phone"
                                                    type="tel"
                                                    className="mt-1 block w-full"
                                                    value={data.contact_phone}
                                                    onChange={e => setData('contact_phone', e.target.value)}
                                                />
                                                <InputError message={errors.contact_phone} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="amount_received" value="Amount Received (₹)" />
                                                <TextInput
                                                    id="amount_received"
                                                    type="number"
                                                    step="0.01"
                                                    className="mt-1 block w-full"
                                                    value={data.amount_received}
                                                    onChange={e => setData('amount_received', e.target.value)}
                                                />
                                                <InputError message={errors.amount_received} className="mt-2" />
                                            </div>
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
                                                {grant ? 'Update Grant' : 'Create Grant'}
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