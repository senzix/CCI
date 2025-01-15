import { formatDate } from '@/utils';
import { Link } from '@inertiajs/react';
import { FaDownload, FaTrash, FaHistory } from 'react-icons/fa';

export default function VersionHistory({ document, versions, onDeleteVersion }) {
    return (
        <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                        Version History
                    </h3>
                    <span className="text-sm text-gray-500">
                        {versions.length} version{versions.length !== 1 ? 's' : ''}
                    </span>
                </div>

                <div className="space-y-4">
                    {versions.map((version, index) => (
                        <div 
                            key={version.id}
                            className={`relative flex items-start space-x-3 ${
                                index !== versions.length - 1 ? 'pb-4 border-b border-gray-200' : ''
                            }`}
                        >
                            <div className="flex-shrink-0">
                                <div className="relative">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 ring-8 ring-white">
                                        <FaHistory className="h-4 w-4 text-blue-600" />
                                    </span>
                                </div>
                            </div>
                            <div className="flex-grow min-w-0">
                                <div className="text-sm">
                                    <div className="font-medium text-gray-900">
                                        Version {version.version_number}
                                    </div>
                                    {version.change_notes && (
                                        <p className="mt-0.5 text-gray-500">
                                            {version.change_notes}
                                        </p>
                                    )}
                                    <div className="mt-2 text-xs text-gray-500">
                                        Uploaded by {version.created_by_name} on {formatDate(version.created_at)}
                                    </div>
                                </div>
                            </div>
                            <div className="flex-shrink-0 self-center flex space-x-2">
                                <Link
                                    href={route('documents.versions.show', [document.id, version.id])}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    <FaDownload className="h-4 w-4" />
                                </Link>
                                {versions.length > 1 && (
                                    <button
                                        onClick={() => onDeleteVersion(version)}
                                        className="text-gray-400 hover:text-red-500"
                                    >
                                        <FaTrash className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {versions.length === 0 && (
                    <div className="text-center py-4">
                        <p className="text-sm text-gray-500">No versions available</p>
                    </div>
                )}
            </div>
        </div>
    );
} 