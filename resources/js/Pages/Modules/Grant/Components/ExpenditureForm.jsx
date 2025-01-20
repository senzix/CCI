import { useEffect, useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import SelectInput from '@/Components/SelectInput';
import TextArea from '@/Components/TextArea';

export default function ExpenditureForm({ isOpen, onClose, grantId, expenditure = null, onSuccess }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        description: '',
        amount: '',
        date: '',
        category: '',
        receipt_number: '',
        receipt_file: null,
        notes: '',
        _method: 'PUT',
    });

    // Use useEffect to set form data when expenditure changes
    useEffect(() => {
        if (expenditure) {
            // Format the date to YYYY-MM-DD
            const formattedDate = expenditure.date 
                ? new Date(expenditure.date).toISOString().split('T')[0] 
                : '';

            setData({
                description: expenditure.description,
                amount: expenditure.amount,
                date: formattedDate,
                category: expenditure.category,
                receipt_number: expenditure.receipt_number || '',
                receipt_file: null,
                notes: expenditure.notes || '',
                _method: 'PUT',
            });
        } else {
            reset();
            setData({
                description: '',
                amount: '',
                date: new Date().toISOString().split('T')[0],
                category: '',
                receipt_number: '',
                receipt_file: null,
                notes: '',
                _method: 'POST',
            });
        }
    }, [expenditure]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (data[key] !== null && data[key] !== undefined) {
                formData.append(key, data[key]);
            }
        });

        const successMessage = expenditure 
            ? 'Expenditure updated successfully'
            : 'Expenditure added successfully';

        if (expenditure) {
            router.post(route('grants.expenditures.update', [grantId, expenditure.id]), formData, {
                preserveScroll: true,
                onSuccess: () => {
                    console.log('Router success callback with message:', successMessage);
                    onSuccess(successMessage);
                    onClose();
                },
                onError: (errors) => {
                    console.error('Operation failed:', errors);
                }
            });
        } else {
            router.post(route('grants.expenditures.store', grantId), formData, {
                preserveScroll: true,
                onSuccess: () => {
                    console.log('Router success callback with message:', successMessage);
                    onSuccess(successMessage);
                    onClose();
                },
                onError: (errors) => {
                    console.error('Operation failed:', errors);
                }
            });
        }
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
        <>
            <Modal show={isOpen} onClose={onClose} maxWidth="2xl">
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        {expenditure ? 'Edit Expenditure' : 'Add New Expenditure'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <InputLabel htmlFor="description" value="Description" />
                            <TextInput
                                id="description"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.description || ''}
                                onChange={e => setData('description', e.target.value)}
                                required
                            />
                            <InputError message={errors.description} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="amount" value="Amount" />
                            <TextInput
                                id="amount"
                                type="number"
                                step="0.01"
                                className="mt-1 block w-full"
                                value={data.amount || ''}
                                onChange={e => setData('amount', e.target.value)}
                                required
                            />
                            <InputError message={errors.amount} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="date" value="Date" />
                            <TextInput
                                id="date"
                                type="date"
                                className="mt-1 block w-full"
                                value={data.date || ''}
                                onChange={e => setData('date', e.target.value)}
                                required
                            />
                            <InputError message={errors.date} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="category" value="Category" />
                            <SelectInput
                                id="category"
                                className="mt-1 block w-full"
                                value={data.category || ''}
                                onChange={e => setData('category', e.target.value)}
                                options={categories}
                                required
                            />
                            <InputError message={errors.category} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="receipt_number" value="Receipt Number" />
                            <TextInput
                                id="receipt_number"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.receipt_number || ''}
                                onChange={e => setData('receipt_number', e.target.value)}
                            />
                            <InputError message={errors.receipt_number} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="receipt_file" value="Receipt File" />
                            <input
                                id="receipt_file"
                                type="file"
                                className="mt-1 block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-md file:border-0
                                    file:text-sm file:font-medium
                                    file:bg-blue-50 file:text-blue-700
                                    hover:file:bg-blue-100"
                                onChange={e => setData('receipt_file', e.target.files[0])}
                            />
                            {expenditure?.receipt_file && (
                                <div className="mt-2 text-sm text-gray-600">
                                    Current file: {expenditure.receipt_file}
                                </div>
                            )}
                            <InputError message={errors.receipt_file} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="notes" value="Notes" />
                            <TextArea
                                id="notes"
                                className="mt-1 block w-full"
                                value={data.notes || ''}
                                onChange={e => setData('notes', e.target.value)}
                                rows={3}
                            />
                            <InputError message={errors.notes} className="mt-2" />
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50 flex items-center"
                            >
                                {processing ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    expenditure ? 'Update Expenditure' : 'Record Expenditure'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
} 