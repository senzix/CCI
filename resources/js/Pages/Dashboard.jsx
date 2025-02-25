import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { FaProjectDiagram, FaFileAlt, FaUserTie, FaUserGraduate, FaHandHoldingUsd } from 'react-icons/fa';

const ModuleCard = ({ title, icon: Icon, description, count, route }) => (
    <Link href={route}>
        <div className="transform transition-all hover:scale-102 hover:shadow-xl cursor-pointer duration-300 h-full">
            <div className="p-6 rounded-xl shadow-md bg-white border-t-4 border-primary-500 h-full flex flex-col">
                <div className="flex flex-col flex-1">
                    <div className="p-2.5 rounded-xl bg-primary-100 w-fit mb-3">
                        <Icon className="w-5 h-5 text-secondary-600" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-base font-bold text-gray-900">{title}</h3>
                        <p className="mt-0.5 text-sm text-gray-600">{description}</p>
                    </div>
                    {count && (
                        <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100">
                            <span className="text-sm font-medium text-gray-600">Total</span>
                            <span className="text-base font-bold text-secondary-600">{count}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </Link>
);

export default function Dashboard({ auth, stats }) {
    const canAccess = (permission) => {
        if (!permission) return true; // If no permission required, show the module
        if (auth.user.is_admin) return true; // Admin can access everything
        return auth.user.permissions.includes(permission);
    };

    const modules = [
        {
            title: 'Students',
            description: 'Manage student records',
            icon: FaUserGraduate,
            color: 'border-blue-500',
            count: `${stats?.active_students ?? 0} Active Students`,
            route: route('students.index'),
            permission: 'students.view'
        },
        {
            title: 'Documents',
            description: 'Manage documents and files',
            icon: FaFileAlt,
            color: 'border-yellow-500',
            count: `${stats?.total_documents ?? 0} Documents`,
            route: route('documents.index'),
            permission: 'documents.view'
        },
        {
            title: 'Grants',
            description: 'Manage grants and funding',
            icon: FaHandHoldingUsd,
            color: 'border-green-500',
            count: `${stats?.active_grants ?? 0} Active Grants`,
            route: route('grants.index'),
            permission: 'grants.view'
        },
        {
            title: 'Projects',
            description: 'Manage research projects and activities',
            icon: FaProjectDiagram,
            color: 'border-purple-500',
            count: `${stats?.active_projects ?? 0} Active Projects`,
            route: route('projects.index'),
            permission: 'projects.view'
        },
        {
            title: 'Employee Management',
            description: 'Manage staff and personnel',
            icon: FaUserTie,
            color: 'border-teal-500',
            count: `${stats?.total_employees ?? 0} Employees`,
            route: route('employees.index'),
            permission: 'employees.view'
        }
    ];

    const accessibleModules = modules.filter(module => canAccess(module.permission));

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold leading-tight text-gray-900">
                        Dashboard
                    </h2>
                    <div className="flex space-x-3">
                        <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Export Report
                        </button>
                        <button className="inline-flex items-center px-4 py-2 bg-secondary-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            New Entry
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                        {accessibleModules.map((module, index) => (
                            <ModuleCard key={index} {...module} />
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
