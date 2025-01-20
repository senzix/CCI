import { useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import SelectInput from '@/Components/SelectInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { FaPlus, FaTrash } from 'react-icons/fa';

export default function PayrollForm({ isOpen, onClose, employees, payrollPeriod, editingRecord = null }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        employee_id: editingRecord?.employee_id || '',
        payroll_period_id: payrollPeriod?.id || '',
        basic_salary: editingRecord?.basic_salary || '',
        allowances: editingRecord?.allowances || [],
        deductions: editingRecord?.deductions || [],
        notes: editingRecord?.notes || ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        post(route('payroll.generate'), {
            onSuccess: () => {
                reset();
                onClose();
            },
            preserveScroll: true
        });
    };

    const addAllowance = () => {
        setData('allowances', [...data.allowances, { name: '', amount: '' }]);
    };

    const addDeduction = () => {
        setData('deductions', [...data.deductions, { name: '', amount: '' }]);
    };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="2xl">
            <form onSubmit={handleSubmit} className="p-6">
                <h2 className="text-lg font-medium text-gray-900">
                    Generate Payroll
                </h2>

                <div className="mt-6 space-y-6">
                    <div>
                        <InputLabel htmlFor="employee_id" value="Employee" />
                        <SelectInput
                            id="employee_id"
                            className="mt-1 block w-full"
                            value={data.employee_id}
                            onChange={e => setData('employee_id', e.target.value)}
                            required
                        >
                            <option value="">Select Employee</option>
                            {employees.map((employee) => (
                                <option key={employee.id} value={employee.id}>
                                    {employee.first_name} {employee.last_name}
                                </option>
                            ))}
                        </SelectInput>
                        <InputError message={errors.employee_id} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="basic_salary" value="Basic Salary" />
                        <TextInput
                            id="basic_salary"
                            type="number"
                            step="0.01"
                            className="mt-1 block w-full"
                            value={data.basic_salary}
                            onChange={e => setData('basic_salary', e.target.value)}
                            required
                        />
                        <InputError message={errors.basic_salary} className="mt-2" />
                    </div>

                    {/* Allowances Section */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <InputLabel value="Allowances" />
                            <button
                                type="button"
                                onClick={addAllowance}
                                className="text-sm text-blue-600 hover:text-blue-800"
                            >
                                + Add Allowance
                            </button>
                        </div>
                        {data.allowances.map((allowance, index) => (
                            <div key={index} className="flex space-x-2 mt-2">
                                <TextInput
                                    placeholder="Name"
                                    value={allowance.name}
                                    onChange={e => {
                                        const newAllowances = [...data.allowances];
                                        newAllowances[index].name = e.target.value;
                                        setData('allowances', newAllowances);
                                    }}
                                    className="flex-1"
                                />
                                <TextInput
                                    type="number"
                                    step="0.01"
                                    placeholder="Amount"
                                    value={allowance.amount}
                                    onChange={e => {
                                        const newAllowances = [...data.allowances];
                                        newAllowances[index].amount = e.target.value;
                                        setData('allowances', newAllowances);
                                    }}
                                    className="w-32"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Deductions Section */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <InputLabel value="Deductions" />
                            <button
                                type="button"
                                onClick={addDeduction}
                                className="text-sm text-blue-600 hover:text-blue-800"
                            >
                                + Add Deduction
                            </button>
                        </div>
                        {data.deductions.map((deduction, index) => (
                            <div key={index} className="flex space-x-2 mt-2">
                                <TextInput
                                    placeholder="Name"
                                    value={deduction.name}
                                    onChange={e => {
                                        const newDeductions = [...data.deductions];
                                        newDeductions[index].name = e.target.value;
                                        setData('deductions', newDeductions);
                                    }}
                                    className="flex-1"
                                />
                                <TextInput
                                    type="number"
                                    step="0.01"
                                    placeholder="Amount"
                                    value={deduction.amount}
                                    onChange={e => {
                                        const newDeductions = [...data.deductions];
                                        newDeductions[index].amount = e.target.value;
                                        setData('deductions', newDeductions);
                                    }}
                                    className="w-32"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                    <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
                    <PrimaryButton type="submit" disabled={processing}>
                        Generate Payroll
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
} 