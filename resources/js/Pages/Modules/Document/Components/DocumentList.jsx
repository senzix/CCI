import { 
    FaFilePdf, 
    FaFileWord, 
    FaFileExcel, 
    FaFileImage,
    FaFileAlt,
    FaDownload,
    FaTrash,
    FaShare,
    FaCheck
} from 'react-icons/fa';
import { formatDate } from '@/utils';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import DeleteConfirmationModal from '@/Components/DeleteConfirmationModal';

export default function DocumentList({ 
    documents = { data: [] }, 
    viewMode = 'grid',
    selectedDocuments,
    onSelectionChange,
    onVersionClick,
    onShareClick
}) {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [documentToDelete, setDocumentToDelete] = useState(null);

    if (!documents?.data) {
        return null;
    }

    const getIcon = (fileType) => {
        const iconClass = "w-12 h-12";
        switch(fileType.toLowerCase()) {
            case 'pdf':
                return <FaFilePdf className={`${iconClass} text-red-500`} />;
            case 'doc':
            case 'docx':
                return <FaFileWord className={`${iconClass} text-blue-500`} />;
            case 'xls':
            case 'xlsx':
                return <FaFileExcel className={`${iconClass} text-green-500`} />;
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return <FaFileImage className={`${iconClass} text-purple-500`} />;
            default:
                return <FaFileAlt className={`${iconClass} text-gray-500`} />;
        }
    };

    const handleDownload = (e, documentId) => {
        e.preventDefault();
        window.location.href = route('documents.download', documentId);
    };

    const handleDeleteClick = (document) => {
        setDocumentToDelete(document);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        router.delete(route('documents.destroy', documentToDelete.id), {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setDocumentToDelete(null);
            },
        });
    };

    const toggleSelection = (documentId) => {
        if (selectedDocuments.includes(documentId)) {
            onSelectionChange(selectedDocuments.filter(id => id !== documentId));
        } else {
            onSelectionChange([...selectedDocuments, documentId]);
        }
    };

    if (viewMode === 'grid') {
        return (
            <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {documents.data.map((document) => (
                        <div 
                            key={document.id}
                            className="relative group bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                            <div className="absolute top-2 left-2 z-10">
                                <button
                                    onClick={() => toggleSelection(document.id)}
                                    className={`w-5 h-5 rounded ${
                                        selectedDocuments.includes(document.id)
                                            ? 'bg-blue-500'
                                            : 'bg-white border border-gray-300'
                                    } flex items-center justify-center`}
                                >
                                    {selectedDocuments.includes(document.id) && (
                                        <FaCheck className="w-3 h-3 text-white" />
                                    )}
                                </button>
                            </div>
                            <div className="flex items-center justify-center h-32 bg-gray-50 rounded-lg mb-4">
                                {getIcon(document.file_type)}
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-gray-900 truncate">
                                    {document.title}
                                </h3>
                                <p className="text-xs text-gray-500">
                                    {document.file_name}
                                </p>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span>{document.formatted_size}</span>
                                    <span>{formatDate(document.created_at)}</span>
                                </div>
                            </div>
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="flex space-x-2">
                                    <button
                                        onClick={(e) => handleDownload(e, document.id)}
                                        className="p-1 text-gray-500 hover:text-gray-700"
                                    >
                                        <FaDownload className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => onShareClick(document)}
                                        className="p-1 text-gray-500 hover:text-gray-700"
                                    >
                                        <FaShare className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(document)}
                                        className="p-1 text-gray-500 hover:text-red-700"
                                    >
                                        <FaTrash className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {documents.data.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-sm">No documents found</p>
                    </div>
                )}

                <DeleteConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => {
                        setIsDeleteModalOpen(false);
                        setDocumentToDelete(null);
                    }}
                    onConfirm={handleDeleteConfirm}
                    title="Delete Document"
                    message={`Are you sure you want to delete "${documentToDelete?.title}"? This action cannot be undone.`}
                />
            </>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="w-8 px-6 py-3 bg-gray-50">
                            {/* Add column for checkboxes */}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Document
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Size
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Uploaded
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {documents.data.map((document) => (
                        <tr key={document.id}>
                            <td className="px-6 py-4">
                                <button
                                    onClick={() => toggleSelection(document.id)}
                                    className={`w-5 h-5 rounded ${
                                        selectedDocuments.includes(document.id)
                                            ? 'bg-blue-500'
                                            : 'bg-white border border-gray-300'
                                    } flex items-center justify-center`}
                                >
                                    {selectedDocuments.includes(document.id) && (
                                        <FaCheck className="w-3 h-3 text-white" />
                                    )}
                                </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    {getIcon(document.file_type)}
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            {document.title}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {document.file_name}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                    {document.category?.name || 'Uncategorized'}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {document.formatted_size}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(document.created_at)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex justify-end space-x-3">
                                    <button
                                        onClick={(e) => handleDownload(e, document.id)}
                                        className="text-blue-600 hover:text-blue-900"
                                    >
                                        Download
                                    </button>
                                    <button
                                        onClick={() => onShareClick(document)}
                                        className="text-gray-600 hover:text-gray-900"
                                    >
                                        Share
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(document)}
                                        className="text-gray-600 hover:text-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setDocumentToDelete(null);
                }}
                onConfirm={handleDeleteConfirm}
                title="Delete Document"
                message={`Are you sure you want to delete "${documentToDelete?.title}"? This action cannot be undone.`}
            />
        </div>
    );
} 