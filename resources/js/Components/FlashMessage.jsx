import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { FaCheckCircle, FaExclamationCircle, FaTimes } from 'react-icons/fa';

export default function FlashMessage() {
    const { flash = {} } = usePage().props;
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (flash?.success || flash?.error) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [flash]);

    if (!visible || (!flash?.success && !flash?.error)) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {flash?.success && (
                <div className="flex items-center p-4 mb-4 text-green-800 bg-green-100 rounded-lg shadow-lg">
                    <FaCheckCircle className="w-5 h-5 mr-2" />
                    <span>{flash.success}</span>
                    <button 
                        onClick={() => setVisible(false)}
                        className="ml-4 text-green-600 hover:text-green-800"
                    >
                        <FaTimes className="w-4 h-4" />
                    </button>
                </div>
            )}
            {flash?.error && (
                <div className="flex items-center p-4 mb-4 text-red-800 bg-red-100 rounded-lg shadow-lg">
                    <FaExclamationCircle className="w-5 h-5 mr-2" />
                    <span>{flash.error}</span>
                    <button 
                        onClick={() => setVisible(false)}
                        className="ml-4 text-red-600 hover:text-red-800"
                    >
                        <FaTimes className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
} 