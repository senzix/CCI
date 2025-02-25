import { Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={`inline-flex items-center px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ${
                active
                    ? 'border-b-2 border-primary-500 text-secondary-600'
                    : 'border-b-2 border-transparent text-gray-500 hover:border-primary-300 hover:text-secondary-500'
            } ${className}`}
        >
            {children}
        </Link>
    );
}
