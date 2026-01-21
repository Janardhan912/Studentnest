import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <span className="text-2xl font-bold text-blue-600">StudentNest</span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link to="/about" className="text-gray-700 hover:text-blue-600">About</Link>
                        <Link to="/contact" className="text-gray-700 hover:text-blue-600">Contact</Link>

                        {user ? (
                            <>
                                <span className="text-gray-500">Hi, {user.name}</span>
                                {user.role === 'student' && <Link to="/student/dashboard" className="text-blue-600 hover:text-blue-800">Dashboard</Link>}
                                {user.role === 'owner' && <Link to="/owner/dashboard" className="text-blue-600 hover:text-blue-800">Dashboard</Link>}
                                {user.role === 'admin' && <Link to="/admin/dashboard" className="text-blue-600 hover:text-blue-800">Dashboard</Link>}
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
                                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Register</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
