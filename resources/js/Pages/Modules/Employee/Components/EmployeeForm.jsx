import { useState, useEffect } from 'react';
import { useForm, router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import SelectInput from '@/Components/SelectInput';

export default function EmployeeForm({ show, onClose, employee = null, departments, positions }) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        first_name: employee?.first_name || '',
        last_name: employee?.last_name || '',
        email: employee?.email || '',
        phone: employee?.phone || '',
        department_id: employee?.position?.department_id || '',
        position_id: employee?.position_id || '',
        employment_status: employee?.employment_status || 'full-time',
        date_of_birth: employee?.date_of_birth || '',
        hire_date: employee?.hire_date || '',
        salary: employee?.salary || '',
        address: employee?.address || '',
        emergency_contact_name: employee?.emergency_contact_name || '',
        emergency_contact_phone: employee?.emergency_contact_phone || ''
    });

    const [availablePositions, setAvailablePositions] = useState(
        positions.filter(p => p.department_id === data.department_id)
    );

    const handleDepartmentChange = (departmentId) => {
        setData(data => ({
            ...data,
            department_id: departmentId,
            position_id: ''
        }));
        setAvailablePositions(positions.filter(p => p.department_id === departmentId));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted with data:', data);
        
        if (employee) {
            put(route('employees.update', employee.id), {
                onSuccess: () => {
                    console.log('Employee updated successfully');
                    reset();
                    onClose();
                },
                onError: (errors) => {
                    console.error('Update errors:', errors);
                }
            });
        } else {
            post(route('employees.store'), {
                onSuccess: () => {
                    console.log('Employee created successfully');
                    reset();
                    onClose();
                },
                onError: (errors) => {
                    console.error('Creation errors:', errors);
                }
            });
        }
    };

    useEffect(() => {
        if (data.department_id) {
            setAvailablePositions(positions.filter(p => p.department_id === parseInt(data.department_id)));
        }
    }, [data.department_id]);

    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl">
            <form onSubmit={handleSubmit} className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-6">
                    {employee ? 'Edit Employee' : 'Add New Employee'}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <div className="sm:col-span-2">
                        <h3 className="text-md font-medium text-gray-700 mb-4">Personal Information</h3>
                    </div>

                    <div>
                        <InputLabel htmlFor="first_name" value="First Name" />
                        <TextInput
                            id="first_name"
                            type="text"
                            className="mt-1 block w-full"
                            value={data.first_name}
                            onChange={e => setData('first_name', e.target.value)}
                        />
                        <InputError message={errors.first_name} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="last_name" value="Last Name" />
                        <TextInput
                            id="last_name"
                            type="text"
                            className="mt-1 block w-full"
                            value={data.last_name}
                            onChange={e => setData('last_name', e.target.value)}
                        />
                        <InputError message={errors.last_name} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="date_of_birth" value="Date of Birth" />
                        <TextInput
                            id="date_of_birth"
                            type="date"
                            className="mt-1 block w-full"
                            value={data.date_of_birth}
                            onChange={e => setData('date_of_birth', e.target.value)}
                        />
                        <InputError message={errors.date_of_birth} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="email" value="Email" />
                        <TextInput
                            id="email"
                            type="email"
                            className="mt-1 block w-full"
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="phone" value="Phone" />
                        <TextInput
                            id="phone"
                            type="tel"
                            className="mt-1 block w-full"
                            value={data.phone}
                            onChange={e => setData('phone', e.target.value)}
                        />
                        <InputError message={errors.phone} className="mt-2" />
                    </div>

                    <div className="sm:col-span-2">
                        <InputLabel htmlFor="address" value="Address" />
                        <TextInput
                            id="address"
                            type="text"
                            className="mt-1 block w-full"
                            value={data.address}
                            onChange={e => setData('address', e.target.value)}
                        />
                        <InputError message={errors.address} className="mt-2" />
                    </div>

                    {/* Employment Information */}
                    <div className="sm:col-span-2">
                        <h3 className="text-md font-medium text-gray-700 mb-4">Employment Information</h3>
                    </div>

                    <div>
                        <InputLabel htmlFor="department_id" value="Department" />
                        <SelectInput
                            id="department_id"
                            className="mt-1 block w-full"
                            value={data.department_id}
                            onChange={e => handleDepartmentChange(e.target.value)}
                        >
                            <option value="">Select Department</option>
                            {departments.map(dept => (
                                <option key={dept.id} value={dept.id}>{dept.name}</option>
                            ))}
                        </SelectInput>
                        <InputError message={errors.department_id} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="position_id" value="Position" />
                        <SelectInput
                            id="position_id"
                            className="mt-1 block w-full"
                            value={data.position_id}
                            onChange={e => setData('position_id', e.target.value)}
                        >
                            <option value="">Select Position</option>
                            {availablePositions.map(pos => (
                                <option key={pos.id} value={pos.id}>{pos.title}</option>
                            ))}
                        </SelectInput>
                        <InputError message={errors.position_id} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="employment_status" value="Employment Status" />
                        <SelectInput
                            id="employment_status"
                            className="mt-1 block w-full"
                            value={data.employment_status}
                            onChange={e => setData('employment_status', e.target.value)}
                        >
                            <option value="full-time">Full Time</option>
                            <option value="part-time">Part Time</option>
                            <option value="contract">Contract</option>
                        </SelectInput>
                        <InputError message={errors.employment_status} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="hire_date" value="Hire Date" />
                        <TextInput
                            id="hire_date"
                            type="date"
                            className="mt-1 block w-full"
                            value={data.hire_date}
                            onChange={e => setData('hire_date', e.target.value)}
                        />
                        <InputError message={errors.hire_date} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="salary" value="Salary" />
                        <TextInput
                            id="salary"
                            type="number"
                            step="0.01"
                            className="mt-1 block w-full"
                            value={data.salary}
                            onChange={e => setData('salary', e.target.value)}
                        />
                        <InputError message={errors.salary} className="mt-2" />
                    </div>

                    {/* Emergency Contact */}
                    <div className="sm:col-span-2">
                        <h3 className="text-md font-medium text-gray-700 mb-4">Emergency Contact</h3>
                    </div>

                    <div>
                        <InputLabel htmlFor="emergency_contact_name" value="Contact Name" />
                        <TextInput
                            id="emergency_contact_name"
                            type="text"
                            className="mt-1 block w-full"
                            value={data.emergency_contact_name}
                            onChange={e => setData('emergency_contact_name', e.target.value)}
                        />
                        <InputError message={errors.emergency_contact_name} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="emergency_contact_phone" value="Contact Phone" />
                        <TextInput
                            id="emergency_contact_phone"
                            type="tel"
                            className="mt-1 block w-full"
                            value={data.emergency_contact_phone}
                            onChange={e => setData('emergency_contact_phone', e.target.value)}
                        />
                        <InputError message={errors.emergency_contact_phone} className="mt-2" />
                    </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                    <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
                    <PrimaryButton type="submit" disabled={processing}>
                        {processing ? 'Saving...' : 'Save'}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
} 