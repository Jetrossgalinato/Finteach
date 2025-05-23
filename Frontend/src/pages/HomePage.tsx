import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SunIcon, MoonIcon } from '@heroicons/react/16/solid';
import Sidebar from '../components/Sidebar';

function HomePage() {
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  // Auth Guard: Check if the user is authenticated
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      navigate('/'); 
    }
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
      <Sidebar handleLogout={handleLogout} />

      {/* Main Content */}
      <div className="flex-1 p-8 space-y-16">
        {/* Hero Section */}
        <section className="text-center bg-blue-500 dark:bg-blue-700 text-white py-16 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold mb-4">Empowering You to Make Smarter Financial Decisions</h1>
          <p className="text-lg mb-6">Learn, plan, and grow with expert-backed financial insights and AI-powered advice.</p>
          <div className="space-x-4">
            <button className="bg-white dark:bg-gray-800 text-blue-500 dark:text-white px-6 py-2 rounded-md font-bold hover:bg-gray-100 dark:hover:bg-gray-700">
              Get Started
            </button>
            <button className="bg-blue-700 dark:bg-blue-800 px-6 py-2 rounded-md font-bold hover:bg-blue-600 dark:hover:bg-blue-700">
              Talk to Our AI Advisor
            </button>
          </div>
        </section>

        {/* Key Features */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">AI-Powered Financial Advice</h3>
            <p className="text-gray-700 dark:text-gray-300">Get personalized advice from our AI advisor to achieve your financial goals.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Educational Resources</h3>
            <p className="text-gray-700 dark:text-gray-300">Access videos, blogs, and courses to boost your financial literacy.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Budgeting Tools</h3>
            <p className="text-gray-700 dark:text-gray-300">Use our tools to manage your budget and investments.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Certified Advisors</h3>
            <p className="text-gray-700 dark:text-gray-300">Combine AI insights with certified financial advisors for expert guidance.</p>
          </div>
        </section>

        {/* How It Works */}
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">1. Sign Up</h3>
              <p className="text-gray-700 dark:text-gray-300">Create your account to get started.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">2. Take Financial Quiz</h3>
              <p className="text-gray-700 dark:text-gray-300">Answer a few questions to personalize your experience.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">3. Get AI Advice</h3>
              <p className="text-gray-700 dark:text-gray-300">Receive tailored advice from our AI advisor.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">4. Track Progress</h3>
              <p className="text-gray-700 dark:text-gray-300">Monitor your financial growth over time.</p>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section>
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <blockquote className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <p className="text-gray-700 dark:text-gray-300">"The AI advisor gave me actionable steps to save for my dream home!"</p>
              <footer className="mt-4 text-sm text-gray-500 dark:text-gray-400">- Sarah L.</footer>
            </blockquote>
            <blockquote className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <p className="text-gray-700 dark:text-gray-300">"I love how the AI combines insights with human advisors."</p>
              <footer className="mt-4 text-sm text-gray-500 dark:text-gray-400">- John D.</footer>
            </blockquote>
            <blockquote className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <p className="text-gray-700 dark:text-gray-300">"The AI advisor made financial planning so easy for me."</p>
              <footer className="mt-4 text-sm text-gray-500 dark:text-gray-400">- Emily R.</footer>
            </blockquote>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Start Building Your Financial Future</h2>
          <button className="bg-blue-500 dark:bg-blue-700 text-white px-6 py-3 rounded-md font-bold hover:bg-blue-600 dark:hover:bg-blue-800">
            Get Started Now
          </button>
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
      <footer className="bg-gray-800 dark:bg-gray-900 text-gray-400 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Social Media Links */}
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white">Facebook</a>
              <a href="#" className="hover:text-white">Twitter</a>
              <a href="#" className="hover:text-white">LinkedIn</a>
            </div>

            {/* Legal Links */}
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
            </div>

            {/* Contact Info */}
            <div>
              <p>Contact us: <a href="mailto:support@finteach.com" className="hover:text-white">support@finteach.com</a></p>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}

export default HomePage;