import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal'; 
import ConfirmationModal from '../components/ConfirmationModal';
import { useAuth } from '../AuthContext';
import { fetchBooks, addBook, updateBook, deleteBook } from '../api/apiService'; 
import { toast } from 'react-toastify'; 
import { BookOpen, Edit2, Trash2, Plus, Library } from 'lucide-react';

const Home = () => {
    const { token } = useAuth();
    const [books, setBooks] = useState([]); 
    const [bookTitle, setBookTitle] = useState(''); 
    const [bookAuthor, setBookAuthor] = useState(''); 
    const [editingIndex, setEditingIndex] = useState(null); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false); 
    const [bookToDelete, setBookToDelete] = useState(null); 

    useEffect(() => {
        const loadBooks = async () => {
            try {
                const fetchedBooks = await fetchBooks(token);
                setBooks(fetchedBooks?.data);
            } catch (error) {
                toast.error("Failed to fetch books.");
            }
        };
        loadBooks();
    }, [token]);

    const handleAddBook = async () => {
        const newBook = { name: bookTitle, author: bookAuthor };
        const addedBook = await addBook(token, newBook);

        if (addedBook && addedBook.data?._id) {
            setBooks(prevBooks => [...prevBooks, addedBook?.data]); 
        } else {
            toast.error("Failed to add book. Please try again.");
        }

        setBookTitle('');
        setBookAuthor('');
        setIsModalOpen(false); 
        toast.success(addedBook?.message);
    };

    const handleEditBook = (book) => {
        console.log(book)
        setBookTitle(book.name);
        setBookAuthor(book.author);
        setEditingIndex(book._id);
        setIsModalOpen(true); 
    };

    const handleUpdateBook = async (updatedBook) => {
        try {
            await updateBook(token, editingIndex, updatedBook);
            setBooks(prevBooks => prevBooks.map(book => 
                book._id === editingIndex ? { ...book, ...updatedBook } : book
            ));
            toast.success("Book updated successfully.");
        } catch (error) {
            toast.error("Failed to update book.");
        }
        setBookTitle('');
        setBookAuthor('');
        setIsModalOpen(false); 
        setEditingIndex(null);
    };

    const handleDeleteBook = (id) => {
        setBookToDelete(id); 
        setIsConfirmationOpen(true); 
    };

    const confirmDelete = async () => {
        await deleteBook(token, bookToDelete);
        setBooks(prevBooks => prevBooks.filter(book => book._id !== bookToDelete));
        setIsConfirmationOpen(false); 
        setBookToDelete(null); 
        toast.success("Book deleted successfully");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-400 to-pink-500 p-6">
            <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden h-full backdrop-blur-lg bg-opacity-95">
                <div className="p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center">
                            <Library className="w-8 h-8 text-indigo-600 mr-3" />
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                My Bookshelf
                            </h1>
                        </div>
                        <button
                            onClick={() => {
                                setBookTitle('');
                                setBookAuthor('');
                                setEditingIndex(null);
                                setIsModalOpen(true); 
                            }}
                            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition duration-300 flex items-center shadow-md"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Add Book
                        </button>
                    </div>

                    {books?.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {books.map((book) => (
                                <div key={book._id} className="relative bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg border border-indigo-100">
                                    <div className="flex items-start mb-2">
                                        <BookOpen className="w-5 h-5 text-indigo-500 mr-2 mt-1" />
                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold text-gray-800">{book.name}</h3>
                                            <p className="text-gray-600 italic">by {book.author}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-end mt-4 space-x-2">
                                        <button
                                            onClick={() => handleEditBook(book)}
                                            className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-full transition-colors"
                                            aria-label="Edit book"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteBook(book._id)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                            aria-label="Delete book"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-xl">
                            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">Your bookshelf is empty. Add your first book!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal for adding/editing books */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={editingIndex ? handleUpdateBook : handleAddBook}
                bookTitle={bookTitle}
                editingIndex={editingIndex}
                setBookTitle={setBookTitle}
                bookAuthor={bookAuthor}
                setBookAuthor={setBookAuthor}
            />

            {/* Confirmation Modal for deleting books */}
            <ConfirmationModal
                isOpen={isConfirmationOpen}
                onClose={() => setIsConfirmationOpen(false)}
                onConfirm={confirmDelete}
                message="Are you sure you want to delete this book?"
            />
        </div>
    );
};

export default Home;