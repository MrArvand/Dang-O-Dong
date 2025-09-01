// Share utilities for encoding/decoding expense data in URLs

// Compress data to make URLs shorter
export const compressData = (data) => {
    try {
        const jsonString = JSON.stringify(data);
        // Use base64 encoding for better compression
        return btoa(unescape(encodeURIComponent(jsonString)));
    } catch (error) {
        console.error('Error compressing data:', error);
        return null;
    }
};

// Decompress data from URL
export const decompressData = (compressedData) => {
    try {
        const jsonString = decodeURIComponent(escape(atob(compressedData)));
        return JSON.parse(jsonString);
    } catch (error) {
        console.error('Error decompressing data:', error);
        return null;
    }
};

// Generate share URL
export const generateShareUrl = (members, expenses) => {
    const data = {
        members,
        expenses,
        version: '1.0', // For future compatibility
        timestamp: Date.now()
    };

    const compressed = compressData(data);
    if (!compressed) return null;

    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?share=${compressed}`;
};

// Extract share data from URL
export const extractShareData = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const shareData = urlParams.get('share');

    if (!shareData) return null;

    const data = decompressData(shareData);
    if (!data) return null;

    return {
        members: data.members || [],
        expenses: data.expenses || []
    };
};

// Copy URL to clipboard
export const copyToClipboard = async (url) => {
    try {
        await navigator.clipboard.writeText(url);
        return true;
    } catch (error) {
        console.error('Error copying to clipboard:', error);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return true;
    }
};

// Check if current URL has share data
export const hasShareData = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('share');
};

// Clear share data from URL (for new sessions)
export const clearShareData = () => {
    const url = new URL(window.location);
    url.searchParams.delete('share');
    window.history.replaceState({}, '', url);
};
