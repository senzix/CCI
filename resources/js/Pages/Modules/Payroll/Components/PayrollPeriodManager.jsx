import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function PayrollPeriodManager({ isOpen, onClose, periods }) {
    const [editingPeriod, setEditingPeriod] = useState(null);
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        start_date: '',
        end_date: '',
        payment_date: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (editingPeriod) {
            put(route('payroll-periods.update', editingPeriod.id), {
                onSuccess: () => {
                    reset();
                    setEditingPeriod(null);
                }
            });
        } else {
            post(route('payroll-periods.store'), {
                onSuccess: () => reset()
            });
        }
    };

    const deletePeriod = (periodId) => {
        router.delete(route('payroll-periods.destroy', periodId), {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const handleEdit = (period) => {
        setEditingPeriod(period);
        setData({
            name: period.name,
            start_date: period.start_date,
            end_date: period.end_date,
            payment_date: period.payment_date
        });
    };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="3xl">
            <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Manage Payroll Periods
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <InputLabel htmlFor="name" value="Period Name" />
                                <TextInput
                                    id="name"
                                    type="text"
                                    className="mt-1 block w-full"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="start_date" value="Start Date" />
                                <TextInput
                                    id="start_date"
                                    type="date"
                                    className="mt-1 block w-full"
                                    value={data.start_date}
                                    onChange={e => setData('start_date', e.target.value)}
                                    required
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
                                    required
                                />
                                <InputError message={errors.end_date} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="payment_date" value="Payment Date" />
                                <TextInput
                                    id="payment_date"
                                    type="date"
                                    className="mt-1 block w-full"
                                    value={data.payment_date}
                                    onChange={e => setData('payment_date', e.target.value)}
                                    required
                                />
                                <InputError message={errors.payment_date} className="mt-2" />
                            </div>

                            <div className="flex justify-end">
                                <PrimaryButton type="submit" disabled={processing}>
                                    {editingPeriod ? 'Update' : 'Create'} Period
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>

                    <div className="border-l pl-6">
                        <h3 className="font-medium text-gray-900 mb-4">Existing Periods</h3>
                        <div className="space-y-4">
                            {periods.map((period) => (
                                <div 
                                    key={period.id} 
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                >
                                    <div>
                                        <h4 className="font-medium">{period.name}</h4>
                                        <p className="text-sm text-gray-500">
                                            {new Date(period.start_date).toLocaleDateString()} - {new Date(period.end_date).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEdit(period)}
                                            className="text-indigo-600 hover:text-indigo-900"
                                        >
                                            <FaEdit className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => deletePeriod(period.id)}
                                            className="text-red-600 hover:text-red-900"
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