import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { FaUsers, FaClipboardList, FaProjectDiagram, FaMoneyBill, 
         FaFileAlt, FaChartLine, FaCreditCard, FaUserTie } from 'react-icons/fa';
import { useEffect } from 'react';

const ModuleCard = ({ title, icon: Icon, description, count, color, route }) => (
    <Link href={route}>
        <div className="transform transition-all hover:scale-102 hover:shadow-xl cursor-pointer duration-300 h-full">
            <div className={`p-6 rounded-xl shadow-md bg-white border-t-4 ${color} h-full flex flex-col`}>
                <div className="flex flex-col flex-1">
                    <div className={`p-2.5 rounded-xl ${color.replace('border-', 'bg-')} bg-opacity-10 w-fit mb-3`}>
                        <Icon className={`w-5 h-5 ${color.replace('border-', 'text-')}`} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-base font-bold text-gray-900">{title}</h3>
                        <p className="mt-0.5 text-sm text-gray-600">{description}</p>
                    </div>
                    {count && (
                        <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100">
                            <span className="text-sm font-medium text-gray-600">Total</span>
                            <span className="text-base font-bold text-gray-900">{count}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </Link>
);

export default function Dashboard(props) {
    const stats = props.stats || {
        active_students: 0,
        special_ed_students: 0,
        pending_assessments: 0
    };

    const modules = [
        {
            title: 'Student Management',
            description: 'Manage students, classes, and resources',
            icon: FaUsers,
            color: 'border-blue-500',
            count: `${stats.active_students} Active Students`,
            route: route('students.index')
        },
        {
            title: 'Attendance',
            description: 'Track attendance and leaves',
            icon: FaClipboardList,
            color: 'border-green-500',
            count: `${stats?.attendance_rate ?? 0}% This Month`,
            route: route('attendance.index')
        },
        {
            title: 'Project Management',
            description: 'Monitor projects and tasks',
            icon: FaProjectDiagram,
            color: 'border-purple-500',
            count: `${stats?.active_projects ?? 0} Projects`,
            route: '#'
        },
        {
            title: 'Grants Management',
            description: 'Track grants and funding',
            icon: FaMoneyBill,
            color: 'border-yellow-500',
            count: `${stats.active_grants || 0} Active Grants`,
            route: route('grants.index')
        },
        {
            title: 'Documents',
            description: 'Manage and organize documents',
            icon: FaFileAlt,
            color: 'border-red-500',
            count: `${stats?.total_files ?? 0} Files`,
            route: route('documents.index')
        },
        {
            title: 'Accounts',
            description: 'Track expenses and budgets',
            icon: FaChartLine,
            color: 'border-indigo-500',
            count: `${stats?.total_expenses ?? 0}`,
            route: '#'
        },
        {
            title: 'Payroll',
            description: 'Manage salaries and benefits',
            icon: FaCreditCard,
            color: 'border-pink-500',
            count: `${stats?.pending_payments ?? 0} Pending Payments`,
            route: route('payroll.index')
        },
        {
            title: 'Employee Management',
            description: 'Manage staff and personnel',
            icon: FaUserTie,
            color: 'border-teal-500',
            count: `${stats?.total_employees ?? 0} Employees`,
            route: route('employees.index')
        }
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold leading-tight text-gray-900">
                        Dashboard
                    </h2>
                    <div className="flex space-x-3">
                        <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Export Report
                        </button>
                        <button className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
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
                        {modules.map((module, index) => (
                            <ModuleCard key={index} {...module} />
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
