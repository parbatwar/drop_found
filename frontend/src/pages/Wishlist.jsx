import { useEffect, useState } from "react";
import { getWishlist, removeFromWishlist } from "../api/wishlist";
import { Link } from "react-router-dom";

function Wishlist() {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadWishlist();
    }, []);

    const loadWishlist = async () => {
        try {
        const res = await getWishlist();
        console.log(res.data);
        setWishlist(res.data);
        } catch (err) {
        console.error(err);
        } finally {
        setLoading(false);
        }
    };

    const handleRemove = async (listingId) => {
        try {
            await removeFromWishlist(listingId);

            setWishlist((prev) =>
                prev.filter((item) => item.listing.id !== listingId)
            );
        } catch (err) {
            console.error(err);
            alert("Failed to remove item.");
        }
    };

    if (loading) {
        return (
        <div className="max-w-7xl mx-auto py-20 text-center">
            Loading...
        </div>
        );
    }

    return (
        <main className="max-w-7xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-light mb-10 tracking-wide">
            Saved Items
        </h1>

        {wishlist.length === 0 ? (
            <div className="text-center py-20">
            <p className="text-neutral-500">No saved items yet.</p>
            </div>
        ) : (
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
            {wishlist.map((item) => (
                <div
                key={item.id}
                className="border border-neutral-200 p-4"
                >
                <Link to={`/listing/${item.listing.id}`}>
                    <h2 className="text-lg">{item.listing.title}</h2>
                </Link>

                <p className="mt-2 text-neutral-500">
                    Rs. {item.listing.price}
                </p>

                <button
                    onClick={() => handleRemove(item.listing.id)}
                    className="mt-6 text-red-500 text-sm"
                >
                    Remove
                </button>
                </div>
            ))}
            </div>
        )}
        </main>
    );
}

export default Wishlist;