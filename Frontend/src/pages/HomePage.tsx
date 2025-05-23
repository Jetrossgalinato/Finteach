import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import { Link, useNavigate } from 'react-router-dom'; 
import { SunIcon, MoonIcon } from '@heroicons/react/16/solid'; 

function HomePage() {
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate(); 

  useEffect(() => {
    const savedMode = localStorage.getItem('theme');
    if (savedMode === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
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

  const handleLogout = () => {
    localStorage.removeItem('accessToken'); 
    localStorage.removeItem('refreshToken'); 
    alert('You have been logged out.');
    navigate('/'); 
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      {/* Dark Mode Toggler */}
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

      {/* Sidebar */}
      <div className="w-64 bg-gray-800 dark:bg-gray-700 text-white flex flex-col">
        <div className="flex items-center justify-center h-20 border-b border-gray-700">
          <img src={logo} alt="Logo" className="h-12 w-12" />
          <h1 className="text-xl font-bold ml-2">FinTeach</h1>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-4">
            <li>
              <Link to="/home" className="block px-4 py-2 rounded hover:bg-gray-700">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="block px-4 py-2 rounded hover:bg-gray-700">
                About
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="block px-4 py-2 rounded hover:bg-gray-700">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/settings" className="block px-4 py-2 rounded hover:bg-gray-700">
                Settings
              </Link>
            </li>
          </ul>
        </nav>
        {/* Log Out Button */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500 transition"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">This is the Home Page</h1>
        <p className="text-gray-700 dark:text-gray-300">Welcome to the FinTeach platform!</p>
      </div>
    </div>
  );
}

export default HomePage;