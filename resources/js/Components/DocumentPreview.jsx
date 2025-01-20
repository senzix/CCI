import { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';

export default function DocumentPreview({ url, fileType, fileName }) {
    const [loading, setLoading] = useState(true);

    // For PDF files
    if (fileType.includes('pdf')) {
        return (
            <div className="relative h-[600px]">
                <iframe
                    src={`${url}#toolbar=0`}
                    className="w-full h-full border-0 rounded-lg"
                    onLoad={() => setLoading(false)}
                />
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                        <FaSpinner className="h-8 w-8 text-gray-400 animate-spin" />
                    </div>
                )}
            </div>
        );
    }

    // For images
    if (fileType.includes('image')) {
        return (
            <div className="relative h-[600px]">
                <img 
                    src={url} 
                    alt={fileName}
                    className="w-full h-full object-contain rounded-lg"
                    onLoad={() => setLoading(false)}
                />
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                        <FaSpinner className="h-8 w-8 text-gray-400 animate-spin" />
                    </div>
                )}
            </div>
        );
    }

    // For other file types
    return (
        <div className="flex flex-col items-center justify-center h-[600px] bg-gray-100 rounded-lg">
            <p className="text-gray-500 mb-2">Preview not available</p>
            <a href={url} download className="text-blue-500 hover:underline">
                Download instead
            </a>
        </div>
    );
}