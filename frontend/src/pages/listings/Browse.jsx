import { useSearchParams } from 'react-router-dom';
import ListingsPage from './ListingsPage';

function Browse() {
    const [searchParams] = useSearchParams();
    const initialSearch = searchParams.get('search') || '';

    return (
        <ListingsPage
            title="All Collection"
            description="Hand-picked essentials and seasonal favorites from Nepal's finest curators."
            heroBadge="Explore"
            initialSearch={initialSearch}
            showColorFilter={true}
            emptyStateMessage="No items found"
        />
    );
}

export default Browse;