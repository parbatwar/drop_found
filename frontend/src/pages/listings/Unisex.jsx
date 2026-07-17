/**
 * Unisex - Page component for displaying unisex collection
 * 
 * A wrapper component that renders ListingsPage with gender="unisex".
 * This page shows all unisex clothing items from both thrift and surplus sellers.
 * 
 * @example
 * // Route: /unisex
 * <Route path="/unisex" element={<Unisex />} />
 */

// pages/listings/Unisex.jsx
import ListingsPage from './ListingsPage';

function Unisex() {
    return (
        <ListingsPage
            gender="unisex"
            title="Unisex Collection"
            description="Gender-neutral fashion for everyone. Curated pieces that transcend traditional boundaries."
        />
    );
}

export default Unisex;