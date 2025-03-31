import React from 'react';
import { User } from 'lucide-react';

const Home = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-4">
            <div className="w-full bg-white shadow-2xl rounded-2xl overflow-hidden h-full">
                <div className="p-8">
                    <div className="flex items-center justify-between">
                        <h4 className="text-xl font-bold text-gray-800">
                            Add Your Books From Here
                        </h4>
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200">
                        Add Book</button>
                      
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Home; 