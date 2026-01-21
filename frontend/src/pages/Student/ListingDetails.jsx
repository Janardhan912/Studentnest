import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import { FaMapMarkerAlt, FaStar } from 'react-icons/fa';

const ListingDetails = () => {
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const { data } = await api.get(`/properties/${id}`);
                setProperty(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchProperty();
    }, [id]);

    if (loading) return <div className="p-10 text-center">Loading...</div>;
    if (!property) return <div className="p-10 text-center">Property not found</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="h-96 bg-gray-300">
                    <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
                </div>

                <div className="p-8">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
                            <p className="flex items-center text-gray-600"><FaMapMarkerAlt className="mr-2" /> {property.address}, {property.city}</p>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-blue-600">₹{property.rent}</div>
                            <div className="text-gray-500">Deposit: ₹{property.deposit}</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                        <div className="md:col-span-2">
                            <h2 className="text-xl font-bold mb-4">Description</h2>
                            <p className="text-gray-700 mb-6">A great place to stay near campus.</p>

                            <h2 className="text-xl font-bold mb-4">Amenities</h2>
                            <div className="flex flex-wrap gap-2 mb-6">
                                {property.amenities.map(item => (
                                    <span key={item} className="bg-gray-100 px-3 py-1 rounded-full text-sm">{item}</span>
                                ))}
                            </div>

                            <h2 className="text-xl font-bold mb-4">Rules</h2>
                            <ul className="list-disc pl-5 mb-6">
                                {property.rules.map(rule => <li key={rule}>{rule}</li>)}
                            </ul>

                            {/* Map Placeholder */}
                            <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                                GMaps Integration (Needs Key)
                            </div>
                        </div>

                        <div>
                            <div className="bg-gray-50 p-6 rounded-lg border">
                                <h3 className="font-bold text-lg mb-4">Owner Contact</h3>
                                <p className="mb-2"><strong>Name:</strong> {property.ownerId.name}</p>
                                <p className="mb-2"><strong>Email:</strong> {property.ownerId.email}</p>
                                <button className="w-full bg-blue-600 text-white py-3 rounded mt-4 font-bold hover:bg-blue-700">Book Now</button>
                                <button className="w-full border border-gray-300 text-gray-700 py-3 rounded mt-2 hover:bg-gray-50">Bookmark</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListingDetails;
