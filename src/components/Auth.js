import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { login, register } from '../api/apiService';
import { Lock, Mail, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login: authLogin } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        if (e.target.name === 'name') {
            setName(e.target.value);
        } else if (e.target.name === 'email') {
            setEmail(e.target.value);
        } else if (e.target.name === 'password') {
            setPassword(e.target.value);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        // email validation
        if (!/\S+@\S+\.\S+/.test(email)) {
            toast.error('Please enter a valid email address');
            setLoading(false);
            return;
        }

        try {
            const data = await register(name, email, password); 
            toast.success('Registration successful!');
            
            // Navigate to login page after successful registration
            setTimeout(() => {
                setIsLogin(true); 
            }, 2000); 
        } catch (error) {
            toast.error(error.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        if (!/\S+@\S+\.\S+/.test(email)) {
            toast.error('Please enter a valid email address');
            setLoading(false);
            return;
        }

        try {
            const response = await login(email, password); 
            const { token, user } = response;
            toast.success('Login successful!');
            authLogin(token); 
            
            // Store user information in local storage
            localStorage.setItem('user', JSON.stringify(user)); 
            localStorage.setItem('token', token); 
            
            navigate('/home'); 
        } catch (error) {
            toast.error(error.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl overflow-hidden">
                <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-3xl font-bold text-gray-800">
                            {isLogin ? 'Welcome Back' : 'Create Account'}
                        </h2>
                        <div className="text-sm text-gray-500">
                            {isLogin ? 'Sign in to continue' : 'Let\'s get started'}
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}

                    <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
                        {!isLogin && (
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="name"
                                    value={name}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
                                    placeholder="Full Name"
                                    required
                                />
                            </div>
                        )}

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
                                placeholder="Email Address"
                                required
                            />
                        </div>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="password"
                                name="password"
                                value={password}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
                                placeholder="Password"
                                required
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg hover:opacity-90 transition duration-300 flex items-center justify-center space-x-2 disabled:opacity-50"
                        >
                            {loading ? (
                                <span>Logging in...</span>
                            ) : (
                                <>
                                    <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                                    <ArrowRight className="h-5 w-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button 
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-purple-600 hover:text-purple-800 transition duration-300"
                        >
                            {isLogin 
                                ? 'Don\'t have an account? Sign Up' 
                                : 'Already have an account? Sign In'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth; 