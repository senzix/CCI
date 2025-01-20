import { FaMoneyBillWave, FaUsers, FaCalendarAlt, FaChartLine } from 'react-icons/fa';

export default function PayrollStats({ stats }) {
    const statCards = [
        {
            title: 'Total Payroll',
            value: new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(stats.total_payroll),
            icon: FaMoneyBillWave,
            color: 'text-green-600',
            bgColor: 'bg-green-100'
        },
        {
            title: 'Active Employees',
            value: stats.active_employees,
            icon: FaUsers,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100'
        },
        {
            title: 'Current Period',
            value: stats.current_period,
            icon: FaCalendarAlt,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100'
        },
        {
            title: 'Pending Payments',
            value: stats.pending_payments,
            icon: FaChartLine,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-100'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((stat, index) => (
                <div
                    key={index}
                    className="bg-white overflow-hidden shadow rounded-lg"
                >
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className={`flex-shrink-0 ${stat.bgColor} rounded-md p-3`}>
                                <stat.icon className={`h-6 w-6 ${stat.color}`} />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        {stat.title}
                                    </dt>
                                    <dd className="flex items-baseline">
                                        <div className="text-2xl font-semibold text-gray-900">
                                            {stat.value}
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
} 