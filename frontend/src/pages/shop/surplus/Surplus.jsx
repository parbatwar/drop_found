/**
 * Surplus - Page component for displaying surplus collection
 * 
 * A wrapper component that renders ListingsPage with sellerType="surplus".
 * This page shows all surplus/deadstock/excess inventory items.
 * 
 * @example
 * // Route: /surplus
 * <Route path="/surplus" element={<Surplus />} />
 */

import ListingsPage from '../../listings/ListingsPage';  // ✅ Correct path

function Surplus() {
    return (
        <ListingsPage
            sellerType="surplus"
            title="Shop Surplus"
            description="Discover premium deadstock & excess inventory. Unworn, tagged, and ready for a new home."
        />
    );
}

export default Surplus;