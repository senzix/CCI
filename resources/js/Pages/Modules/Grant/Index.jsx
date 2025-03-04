import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import GrantList from './Components/GrantList';
import GrantForm from './Components/GrantForm';
import StatsSection from './Components/StatsSection';
import SearchFilters from './Components/SearchFilters';
import { FaPlus } from 'react-icons/fa';
import CategoryManager from './Components/CategoryManager';

export default function Index({ grants, categories, filters, stats }) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingGrant, setEditingGrant] = useState(null);
    const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="font-semibold text-gray-800 text-xl">
                            Grants
                        </h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Manage grant applications and funding
                        </p>
                    </div>
                    <div className="flex space-x-3">
                        <button
                            onClick={() => setIsCategoryManagerOpen(true)}
                            className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Manage Categories
                        </button>
                        <button
                            onClick={() => setIsFormOpen(true)}
                            className="inline-flex items-center px-2.5 py-1.5 bg-primary-500 hover:bg-primary-600 text-gray-900 font-medium rounded-md"
                        >
                            <FaPlus className="w-3.5 h-3.5 mr-1.5" />
                            New Grant
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Grants" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <StatsSection stats={stats} />
                    
                    <div className="mt-6 bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <SearchFilters 
                            filters={filters}
                            categories={categories}
                        />
                        
                        <GrantList
                            grants={grants}
                            onEdit={(grant) => {
                                setEditingGrant(grant);
                                setIsFormOpen(true);
                            }}
                        />
                    </div>
                </div>
            </div>

            <GrantForm
                isOpen={isFormOpen}
                onClose={() => {
                    setIsFormOpen(false);
                    setEditingGrant(null);
                }}
                grant={editingGrant}
                categories={categories}
            />

            <CategoryManager
                isOpen={isCategoryManagerOpen}
                onClose={() => setIsCategoryManagerOpen(false)}
                categories={categories}
            />
        </AuthenticatedLayout>
    );
} 