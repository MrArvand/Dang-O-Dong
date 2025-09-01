import React, { useState } from 'react';
import { ShareIcon, CheckIcon } from '@heroicons/react/24/outline';
import { generateShareUrl, copyToClipboard } from '../utils/shareUtils';

const ShareButton = ({ members, expenses }) => {
    const [isCopied, setIsCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleShare = async () => {
        if (members.length === 0 && expenses.length === 0) {
            alert('ابتدا اعضا و هزینه‌ها را اضافه کنید');
            return;
        }

        setIsLoading(true);

        try {
            const shareUrl = generateShareUrl(members, expenses);
            if (!shareUrl) {
                alert('خطا در ایجاد لینک اشتراک‌گذاری');
                return;
            }

            const success = await copyToClipboard(shareUrl);
            if (success) {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
            } else {
                alert('خطا در کپی کردن لینک');
            }
        } catch (error) {
            console.error('Error sharing:', error);
            alert('خطا در اشتراک‌گذاری');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleShare}
            disabled={isLoading || (members.length === 0 && expenses.length === 0)}
            className="btn-primary flex items-center gap-1 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm px-2 sm:px-4 py-2"
            title="اشتراک‌گذاری با دوستان"
        >
            {isLoading ? (
                <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : isCopied ? (
                <CheckIcon className="w-3 h-3 sm:w-4 sm:h-4" />
            ) : (
                <ShareIcon className="w-3 h-3 sm:w-4 sm:h-4" />
            )}
            <span className="hidden sm:inline">{isCopied ? 'کپی شد!' : 'اشتراک‌گذاری'}</span>
        </button>
    );
};

export default ShareButton;
