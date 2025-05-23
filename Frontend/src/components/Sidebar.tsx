import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

interface SidebarProps {
  handleLogout: () => void; // Function to handle logout
}

const Sidebar: React.FC<SidebarProps> = ({ handleLogout }) => {
  return (
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
  );
};

export default Sidebar;