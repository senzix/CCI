import { FaUserCheck, FaUserTimes, FaClock, FaCalendarCheck } from 'react-icons/fa';

export default function AttendanceStats({ stats }) {
    const statCards = [
        {
            title: 'Present Today',
            value: stats.present_today,
            icon: FaUserCheck,
            color: 'text-green-600',
            bgColor: 'bg-green-100'
        },
        {
            title: 'Absent Today',
            value: stats.absent_today,
            icon: FaUserTimes,
            color: 'text-red-600',
            bgColor: 'bg-red-100'
        },
        {
            title: 'Attendance Rate',
            value: `${stats.attendance_rate}%`,
            icon: FaClock,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-100'
        },
        {
            title: 'On Leave',
            value: stats.on_leave,
            icon: FaCalendarCheck,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100'
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