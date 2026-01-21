import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaStar, FaRupeeSign } from 'react-icons/fa';

const ListingCard = ({ property }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <img
                src={property.images[0] || 'https://via.placeholder.com/400x250'}
                alt={property.title}
                className="w-full h-48 object-cover"
            />
            <div className="p-4">
                <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold mb-2 truncate">{property.title}</h3>
                    {property.verified && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold">
                            Verified
                        </span>
                    )}
                </div>

                <div className="flex items-center text-gray-600 mb-2">
                    <FaMapMarkerAlt className="mr-1" />
                    <span className="truncate">{property.city}</span>
                </div>

                <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center text-yellow-500">
                        <FaStar className="mr-1" />
                        <span className="font-bold text-gray-700">{property.ratingAvg.toFixed(1)} ({property.ratingCount})</span>
                    </div>
                    <div className="flex items-center text-blue-600 font-bold text-lg">
                        <FaRupeeSign />
                        {property.rent}
                        <span className="text-sm text-gray-500 font-normal ml-1">/mo</span>
                    </div>
                </div>

                <Link
                    to={`/properties/${property._id}`}
                    className="block mt-4 text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default ListingCard;
