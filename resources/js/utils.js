/**
 * Format a date string to a readable format
 * @param {string} dateString - The date string to format
 * @returns {string} Formatted date string
 */
export function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

/**
 * Format a number as currency
 * @param {number} amount - The amount to format
 * @param {string} currency - The currency code (default: USD)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
};

/**
 * Format file size to human readable format
 * @param {number} bytes - The file size in bytes
 * @returns {string} Formatted file size
 */
export function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Truncate text to a specified length
 * @param {string} text - The text to truncate
 * @param {number} length - Maximum length
 * @returns {string} Truncated text
 */
export function truncateText(text, length = 50) {
    if (!text) return '';
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
}

/**
 * Generate a slug from a string
 * @param {string} text - The text to convert to slug
 * @returns {string} Slugified text
 */
export function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');
}

/**
 * Check if a file type is an image
 * @param {string} fileType - The file type/extension
 * @returns {boolean}
 */
export function isImageFile(fileType) {
    const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    return imageTypes.includes(fileType.toLowerCase());
}

/**
 * Get file type icon name
 * @param {string} fileType - The file type/extension
 * @returns {string} Icon name
 */
export function getFileTypeIcon(fileType) {
    const type = fileType.toLowerCase();
    if (isImageFile(type)) return 'image';
    
    const typeMap = {
        pdf: 'pdf',
        doc: 'word',
        docx: 'word',
        xls: 'excel',
        xlsx: 'excel',
        ppt: 'powerpoint',
        pptx: 'powerpoint',
        txt: 'text',
        zip: 'archive',
        rar: 'archive',
        '7z': 'archive'
    };

    return typeMap[type] || 'file';
}

/**
 * Debounce a function
 * @param {Function} func - The function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}