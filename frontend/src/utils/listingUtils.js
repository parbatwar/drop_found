// utils/listingUtils.js
export const getInitials = (title) => {
    if (!title) return '?';
    const words = title.trim().split(' ');
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
};

export const canBuy = (listing) => {
    return listing?.status === 'active' && listing?.quantity > 0;
};

export const getPriceDisplay = (price) => {
    return `NPR ${Number(price).toLocaleString()}`;
};

export const getStatusDisplay = (status, quantity) => {
    if (status === 'inactive') return 'Currently Unavailable';
    if (quantity <= 0) return 'Sold Out';
    return 'In Stock';
};