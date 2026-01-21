import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Public/Home';
import Login from './pages/Public/Login';
import Register from './pages/Public/Register';

// Student Pages
import StudentDashboard from './pages/Student/StudentDashboard';
import RoommateMatching from './pages/Student/RoommateMatching';
import ListingDetails from './pages/Student/ListingDetails';

// Owner Pages
import OwnerDashboard from './pages/Owner/OwnerDashboard';
import AddProperty from './pages/Owner/AddProperty';

// Admin Pages
import AdminDashboard from './pages/Admin/AdminDashboard';

function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="min-h-screen bg-gray-50 font-sans">
                    <Navbar />
                    <Routes>
                        {/* Public */}
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/about" element={<div className="p-10 text-center text-2xl">About: Secure Student Housing Portal</div>} />
                        <Route path="/contact" element={<div className="p-10 text-center text-2xl">Contact: support@studentnest.com</div>} />

                        {/* Protected Student Routes */}
                        <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                            <Route path="/student/dashboard" element={<StudentDashboard />} />
                            <Route path="/student/match" element={<RoommateMatching />} />
                            <Route path="/properties/:id" element={<ListingDetails />} />
                        </Route>

                        {/* Protected Owner Routes */}
                        <Route element={<ProtectedRoute allowedRoles={['owner']} />}>
                            <Route path="/owner/dashboard" element={<OwnerDashboard />} />
                            <Route path="/owner/add-property" element={<AddProperty />} />
                            <Route path="/owner/properties/:id" element={<ListingDetails />} />
                        </Route>

                        {/* Protected Admin Routes */}
                        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                            <Route path="/admin/dashboard" element={<AdminDashboard />} />
                        </Route>
                    </Routes>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;
