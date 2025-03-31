import "./App.css";
import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Auth from './components/Auth';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Profile from './components/Profile';
import Home from './pages/Home';
import Header from './components/Header';
import NotFound from './pages/NotFound';
import { AuthProvider, useAuth } from './AuthContext';

const PrivateRoute = ({ element }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>; 
    }

    return isAuthenticated ? element : <Navigate to="/auth" />;
};

const AppRoutes = () => {
    const location = useLocation(); 
    const isAuthPage = location.pathname === '/auth'; 

    return (
        <>
            {!isAuthPage && <Header />}
            <Routes>
                <Route path="/home" element={<PrivateRoute element={<Home />} />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
                <Route path="/" element={<Navigate to="/auth" />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <AppRoutes /> 
                <ToastContainer />
            </Router>
        </AuthProvider>
    );
};

export default App;
