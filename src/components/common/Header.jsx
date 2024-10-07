import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaBars } from 'react-icons/fa';

function Header({ onMenuClick }) {
  const { currentUser, logout } = useAuth();

  async function handleLogout() {
    try {
      await logout();
    } catch {
      console.error("Failed to log out");
    }
  }

  return (
    <header className="bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <button onClick={onMenuClick} className="mr-4 md:hidden text-gray-300 hover:text-white focus:outline-none focus:text-white">
            <FaBars size={24} />
          </button>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
            Food Service Admin
          </h1>
        </div>
        {currentUser && (
          <div className="flex items-center space-x-4">
            <span className="hidden md:inline text-gray-300">Logged in as: {currentUser.email}</span>
            <button 
              onClick={handleLogout} 
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              Log Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;