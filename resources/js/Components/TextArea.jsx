import { forwardRef, useEffect, useRef } from 'react';

export default forwardRef(function TextArea(
    { name = '', id = '', className = '', required = false, isFocused = false, ...props },
    ref
) {
    const localRef = useRef(null);

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <textarea
            {...props}
            name={name}
            id={id || name}
            ref={ref || localRef}
            required={required}
            className={
                `border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm ` +
                className
            }
        />
    );
}); 