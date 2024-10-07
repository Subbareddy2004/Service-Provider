import React from 'react';

function OrderSummary({ order }) {
  return (
    <li className="px-4 py-4 sm:px-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-indigo-600 truncate">Order #{order.docId}</p>
        <div className="ml-2 flex-shrink-0 flex">
          <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
            order.status === 'in_transit' ? 'bg-yellow-100 text-yellow-800' : 
            'bg-gray-100 text-gray-800'
          }`}>
            {order.status}
          </p>
        </div>
      </div>
      <div className="mt-2 sm:flex sm:justify-between">
        <div className="sm:flex">
          <p className="flex items-center text-sm text-gray-500">
            {order.itemName} (x{order.itemCount})
          </p>
        </div>
        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
          <p>₹{order.itemPrice * order.itemCount}</p>
        </div>
      </div>
    </li>
  );
}

export default OrderSummary;