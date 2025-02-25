export default function SelectInput({ className = '', options = [], disabled = false, ...props }) {
    return (
        <select
            disabled={disabled}
            {...props}
            className={
                'border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-md shadow-sm w-full ' +
                className
            }
        >
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
} 