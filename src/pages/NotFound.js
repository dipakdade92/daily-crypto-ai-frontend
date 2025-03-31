import React from 'react';

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800">404 - Page Not Found</h1>
                <p className="mt-4 text-gray-600">Sorry, the page you are looking for does not exist.</p>
            </div>
        </div>
    );
};

export default NotFound; 