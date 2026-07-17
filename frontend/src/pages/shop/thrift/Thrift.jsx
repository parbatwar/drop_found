/**
 * Thrift - Page component for displaying thrift collection
 * 
 * A wrapper component that renders ListingsPage with sellerType="thrift".
 * This page shows all thrift/vintage/pre-loved items from independent sellers.
 * 
 * @example
 * // Route: /thrift
 * <Route path="/thrift" element={<Thrift />} />
 */

import ListingsPage from '../../listings/ListingsPage';  // ✅ Correct path

function Thrift() {
    return (
        <ListingsPage
            sellerType="thrift"
            title="Shop Thrift"
            description="Discover pre-loved vintage & modern pieces from independent sellers across Nepal."
        />
    );
}

export default Thrift;