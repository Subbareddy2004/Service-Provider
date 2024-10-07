import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <nav>
        <ul className="space-y-2">
          <li><Link to="/" className="block py-2 px-4 hover:bg-gray-700 rounded">Dashboard</Link></li>
          <li><Link to="/orders" className="block py-2 px-4 hover:bg-gray-700 rounded">Orders</Link></li>
          <li><Link to="/food-items" className="block py-2 px-4 hover:bg-gray-700 rounded">Food Items</Link></li>
          <li><Link to="/subscriptions" className="block py-2 px-4 hover:bg-gray-700 rounded">Subscriptions</Link></li>
          <li><Link to="/users" className="block py-2 px-4 hover:bg-gray-700 rounded">Users</Link></li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;