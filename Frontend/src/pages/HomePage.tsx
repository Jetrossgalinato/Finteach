import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SunIcon, MoonIcon } from '@heroicons/react/16/solid';
import Sidebar from '../components/Sidebar';
import AI from '../assets/AI.jpg';
import Education from '../assets/educ.jpg';
import Tools from '../assets/tools.jpg';
import Advisors from '../assets/advisor.jpg';

function HomePage() {
  const [darkMode, setDarkMode] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  // Auth Guard: Check if the user is authenticated
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      navigate('/'); 
    }
  }, [navigate]);

  // Fetch the user's name from the Django backend
  useEffect(() => {
    const fetchUserName = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.error('No access token found');
        return;
      }
  
      try {
        const response = await fetch('http://127.0.0.1:8000/accounts/api/user/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: 'include', // Include cookies if using session-based auth
        });
  
        if (response.ok) {
          const data = await response.json();
          setUserName(data.username); // Set the username from the backend
        } else if (response.status === 401) {
          console.error('Unauthorized: Invalid or expired token');
          navigate('/'); // Redirect to login page
        } else {
          console.error('Failed to fetch user details:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
  
    fetchUserName();
  }, [navigate]);

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
    sessionStorage.removeItem('username');
    alert('You have been logged out.');
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      {/* Dark Mode Toggler */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="mt-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white px-3 py-1 rounded transition flex items-center justify-center"
        >
          {darkMode ? (
            <SunIcon className="h-5 w-5 text-yellow-400" />
          ) : (
            <MoonIcon className="h-5 w-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <Sidebar handleLogout={handleLogout} />

      {/* Main Content */}
      <div className="flex-1 p-8 space-y-16">
        {/* Hero Section */}
        <section className="mt-9 text-center bg-blue-500 dark:bg-blue-700 text-white py-16 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-4">Welcome back, {userName}!</h1>
          <p className="text-lg mb-6">Learn, plan, and grow with expert-backed financial insights and AI-powered advice.</p>
          <div className="space-x-4">
            <button className="bg-white dark:bg-gray-800 text-blue-500 dark:text-white px-6 py-2 rounded-md font-bold hover:bg-gray-100 dark:hover:bg-gray-700">
              Get Started
            </button>
            <button className="bg-blue-600 dark:bg-blue-800 px-6 py-2 rounded-md font-bold hover:bg-blue-700 dark:hover:bg-blue-900">
              Talk to Our AI Advisor
            </button>
          </div>
        </section>

        {/* Key Features */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center">
            <img
              src={AI}
              alt="AI-Powered Financial Advice"
              className="h-24 w-24 object-cover rounded-full mb-4 shadow"
            />
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">AI-Powered Financial Advice</h3>
            <p className="text-gray-700 dark:text-gray-300 text-center">Get personalized advice from our AI advisor to achieve your financial goals.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center">
            <img
              src={Education}
              alt="Educational Resources"
              className="h-24 w-24 object-cover rounded-full mb-4 shadow"
            />
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Educational Resources</h3>
            <p className="text-gray-700 dark:text-gray-300 text-center">Access videos, blogs, and courses to boost your financial literacy.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center">
            <img
              src={Tools}
              alt="Budgeting Tools"
              className="h-24 w-24 object-cover rounded-full mb-4 shadow"
            />
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Budgeting Tools</h3>
            <p className="text-gray-700 dark:text-gray-300 text-center">Use our tools to manage your budget and investments.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center">
            <img
              src={Advisors}
              alt="Certified Advisors"
              className="h-24 w-24 object-cover rounded-full mb-4 shadow"
            />
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Certified Advisors</h3>
            <p className="text-gray-700 dark:text-gray-300 text-center">Combine AI insights with certified financial advisors for expert guidance.</p>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="text-center bg-gray-200 dark:bg-gray-800 py-12 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Stay Updated</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Join our mailing list for tips, updates, and free tools to help you achieve your financial goals.
          </p>
          <form className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2 w-full md:w-1/2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              required
            />
            <button
              type="submit"
              className="bg-blue-500 dark:bg-blue-700 text-white px-6 py-2 rounded-md font-bold hover:bg-blue-600 dark:hover:bg-blue-800"
            >
              Subscribe
            </button>
          </form>
        </section>

        {/* Footer */}
      <footer className="bg-white-200 dark:bg-gray-900 text-gray-600 dark:text-gray-400 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Social Media Links */}
            <div className="flex space-x-4">
              <a href="#" className="hover:text-dark dark:hover:text-white">Facebook</a>
              <a href="#" className="hover:text-dark dark:hover:text-white">Twitter</a>
              <a href="#" className="hover:text-dark dark:hover:text-white">LinkedIn</a>
            </div>

            {/* Legal Links */}
            <div className="flex space-x-4">
              <a href="#" className="hover:text-dark dark:hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-dark dark:hover:text-white">Terms of Service</a>
            </div>

            {/* Contact Info */}
            <div>
              <p>Contact us: <a href="mailto:support@finteach.com" className="hover:text-dark dark:hover:text-white">support@finteach.com</a></p>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}

export default HomePage;