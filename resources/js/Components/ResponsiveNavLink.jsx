import { Link } from '@inertiajs/react';

export default function ResponsiveNavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={`block w-full pl-3 pr-4 py-2 border-l-4 text-left text-base font-medium transition duration-150 ease-in-out ${
                active
                    ? 'border-primary-400 text-secondary-700 bg-primary-50 focus:text-secondary-800 focus:bg-primary-100 focus:border-primary-700'
                    : 'border-transparent text-gray-600 hover:text-secondary-800 hover:bg-primary-50 hover:border-primary-300 focus:text-secondary-800 focus:bg-primary-50 focus:border-primary-300'
            } ${className}`}
        >
            {children}
        </Link>
    );
}
