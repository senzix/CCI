export default function ApplicationLogo(props) {
    return (
        <div className="flex items-center">
            <img
                src="/storage/images/logo.png"
                alt="Company Logo"
                className="w-48 h-auto"
                style={{ width: '200px' }}
                {...props}
            />
        </div>
    );
}
