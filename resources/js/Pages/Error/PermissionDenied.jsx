import PermissionDeniedModal from '@/Components/PermissionDeniedModal';
import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';

export default function PermissionDenied({ error, showModal }) {
    const [isOpen, setIsOpen] = useState(showModal);

    const handleClose = () => {
        setIsOpen(false);
        router.visit(document.referrer || '/dashboard');
    };

    useEffect(() => {
        setIsOpen(showModal);
    }, [showModal]);

    return (
        <PermissionDeniedModal 
            show={isOpen} 
            onClose={handleClose} 
        />
    );
} 