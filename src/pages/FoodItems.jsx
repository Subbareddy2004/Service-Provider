import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, getDocs } from 'firebase/firestore';
import FoodItemCard from '../components/foodItems/FoodItemCard';

function FoodItems() {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFoodItems() {
      try {
        const foodItemsCollection = collection(db, 'fs_food_items1');
        const foodItemsSnapshot = await getDocs(foodItemsCollection);
        const foodItemsList = foodItemsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFoodItems(foodItemsList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching food items:", error);
        setLoading(false);
      }
    }

    fetchFoodItems();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-gray-900">Food Items</h1>
      <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        {foodItems.map(item => (
          <FoodItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

export default FoodItems;