import { Link } from '@inertiajs/react';
import { FaFile, FaExternalLinkAlt } from 'react-icons/fa';

export default function GrantDocuments({ documents }) {
    return (
        <div className="mt-6 border-t border-gray-200 pt-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                    Related Documents
                </h3>
                <Link
                    href={route('documents.index', { filter: 'grants' })}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                >
                    View All
                    <FaExternalLinkAlt className="ml-1 h-3 w-3" />
                </Link>
            </div>

            <div className="space-y-3">
                {documents.map((doc) => (
                    <div 
                        key={doc.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                        <div className="flex items-center">
                            <FaFile className="h-4 w-4 text-gray-400 mr-3" />
                            <div>
                                <p className="text-sm font-medium text-gray-900">
                                    {doc.title}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {doc.file_type}
                                </p>
                            </div>
                        </div>
                        <Link
                            href={route('documents.show', doc.id)}
                            className="text-sm text-blue-600 hover:text-blue-800"
                        >
                            View
                        </Link>
                    </div>
                ))}

                {documents.length === 0 && (
                    <div className="text-center py-4 text-sm text-gray-500">
                        No documents attached
                    </div>
                )}
            </div>
        </div>
    );
} 