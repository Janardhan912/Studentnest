import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../../services/api';
import ListingCard from '../../components/ListingCard';

const Home = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const { data } = await api.get('/properties');
                setProperties(data.properties);
            } catch (error) {
                console.error('Failed to fetch properties:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProperties();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Hero Section */}
            <div className="bg-blue-600 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">Find Your Perfect Student Home</h1>
                    <p className="text-xl mb-8">Verified clusters, compatible roommates, and zero brokerage.</p>

                    <div className="max-w-2xl mx-auto bg-white rounded-lg p-2 flex">
                        <input
                            type="text"
                            placeholder="Search by college, city, or location..."
                            className="flex-1 p-3 text-gray-800 rounded-l-lg focus:outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="bg-yellow-500 text-gray-900 font-bold px-6 py-3 rounded-r-lg hover:bg-yellow-400">
                            Search
                        </button>
                    </div>
                </div>
            </div>

            {/* Features/Steps */}
            <div className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="p-6">
                        <div className="text-blue-600 text-4xl mb-4">🏠</div>
                        <h3 className="text-xl font-bold mb-2">Verified Listings</h3>
                        <p className="text-gray-600">We verify every property to ensure your safety and comfort.</p>
                    </div>
                    <div className="p-6">
                        <div className="text-blue-600 text-4xl mb-4">🤝</div>
                        <h3 className="text-xl font-bold mb-2">Roommate Matching</h3>
                        <p className="text-gray-600">Find roommates who match your lifestyle and preferences.</p>
                    </div>
                    <div className="p-6">
                        <div className="text-blue-600 text-4xl mb-4">🔒</div>
                        <h3 className="text-xl font-bold mb-2">Secure Booking</h3>
                        <p className="text-gray-600">Connect directly with owners and book securely.</p>
                    </div>
                </div>
            </div>


            {/* Listings Section */}
            <div className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-8 text-center">Featured Listings</h2>

                    {loading ? (
                        <div className="text-center">Loading...</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {properties.map((property) => (
                                <ListingCard key={property._id} property={property} />
                            ))}
                        </div>
                    )}

                    {!loading && properties.length === 0 && (
                        <p className="text-center text-gray-500">No listings found. Please try seeding the database.</p>
                    )}
                </div>
            </div>

            {/* CTA */}
            <div className="bg-gray-100 py-16 text-center">
                <h2 className="text-3xl font-bold mb-4">Are you a property owner?</h2>
                <p className="text-gray-600 mb-6">List your property and reach thousands of students.</p>
                <Link to="/register" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700">List Your Property</Link>
            </div>
        </div >
    );
};

export default Home;
