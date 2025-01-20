import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import SecondaryButton from '@/Components/SecondaryButton';
import SelectInput from '@/Components/SelectInput';
import { FaCheck, FaTimes } from 'react-icons/fa';

export default function LeaveRequestManager({ isOpen, onClose, leaveRequests, employees, leaveTypes }) {
    const [showNewRequestForm, setShowNewRequestForm] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        employee_id: '',
        leave_type_id: '',
        start_date: '',
        end_date: '',
        reason: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('leave-requests.store'), {
            onSuccess: () => {
                reset();
                setShowNewRequestForm(false);
            }
        });
    };

    const handleApprove = (id) => {
        router.put(route('leave-requests.approve', id));
    };

    const handleReject = (id) => {
        const reason = prompt('Please provide a reason for rejection:');
        if (reason !== null) {
            router.put(route('leave-requests.reject', id), { rejection_reason: reason });
        }
    };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="4xl">
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Leave Requests
                    </h2>
                    <PrimaryButton onClick={() => setShowNewRequestForm(true)}>
                        New Leave Request
                    </PrimaryButton>
                </div>

                {showNewRequestForm ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
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
                                {employees.map(employee => (
                                    <option key={employee.id} value={employee.id}>
                                        {employee.first_name} {employee.last_name}
                                    </option>
                                ))}
                            </SelectInput>
                            <InputError message={errors.employee_id} className="mt-2" />
                        </div>
                        
                        <div>
                            <InputLabel htmlFor="leave_type_id" value="Leave Type" />
                            <SelectInput
                                id="leave_type_id"
                                className="mt-1 block w-full"
                                value={data.leave_type_id}
                                onChange={e => setData('leave_type_id', e.target.value)}
                                required
                            >
                                <option value="">Select Leave Type</option>
                                {leaveTypes.map(type => (
                                    <option key={type.id} value={type.id}>
                                        {type.name}
                                    </option>
                                ))}
                            </SelectInput>
                            <InputError message={errors.leave_type_id} className="mt-2" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
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
                        </div>

                        <div>
                            <InputLabel htmlFor="reason" value="Reason" />
                            <textarea
                                id="reason"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={data.reason}
                                onChange={e => setData('reason', e.target.value)}
                                rows={3}
                                required
                            />
                            <InputError message={errors.reason} className="mt-2" />
                        </div>

                        <div className="flex justify-end space-x-3">
                            <SecondaryButton onClick={() => setShowNewRequestForm(false)}>
                                Cancel
                            </SecondaryButton>
                            <PrimaryButton type="submit" disabled={processing}>
                                Submit Request
                            </PrimaryButton>
                        </div>
                    </form>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Employee
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Leave Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Duration
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {leaveRequests.map((request) => (
                                    <tr key={request.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {request.employee.first_name} {request.employee.last_name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {request.leave_type.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {request.start_date} to {request.end_date}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                request.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {request.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {request.status === 'pending' && (
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleApprove(request.id)}
                                                        className="text-green-600 hover:text-green-900"
                                                    >
                                                        <FaCheck className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(request.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        <FaTimes className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </Modal>
    );
} 