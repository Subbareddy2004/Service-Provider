import React from 'react';
import { Link } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';

function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20" onClick={onClose}></div>
      )}
      <aside className={`bg-gray-900 text-gray-100 w-64 min-h-screen p-4 fixed top-0 left-0 z-30 transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
        <div className="flex justify-between items-center mb-6 md:hidden">
          <h2 className="text-xl font-semibold text-teal-400">Menu</h2>
          <button onClick={onClose} className="text-gray-300 hover:text-white focus:outline-none focus:text-white">
            <FaTimes size={24} />
          </button>
        </div>
        <nav>
          <ul className="space-y-2">
            <li><Link to="/" className="block py-2 px-4 rounded transition duration-200 hover:bg-gray-800 hover:text-teal-400" onClick={onClose}>Dashboard</Link></li>
            <li><Link to="/orders" className="block py-2 px-4 rounded transition duration-200 hover:bg-gray-800 hover:text-teal-400" onClick={onClose}>Orders</Link></li>
            <li><Link to="/food-items" className="block py-2 px-4 rounded transition duration-200 hover:bg-gray-800 hover:text-teal-400" onClick={onClose}>Food Items</Link></li>
            <li><Link to="/subscriptions" className="block py-2 px-4 rounded transition duration-200 hover:bg-gray-800 hover:text-teal-400" onClick={onClose}>Subscriptions</Link></li>
            <li><Link to="/users" className="block py-2 px-4 rounded transition duration-200 hover:bg-gray-800 hover:text-teal-400" onClick={onClose}>Users</Link></li>
          </ul>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;