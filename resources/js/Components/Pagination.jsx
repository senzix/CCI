import { Link } from '@inertiajs/react';

export default function Pagination({ links }) {
    if (links.length === 3) return null;

    return (
        <div className="flex items-center justify-center space-x-1">
            {links.map((link, key) => {
                if (!link.url) {
                    return (
                        <span
                            key={key}
                            className="px-4 py-2 text-sm text-gray-500 bg-white border border-gray-300 rounded-md cursor-not-allowed"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                }

                return (
                    <Link
                        key={key}
                        href={link.url}
                        preserveScroll
                        preserveState
                        className={`px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                            link.active
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                );
            })}
        </div>
    );
} 