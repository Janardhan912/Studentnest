import { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('owners');
    const [pendingOwners, setPendingOwners] = useState([]);
    const [pendingProperties, setPendingProperties] = useState([]);
    const [reports, setReports] = useState([]);

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        try {
            if (activeTab === 'owners') {
                const { data } = await api.get('/admin/pending-owners');
                setPendingOwners(data);
            } else if (activeTab === 'properties') {
                const { data } = await api.get('/admin/pending-properties');
                setPendingProperties(data);
            } else {
                const { data } = await api.get('/admin/reports');
                setReports(data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleVerifyOwner = async (id) => {
        await api.post(`/admin/verify-owner/${id}`);
        loadData();
    };

    const handleVerifyProperty = async (id) => {
        await api.post(`/admin/verify-property/${id}`);
        loadData();
    };

    const handleReportAction = async (id, action) => {
        await api.post(`/admin/action/report/${id}`, { action });
        loadData();
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

            <div className="flex space-x-4 mb-6 border-b">
                <button
                    className={`pb-2 px-4 ${activeTab === 'owners' ? 'border-b-2 border-blue-600 text-blue-600 font-bold' : 'text-gray-600'}`}
                    onClick={() => setActiveTab('owners')}
                >
                    Verify Owners
                </button>
                <button
                    className={`pb-2 px-4 ${activeTab === 'properties' ? 'border-b-2 border-blue-600 text-blue-600 font-bold' : 'text-gray-600'}`}
                    onClick={() => setActiveTab('properties')}
                >
                    Verify Properties
                </button>
                <button
                    className={`pb-2 px-4 ${activeTab === 'reports' ? 'border-b-2 border-blue-600 text-blue-600 font-bold' : 'text-gray-600'}`}
                    onClick={() => setActiveTab('reports')}
                >
                    Reports
                </button>
            </div>

            <div className="bg-white rounded shadow text-sm"> {/* text-sm for density */}
                {activeTab === 'owners' && (
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-4">Name</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Phone</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingOwners.map(owner => (
                                <tr key={owner._id} className="border-b">
                                    <td className="p-4">{owner.name}</td>
                                    <td className="p-4">{owner.email}</td>
                                    <td className="p-4">{owner.phone}</td>
                                    <td className="p-4">
                                        <button onClick={() => handleVerifyOwner(owner._id)} className="bg-green-600 text-white px-3 py-1 rounded">Verify</button>
                                    </td>
                                </tr>
                            ))}
                            {pendingOwners.length === 0 && <tr><td colSpan="4" className="p-4 text-center text-gray-500">No pending owners.</td></tr>}
                        </tbody>
                    </table>
                )}

                {activeTab === 'properties' && (
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-4">Title</th>
                                <th className="p-4">Owner</th>
                                <th className="p-4">Address</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingProperties.map(prop => (
                                <tr key={prop._id} className="border-b">
                                    <td className="p-4">{prop.title}</td>
                                    <td className="p-4">{prop.ownerId.name}</td>
                                    <td className="p-4">{prop.address}, {prop.city}</td>
                                    <td className="p-4">
                                        <button onClick={() => handleVerifyProperty(prop._id)} className="bg-green-600 text-white px-3 py-1 rounded">Verify</button>
                                    </td>
                                </tr>
                            ))}
                            {pendingProperties.length === 0 && <tr><td colSpan="4" className="p-4 text-center text-gray-500">No pending properties.</td></tr>}
                        </tbody>
                    </table>
                )}

                {activeTab === 'reports' && (
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-4">Property</th>
                                <th className="p-4">Reported By</th>
                                <th className="p-4">Reason</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map(rep => (
                                <tr key={rep._id} className="border-b">
                                    <td className="p-4">{rep.propertyId?.title || 'Deleted'}</td>
                                    <td className="p-4">{rep.reportedBy.name}</td>
                                    <td className="p-4">{rep.reason}</td>
                                    <td className="p-4">{rep.status}</td>
                                    <td className="p-4 flex gap-2">
                                        {rep.status === 'open' && (
                                            <>
                                                <button onClick={() => handleReportAction(rep._id, 'resolve')} className="bg-blue-600 text-white px-3 py-1 rounded">Resolve</button>
                                                <button onClick={() => handleReportAction(rep._id, 'remove-property')} className="bg-red-600 text-white px-3 py-1 rounded">Delete Prop</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {reports.length === 0 && <tr><td colSpan="5" className="p-4 text-center text-gray-500">No reports.</td></tr>}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
