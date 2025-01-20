import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Switch } from '@headlessui/react';
import { 
    FaThLarge, 
    FaTable, 
    FaTrash, 
    FaPlus, 
    FaUpload 
} from 'react-icons/fa';
import DocumentUploadForm from './Components/DocumentUploadForm';
import SearchFilters from './Components/SearchFilters';
import BatchOperations from './Components/BatchOperations';
import DocumentList from './Components/DocumentList';
import CategoryManagementModal from './Components/CategoryManagementModal';
import VersionUploadForm from './Components/VersionUploadForm';
import ShareDocumentForm from './Components/ShareDocumentForm';

export default function Index({ documents = { data: [] }, categories = [], filters = {} }) {
    const [isUploadFormOpen, setIsUploadFormOpen] = useState(false);
    const [isVersionFormOpen, setIsVersionFormOpen] = useState(false);
    const [isShareFormOpen, setIsShareFormOpen] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [selectedDocuments, setSelectedDocuments] = useState([]);
    const [includeGrantDocs, setIncludeGrantDocs] = useState(false);

    const handleVersionClick = (document) => {
        setSelectedDocument(document);
        setIsVersionFormOpen(true);
    };

    const handleShareClick = (document) => {
        setSelectedDocument(document);
        setIsShareFormOpen(true);
    };

    const handleClearSelection = () => {
        setSelectedDocuments([]);
    };

    const handleToggleGrantDocs = (checked) => {
        setIncludeGrantDocs(checked);
        
        router.get(
            route('documents.index'), 
            {
                ...filters,
                include_grants: checked
            }, 
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    setIncludeGrantDocs(checked);
                },
                onError: () => {
                    setIncludeGrantDocs(!checked);
                }
            }
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">
                            Document Management
                        </h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Manage and organize all your documents
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <button 
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-md ${viewMode === 'grid' 
                                    ? 'bg-blue-50 text-blue-600' 
                                    : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                <FaThLarge className="h-4 w-4" />
                            </button>
                            <button 
                                onClick={() => setViewMode('table')}
                                className={`p-2 rounded-md ${viewMode === 'table' 
                                    ? 'bg-blue-50 text-blue-600' 
                                    : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                <FaTable className="h-4 w-4" />
                            </button>
                        </div>
                        <Link
                            href={route('documents.trash')}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border border-gray-300"
                        >
                            <FaTrash className="mr-2 h-4 w-4" />
                            Trash
                        </Link>
                        <button
                            onClick={() => setIsCategoryModalOpen(true)}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium bg-gray-600 hover:bg-gray-700 text-white rounded"
                        >
                            <FaPlus className="mr-2 h-4 w-4" />
                            Manage Categories
                        </button>
                        <button
                            onClick={() => setIsUploadFormOpen(true)}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded"
                        >
                            <FaUpload className="mr-2 h-4 w-4" />
                            Upload Document
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Document Management" />

            <div className="py-12">
                <div className="max-w-8xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-lg sm:rounded-lg">
                        <SearchFilters 
                            filters={filters}
                            categories={categories}
                        />
                        
                        <BatchOperations 
                            selectedDocuments={selectedDocuments}
                            onClearSelection={handleClearSelection}
                            categories={categories}
                        />

                        <div className="flex items-center space-x-2">
                            <Switch
                                checked={includeGrantDocs}
                                onChange={handleToggleGrantDocs}
                                className={`${
                                    includeGrantDocs ? 'bg-blue-600' : 'bg-gray-200'
                                } relative inline-flex h-6 w-11 items-center rounded-full`}
                            >
                                <span className="sr-only">Include Grant Documents</span>
                                <span
                                    className={`${
                                        includeGrantDocs ? 'translate-x-6' : 'translate-x-1'
                                    } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                                />
                            </Switch>
                            <span className="text-sm text-gray-600">Include Grant Documents</span>
                        </div>

                        <DocumentList
                            documents={documents}
                            viewMode={viewMode}
                            selectedDocuments={selectedDocuments}
                            onSelectionChange={setSelectedDocuments}
                            onVersionClick={handleVersionClick}
                            onShareClick={handleShareClick}
                        />
                    </div>
                </div>
            </div>

            <DocumentUploadForm
                isOpen={isUploadFormOpen}
                onClose={() => {
                    setIsUploadFormOpen(false);
                    router.reload({ only: ['documents'] });
                }}
                categories={categories}
                documentableType={null}
                documentableId={null}
            />

            <CategoryManagementModal
                isOpen={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
                categories={categories}
            />

            {selectedDocument && (
                <VersionUploadForm
                    isOpen={isVersionFormOpen}
                    onClose={() => {
                        setIsVersionFormOpen(false);
                        setSelectedDocument(null);
                    }}
                    document={selectedDocument}
                />
            )}

            {selectedDocument && (
                <ShareDocumentForm
                    isOpen={isShareFormOpen}
                    onClose={() => {
                        setIsShareFormOpen(false);
                        setSelectedDocument(null);
                    }}
                    document={selectedDocument}
                />
            )}
        </AuthenticatedLayout>
    );
} 