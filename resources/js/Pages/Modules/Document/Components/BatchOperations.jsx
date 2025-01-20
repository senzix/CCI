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
    categories 
}) {
    const [isMoving, setIsMoving] = useState(false);
    const [targetCategory, setTargetCategory] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleDownload = () => {
        // Create a form and submit it directly
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = route('documents.batch.download');

        // Add CSRF token
        const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
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

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
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
                                {isMoving ? (
                                    <>
                                        <select
                                            value={targetCategory}
                                            onChange={(e) => setTargetCategory(e.target.value)}
                                            className="rounded-md border-gray-300 text-sm"
                                        >
                                            <option value="">Select category</option>
                                            {categories.map(category => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={handleMove}
                                            disabled={!targetCategory}
                                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                                        >
                                            <FaCheck className="mr-2 h-4 w-4" />
                                            Confirm Move
                                        </button>
                                        <button
                                            onClick={() => setIsMoving(false)}
                                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
                                        >
                                            <FaTimes className="mr-2 h-4 w-4" />
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={handleDownload}
                                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                        >
                                            <FaDownload className="mr-2 h-4 w-4" />
                                            Download
                                        </button>
                                        <button
                                            onClick={() => setIsMoving(true)}
                                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                                        >
                                            <FaFolderOpen className="mr-2 h-4 w-4" />
                                            Move
                                        </button>
                                        <button
                                            onClick={handleDeleteClick}
                                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                                        >
                                            <FaTrash className="mr-2 h-4 w-4" />
                                            Delete
                                        </button>
                                    </>
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