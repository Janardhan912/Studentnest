import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const AddProperty = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        rent: '',
        deposit: '',
        address: '',
        city: '',
        genderAllowed: 'any',
        amenities: '', // comma separated strings
        rules: '',
        description: '',
        images: '' // comma separated urls for now
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                amenities: formData.amenities.split(',').map(s => s.trim()),
                rules: formData.rules.split(',').map(s => s.trim()),
                images: formData.images.split(',').map(s => s.trim())
            };

            await api.post('/properties', payload);
            navigate('/owner/dashboard');
        } catch (error) {
            console.error('Failed to add property', error);
            alert('Failed to add property');
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">List New Property</h1>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
                <div>
                    <label className="block text-gray-700 mb-1">Property Title</label>
                    <input type="text" required className="w-full border p-2 rounded"
                        value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 mb-1">Rent (₹/mo)</label>
                        <input type="number" required className="w-full border p-2 rounded"
                            value={formData.rent} onChange={e => setFormData({ ...formData, rent: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1">Deposit (₹)</label>
                        <input type="number" required className="w-full border p-2 rounded"
                            value={formData.deposit} onChange={e => setFormData({ ...formData, deposit: e.target.value })} />
                    </div>
                </div>

                <div>
                    <label className="block text-gray-700 mb-1">Address</label>
                    <textarea required className="w-full border p-2 rounded"
                        value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })}></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 mb-1">City</label>
                        <input type="text" required className="w-full border p-2 rounded"
                            value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1">Gender Allowed</label>
                        <select className="w-full border p-2 rounded"
                            value={formData.genderAllowed} onChange={e => setFormData({ ...formData, genderAllowed: e.target.value })}>
                            <option value="any">Any</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-gray-700 mb-1">Amenities (comma separated)</label>
                    <input type="text" className="w-full border p-2 rounded" placeholder="WiFi, AC, Gym"
                        value={formData.amenities} onChange={e => setFormData({ ...formData, amenities: e.target.value })} />
                </div>

                <div>
                    <label className="block text-gray-700 mb-1">Rules (comma separated)</label>
                    <input type="text" className="w-full border p-2 rounded" placeholder="No smoking, No pets"
                        value={formData.rules} onChange={e => setFormData({ ...formData, rules: e.target.value })} />
                </div>

                <div>
                    <label className="block text-gray-700 mb-1">Image URLs (comma separated)</label>
                    <input type="text" className="w-full border p-2 rounded" placeholder="http://..., http://..."
                        value={formData.images} onChange={e => setFormData({ ...formData, images: e.target.value })} />
                </div>

                <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700">Submit Listing</button>
            </form>
        </div>
    );
};

export default AddProperty;
