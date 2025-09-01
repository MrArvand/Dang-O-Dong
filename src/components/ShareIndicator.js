import React from 'react';
import { LinkIcon, XMarkIcon } from '@heroicons/react/24/outline';

const ShareIndicator = ({ onClearShare }) => {
    return (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                        <LinkIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h4 className="font-medium text-blue-900 dark:text-blue-100">
                            حالت مشاهده اشتراکی
                        </h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                            این داده‌ها از لینک اشتراک‌گذاری بارگذاری شده‌اند
                        </p>
                    </div>
                </div>
                <button
                    onClick={onClearShare}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
                    title="پاک کردن و شروع جدید"
                >
                    <XMarkIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default ShareIndicator;
