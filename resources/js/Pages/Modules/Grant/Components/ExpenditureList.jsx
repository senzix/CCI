import { formatCurrency, formatDate } from '@/utils';
import { FaReceipt } from 'react-icons/fa';

export default function ExpenditureList({ expenditures }) {
    const groupedByCategory = expenditures.reduce((acc, exp) => {
        if (!acc[exp.category]) {
            acc[exp.category] = {
                total: 0,
                items: []
            };
        }
        acc[exp.category].total += parseFloat(exp.amount);
        acc[exp.category].items.push(exp);
        return acc;
    }, {});

    return (
        <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Expenditures
                </h3>

                {Object.entries(groupedByCategory).map(([category, data]) => (
                    <div key={category} className="mb-6 last:mb-0">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="text-sm font-medium text-gray-900 capitalize">
                                {category}
                            </h4>
                            <span className="text-sm font-medium text-gray-900">
                                {formatCurrency(data.total)}
                            </span>
                        </div>
                        
                        <div className="space-y-3">
                            {data.items.map((expenditure) => (
                                <div 
                                    key={expenditure.id}
                                    className="bg-gray-50 rounded-lg p-3 flex justify-between items-start"
                                >
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {expenditure.description}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {formatDate(expenditure.date)}
                                        </p>
                                        {expenditure.receipt_number && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                Receipt: {expenditure.receipt_number}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <span className="text-sm font-medium text-gray-900">
                                            {formatCurrency(expenditure.amount)}
                                        </span>
                                        {expenditure.receipt_file && (
                                            <a
                                                href={`/storage/${expenditure.receipt_file}`}
                                                target="_blank"
                                                className="text-blue-600 hover:text-blue-800"
                                                title="View Receipt"
                                            >
                                                <FaReceipt className="h-4 w-4" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {expenditures.length === 0 && (
                    <div className="text-center py-6 text-sm text-gray-500">
                        No expenditures recorded
                    </div>
                )}
            </div>
        </div>
    );
} 