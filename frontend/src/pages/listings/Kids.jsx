/**
 * Kids - Page component for displaying kids' collection
 * 
 * A wrapper component that renders ListingsPage with gender="kids".
 * This page shows all children's clothing items from both thrift and surplus sellers.
 * 
 * @example
 * // Route: /kids
 * <Route path="/kids" element={<Kids />} />
 */

// pages/listings/Kids.jsx
import ListingsPage from './ListingsPage';

function Kids() {
    return (
        <ListingsPage
            gender="kids"
            title="Kids' Collection"
            description="Sustainable and stylish clothing for little ones. Pre-loved and new finds for every age."
        />
    );
}

export default Kids;