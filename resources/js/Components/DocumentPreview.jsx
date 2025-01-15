import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { FaSpinner, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// Set up the PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function DocumentPreview({ url, fileType }) {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [loading, setLoading] = useState(true);

    if (!['pdf', 'jpg', 'jpeg', 'png'].includes(fileType.toLowerCase())) {
        return (
            <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
                <p className="text-gray-500">Preview not available for this file type</p>
            </div>
        );
    }

    if (['jpg', 'jpeg', 'png'].includes(fileType.toLowerCase())) {
        return (
            <div className="relative">
                <img
                    src={url}
                    alt="Document preview"
                    className="max-w-full h-auto rounded-lg"
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

    return (
        <div className="relative">
            <Document
                file={url}
                onLoadSuccess={({ numPages }) => {
                    setNumPages(numPages);
                    setLoading(false);
                }}
                loading={
                    <div className="flex items-center justify-center h-64">
                        <FaSpinner className="h-8 w-8 text-gray-400 animate-spin" />
                    </div>
                }
            >
                <Page
                    pageNumber={pageNumber}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                />
            </Document>

            {numPages > 1 && (
                <div className="flex items-center justify-center space-x-4 mt-4">
                    <button
                        onClick={() => setPageNumber(page => Math.max(page - 1, 1))}
                        disabled={pageNumber <= 1}
                        className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
                    >
                        <FaChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="text-sm text-gray-600">
                        Page {pageNumber} of {numPages}
                    </span>
                    <button
                        onClick={() => setPageNumber(page => Math.min(page + 1, numPages))}
                        disabled={pageNumber >= numPages}
                        className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
                    >
                        <FaChevronRight className="h-4 w-4" />
                    </button>
                </div>
            )}
        </div>
    );
} 