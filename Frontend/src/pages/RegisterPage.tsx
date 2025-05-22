import React, { useState, useEffect } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/16/solid';
import axios from 'axios';
import logo from '../assets/logo.png';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      const response = await axios.post('http://127.0.0.1:8000/accounts/api/register/', {
        username: username,
        email: email,
        password: password,
      });
      console.log('Registration successful:', response.data);
  
      // Show success alert
      alert('Account registered successfully! You can now log in.');
  
      // Redirect to the login page
      window.location.href = '/';
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Registration failed:', error.response?.data || error.message);
        alert(
          axios.isAxiosError(error) && error.response?.data?.detail
            ? error.response.data.detail
            : 'Registration failed. Please try again.'
        );
      } else {
        console.error('An unexpected error occurred:', error);
        alert('An unexpected error occurred. Please try again.');
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
          aria-label="Toggle Dark Mode"
          title="Toggle Dark Mode"
        >
          {darkMode ? (
            <SunIcon className="h-5 w-5 text-yellow-400" />
          ) : (
            <MoonIcon className="h-5 w-5 text-gray-600" />
          )}
        </button>
      </div>

      <img src={logo} alt="Logo" className="mb-4 w-24 h-24" />
      <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Register now!</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6 text-center max-w-sm">
        Please enter your credentials to register your account.
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <div>
          <label htmlFor="email" className="block text-left text-gray-700 dark:text-gray-200 mb-1">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="username" className="block text-left text-gray-700 dark:text-gray-200 mb-1">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-left text-gray-700 dark:text-gray-200 mb-1">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="confirm-password" className="block text-left text-gray-700 dark:text-gray-200 mb-1">Confirm Password:</label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          Register
        </button>
      </form>

      <p className="mt-4 text-gray-600 dark:text-gray-300">
        Already have an account?{' '}
        <a href="/" className="text-blue-500 hover:underline">Sign in here</a>
      </p>
    </div>
  );
}

export default RegisterPage;
