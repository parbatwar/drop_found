/**
 * Women - Page component for displaying women's collection
 * 
 * A wrapper component that renders ListingsPage with gender="women".
 * This page shows all women's clothing items from both thrift and retail shop sellers.
 * 
 * @example
 * // Route: /women
 * <Route path="/women" element={<Women />} />
 */

// pages/listings/Women.jsx
import ListingsPage from './ListingsPage';

function Women() {
    return (
        <ListingsPage
            gender="women"
            title="Women's Collection"
            description="Curated womenswear. Discover timeless pieces and contemporary finds."
        />
    );
}

export default Women;