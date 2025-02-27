import { Link } from '@inertiajs/react';
import { formatCurrency, formatDate } from '@/utils';

export default function GrantList({ grants = { data: [] }, onEdit }) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Grant Details
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Funding
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Timeline
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {grants.data.map((grant) => (
                        <tr key={grant.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">
                                            {grant.title}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {grant.reference_number}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                    {formatCurrency(grant.amount)}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {grant.funding_agency}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                    {formatDate(grant.start_date)}
                                </div>
                                <div className="text-sm text-gray-500">
                                    to {formatDate(grant.end_date)}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    grant.status === 'active' ? 'bg-primary-100 text-primary-800' :
                                    grant.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    grant.status === 'rejected' ? 'bg-secondary-100 text-secondary-800' :
                                    'bg-gray-100 text-gray-800'
                                }`}>
                                    {grant.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Link
                                    href={route('grants.show', grant.id)}
                                    className="text-sm text-primary-600 hover:text-primary-700 mr-3"
                                >
                                    View
                                </Link>
                                <button
                                    onClick={() => onEdit(grant)}
                                    className="text-sm text-indigo-600 hover:text-indigo-900"
                                >
                                    Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {grants.data.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-sm">No grants found</p>
                </div>
            )}
        </div>
    );
} 