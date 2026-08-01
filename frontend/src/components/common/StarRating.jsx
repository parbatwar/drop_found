// components/common/StarRating.jsx
function StarRating({ rating, className = '' }) {
    const stars = [];
    const roundedRating = Math.round(rating);
    
    for (let i = 1; i <= 5; i++) {
        stars.push(
            <span 
                key={i} 
                className={`text-sm ${i <= roundedRating ? 'text-amber-500' : 'text-neutral-200'}`}
            >
                ★
            </span>
        );
    }
    
    return <div className={`flex items-center ${className}`}>{stars}</div>;
}

export default StarRating;