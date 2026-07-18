// pages/shop/retailer/Retailer.jsx
/**
 * Retailer - Page component for displaying retailer (Brand New) collection
 * 
 * A wrapper component that renders ListingsPage with sellerType="retailer".
 * This page shows all brand new items from retailers.
 * 
 * @example
 * // Route: /brand
 * <Route path="/brand" element={<Retailer />} />
 */

import ListingsPage from '../../listings/ListingsPage';

function Retailer() {
    return (
        <ListingsPage
            sellerType="retailer"
            title="Shop Brand New"
            description="Fresh drops, current collections, and new arrivals from retailers across Nepal."
        />
    );
}

export default Retailer;