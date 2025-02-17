import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { FaFileUpload, FaDownload, FaTrash, FaEye, FaFilePdf, FaFileWord, FaFileExcel, FaFileImage } from 'react-icons/fa';
import DocumentUploadForm from '@/Pages/Modules/Document/Components/DocumentUploadForm';
import { formatDate, formatFileSize } from '@/utils';

export default function GrantDocumentManager({ grant, documents = [], categories = [] }) {
    console.log('Grant in GrantDocumentManager:', grant);
    console.log('Documents in GrantDocumentManager:', documents);
    const [isUploadFormOpen, setIsUploadFormOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');

    const filteredDocuments = selectedCategory === 'all'
        ? documents
        : documents.filter(doc => doc.category_id === selectedCategory);

    const handleDelete = async (documentId) => {
        if (confirm('Are you sure you want to delete this document?')) {
            router.delete(route('documents.destroy', documentId));
        }
    };

    return (
        <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-medium text-gray-900">
                        Grant Documents
                    </h3>
                    <button
                        onClick={() => setIsUploadFormOpen(true)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                        <FaFileUpload className="mr-2 h-4 w-4" />
                        Upload Document
                    </button>
                </div>

                <div className="mb-4">
                    <div className="flex space-x-2 overflow-x-auto pb-2">
                        {categories.map(category => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                                    selectedCategory === category.id
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    {filteredDocuments.map(document => (
                        <div
                            key={document.id}
                            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0">
                                    {getDocumentIcon(document.file_type)}
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900">
                                        {document.title}
                                    </h4>
                                    <div className="mt-1 flex items-center space-x-2 text-xs text-gray-500">
                                        <span>{formatFileSize(document.file_size)}</span>
                                        <span>•</span>
                                        <span>Uploaded {formatDate(document.created_at)}</span>
                                        {document.versions_count > 1 && (
                                            <>
                                                <span>•</span>
                                                <span>{document.versions_count} versions</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Link
                                    href={route('documents.show', document.id)}
                                    className="p-2 text-gray-400 hover:text-gray-500"
                                    title="View Details"
                                >
                                    <FaEye className="h-4 w-4" />
                                </Link>
                                <Link
                                    href={route('documents.download', document.id)}
                                    className="p-2 text-gray-400 hover:text-gray-500"
                                    title="Download"
                                >
                                    <FaDownload className="h-4 w-4" />
                                </Link>
                                <button
                                    onClick={() => handleDelete(document.id)}
                                    className="p-2 text-gray-400 hover:text-red-500"
                                    title="Delete"
                                >
                                    <FaTrash className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}

                    {filteredDocuments.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-2">
                                <FaFileUpload className="mx-auto h-12 w-12" />
                            </div>
                            <h3 className="text-sm font-medium text-gray-900">No documents</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Upload documents to get started
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <DocumentUploadForm
                isOpen={isUploadFormOpen}
                onClose={() => setIsUploadFormOpen(false)}
                documentableType="grant"
                documentableId={grant.id}
                categories={categories}
                defaultCategory={selectedCategory !== 'all' ? selectedCategory : null}
            />
        </div>
    );
}

function getDocumentIcon(fileType) {
    const iconClass = "h-8 w-8 text-gray-400";
    
    // Handle both MIME types and file extensions
    const type = fileType.toLowerCase();
    
    if (type.includes('pdf')) {
        return <FaFilePdf className={iconClass} />;
    } else if (type.includes('word') || type.includes('doc') || type.includes('msword') || type.includes('officedocument.wordprocessingml')) {
        return <FaFileWord className={iconClass} />;
    } else if (type.includes('excel') || type.includes('sheet') || type.includes('spreadsheet') || type.includes('officedocument.spreadsheetml')) {
        return <FaFileExcel className={iconClass} />;
    } else if (type.includes('image/')) {
        return <FaFileImage className={iconClass} />;
    }
    
    return <FaFile className={iconClass} />;
} 