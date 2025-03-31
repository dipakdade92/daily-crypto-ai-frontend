import axios from "axios";
import apiConfig from "../config/apiConfig"; 

const axiosInstance = axios.create({
  baseURL: apiConfig.API_BASE_URL, 
});

// Add a request interceptor to include the token in headers
const setAuthToken = (token) => {
  if (token) {
    axiosInstance.defaults.headers['Authorization'] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers['Authorization'];
  }
};

export const fetchData = async (token) => {
  setAuthToken(token); 
  try {
    const response = await axiosInstance.get("/data"); 
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; 
  }
};

// Add the login function
export const login = async (email, password) => {
  const payload = {
    email: email,
    password: password,
  };

  try {
    const response = await axiosInstance.post("/api/auth/login", payload);
    localStorage.setItem('token', response.data.token); // Store the token in local storage
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    if (error.response) {
      throw error.response.data;
    } else {
      throw { message: "Network error or server not reachable" };
    }
  }
};

export const register = async (name, email, password) => {
  const payload = {
    name: name,
    email: email,
    password: password,
  };

  try {
    const response = await axiosInstance.post("/api/auth/register", payload);
    return response.payload;
  } catch (error) {
    throw error.response.data;
  }
};

// Fetch all books
export const fetchBooks = async (token) => {
  setAuthToken(token);
  try {
    const response = await axiosInstance.get("/api/auth/books");
    return response.data; // Assuming the response contains the list of books
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
};

// Add a new book
export const addBook = async (token, book) => {
  setAuthToken(token);
  try {
    const response = await axiosInstance.post("/api/auth/book", book);
    return response.data; // Assuming the response contains the added book
  } catch (error) {
    console.error("Error adding book:", error);
    throw error;
  }
};

// Update an existing book
export const updateBook = async (token, id, book) => {
  setAuthToken(token);
  try {
    const response = await axiosInstance.put(`/api/auth/book/${id}`, book);
    return response.data; // Assuming the response contains the updated book
  } catch (error) {
    console.error("Error updating book:", error);
    throw error;
  }
};

// Delete a book
export const deleteBook = async (token, id) => {
  setAuthToken(token);
  try {
    const response = await axiosInstance.delete(`/api/auth/book/${id}`);
    return response.data; // Assuming the response contains a success message
  } catch (error) {
    console.error("Error deleting book:", error);
    throw error;
  }
};

// Fetch a single book by ID
export const getBookById = async (token, id) => {
  setAuthToken(token);
  try {
    const response = await axiosInstance.get(`/api/auth/book/${id}`);
    return response.data; // Assuming the response contains the book details
  } catch (error) {
    console.error("Error fetching book:", error);
    throw error;
  }
};

// Add more API functions as needed

export default axiosInstance;
