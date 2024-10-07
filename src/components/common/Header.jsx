import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Header() {
  const { currentUser, logout } = useAuth();

  async function handleLogout() {
    try {
      await logout();
    } catch {
      console.error("Failed to log out");
    }
  }

  return (
    <header className="bg-blue-500 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Food Service Admin</h1>
        {/* <nav className="hidden md:block">
          <ul className="flex space-x-4">
            <li><Link to="/" className="hover:text-blue-200">Dashboard</Link></li>
            <li><Link to="/orders" className="hover:text-blue-200">Orders</Link></li>
            <li><Link to="/food-items" className="hover:text-blue-200">Food Items</Link></li>
            <li><Link to="/subscriptions" className="hover:text-blue-200">Subscriptions</Link></li>
            <li><Link to="/users" className="hover:text-blue-200">Users</Link></li>
          </ul>
        </nav> */}
        {currentUser && (
          <div className="flex items-center space-x-4">
            <span className="hidden md:inline">Logged in as: {currentUser.email}</span>
            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">Log Out</button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;