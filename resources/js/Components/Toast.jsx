import { useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaTimes } from 'react-icons/fa';

export default function Toast({ message, type = 'success', show, onClose }) {
    useEffect(() => {
        console.log('Toast mounted with:', { message, type, show });
        if (show) {
            const timer = setTimeout(() => {
                console.log('Toast timer expired, calling onClose');
                onClose();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [show, message]);

    console.log('Toast rendering with:', { message, type, show });

    const styles = {
        success: {
            bg: 'bg-green-500',
            text: 'text-white',
            icon: FaCheckCircle
        },
        error: {
            bg: 'bg-red-500',
            text: 'text-white',
            icon: FaExclamationCircle
        }
    };

    const { bg, text, icon: Icon } = styles[type];

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <div className={`flex items-center p-4 rounded-lg shadow-lg ${bg} ${text}`}>
                <Icon className="w-5 h-5 mr-2" />
                <span className="font-medium">{message}</span>
                <button 
                    onClick={onClose}
                    className="ml-4 hover:opacity-75"
                >
                    <FaTimes className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
} 