import React from 'react';

const Preloader = () => {
    return (
        <div className="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-50">
            <div className="text-center">
                {/* Logo/Title */}
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        دَنگ و دونگ
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                        نرم‌افزار تقسیم هزینه‌ها
                    </p>
                </div>

                {/* Loading Animation */}
                <div className="flex items-center justify-center mb-6">
                    <div className="relative">
                        {/* Outer ring */}
                        <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>

                        {/* Animated ring */}
                        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>

                        {/* Center dot */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                    </div>
                </div>

                {/* Loading text */}
                <div className="text-gray-600 dark:text-gray-400 text-sm">
                    <span className="inline-block animate-pulse">در حال بارگذاری</span>
                    <span className="inline-block animate-pulse delay-100">.</span>
                    <span className="inline-block animate-pulse delay-200">.</span>
                    <span className="inline-block animate-pulse delay-300">.</span>
                </div>
            </div>
        </div>
    );
};

export default Preloader;
