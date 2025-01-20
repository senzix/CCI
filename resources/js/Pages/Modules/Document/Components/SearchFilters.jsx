import { router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import TextInput from '@/Components/TextInput';
import { FaSearch, FaFilter } from 'react-icons/fa';
import AdvancedSearch from './AdvancedSearch';

export default function SearchFilters({ filters = {}, categories = [] }) {
    const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
    const [values, setValues] = useState({
        search: filters?.search || '',
        category: filters?.category || 'all',
        type: filters?.type || 'all',
        date_from: filters?.date_from || '',
        date_to: filters?.date_to || '',
        include_grants: filters?.include_grants || false
    });

    const fileTypes = [
        { value: 'all', label: 'All Types' },
        { value: 'pdf', label: 'PDF Documents' },
        { value: 'docx', label: 'Word & Text Documents' },
        { value: 'xlsx', label: 'Spreadsheets' },
        { value: 'ppt', label: 'Presentations' },
        { value: 'jpg', label: 'Images' },
        { value: 'txt', label: 'Text Files' },
        { value: 'zip', label: 'Archives' }
    ];

    const categoryOptions = [
        { value: 'all', label: 'All Categories' },
        ...categories.map(category => ({
            value: category.id.toString(),
            label: category.name
        }))
    ];

    useEffect(() => {
        const debounceId = setTimeout(() => {
            router.get(
                route('documents.index'),
                { 
                    ...values,
                    category: values.category === 'all' ? null : values.category,
                    type: values.type === 'all' ? null : values.type,
                    date_from: values.date_from || null,
                    date_to: values.date_to || null,
                    include_grants: filters.include_grants
                },
                { 
                    preserveState: true, 
                    preserveScroll: true,
                    only: ['documents']
                }
            );
        }, 300);

        return () => clearTimeout(debounceId);
    }, [values, filters.include_grants]);

    return (
        <div className="p-3 border-b border-gray-200">
            <div className="flex items-center gap-2">
                <div className="relative flex-1">
                    <FaSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3" />
                    <TextInput
                        type="text"
                        placeholder="Search documents..."
                        className="w-full pl-8 pr-3 py-1.5 text-sm"
                        value={values.search}
                        onChange={e => setValues({ ...values, search: e.target.value })}
                    />
                </div>
                
                <select
                    value={values.category}
                    onChange={e => setValues({ ...values, category: e.target.value })}
                    className="mt-1 block w-40 border-gray-300 rounded-md shadow-sm 
                        focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50
                        text-gray-700 text-sm
                        bg-white
                        appearance-none cursor-pointer
                        pl-3 pr-10 py-1.5
                        hover:border-gray-400 transition-colors duration-200"
                    style={{
                        backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                        backgroundPosition: 'right 0.5rem center',
                        backgroundSize: '1.5em 1.5em',
                        backgroundRepeat: 'no-repeat'
                    }}
                >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                        <option 
                            key={category.id} 
                            value={category.id}
                        >
                            {category.name}
                        </option>
                    ))}
                </select>

                <select
                    value={values.type}
                    onChange={e => setValues({ ...values, type: e.target.value })}
                    className="mt-1 block w-40 border-gray-300 rounded-md shadow-sm 
                        focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50
                        text-gray-700 text-sm
                        bg-white
                        appearance-none cursor-pointer
                        pl-3 pr-10 py-1.5
                        hover:border-gray-400 transition-colors duration-200"
                    style={{
                        backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                        backgroundPosition: 'right 0.5rem center',
                        backgroundSize: '1.5em 1.5em',
                        backgroundRepeat: 'no-repeat'
                    }}
                >
                    {fileTypes.map(type => (
                        <option 
                            key={type.value} 
                            value={type.value}
                            className="py-2 text-gray-700"
                        >
                            {type.label}
                        </option>
                    ))}
                </select>

                <button
                    onClick={() => setIsAdvancedSearchOpen(true)}
                    className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50"
                >
                    <FaFilter className="mr-1.5 h-3 w-3" />
                    Advanced
                </button>
            </div>

            <AdvancedSearch 
                isOpen={isAdvancedSearchOpen}
                onClose={() => setIsAdvancedSearchOpen(false)}
                filters={filters}
                categories={categories}
            />
        </div>
    );
} 