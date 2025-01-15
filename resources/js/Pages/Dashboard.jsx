import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { FaUsers, FaClipboardList, FaProjectDiagram, FaMoneyBill, 
         FaFileAlt, FaChartLine, FaCreditCard } from 'react-icons/fa';

const ModuleCard = ({ title, icon: Icon, description, count, color, route }) => (
    <Link href={route}>
        <div className="transform transition-all hover:scale-105 cursor-pointer">
            <div className={`p-6 rounded-lg shadow-lg bg-white border-l-4 ${color}`}>
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                        <p className="mt-2 text-sm text-gray-600">{description}</p>
                        {count && (
                            <p className="mt-4 text-2xl font-bold text-gray-800">{count}</p>
                        )}
                    </div>
                    <div className={`p-3 rounded-full ${color.replace('border-', 'bg-')} bg-opacity-10`}>
                        <Icon className={`w-8 h-8 ${color.replace('border-', 'text-')}`} />
                    </div>
                </div>
            </div>
        </div>
    </Link>
);

export default function Dashboard() {
    const modules = [
        {
            title: 'Student Management',
            description: 'Manage students, classes, and resources',
            icon: FaUsers,
            color: 'border-blue-500',
            count: '24 Active Students',
            route: route('students.index')
        },
        {
            title: 'Attendance',
            description: 'Track attendance and leaves',
            icon: FaClipboardList,
            color: 'border-green-500',
            count: '98% This Month',
            route: '#'
        },
        {
            title: 'Project Management',
            description: 'Monitor projects and tasks',
            icon: FaProjectDiagram,
            color: 'border-purple-500',
            count: '12 Projects',
            route: '#'
        },
        {
            title: 'Grants Management',
            description: 'Track grants and funding',
            icon: FaMoneyBill,
            color: 'border-yellow-500',
            count: '5 Active Grants',
            route: route('grants.index')
        },
        {
            title: 'Documents',
            description: 'Manage and organize documents',
            icon: FaFileAlt,
            color: 'border-red-500',
            count: '156 Files',
            route: route('documents.index')
        },
        {
            title: 'Accounts',
            description: 'Track expenses and budgets',
            icon: FaChartLine,
            color: 'border-indigo-500',
            count: null,
            route: '#'
        },
        {
            title: 'Payroll',
            description: 'Manage salaries and benefits',
            icon: FaCreditCard,
            color: 'border-pink-500',
            count: null,
            route: '#'
        }
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Dashboard
                    </h2>
                    <div className="flex space-x-2">
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded text-sm">
                            Generate Report
                        </button>
                        <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-sm">
                            Settings
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {modules.map((module, index) => (
                            <ModuleCard key={index} {...module} />
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
