import { formatCurrency, formatDate } from '@/utils';
import GrantDocuments from './GrantDocuments';

export default function GrantDetails({ grant }) {
    if (!grant) {
        return <div>Loading...</div>;
    }

    const progressPercentage = (grant.amount_received / grant.amount) * 100;

    return (
        <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">
                    {grant.title}
                </h3>
                
                <div className="mt-6 border-t border-gray-200">
                    <dl className="divide-y divide-gray-200">
                        <div className="py-4 grid grid-cols-3 gap-4">
                            <dt className="text-sm font-medium text-gray-500">Category</dt>
                            <dd className="text-sm text-gray-900 col-span-2">{grant.category?.name || 'N/A'}</dd>
                        </div>
                        
                        <div className="py-4 grid grid-cols-3 gap-4">
                            <dt className="text-sm font-medium text-gray-500">Funding Agency</dt>
                            <dd className="text-sm text-gray-900 col-span-2">{grant.funding_agency}</dd>
                        </div>

                        <div className="py-4 grid grid-cols-3 gap-4">
                            <dt className="text-sm font-medium text-gray-500">Timeline</dt>
                            <dd className="text-sm text-gray-900 col-span-2">
                                {formatDate(grant.start_date)} to {formatDate(grant.end_date)}
                            </dd>
                        </div>

                        <div className="py-4 grid grid-cols-3 gap-4">
                            <dt className="text-sm font-medium text-gray-500">Status</dt>
                            <dd className="text-sm text-gray-900 col-span-2">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-${grant.status_color}-100 text-${grant.status_color}-800`}>
                                    {grant.status}
                                </span>
                            </dd>
                        </div>

                        <div className="py-4 grid grid-cols-3 gap-4">
                            <dt className="text-sm font-medium text-gray-500">Contact Person</dt>
                            <dd className="text-sm text-gray-900 col-span-2">
                                {grant.contact_person}
                                {grant.contact_email && (
                                    <span className="block text-gray-500">{grant.contact_email}</span>
                                )}
                                {grant.contact_phone && (
                                    <span className="block text-gray-500">{grant.contact_phone}</span>
                                )}
                            </dd>
                        </div>

                        <div className="py-4">
                            <dt className="text-sm font-medium text-gray-500 mb-2">Financial Overview</dt>
                            <dd className="mt-1">
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500">Total Amount</p>
                                        <p className="font-medium text-gray-900">{formatCurrency(grant.amount)}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Received</p>
                                        <p className="font-medium text-gray-900">{formatCurrency(grant.amount_received)}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Spent</p>
                                        <p className="font-medium text-gray-900">{formatCurrency(grant.amount_spent)}</p>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="relative pt-1">
                                        <div className="flex mb-2 items-center justify-between">
                                            <div>
                                                <span className="text-xs font-semibold inline-block text-blue-600">
                                                    Progress
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs font-semibold inline-block text-blue-600">
                                                    {progressPercentage.toFixed(1)}%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-200">
                                            <div
                                                style={{ width: `${progressPercentage}%` }}
                                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </dd>
                        </div>

                        {grant.description && (
                            <div className="py-4">
                                <dt className="text-sm font-medium text-gray-500">Description</dt>
                                <dd className="mt-2 text-sm text-gray-900 whitespace-pre-wrap">
                                    {grant.description}
                                </dd>
                            </div>
                        )}

                        {grant.documents && (
                            <GrantDocuments documents={grant.documents} />
                        )}
                    </dl>
                </div>
            </div>
        </div>
    );
} 