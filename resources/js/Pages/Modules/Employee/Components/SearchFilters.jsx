import { router } from '@inertiajs/react';
import { useState, useCallback } from 'react';
import debounce from 'lodash/debounce';
import { FaSearch, FaFilter } from 'react-icons/fa';

export default function SearchFilters({ filters, departments }) {
    const [values, setValues] = useState({
        search: filters.search || '',
        department: filters.department || '',
        status: filters.status || '',
    });

    const debouncedSearch = useCallback(
        debounce((query) => {
            router.get(
                route('employees.index'),
                { ...values, search: query },
                { preserveState: true, preserveScroll: true }
            );
        }, 300),
        [values]
    );

    const handleSearch = (e) => {
        const query = e.target.value;
        setValues(values => ({ ...values, search: query }));
        debouncedSearch(query);
    };

    const handleFilter = (field, value) => {
        const newValues = { ...values, [field]: value };
        setValues(newValues);
        router.get(
            route('employees.index'),
            newValues,
            { preserveState: true, preserveScroll: true }
        );
    };

    return (
        <div className="p-4 border-b border-gray-200 bg-white sm:rounded-t-lg">
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="flex-1">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Search employees..."
                            value={values.search}
                            onChange={handleSearch}
                        />
                    </div>
                </div>

                <div className="flex space-x-4">
                    <select
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        value={values.department}
                        onChange={(e) => handleFilter('department', e.target.value)}
                    >
                        <option value="">All Departments</option>
                        {departments.map((department) => (
                            <option key={department.id} value={department.id}>
                                {department.name}
                            </option>
                        ))}
                    </select>

                    <select
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        value={values.status}
                        onChange={(e) => handleFilter('status', e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        <option value="full-time">Full Time</option>
                        <option value="part-time">Part Time</option>
                        <option value="contract">Contract</option>
                    </select>
                </div>
            </div>
        </div>
    );
} 