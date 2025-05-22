import React, { useState, useEffect } from 'react';
import { SunIcon, MoonIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/16/solid'; // Import eye icons
import axios from 'axios';
import logo from '../assets/logo.png';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/accounts/api/token/', {
        username: username,
        password: password,
      });
      console.log('Login successful:', response.data);

      // Save the access and refresh tokens to localStorage
      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);

      // Show success alert
      alert('Login successful! Redirecting to the dashboard.');

      // Redirect to another page (e.g., dashboard)
      window.location.href = '/home';
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Login failed:', error.response?.data || error.message);
        setErrorMessage(
          axios.isAxiosError(error) && error.response?.data?.detail
            ? error.response.data.detail
            : 'Invalid credentials. Please try again.'
        );
      } else {
        console.error('An unexpected error occurred:', error);
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
    }
  };

  useEffect(() => {
    const savedMode = localStorage.getItem('theme');
    if (savedMode === 'dark') {
      setDarkMode(true);
    }
  }, []);
  
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors px-4">
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white px-3 py-1 rounded transition flex items-center justify-center"
        >
          {darkMode ? (
            <SunIcon className="h-5 w-5 text-yellow-400" /> 
          ) : (
            <MoonIcon className="h-5 w-5 text-gray-600" /> 
          )}
        </button>
      </div>

      <img src={logo} alt="Logo" className="mb-6 w-24 h-24" />
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Welcome to FinTeach!</h1>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
        Please enter your credentials to log in.
      </p>

      {errorMessage && (
        <p className="text-red-500 mb-4">{errorMessage}</p>
      )}

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <div>
          <label htmlFor="username" className="block text-left text-gray-700 dark:text-gray-200 mb-1">
            Username:
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="relative">
          <label htmlFor="password" className="block text-left text-gray-700 dark:text-gray-200 mb-1">
            Password:
          </label>
          <input
            type={showPassword ? 'text' : 'password'} // Toggle between 'text' and 'password'
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)} // Toggle visibility
            className="absolute inset-y-0 right-3 flex items-center"
            aria-label="Toggle password visibility"
          >
            {showPassword ? (
              <EyeSlashIcon className="mt-7 h-5 w-5 text-gray-500" /> // Eye-off icon for hiding password
            ) : (
              <EyeIcon className="mt-7 h-5 w-5 text-gray-500" /> // Eye icon for showing password
            )}
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          Login
        </button>
      </form>

      <p className="mt-4 text-gray-600 dark:text-gray-300">
        Don't have an account?{' '}
        <a href="/register" className="text-blue-500 hover:underline">
          Register here
        </a>
      </p>
    </div>
  );
}

export default LoginPage;