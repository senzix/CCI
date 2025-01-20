import { useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import SelectInput from '@/Components/SelectInput';

export default function AttendanceForm({ isOpen, onClose, employees, selectedDate, editingRecord = null }) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        employee_id: editingRecord?.employee_id || '',
        date: editingRecord?.date || selectedDate.toISOString().split('T')[0],
        clock_in: editingRecord?.clock_in || '',
        clock_out: editingRecord?.clock_out || '',
        status: editingRecord?.status || 'present',
        notes: editingRecord?.notes || ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (editingRecord) {
            put(route('attendance.update', editingRecord.id), {
                onSuccess: () => {
                    reset();
                    onClose();
                }
            });
        } else {
            post(route('attendance.store'), {
                onSuccess: () => {
                    reset();
                    onClose();
                }
            });
        }
    };

    return (
        <Modal show={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit} className="p-6">
                <h2 className="text-lg font-medium text-gray-900">
                    {editingRecord ? 'Edit Attendance Record' : 'Record Attendance'}
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
                        <InputLabel htmlFor="date" value="Date" />
                        <TextInput
                            id="date"
                            type="date"
                            className="mt-1 block w-full"
                            value={data.date}
                            onChange={e => setData('date', e.target.value)}
                            required
                        />
                        <InputError message={errors.date} className="mt-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel htmlFor="clock_in" value="Clock In" />
                            <TextInput
                                id="clock_in"
                                type="time"
                                className="mt-1 block w-full"
                                value={data.clock_in}
                                onChange={e => setData('clock_in', e.target.value)}
                            />
                            <InputError message={errors.clock_in} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="clock_out" value="Clock Out" />
                            <TextInput
                                id="clock_out"
                                type="time"
                                className="mt-1 block w-full"
                                value={data.clock_out}
                                onChange={e => setData('clock_out', e.target.value)}
                            />
                            <InputError message={errors.clock_out} className="mt-2" />
                        </div>
                    </div>

                    <div>
                        <InputLabel htmlFor="status" value="Status" />
                        <SelectInput
                            id="status"
                            className="mt-1 block w-full"
                            value={data.status}
                            onChange={e => setData('status', e.target.value)}
                            required
                        >
                            <option value="present">Present</option>
                            <option value="absent">Absent</option>
                            <option value="late">Late</option>
                            <option value="half-day">Half Day</option>
                        </SelectInput>
                        <InputError message={errors.status} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="notes" value="Notes" />
                        <textarea
                            id="notes"
                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            value={data.notes}
                            onChange={e => setData('notes', e.target.value)}
                            rows="3"
                        />
                        <InputError message={errors.notes} className="mt-2" />
                    </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                    <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
                    <PrimaryButton type="submit" disabled={processing}>
                        {editingRecord ? 'Update' : 'Record'} Attendance
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
} 