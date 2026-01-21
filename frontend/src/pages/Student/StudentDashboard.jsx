import { useState, useEffect } from 'react';
import api from '../../services/api';
import ListingCard from '../../components/ListingCard';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
    const [properties, setProperties] = useState([]);
    const [filters, setFilters] = useState({
        city: '',
        genderAllowed: '',
        verified: true
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProperties();
    }, [filters]);

    const fetchProperties = async () => {
        try {
            setLoading(true);
            const query = new URLSearchParams(filters).toString();
            const { data } = await api.get(`/properties?${query}`);
            setProperties(data.properties);
        } catch (error) {
            console.error('Failed to fetch properties', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Available Housing</h1>
                <Link to="/student/match" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                    Find Roommate
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow mb-8 flex flex-wrap gap-4">
                <select
                    name="city"
                    value={filters.city}
                    onChange={handleFilterChange}
                    className="p-2 border rounded"
                >
                    <option value="">All Cities</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Pune">Pune</option>
                    <option value="Delhi">Delhi</option>
                </select>

                <select
                    name="genderAllowed"
                    value={filters.genderAllowed}
                    onChange={handleFilterChange}
                    className="p-2 border rounded"
                >
                    <option value="">Any Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="any">Co-ed</option>
                </select>

                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="verified"
                        checked={filters.verified}
                        onChange={(e) => setFilters({ ...filters, verified: e.target.checked })}
                    />
                    <span>Verified Only</span>
                </label>
            </div>

            {loading ? (
                <div className="text-center py-20">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {properties.map(property => (
                        <ListingCard key={property._id} property={property} />
                    ))}
                    {properties.length === 0 && (
                        <div className="col-span-full text-center text-gray-500 py-10">No properties found.</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;
