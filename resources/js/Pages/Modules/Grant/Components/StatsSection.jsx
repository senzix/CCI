import { formatCurrency } from '@/utils';

export default function StatsSection({ stats = {
    total_grants: 0,
    active_grants: 0,
    total_amount: 0,
    received_amount: 0
} }) {
    const statItems = [
        {
            name: 'Total Grants',
            value: stats.total_grants,
            textColor: 'text-primary-700',
            bgColor: 'bg-primary-50',
        },
        {
            name: 'Active Grants',
            value: stats.active_grants,
            textColor: 'text-primary-600',
            bgColor: 'bg-primary-50',
        },
        {
            name: 'Total Amount',
            value: formatCurrency(stats.total_amount),
            textColor: 'text-secondary-600',
            bgColor: 'bg-secondary-50',
        },
        {
            name: 'Received Amount',
            value: formatCurrency(stats.received_amount),
            textColor: 'text-secondary-700',
            bgColor: 'bg-secondary-50',
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {statItems.map((item) => (
                <div
                    key={item.name}
                    className={`${item.bgColor} px-3 py-4 rounded-lg overflow-hidden`}
                >
                    <dt className="text-xs font-medium text-gray-500 truncate">
                        {item.name}
                    </dt>
                    <dd className={`mt-1 text-xl font-semibold ${item.textColor}`}>
                        {item.value}
                    </dd>
                </div>
            ))}
        </div>
    );
} 