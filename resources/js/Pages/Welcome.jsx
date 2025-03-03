import { Head, Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { FaUsers, FaFileAlt, FaChartBar } from 'react-icons/fa';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    return (
        <>
            <Head title="Centre for Community Initiative" />
            <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
                {/* Navigation */}
                <nav className="bg-white/80 backdrop-blur-sm fixed w-full z-50 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center">
                                {/* Logo */}
                                <ApplicationLogo className="w-40 h-auto" style={{ width: '120px' }} />
                            </div>
                            <div className="flex items-center space-x-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-secondary-600 hover:bg-secondary-700"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="text-secondary-600 hover:text-secondary-900"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-secondary-600 hover:bg-secondary-700"
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                                <span className="block">Centre for</span>
                                <span className="block text-secondary-600">Community Initiative</span>
                            </h1>
                            <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600">
                                Empowering special needs education through comprehensive management and support systems
                            </p>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="py-12 bg-primary-50/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {/* Feature cards with updated colors */}
                            <FeatureCard
                                icon="users"
                                title="Beneficiary Management"
                                description="Comprehensive beneficiary tracking, assessment management, and progress monitoring"
                            />
                            <FeatureCard
                                icon="document"
                                title="Resource Management"
                                description="Efficient handling of educational resources, facilities, and teaching materials"
                            />
                            <FeatureCard
                                icon="chart"
                                title="Performance Analytics"
                                description="Detailed insights and reporting on student progress and institutional performance"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="bg-white">
                    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                        <div className="text-center text-sm text-gray-500">
                            <p>© {new Date().getFullYear()} Centre for Community Initiative. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

// Feature Card Component
const FeatureCard = ({ icon, title, description }) => {
    const IconMap = {
        'users': FaUsers,
        'document': FaFileAlt,
        'chart': FaChartBar
    };
    
    const Icon = IconMap[icon];

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 border-t-4 border-primary-500">
            <div className="text-secondary-600 mb-4">
                <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {title}
            </h3>
            <p className="text-gray-600">
                {description}
            </p>
        </div>
    );
};
