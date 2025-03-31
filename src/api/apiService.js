import axios from "axios";
import apiConfig from "../config/apiConfig"; // Import the configuration

const axiosInstance = axios.create({
  baseURL: apiConfig.API_BASE_URL, // Use the base URL from the configuration
  // other axios settings...
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
  setAuthToken(token); // Set the token for the request
  try {
    const response = await axiosInstance.get("/data"); // Adjust the endpoint as needed
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Rethrow the error for further handling
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

// Add more API functions as needed

export default axiosInstance;
