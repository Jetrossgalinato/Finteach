import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

interface SidebarProps {
  handleLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ handleLogout }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger for small screens */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-800 dark:bg-gray-700 p-2 rounded"
        onClick={() => setOpen(!open)}
        aria-label="Open sidebar"
      >
        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <div className="min-h-screen flex">
        <div
          className={`
            fixed md:static top-0 left-0 h-full w-64 bg-gray-800 dark:bg-gray-700 text-white flex flex-col z-40
            transform transition-transform duration-200
            ${open ? 'translate-x-0' : '-translate-x-full'}
            md:translate-x-0
          `}
        >
          <div className="flex items-center justify-center h-20 border-b border-gray-700 dark:border-gray-600">
            <img src={logo} alt="Logo" className="h-12 w-12" />
            <h1 className="text-xl font-bold ml-2">FinTeach</h1>
          </div>

          <nav className="flex-1 p-4">
            <ul className="space-y-4">
              <li>
                <Link to="/home" className="block px-4 py-2 rounded hover:bg-gray-700 dark:rounded hover:bg-gray-900" onClick={() => setOpen(false)}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="block px-4 py-2 rounded hover:bg-gray-700 dark:rounded hover:bg-gray-900" onClick={() => setOpen(false)}>
                  About
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="block px-4 py-2 rounded hover:bg-gray-700 dark:rounded hover:bg-gray-900" onClick={() => setOpen(false)}>
                  Dashboard
                </Link>
              </li>
            </ul>
          </nav>

          <div className="p-4 border-t border-gray-700">
            <button
              onClick={() => {
                setOpen(false);
                handleLogout();
              }}
              className="flex items-center justify-center w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500 transition"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for small screens */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
