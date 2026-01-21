import { useState, useEffect } from 'react';
import api from '../../services/api';

const RoommateMatching = () => {
    const [matches, setMatches] = useState([]);
    const [preferences, setPreferences] = useState({});
    const [loading, setLoading] = useState(true);
    const [showPrefs, setShowPrefs] = useState(false);

    useEffect(() => {
        fetchMatches();
    }, [showPrefs]); // Refetch if prefs closed (saved)

    const fetchMatches = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/match/recommendations');
            setMatches(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePrefs = async (e) => {
        e.preventDefault();
        try {
            await api.post('/match/preferences', preferences);
            setShowPrefs(false);
            alert('Preferences updated!');
        } catch (error) {
            alert('Failed to update');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Roommate Matches</h1>
                <button
                    onClick={() => setShowPrefs(!showPrefs)}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    {showPrefs ? 'Close Preferences' : 'Update Preferences'}
                </button>
            </div>

            {showPrefs && (
                <div className="bg-white p-6 rounded shadow mb-8">
                    <h2 className="text-xl font-bold mb-4">Edit Preferences</h2>
                    <form onSubmit={handleUpdatePrefs} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Simplified form fields for brevity in this single shot */}
                        <div>
                            <label className="block mb-1">Budget Max</label>
                            <input
                                type="number"
                                className="w-full border p-2 rounded"
                                value={preferences.budget?.max || ''}
                                onChange={(e) => setPreferences({
                                    ...preferences,
                                    budget: { ...preferences.budget, max: Number(e.target.value) }
                                })}
                            />
                        </div>
                        {/* Add other fields as needed */}
                        <div className="col-span-full">
                            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded">Save</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid gap-6">
                {matches.map((match) => (
                    <div key={match.user._id} className="bg-white p-6 rounded-lg shadow flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-bold">{match.user.name}</h3>
                            <p className="text-gray-600">{match.user.collegeName}</p>
                            <div className="mt-2 flex gap-2">
                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Score: {match.score}%</span>
                            </div>
                        </div>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Connect</button>
                    </div>
                ))}
                {matches.length === 0 && !loading && <div>No matches found. Update your preferences!</div>}
            </div>
        </div>
    );
};

export default RoommateMatching;
