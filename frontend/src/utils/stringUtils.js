// utils/stringUtils.js
export const getInitials = (firstName, lastName) => {
    if (!firstName && !lastName) return '?';
    return ((firstName?.charAt(0) || '') + (lastName?.charAt(0) || '')).toUpperCase() || '?';
};

export const getListingInitials = (title) => {
    if (!title) return '?';
    const words = title.trim().split(' ');
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
};

export const renderStars = (rating) => {
    const stars = [];
    const roundedRating = Math.round(rating);
    for (let i = 1; i <= 5; i++) {
        stars.push(
            <span key={i} className={`text-sm ${i <= roundedRating ? 'text-amber-500' : 'text-neutral-200'}`}>★</span>
        );
    }
    return stars;
};