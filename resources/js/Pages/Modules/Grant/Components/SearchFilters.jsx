import { router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';

export default function SearchFilters({ filters = {
    search: '',
    status: 'all',
    category: 'all'
}, categories = [] }) {
    const [values, setValues] = useState({
        search: filters.search || '',
        status: filters.status || 'all',
        category: filters.category || 'all',
    });

    useEffect(() => {
        const debounceId = setTimeout(() => {
            router.get(
                route('grants.index'),
                values,
                { preserveState: true, preserveScroll: true }
            );
        }, 300);

        return () => clearTimeout(debounceId);
    }, [values]);

    const statusOptions = [
        { value: 'all', label: 'All Statuses' },
        { value: 'draft', label: 'Draft' },
        { value: 'submitted', label: 'Submitted' },
        { value: 'approved', label: 'Approved' },
        { value: 'rejected', label: 'Rejected' },
        { value: 'active', label: 'Active' },
        { value: 'completed', label: 'Completed' },
    ];

    const categoryOptions = [
        { value: 'all', label: 'All Categories' },
        ...categories.map(category => ({
            value: category.id,
            label: category.name
        }))
    ];

    return (
        <div className="p-4 border-b border-gray-200 bg-white sm:rounded-t-lg">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                    <TextInput
                        type="text"
                        placeholder="Search grants..."
                        className="w-full"
                        value={values.search}
                        onChange={e => setValues({ ...values, search: e.target.value })}
                    />
                </div>
                <div>
                    <SelectInput
                        className="w-full"
                        value={values.status}
                        onChange={e => setValues({ ...values, status: e.target.value })}
                        options={statusOptions}
                    />
                </div>
                <div>
                    <SelectInput
                        className="w-full"
                        value={values.category}
                        onChange={e => setValues({ ...values, category: e.target.value })}
                        options={categoryOptions}
                    />
                </div>
            </div>
        </div>
    );
} 