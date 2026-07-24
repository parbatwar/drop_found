export const getInitials = (firstName, lastName) => {
    if (!firstName && !lastName) return '?';
    return ((firstName?.charAt(0) || '') + (lastName?.charAt(0) || '')).toUpperCase() || '?';
};