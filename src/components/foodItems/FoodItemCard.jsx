import React from 'react';

function FoodItemCard({ item }) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <img className="h-48 w-full object-cover" src={item.productImg} alt={item.productTitle} />
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">{item.productTitle}</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">{item.productDesc}</p>
        <div className="mt-3 flex justify-between items-center">
          <p className="text-sm font-medium text-gray-900">₹{item.productPrice}</p>
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            item.isVeg ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {item.isVeg ? 'Veg' : 'Non-Veg'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default FoodItemCard;