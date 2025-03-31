import React from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(); // Clear token and user information
        navigate('/auth'); // Redirect to the auth page
    };

    return (
        <header className="flex justify-between items-center p-4 bg-white shadow-md">
            <h1 className="text-xl font-bold">My Application</h1>
            <button 
                onClick={handleLogout} 
                className="text-blue-500 underline"
            >
                Logout
            </button>
        </header>
    );
};

export default Header; 