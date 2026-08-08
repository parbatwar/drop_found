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
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 sm:gap-x-6 sm:gap-y-14">
      {children}
    </div>
  );
}

ListingGrid.Loading = function LoadingGrid({ count = 8 }) {
  const SkeletonCard = () => (
    <div className="animate-pulse">
      {/* Image placeholder */}
      <div className="aspect-[3/4] bg-neutral-100" />

      {/* Content placeholders — matches Uniqlo card structure */}
      <div className="mt-3 space-y-2">
        <div className="h-2.5 w-1/2 bg-neutral-100" />   {/* shop name */}
        <div className="h-3 w-4/5 bg-neutral-100" />     {/* title */}
        <div className="h-3 w-1/3 bg-neutral-100" />     {/* price */}
        <div className="h-2.5 w-1/4 bg-neutral-100" />   {/* tag / rating */}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 sm:gap-x-6 sm:gap-y-14">
      {[...Array(count)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};

export default ListingGrid;