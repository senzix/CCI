import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    return (
        <>
            <Head title="Centre for Community Initiative" />
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
                {/* Navigation */}
                <nav className="bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 fixed w-full z-50 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center">
                                {/* Logo */}
                                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                    CCI
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
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
                            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                                <span className="block">Centre for</span>
                                <span className="block text-blue-600">Community Initiative</span>
                            </h1>
                            <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
                                Empowering special needs education through comprehensive management and support systems
                            </p>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="py-12 bg-white/50 dark:bg-gray-800/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {/* Feature 1 */}
                            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6">
                                <div className="text-blue-600 dark:text-blue-400 mb-4">
                                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    Student Management
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Comprehensive student tracking, assessment management, and progress monitoring
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6">
                                <div className="text-blue-600 dark:text-blue-400 mb-4">
                                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    Resource Management
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Efficient handling of educational resources, facilities, and teaching materials
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6">
                                <div className="text-blue-600 dark:text-blue-400 mb-4">
                                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    Performance Analytics
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Detailed insights and reporting on student progress and institutional performance
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="bg-white dark:bg-gray-900">
                    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                            <p>© {new Date().getFullYear()} Centre for Community Initiative. All rights reserved.</p>
                            <p className="mt-2">Laravel v{laravelVersion} (PHP v{phpVersion})</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
