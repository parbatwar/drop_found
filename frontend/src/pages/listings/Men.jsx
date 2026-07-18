/**
 * Men - Page component for displaying men's collection
 * 
 * A wrapper component that renders ListingsPage with gender="men".
 * This page shows all men's clothing items from both thrift and retail shop sellers.
 * 
 * @example
 * // Route: /men
 * <Route path="/men" element={<Men />} />
 */

// pages/listings/Men.jsx
import ListingsPage from './ListingsPage';

function Men() {
    return (
        <ListingsPage
            gender="men"
            title="Men's Collection"
            description="Curated menswear. From vintage classics to modern essentials."
        />
    );
}

export default Men;