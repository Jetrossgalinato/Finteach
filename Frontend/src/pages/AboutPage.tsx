import { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { SunIcon, MoonIcon } from '@heroicons/react/16/solid';
import Sidebar from "../components/Sidebar";

function AboutPage() {
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

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
        <h1 className="text-3xl dark:text-gray-300 font-bold mb-4">About FinTeach</h1>
        <p className="mb-4 dark:text-gray-300">
          <strong>FinTeach</strong> is a personal finance dashboard designed to help you manage your money, track expenses, set financial goals, and improve your financial literacy.
        </p>
        <h2 className="text-xl dark:text-gray-300 font-semibold mb-2">Key Features</h2>
        <ul className="list-disc pl-6 mb-4 dark:text-gray-300">
          <li>Track checking, savings, and investment balances</li>
          <li>Log expenses and deposits</li>
          <li>Set and monitor financial goals</li>
          <li>Visualize your budget and spending</li>
          <li>Get advice from our AI Financial Advisor</li>
        </ul>
        <h2 className="text-xl dark:text-gray-300 font-semibold mb-2">Who Built It</h2>
        <p className="mb-4 dark:text-gray-300">
          This application was built by the FinTeach team.
        </p>
        <h2 className="text-xl dark:text-gray-300 font-semibold mb-2">Technologies Used</h2>
        <ul className="list-disc dark:text-gray-300 pl-6 mb-4">
          <li>React</li>
          <li>Tailwind CSS</li>
          <li>Django REST Framework</li>
        </ul>
        <h2 className="text-xl dark:text-gray-300 font-semibold">Contact</h2>
        <p className="dark:text-gray-300">
          For questions or feedback, please contact us at{' '}
          <a href="mailto:support@finteach.com" className="text-blue-600 underline">
            support@finteach.com
          </a>.
        </p>
      </div>
    </div>
  );
}
export default AboutPage;