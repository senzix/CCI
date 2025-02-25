import { useState } from 'react';
import { router } from '@inertiajs/react';
import { 
    FaDownload, 
    FaTrash, 
    FaFolderOpen, 
    FaCheck,
    FaTimes 
} from 'react-icons/fa';
import DeleteConfirmationModal from '@/Components/DeleteConfirmationModal';

export default function BatchOperations({ 
    selectedDocuments, 
    onClearSelection,
    categories,
    can = {}
}) {
    const [isMoving, setIsMoving] = useState(false);
    const [targetCategory, setTargetCategory] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleDownload = () => {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = route('documents.batch.download');

        // Add CSRF token
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        const csrfInput = document.createElement('input');
        csrfInput.type = 'hidden';
        csrfInput.name = '_token';
        csrfInput.value = csrfToken;
        form.appendChild(csrfInput);

        // Add selected documents
        selectedDocuments.forEach(docId => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'documents[]';
            input.value = docId;
            form.appendChild(input);
        });

        // Add to body, submit, and remove
        document.body.appendChild(form);
        form.submit();
        setTimeout(() => document.body.removeChild(form), 100);
    };

    const handleDeleteClick = () => {
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        router.delete(route('documents.batch.destroy'), {
            data: { documents: selectedDocuments },
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                onClearSelection();
            },
        });
    };

    const handleMove = () => {
        if (!targetCategory) return;
        
        router.post(route('documents.batch.move'), {
            documents: selectedDocuments,
            category_id: targetCategory
        }, {
            onSuccess: () => {
                setIsMoving(false);
                setTargetCategory('');
                onClearSelection();
            }
        });
    };

    if (selectedDocuments.length === 0) return null;

    return (
        <>
            <div className="fixed bottom-0 inset-x-0 pb-6">
                <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-lg p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <span className="text-sm text-gray-500">
                                    {selectedDocuments.length} document{selectedDocuments.length !== 1 ? 's' : ''} selected
                                </span>
                                <button
                                    onClick={onClearSelection}
                                    className="ml-4 text-sm text-gray-600 hover:text-gray-900"
                                >
                                    Clear selection
                                </button>
                            </div>
                            <div className="flex space-x-3">
                                {can.download_documents && (
                                    <button 
                                        onClick={handleDownload}
                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                    >
                                        <FaDownload className="mr-2" /> Download
                                    </button>
                                )}
                                
                                {can.move_documents && (
                                    isMoving ? (
                                        <div className="flex items-center space-x-2">
                                            <select
                                                value={targetCategory}
                                                onChange={(e) => setTargetCategory(e.target.value)}
                                                className="rounded-md border-gray-300 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                                            >
                                                <option value="">Select Category</option>
                                                {categories.map((category) => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <button
                                                onClick={handleMove}
                                                disabled={!targetCategory}
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                            >
                                                <FaCheck className="mr-2" /> Move
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setIsMoving(false);
                                                    setTargetCategory('');
                                                }}
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                            >
                                                <FaTimes className="mr-2" /> Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={() => setIsMoving(true)}
                                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                        >
                                            <FaFolderOpen className="mr-2" /> Move
                                        </button>
                                    )
                                )}
                                
                                {can.delete_documents && (
                                    <button 
                                        onClick={handleDeleteClick}
                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-secondary-500 hover:bg-secondary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500"
                                    >
                                        <FaTrash className="mr-2" /> Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="Delete Documents"
                message={`Are you sure you want to delete ${selectedDocuments.length} document${selectedDocuments.length !== 1 ? 's' : ''}? This action cannot be undone.`}
            />
        </>
    );
} 