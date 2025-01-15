import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect, useCallback } from 'react';
import StudentList from '@/Components/Students/StudentList';
import { 
    FaSearch, FaFilter, FaPlus, FaFileImport, 
    FaFileExport, FaPrint, FaTable, FaThLarge 
} from 'react-icons/fa';
import { router } from '@inertiajs/react';
import debounce from 'lodash/debounce';
import StudentForm from '@/Components/Students/StudentForm';

export default function StudentManagement({ students = { data: [] }, filters = {}, classes = [] }) {
    const [activeTab, setActiveTab] = useState(filters?.tab || 'all');
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');
    const [selectedClass, setSelectedClass] = useState(filters?.class || 'all');
    const [viewMode, setViewMode] = useState('grid');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);

    const handleSearch = useCallback(
        debounce((query) => {
            router.get(route('students.index'), { search: query, class: selectedClass, tab: activeTab }, {
                preserveState: true,
                preserveScroll: true,
                replace: true
            });
        }, 300),
        [selectedClass, activeTab]
    );

    useEffect(() => {
        handleSearch(searchQuery);
    }, [searchQuery]);

    useEffect(() => {
        router.get(route('students.index'), { 
            search: searchQuery, 
            class: selectedClass, 
            tab: activeTab,
            page: new URLSearchParams(window.location.search).get('page') || '1'
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true
        });
    }, [selectedClass, activeTab]);

    const tabs = [
        { key: 'all', label: 'All Students' },
        { key: 'active', label: 'Active' },
        { key: 'special-ed', label: 'Special Education' },
        { key: 'pending', label: 'Pending Assessment' },
        { key: 'archived', label: 'Archived' }
    ];

    const handleEdit = (student) => {
        setEditingStudent(student);
        setIsFormOpen(true);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">
                            Student Management
                        </h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Manage and track student information
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button 
                            onClick={() => setIsFormOpen(true)}
                            className="inline-flex items-center px-2.5 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <FaPlus className="mr-1.5 h-4 w-4" />
                            New Student
                        </button>
                        <div className="flex items-center space-x-1">
                            <button className="inline-flex items-center p-1.5 text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100">
                                <FaFileImport className="h-4 w-4" />
                            </button>
                            <button className="inline-flex items-center p-1.5 text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100">
                                <FaFileExport className="h-4 w-4" />
                            </button>
                            <button className="inline-flex items-center p-1.5 text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100">
                                <FaPrint className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button 
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-md ${viewMode === 'grid' 
                                    ? 'bg-blue-50 text-blue-600' 
                                    : 'text-gray-500 hover:bg-gray-100'}`}
                            >
                                <FaThLarge className="h-4 w-4" />
                            </button>
                            <button 
                                onClick={() => setViewMode('table')}
                                className={`p-2 rounded-md ${viewMode === 'table' 
                                    ? 'bg-blue-50 text-blue-600' 
                                    : 'text-gray-500 hover:bg-gray-100'}`}
                            >
                                <FaTable className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Student Management" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Search and Filters */}
                    <div className="mb-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                            <div className="flex-1 max-w-lg flex items-center">
                                <div className="relative flex-1">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaSearch className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search students..."
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <select
                                    value={selectedClass}
                                    onChange={(e) => setSelectedClass(e.target.value)}
                                    className="ml-3 w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-sm"
                                >
                                    <option value="all">All</option>
                                    {classes.map(classGroup => (
                                        <option key={classGroup.id} value={classGroup.id}>
                                            {classGroup.name}
                                        </option>
                                    ))}
                                </select>
                                <button className="ml-3 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                    <FaFilter className="h-4 w-4 mr-2" />
                                    Filters
                                </button>
                            </div>
                            <div className="flex items-center space-x-2">
                                {/* View toggle buttons here */}
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="mb-6 border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            <Link 
                                href={route('students.index')}
                                className={`border-b-2 py-4 px-1 text-sm font-medium ${
                                    route().current('students.index') ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Students
                            </Link>
                            <Link 
                                href={route('classes.index')}
                                className={`border-b-2 py-4 px-1 text-sm font-medium ${
                                    route().current('classes.index') ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Classes
                            </Link>
                        </nav>
                    </div>

                    {/* Content Area */}
                    <div className="mt-6">
                        <StudentList 
                            students={students} 
                            viewMode={viewMode}
                            onEdit={handleEdit}
                        />
                    </div>
                </div>
            </div>

            <StudentForm 
                isOpen={isFormOpen}
                onClose={() => {
                    setIsFormOpen(false);
                    setEditingStudent(null);
                }}
                student={editingStudent}
                classes={classes}
            />
        </AuthenticatedLayout>
    );
} 