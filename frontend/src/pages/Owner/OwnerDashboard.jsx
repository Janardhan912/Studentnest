import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import ListingCard from '../../components/ListingCard';

const OwnerDashboard = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyProperties();
    }, []);

    const fetchMyProperties = async () => {
        try {
            // For now, listing API returns all. 
            // In real app, we might need /api/properties/my-listings or filter by ownerId in frontend
            // Let's filter in frontend since we don't have a specific 'my properties' endpoint in the plan yet, 
            // but the controller 'getProperties' is public.
            // Wait, I should add a way to get my properties.
            // Or just iterate and filter if the API returns enough data.
            // Actually, the best way for now is to use the generic search?
            // No, that's inefficient.
            // Let's assume for this MVF (Minimum Viable Feature) we fetched all and filtered, 
            // OR I can quickly add a `?ownerId=me` filter to the backend if I want.
            // But let's just stick to "Manage Listings" page concept.
            const { data } = await api.get('/properties');
            // This is public properties.
            // It might restrict non-verified ones.
            // Owners need to see pending ones too.
            // The public API `getProperties` filters `verified` via query params?
            // My controller: `if (req.query.verified) filters.verified = ...`.
            // If I don't pass verified, it returns all? No, it defaults?
            // Controller: `if (req.query.verified) ...`
            // If I don't send verified, it returns ALL (verified and unverified).
            // So filtering by current user ID on frontend is "okay" for a demo, 
            // but ideally backend should handle it.
            // I'll filter client side for now.
            // I need the current user ID. 
            // I can get it from context or /auth/me.

            const me = await api.get('/auth/me'); // Get ID
            const myId = me.data._id;

            setProperties(data.properties.filter(p => p.ownerId === myId || p.ownerId._id === myId));

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">My Properties</h1>
                <Link to="/owner/add-property" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                    + Add New Property
                </Link>
            </div>

            {loading ? <div>Loading...</div> : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {properties.map(property => (
                        <div key={property._id} className="relative">
                            <ListingCard property={property} />
                            <div className="absolute top-2 right-2 flex gap-2">
                                <span className={`px-2 py-1 rounded text-xs font-bold text-white ${property.verified ? 'bg-green-500' : 'bg-yellow-500'}`}>
                                    {property.verified ? 'Live' : 'Pending'}
                                </span>
                            </div>
                        </div>
                    ))}
                    {properties.length === 0 && <div className="text-gray-500">You haven't listed any properties yet.</div>}
                </div>
            )}
        </div>
    );
};

export default OwnerDashboard;
