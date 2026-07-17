/**
 * ListingGrid - Component for displaying a grid of listing cards
 * 
 * A wrapper component that arranges ListingCards in a responsive grid layout.
 * Also provides a Loading skeleton component for loading states.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - ListingCard components
 * 
 * @example
 * // With children
 * <ListingGrid>
 *   {listings.map(item => <ListingCard key={item.id} listing={item} />)}
 * </ListingGrid>
 * 
 * // Loading state
 * <ListingGrid.Loading count={8} />
 */


function ListingGrid({ children }) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {children}
        </div>
    );
}

ListingGrid.Loading = function LoadingGrid({ count = 8 }) {
    const SkeletonCard = () => (
        <div className="animate-pulse space-y-3">
            <div className="aspect-[3/4] bg-neutral-100" />
            <div className="h-3 bg-neutral-100 w-2/3" />
            <div className="h-3 bg-neutral-100 w-1/3" />
        </div>
    );

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {[...Array(count)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
    );
};

export default ListingGrid;