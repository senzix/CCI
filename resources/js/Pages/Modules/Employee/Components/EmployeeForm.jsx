import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import SelectInput from '@/Components/SelectInput';
import Checkbox from '@/Components/Checkbox';

export default function EmployeeForm({ show, onClose, employee = null, departments = [], positions = [], permissions = [] }) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        first_name: employee?.first_name || '',
        last_name: employee?.last_name || '',
        email: employee?.email || '',
        phone: employee?.phone || '',
        address: employee?.address || '',
        date_of_birth: employee?.date_of_birth || '',
        department_id: employee?.position?.department_id || '',
        position_id: employee?.position_id || '',
        employment_status: employee?.employment_status || '',
        hire_date: employee?.hire_date || '',
        salary: employee?.salary || '',
        emergency_contact_name: employee?.emergency_contact_name || '',
        emergency_contact_phone: employee?.emergency_contact_phone || '',
        emergency_contact_relationship: employee?.emergency_contact_relationship || '',
        permissions: employee?.user?.permissions?.map(p => p.id) || [],
    });

    const [availablePositions, setAvailablePositions] = useState([]);

    const employmentStatusOptions = [
        { value: 'full-time', label: 'Full Time' },
        { value: 'part-time', label: 'Part Time' },
        { value: 'contract', label: 'Contract' }
    ];

    const groupedPermissions = Array.isArray(permissions) ? permissions.reduce((acc, permission) => {
        if (!acc[permission.group]) {
            acc[permission.group] = [];
        }
        acc[permission.group].push(permission);
        return acc;
    }, {}) : {};

    useEffect(() => {
        if (data.department_id) {
            const departmentId = parseInt(data.department_id);
            const filteredPositions = positions.filter(
                position => position.department_id === departmentId
            );
            setAvailablePositions(filteredPositions);
        } else {
            setAvailablePositions([]);
        }
    }, [data.department_id, positions]);

    useEffect(() => {
        if (employee) {
            console.log('Setting employee data:', employee);
            setData({
                first_name: employee.first_name || '',
                last_name: employee.last_name || '',
                email: employee.email || '',
                phone: employee.phone || '',
                address: employee.address || '',
                date_of_birth: employee.date_of_birth || '',
                department_id: employee.position?.department_id || '',
                position_id: employee.position_id || '',
                employment_status: employee.employment_status || '',
                hire_date: employee.hire_date || '',
                salary: employee.salary || '',
                emergency_contact_name: employee.emergency_contact_name || '',
                emergency_contact_phone: employee.emergency_contact_phone || '',
                emergency_contact_relationship: employee.emergency_contact_relationship || '',
                permissions: employee.user?.permissions?.map(p => p.id) || [],
            });
        }
    }, [employee]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (employee) {
            put(route('employees.update', employee.id), {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        } else {
            post(route('employees.store'), {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        }
    };

    const handlePermissionChange = (permissionId) => {
        const updatedPermissions = data.permissions.includes(permissionId)
            ? data.permissions.filter(id => id !== permissionId)
            : [...data.permissions, permissionId];
        
        setData('permissions', updatedPermissions);
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="4xl">
            <form onSubmit={handleSubmit} className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-6">
                    {employee ? 'Edit Employee' : 'Add New Employee'}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Personal Information Section */}
                    <div className="col-span-full">
                        <h3 className="text-md font-medium text-gray-700 mb-4">Personal Information</h3>
                    </div>

                    <div className="space-y-4">
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
                    </div>

                    <div className="space-y-4">
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

                        <div>
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
                    </div>

                    {/* Employment Information Section */}
                    <div className="col-span-full mt-6">
                        <h3 className="text-md font-medium text-gray-700 mb-4">Employment Information</h3>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="department_id" value="Department" />
                            <SelectInput
                                id="department_id"
                                className="mt-1 block w-full"
                                value={data.department_id}
                                onChange={e => {
                                    setData('department_id', e.target.value);
                                    setData('position_id', '');
                                }}
                                options={[
                                    { value: '', label: 'Select Department' },
                                    ...(departments?.map(dept => ({
                                        value: dept.id,
                                        label: dept.name
                                    })) || [])
                                ]}
                            />
                            <InputError message={errors.department_id} className="mt-2" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="position_id" value="Position" />
                            <SelectInput
                                id="position_id"
                                className="mt-1 block w-full"
                                value={data.position_id}
                                onChange={e => setData('position_id', e.target.value)}
                                disabled={!data.department_id}
                                options={[
                                    { value: '', label: 'Select Position' },
                                    ...availablePositions.map(position => ({
                                        value: position.id,
                                        label: position.title
                                    }))
                                ]}
                            />
                            <InputError message={errors.position_id} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="employment_status" value="Employment Status" />
                            <SelectInput
                                id="employment_status"
                                className="mt-1 block w-full"
                                value={data.employment_status}
                                onChange={e => setData('employment_status', e.target.value)}
                                options={employmentStatusOptions}
                            />
                            <InputError message={errors.employment_status} className="mt-2" />
                        </div>
                    </div>

                    <div className="space-y-4">
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
                                className="mt-1 block w-full"
                                value={data.salary}
                                onChange={e => setData('salary', e.target.value)}
                            />
                            <InputError message={errors.salary} className="mt-2" />
                        </div>
                    </div>

                    {/* Emergency Contact Section */}
                    <div className="col-span-full mt-6">
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

                    {/* Password Section */}
                    <div>
                        <InputLabel htmlFor="password" value="Password (Optional)" />
                        <TextInput
                            id="password"
                            type="password"
                            className="mt-1 block w-full"
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    {/* Permissions Section */}
                    <div className="col-span-full mt-6">
                        <h3 className="text-md font-medium text-gray-700 mb-4">Permissions</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Object.entries(groupedPermissions).map(([group, groupPermissions]) => (
                                <div key={group} className="space-y-2">
                                    <h4 className="font-medium text-gray-600">{group}</h4>
                                    {groupPermissions.map((permission) => (
                                        <div key={permission.id} className="flex items-center">
                                            <Checkbox
                                                id={`permission-${permission.id}`}
                                                checked={data.permissions.includes(permission.id)}
                                                onChange={() => handlePermissionChange(permission.id)}
                                            />
                                            <label
                                                htmlFor={`permission-${permission.id}`}
                                                className="ml-2 text-sm text-gray-600"
                                            >
                                                {permission.name}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                    <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
                    <PrimaryButton type="submit" disabled={processing}>
                        {employee ? 'Update Employee' : 'Create Employee'}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
} 