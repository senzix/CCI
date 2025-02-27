import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GrantDetails from './Components/GrantDetails';
import ExpenditureList from './Components/ExpenditureList';
import GrantDocumentManager from './Components/GrantDocumentManager';
import ExpenditureForm from './Components/ExpenditureForm';
import ExpenditureAnalytics from './Components/ExpenditureAnalytics';
import Toast from '@/Components/Toast';

export default function Show({ grant, documentCategories, flash }) {
    const [activeTab, setActiveTab] = useState('details');
    const [isExpenditureFormOpen, setIsExpenditureFormOpen] = useState(false);
    const [editingExpenditure, setEditingExpenditure] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');

    const handleSuccess = (message) => {
        console.log('Show.jsx handleSuccess called with:', message);
        setToastMessage(message);
        setToastType('success');
        setShowToast(true);
    };

    const handleError = (message) => {
        console.log('Show.jsx handleError called with:', message);
        setToastMessage(message);
        setToastType('error');
        setShowToast(true);
    };

    // Handle flash messages from backend
    useEffect(() => {
        if (flash?.success) {
            handleSuccess(flash.success);
        } else if (flash?.error) {
            handleError(flash.error);
        }
    }, [flash]);

    const tabs = [
        { id: 'details', label: 'Details' },
        { id: 'analytics', label: 'Analytics' },
        { id: 'documents', label: 'Documents' },
        { id: 'expenditures', label: 'Expenditures' },
    ];

    const handleEditExpenditure = (expenditure) => {
        setEditingExpenditure(expenditure);
        setIsExpenditureFormOpen(true);
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Grant - ${grant.title}`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Tab Navigation */}
                    <div className="border-b border-gray-200 mb-6">
                        <nav className="-mb-px flex space-x-8">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                                        whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                                        ${activeTab === tab.id
                                            ? 'border-primary-500 text-primary-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }
                                    `}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'details' && <GrantDetails grant={grant} />}
                    {activeTab === 'analytics' && <ExpenditureAnalytics 
                        expenditures={grant.expenditures}
                        grant={grant}
                    />}
                    {activeTab === 'documents' && <GrantDocumentManager 
                        grant={grant}
                        documents={grant.documents}
                        categories={documentCategories}
                    />}
                    {activeTab === 'expenditures' && (
                        <div className="space-y-6">
                            <div className="flex justify-end">
                                <button
                                    onClick={() => setIsExpenditureFormOpen(true)}
                                    className="inline-flex items-center px-4 py-2 bg-primary-500 hover:bg-primary-600 text-gray-900 font-medium rounded-md"
                                >
                                    Add Expenditure
                                </button>
                            </div>
                            <ExpenditureList 
                                expenditures={grant.expenditures} 
                                onEdit={handleEditExpenditure}
                            />
                        </div>
                    )}
                </div>
            </div>

            <ExpenditureForm
                isOpen={isExpenditureFormOpen}
                onClose={() => {
                    setIsExpenditureFormOpen(false);
                    setEditingExpenditure(null);
                }}
                grantId={grant.id}
                expenditure={editingExpenditure}
                onSuccess={handleSuccess}
                onError={handleError}
            />
            
            {showToast && (
                <Toast 
                    show={showToast}
                    message={toastMessage}
                    type={toastType}
                    onClose={() => setShowToast(false)}
                />
            )}
        </AuthenticatedLayout>
    );
} 