import { useState, useEffect, useRef } from 'react';
import { useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';
import SecondaryButton from '@/Components/SecondaryButton';

export default function StudentForm({ isOpen, onClose, student = null, classes = [] }) {
    const photoInput = useRef();
    const [photoPreview, setPhotoPreview] = useState(null);
    
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        registration_number: '',
        student_class_id: '',
        class_assignment_start_date: new Date().toISOString().split('T')[0],
        special_needs_category: '',
        special_requirements: '',
        status: 'active',
        date_of_birth: '',
        guardian_name: '',
        guardian_contact: '',
        guardian_email: '',
        photo: null,
    });

    const generateRegistrationNumber = async () => {
        try {
            const response = await fetch(route('students.generate-registration'));
            const registrationNumber = await response.text();
            setData('registration_number', registrationNumber);
        } catch (error) {
            console.error('Failed to generate registration number:', error);
        }
    };

    useEffect(() => {
        if (isOpen && !student) {
            generateRegistrationNumber();
        }
    }, [isOpen]);

    useEffect(() => {
        if (student) {
            setData({
                name: student.name || '',
                registration_number: student.registration_number || '',
                student_class_id: student.student_class_id?.toString() || '',
                class_assignment_start_date: student.class_assignment_start_date || new Date().toISOString().split('T')[0],
                special_needs_category: student.special_needs_category || '',
                special_requirements: student.special_requirements || '',
                status: student.status || 'active',
                date_of_birth: student.date_of_birth || '',
                guardian_name: student.guardian_name || '',
                guardian_contact: student.guardian_contact || '',
                guardian_email: student.guardian_email || '',
                photo: null,
                _method: 'PUT'
            });
        } else {
            reset();
        }
    }, [student]);

    useEffect(() => {
        if (!isOpen) {
            setPhotoPreview(null);
            reset();
        }
    }, [isOpen, student]);

    const statusOptions = [
        { value: 'active', label: 'Active' },
        { value: 'pending', label: 'Pending Assessment' },
        { value: 'archived', label: 'Archived' },
    ];

    const specialNeedsOptions = [
        { value: '', label: 'None' },
        { value: 'Autism', label: 'Autism' },
        { value: 'ADHD', label: 'ADHD' },
        { value: 'Dyslexia', label: 'Dyslexia' },
        { value: 'Physical', label: 'Physical Disability' },
    ];

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        
        // Preserve existing data while updating the photo
        setData(prevData => ({
            ...prevData,
            photo: file
        }));
        
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setPhotoPreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        
        // Append all form fields
        formData.append('name', data.name);
        formData.append('registration_number', data.registration_number);
        formData.append('student_class_id', data.student_class_id);
        formData.append('class_assignment_start_date', data.class_assignment_start_date);
        formData.append('special_needs_category', data.special_needs_category);
        formData.append('special_requirements', data.special_requirements);
        formData.append('status', data.status);
        formData.append('date_of_birth', data.date_of_birth);
        formData.append('guardian_name', data.guardian_name);
        formData.append('guardian_contact', data.guardian_contact);
        formData.append('guardian_email', data.guardian_email || '');
        
        if (data.photo) {
            formData.append('photo', data.photo);
        }

        if (student) {
            formData.append('_method', 'PUT');
            post(route('students.update', student.id), formData, {
                onSuccess: () => {
                    onClose();
                    reset();
                },
                preserveScroll: true,
                forceFormData: true,
            });
        } else {
            post(route('students.store'), formData, {
                onSuccess: () => {
                    onClose();
                    reset();
                },
                preserveScroll: true,
                forceFormData: true,
            });
        }
    };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="2xl">
            <form onSubmit={handleSubmit} className="p-6">
                <h2 className="text-lg font-medium text-gray-900">
                    {student ? 'Edit Student' : 'Add New Student'}
                </h2>

                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                    <div>
                        <InputLabel htmlFor="name" value="Full Name" />
                        <TextInput
                            id="name"
                            type="text"
                            className="mt-1 block w-full"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="registration_number" value="Registration Number" />
                        <TextInput
                            id="registration_number"
                            type="text"
                            className="mt-1 block w-full"
                            value={data.registration_number}
                            onChange={(e) => setData('registration_number', e.target.value)}
                            placeholder="Registration Number"
                        />
                        <InputError message={errors.registration_number} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="student_class_id" value="Class" />
                        <select
                            id="student_class_id"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            value={data.student_class_id}
                            onChange={e => setData('student_class_id', e.target.value)}
                        >
                            <option value="">Select a class</option>
                            {Array.isArray(classes) && classes.map(classItem => (
                                <option key={classItem.id} value={classItem.id}>
                                    {classItem.name}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.student_class_id} className="mt-2" />
                    </div>

                    <div className="sm:col-span-2">
                        <InputLabel htmlFor="class_assignment_start_date" value="Class Start Date" />
                        <TextInput
                            id="class_assignment_start_date"
                            type="date"
                            className="mt-1 block w-full"
                            value={data.class_assignment_start_date || new Date().toISOString().split('T')[0]}
                            onChange={(e) => setData('class_assignment_start_date', e.target.value)}
                        />
                        <InputError message={errors.class_assignment_start_date} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="status" value="Status" />
                        <SelectInput
                            id="status"
                            className="mt-1 block w-full"
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value)}
                            options={statusOptions}
                        />
                        <InputError message={errors.status} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="date_of_birth" value="Date of Birth" />
                        <TextInput
                            id="date_of_birth"
                            type="date"
                            className="mt-1 block w-full"
                            value={data.date_of_birth}
                            onChange={(e) => setData('date_of_birth', e.target.value)}
                        />
                        <InputError message={errors.date_of_birth} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="special_needs_category" value="Special Needs Category" />
                        <SelectInput
                            id="special_needs_category"
                            className="mt-1 block w-full"
                            value={data.special_needs_category}
                            onChange={(e) => setData('special_needs_category', e.target.value)}
                            options={specialNeedsOptions}
                        />
                        <InputError message={errors.special_needs_category} className="mt-2" />
                    </div>

                    <div className="sm:col-span-2">
                        <InputLabel htmlFor="special_requirements" value="Special Requirements" />
                        <textarea
                            id="special_requirements"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            rows="3"
                            value={data.special_requirements}
                            onChange={(e) => setData('special_requirements', e.target.value)}
                        />
                        <InputError message={errors.special_requirements} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="guardian_name" value="Guardian Name" />
                        <TextInput
                            id="guardian_name"
                            type="text"
                            className="mt-1 block w-full"
                            value={data.guardian_name}
                            onChange={(e) => setData('guardian_name', e.target.value)}
                        />
                        <InputError message={errors.guardian_name} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="guardian_contact" value="Guardian Contact" />
                        <TextInput
                            id="guardian_contact"
                            type="text"
                            className="mt-1 block w-full"
                            value={data.guardian_contact}
                            onChange={(e) => setData('guardian_contact', e.target.value)}
                        />
                        <InputError message={errors.guardian_contact} className="mt-2" />
                    </div>

                    <div className="sm:col-span-2">
                        <InputLabel htmlFor="guardian_email" value="Guardian Email" />
                        <TextInput
                            id="guardian_email"
                            type="email"
                            className="mt-1 block w-full"
                            value={data.guardian_email}
                            onChange={(e) => setData('guardian_email', e.target.value)}
                        />
                        <InputError message={errors.guardian_email} className="mt-2" />
                    </div>

                    <div className="mb-4">
                        <InputLabel value="Photo" />
                        <div className="mt-2 flex items-center space-x-4">
                            {photoPreview ? (
                                <img src={photoPreview} className="h-20 w-20 rounded-full object-cover" />
                            ) : student?.photo_path ? (
                                <img src={`/storage/${student.photo_path}`} className="h-20 w-20 rounded-full object-cover" />
                            ) : (
                                <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center">
                                    <span className="text-2xl text-gray-500">{data.name?.charAt(0) || '?'}</span>
                                </div>
                            )}
                            <SecondaryButton onClick={() => photoInput.current.click()}>
                                Change Photo
                            </SecondaryButton>
                            <input
                                type="file"
                                ref={photoInput}
                                className="hidden"
                                onChange={handlePhotoChange}
                                accept="image/*"
                            />
                        </div>
                        <InputError message={errors.photo} className="mt-2" />
                    </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
                    >
                        {processing ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </form>
        </Modal>
    );
} 