import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FaTrashRestore, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { Link, router } from '@inertiajs/react';
import { formatFileSize, formatDate } from '@/utils';
import { useState } from 'react';
import DeleteConfirmationModal from '@/Components/DeleteConfirmationModal';

export default function Trash({ documents }) {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [documentToDelete, setDocumentToDelete] = useState(null);

    const handleRestore = (documentId) => {
        router.post(route('documents.restore', documentId));
    };

    const handleForceDelete = (document) => {
        setDocumentToDelete(document);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (documentToDelete) {
            router.delete(route('documents.force-delete', documentToDelete.id), {
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                    setDocumentToDelete(null);
                },
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <Link
                            href={route('documents.index')}
                            className="mr-4 text-gray-600 hover:text-gray-900"
                        >
                            <FaArrowLeft className="w-5 h-5" />
                        </Link>
                        <h2 className="text-xl font-semibold text-gray-800">
                            Deleted Documents
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title="Trash - Documents" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {documents.data.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
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
                                                    Deleted At
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {documents.data.map((document) => (
                                                <tr key={document.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {document.title}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {document.file_type}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {document.category?.name || 'N/A'}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatFileSize(document.file_size)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatDate(document.deleted_at)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex justify-end space-x-2">
                                                            <button
                                                                onClick={() => handleRestore(document.id)}
                                                                className="text-green-600 hover:text-green-900"
                                                                title="Restore"
                                                            >
                                                                <FaTrashRestore className="w-5 h-5" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleForceDelete(document)}
                                                                className="text-red-600 hover:text-red-900"
                                                                title="Delete Permanently"
                                                            >
                                                                <FaTrash className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 text-sm">No deleted documents found</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setDocumentToDelete(null);
                }}
                onConfirm={handleDeleteConfirm}
                title="Delete Document Permanently"
                message={`Are you sure you want to permanently delete "${documentToDelete?.title}"? This action cannot be undone.`}
            />
        </AuthenticatedLayout>
    );
}