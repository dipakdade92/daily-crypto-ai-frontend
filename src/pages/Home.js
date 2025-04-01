import React, { useState, useEffect, useRef } from 'react';
import Modal from '../components/Modal'; 
import ConfirmationModal from '../components/ConfirmationModal';
import { useAuth } from '../AuthContext';
import { fetchBooks, addBook, updateBook, deleteBook } from '../api/apiService'; 
import { toast } from 'react-toastify'; 
import { BookOpen, Edit2, Trash2, Plus, Library, ChevronLeft, ChevronRight } from 'lucide-react';

const Home = () => {
    const { token } = useAuth();
    const [books, setBooks] = useState([]); 
    const [bookTitle, setBookTitle] = useState(''); 
    const [bookAuthor, setBookAuthor] = useState(''); 
    const [editingIndex, setEditingIndex] = useState(null); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false); 
    const [bookToDelete, setBookToDelete] = useState(null);
    
    // Carousel state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [cardsPerPage, setCardsPerPage] = useState(4);
    const carouselRef = useRef(null);

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

    useEffect(() => {
        // Update total pages based on screen size
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setCardsPerPage(6);
            } else if (window.innerWidth < 768) {
                setCardsPerPage(6); 
            } else if (window.innerWidth < 1024) {
                setCardsPerPage(12); 
            } else {
                setCardsPerPage(12); 
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        // Calculate total pages
        if (books?.length && cardsPerPage) {
            setTotalPages(Math.ceil(books.length / cardsPerPage));
        } else {
            setTotalPages(1);
        }
        
        // Reset current page if needed
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(1);
        }
    }, [books, cardsPerPage]);

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
        setBookTitle(book.name);
        setBookAuthor(book.author);
        setEditingIndex(book._id);
        setIsModalOpen(true); 
    };

    const handleUpdateBook = async (updatedBook) => {
        try {
            await updateBook(token, editingIndex, updatedBook);
            setBooks(prevBooks => prevBooks?.map(book => 
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

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Get books for current page
    const getCurrentPageBooks = () => {
        const startIndex = (currentPage - 1) * cardsPerPage;
        const endIndex = startIndex + cardsPerPage;
        return books?.slice(startIndex, endIndex) || [];
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-400 to-pink-500 p-3 sm:p-6">
            <div className="max-w-full mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden h-full bg-opacity-100">
                <div className="p-4 sm:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
                        <div className="flex items-center">
                            <Library className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600 mr-2 sm:mr-3" />
                        </div>
                        <button
                            onClick={() => {
                                setBookTitle('');
                                setBookAuthor('');
                                setEditingIndex(null);
                                setIsModalOpen(true); 
                            }}
                            className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition duration-300 flex items-center justify-center sm:justify-start shadow-md"
                        >
                            <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                            Add Book
                        </button>
                    </div>

                    {books?.length > 0 ? (
                        <div className="relative">
                            {/* Navigation arrows */}
                            <div className="absolute  bottom-0 transform -translate-y-1/2 z-10">
                                <button 
                                    onClick={goToPrevPage}
                                    disabled={currentPage === 1}
                                    className={`p-2 rounded-full bg-white shadow-lg text-indigo-600 hover:bg-indigo-100 transition-colors ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    aria-label="Previous page"
                                >
                                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                                </button>
                            </div>

                            {/* Carousel Content */}
                            <div 
                                ref={carouselRef}
                                className="overflow-hidden pb-8"
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                                    {getCurrentPageBooks().map((book) => (
                                        <div key={book._id} className="relative bg-white border border-indigo-100 p-3 sm:p-4 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg h-full">
                                            <div className="flex items-start mb-2">
                                                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500 mr-2 mt-1 flex-shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 truncate">{book?.name}</h3>
                                                    <p className="text-sm sm:text-base text-gray-600 italic truncate">by {book?.author}</p>
                                                </div>
                                            </div>
                                            <div className="flex justify-end mt-3 sm:mt-4 space-x-1 sm:space-x-2">
                                                <button
                                                    onClick={() => handleEditBook(book)}
                                                    className="p-1 sm:p-2 text-indigo-600 hover:bg-indigo-100 rounded-full transition-colors"
                                                    aria-label="Edit book"
                                                >
                                                    <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteBook(book?._id)}
                                                    className="p-1 sm:p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                                    aria-label="Delete book"
                                                >
                                                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Navigation arrow right */}
                            <div className="absolute right-0 bottom-0 transform -translate-y-1/2 z-10">
                                <button 
                                    onClick={goToNextPage}
                                    disabled={currentPage === totalPages}
                                    className={`p-2 rounded-full bg-white shadow-lg text-indigo-600 hover:bg-indigo-100 transition-colors ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    aria-label="Next page"
                                >
                                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                                </button>
                            </div>

                            {/* Page indicator */}
                            <div className="flex justify-center mt-4">
                                <div className="bg-indigo-100 rounded-full px-3 py-1 text-indigo-800 text-sm font-medium">
                                    Page {currentPage} of {totalPages}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-xl">
                            <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
                            <p className="text-gray-500 text-base sm:text-lg">Your bookshelf is empty. Add your first book!</p>
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