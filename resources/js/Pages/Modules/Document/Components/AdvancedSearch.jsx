import { useState, Fragment } from 'react';
import { Dialog, Transition, Popover } from '@headlessui/react';
import { router } from '@inertiajs/react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export default function AdvancedSearch({ isOpen, onClose, filters, categories }) {
    const [values, setValues] = useState({
        search: filters.search || '',
        date_from: filters.date_from ? new Date(filters.date_from) : null,
        date_to: filters.date_to ? new Date(filters.date_to) : null,
        size_min: filters.size_min || '',
        size_max: filters.size_max || '',
        sort_by: filters.sort_by || 'created_at',
        sort_direction: filters.sort_direction || 'desc',
    });

    const sortOptions = [
        { value: 'created_at', label: 'Upload Date' },
        { value: 'title', label: 'Title' },
        { value: 'file_size', label: 'File Size' },
        { value: 'file_name', label: 'File Name' },
    ];

    const handleSearch = () => {
        // Format dates for SQL date comparison
        const formattedDates = {
            date_from: values.date_from ? values.date_from.toISOString().split('T')[0] : null,
            date_to: values.date_to ? values.date_to.toISOString().split('T')[0] : null
        };

        router.get(route('documents.index'), {
            ...values,
            date_from: formattedDates.date_from,
            date_to: formattedDates.date_to,
            sort_by: values.sort_by,
            sort_direction: values.sort_direction,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
        onClose();
    };

    const handleClear = () => {
        setValues({
            search: '',
            date_from: null,
            date_to: null,
            size_min: '',
            size_max: '',
            sort_by: 'created_at',
            sort_direction: 'desc',
        });

        router.get(route('documents.index'), {
            sort_by: 'created_at',
            sort_direction: 'desc',
        }, {
            preserveState: true,
            preserveScroll: true,
        });
        onClose();
    };

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog onClose={onClose} className="relative z-50">
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500/75" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-visible rounded-lg bg-white p-4 shadow-xl transition-all">
                                <Dialog.Title className="text-sm font-medium text-gray-900 mb-3">
                                    Advanced Search
                                </Dialog.Title>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="relative z-[60]">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Date From
                                            </label>
                                            <DatePicker
                                                selected={values.date_from}
                                                onChange={date => setValues({ ...values, date_from: date })}
                                                className="w-full rounded-md border-gray-300"
                                                dateFormat="yyyy-MM-dd"
                                                popperClassName="z-[65]"
                                                popperPlacement="bottom-start"
                                            />
                                        </div>

                                        <div className="relative z-[60]">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Date To
                                            </label>
                                            <DatePicker
                                                selected={values.date_to}
                                                onChange={date => setValues({ ...values, date_to: date })}
                                                className="w-full rounded-md border-gray-300"
                                                dateFormat="yyyy-MM-dd"
                                                popperClassName="z-[65]"
                                                popperPlacement="bottom-start"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Sort By
                                        </label>
                                        <select
                                            value={values.sort_by}
                                            onChange={e => setValues({ ...values, sort_by: e.target.value })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        >
                                            {sortOptions.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Sort Direction
                                        </label>
                                        <select
                                            value={values.sort_direction}
                                            onChange={e => setValues({ ...values, sort_direction: e.target.value })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        >
                                            <option value="desc">Descending</option>
                                            <option value="asc">Ascending</option>
                                        </select>
                                    </div>

                                    <div className="flex justify-end space-x-3 mt-4">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleClear}
                                            className="px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded"
                                        >
                                            Clear
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleSearch}
                                            className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded"
                                        >
                                            Apply Filters
                                        </button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
} 