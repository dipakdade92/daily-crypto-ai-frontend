import React from 'react';
import { X, BookOpen, User } from 'lucide-react';

const Modal = ({ isOpen, onClose, onSubmit, bookTitle, setBookTitle, bookAuthor, setBookAuthor, editingIndex }) => {
    if (!isOpen) return null;
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const newBook = { name: bookTitle, author: bookAuthor };
        onSubmit(newBook); 
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50 transition-all duration-300">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl transform transition-all duration-300">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        {editingIndex ? 'Edit Book' : 'Add New Book'}
                    </h2>
                    <button 
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>
                
                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Book Title</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <BookOpen className="h-5 w-5 text-indigo-500" />
                            </div>
                            <input
                                type="text"
                                value={bookTitle}
                                onChange={(e) => setBookTitle(e.target.value)}
                                className="block w-full pl-10 pr-3 py-3 border-2 border-indigo-100 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-indigo-50 rounded-lg transition-all duration-200 outline-none"
                                placeholder="Enter book title"
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Author</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-indigo-500" />
                            </div>
                            <input
                                type="text"
                                value={bookAuthor}
                                onChange={(e) => setBookAuthor(e.target.value)}
                                className="block w-full pl-10 pr-3 py-3 border-2 border-indigo-100 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-indigo-50 rounded-lg transition-all duration-200 outline-none"
                                placeholder="Enter author name"
                                required
                            />
                        </div>
                    </div>
                    
                    {/* Buttons */}
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        >
                            {editingIndex ? 'Update Book' : 'Add Book'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Modal;