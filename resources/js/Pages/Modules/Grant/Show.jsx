import { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GrantDetails from './Components/GrantDetails';
import ExpenditureList from './Components/ExpenditureList';
import GrantDocumentManager from './Components/GrantDocumentManager';
import ExpenditureForm from './Components/ExpenditureForm';

export default function Show({ grant, documentCategories }) {
    const [isExpenditureFormOpen, setIsExpenditureFormOpen] = useState(false);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">
                            Grant Details
                        </h2>
                        <p className="mt-1 text-sm text-gray-600">
                            {grant.reference_number}
                        </p>
                    </div>
                    <button
                        onClick={() => setIsExpenditureFormOpen(true)}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
                    >
                        Record Expenditure
                    </button>
                </div>
            }
        >
            <Head title={`Grant - ${grant.title}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            <GrantDetails grant={grant} />
                            <ExpenditureList 
                                expenditures={grant.expenditures}
                                className="mt-6" 
                            />
                        </div>
                        <div>
                            <GrantDocumentManager 
                                grant={grant}
                                documents={grant.documents}
                                categories={documentCategories}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <ExpenditureForm
                isOpen={isExpenditureFormOpen}
                onClose={() => setIsExpenditureFormOpen(false)}
                grantId={grant.id}
            />
        </AuthenticatedLayout>
    );
} 