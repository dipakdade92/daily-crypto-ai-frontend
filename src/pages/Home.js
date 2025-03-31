import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal'; 
import ConfirmationModal from '../components/ConfirmationModal';
import { useAuth } from '../AuthContext';
import { fetchBooks, addBook, updateBook, deleteBook } from '../api/apiService'; 
import { toast } from 'react-toastify'; 


const Home = () => {
    const { token } = useAuth(); // Get the token from AuthContext
    const [books, setBooks] = useState([]); 
    const [bookTitle, setBookTitle] = useState(''); 
    const [bookAuthor, setBookAuthor] = useState(''); 
    const [editingIndex, setEditingIndex] = useState(null); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false); 
    const [bookToDelete, setBookToDelete] = useState(null); 

    // Fetch books on component mount
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
        setEditingIndex(book._id); // Store the book ID for updating
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
        setEditingIndex(null); // Reset editing index
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
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-4">
            <div className="w-full bg-white shadow-2xl rounded-2xl overflow-hidden h-full">
                <div className="p-8">
                    <h4 className="text-xl font-bold text-gray-800 mb-4">
                        Manage Your Book Collection
                    </h4>
                    <button
                        onClick={() => {
                            setBookTitle('');
                            setBookAuthor('');
                            setEditingIndex(null);
                            setIsModalOpen(true); 
                        }}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 mb-4"
                    >
                        Add Book
                    </button>

                    <h5 className="text-lg font-semibold mb-2">Your Books:</h5>
                    <ul className="list-disc pl-5">
                        {books?.map((book) => (
                            <li key={book._id} className="flex justify-between items-center mb-2">
                                <span>{book.name} by {book.author}</span>
                                <div>
                                    <button
                                        onClick={() => handleEditBook(book)}
                                        className="text-blue-500 hover:underline mr-2"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteBook(book._id)}
                                        className="text-red-500 hover:underline"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Modal for adding/editing books */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={editingIndex ? handleUpdateBook : handleAddBook} // Call the appropriate function
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