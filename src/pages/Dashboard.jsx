import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { FaShoppingCart, FaMoneyBillWave, FaFilter } from 'react-icons/fa';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Dashboard() {
  const [analytics, setAnalytics] = useState({
    totalOrders: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [categoryDistribution, setCategoryDistribution] = useState({});
  const [topCustomerAreas, setTopCustomerAreas] = useState([]);
  const [peakOrderHours, setPeakOrderHours] = useState([]);
  const [priceRangeDistribution, setPriceRangeDistribution] = useState({});
  const [topPurchasedFoods, setTopPurchasedFoods] = useState([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        await Promise.all([
          fetchAnalytics(timeFilter),
          fetchCategoryDistribution(),
          fetchTopCustomerAreas(),
          fetchPeakOrderHours(),
          fetchPriceRangeDistribution(),
          fetchTopPurchasedFoods()
        ]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [timeFilter]);

  async function fetchAnalytics(filter) {
    const ordersCollection = collection(db, 'orders');
    let ordersQuery = query(ordersCollection, orderBy('timestamp', 'desc'));
  
    if (filter !== 'all') {
      const filterDate = new Date();
      switch (filter) {
        case 'hour':
          filterDate.setHours(filterDate.getHours() - 1);
          break;
        case 'day':
          filterDate.setDate(filterDate.getDate() - 1);
          break;
        case 'week':
          filterDate.setDate(filterDate.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(filterDate.getMonth() - 1);
          break;
        case 'year':
          filterDate.setFullYear(filterDate.getFullYear() - 1);
          break;
      }
      ordersQuery = query(ordersQuery, where('timestamp', '>=', filterDate.toISOString()));
    }
  
    const ordersSnapshot = await getDocs(ordersQuery);
    const totalOrders = ordersSnapshot.size;
    const totalRevenue = ordersSnapshot.docs.reduce((sum, doc) => sum + (doc.data().itemPrice * doc.data().itemCount), 0);
  
    setAnalytics({ totalOrders, totalRevenue });
  }

  async function fetchCategoryDistribution() {
    const ordersCollection = collection(db, 'orders');
    const ordersSnapshot = await getDocs(ordersCollection);
    const categories = {};

    ordersSnapshot.forEach(doc => {
      const { itemName } = doc.data();
      categories[itemName] = (categories[itemName] || 0) + 1;
    });

    setCategoryDistribution(categories);
  }

  async function fetchTopCustomerAreas() {
    const ordersCollection = collection(db, 'orders');
    const ordersSnapshot = await getDocs(ordersCollection);
    const areas = {};

    ordersSnapshot.forEach(doc => {
      const { address } = doc.data();
      areas[address] = (areas[address] || 0) + 1;
    });

    const sortedAreas = Object.entries(areas)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([area, count]) => ({ area, count }));

    setTopCustomerAreas(sortedAreas);
  }

  async function fetchPeakOrderHours() {
    const ordersCollection = collection(db, 'orders');
    const ordersSnapshot = await getDocs(ordersCollection);
    const hours = Array(24).fill(0);

    ordersSnapshot.forEach(doc => {
      const { timestamp } = doc.data();
      const hour = new Date(timestamp).getHours();
      hours[hour]++;
    });

    const peakHours = hours.map((count, hour) => ({ hour, count }));
    setPeakOrderHours(peakHours);
  }

  async function fetchPriceRangeDistribution() {
    const ordersCollection = collection(db, 'orders');
    const ordersSnapshot = await getDocs(ordersCollection);
    const priceRanges = {
      '0-10': 0,
      '10-20': 0,
      '20-30': 0,
      '30-40': 0,
      '40-50': 0,
      '50+': 0
    };

    ordersSnapshot.forEach(doc => {
      const { itemPrice } = doc.data();
      if (itemPrice <= 10) priceRanges['0-10']++;
      else if (itemPrice <= 20) priceRanges['10-20']++;
      else if (itemPrice <= 30) priceRanges['20-30']++;
      else if (itemPrice <= 40) priceRanges['30-40']++;
      else if (itemPrice <= 50) priceRanges['40-50']++;
      else priceRanges['50+']++;
    });

    setPriceRangeDistribution(priceRanges);
  }

  async function fetchTopPurchasedFoods() {
    const ordersCollection = collection(db, 'orders');
    const ordersSnapshot = await getDocs(ordersCollection);
    const foodCounts = {};

    ordersSnapshot.forEach(doc => {
      const { itemName, itemCount } = doc.data();
      foodCounts[itemName] = (foodCounts[itemName] || 0) + itemCount;
    });

    const sortedFoods = Object.entries(foodCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    setTopPurchasedFoods(sortedFoods);
  }

  const chartColors = {
    orange: '#FFA500',
    purple: '#800080',
    teal: '#008080',
    blue: '#0000FF'
  };

  const categoryChartData = {
    labels: Object.keys(categoryDistribution),
    datasets: [{
      data: Object.values(categoryDistribution),
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
      ],
    }],
  };

  const topCustomerAreasChartData = {
    labels: topCustomerAreas.map(item => item.area),
    datasets: [{
      data: topCustomerAreas.map(item => item.count),
      backgroundColor: chartColors.orange,
    }],
  };

  const peakOrderHoursChartData = {
    labels: peakOrderHours.map(item => item.hour),
    datasets: [{
      data: peakOrderHours.map(item => item.count),
      backgroundColor: chartColors.purple,
    }],
  };

  const priceRangeChartData = {
    labels: Object.keys(priceRangeDistribution),
    datasets: [{
      data: Object.values(priceRangeDistribution),
      backgroundColor: chartColors.teal,
    }],
  };

  const topPurchasedFoodsChartData = {
    labels: topPurchasedFoods.map(item => item.name),
    datasets: [{
      data: topPurchasedFoods.map(item => item.count),
      backgroundColor: chartColors.blue,
    }],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 12,
          padding: 20
        }
      }
    }
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="relative">
          <button
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FaFilter className="mr-2" />
            {timeFilter === 'all' ? 'All Time' : `Last ${timeFilter}`}
          </button>
          {showFilterDropdown && (
            <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                {['all', 'hour', 'day', 'week', 'month'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => {
                      setTimeFilter(filter);
                      setShowFilterDropdown(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    role="menuitem"
                  >
                    {filter === 'all' ? 'All Time' : `Last ${filter}`}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 mb-8">
            <AnalyticCard 
              icon={<FaShoppingCart className="text-blue-500 text-4xl" />} 
              title="Total Orders" 
              value={analytics.totalOrders} 
            />
            <AnalyticCard 
              icon={<FaMoneyBillWave className="text-green-500 text-4xl" />} 
              title="Total Revenue" 
              value={`₹${analytics.totalRevenue.toFixed(2)}`} 
            />
          </div>
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-xl font-semibold mb-4">Category Distribution</h2>
            <div className="h-64">
              <Pie data={categoryChartData} options={pieChartOptions} />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Top 5 Customer Areas</h2>
              <div className="h-64">
                <Bar data={topCustomerAreasChartData} options={barChartOptions} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Peak Order Hours</h2>
              <div className="h-64">
                <Bar data={peakOrderHoursChartData} options={barChartOptions} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Price Range Distribution</h2>
              <div className="h-64">
                <Bar data={priceRangeChartData} options={barChartOptions} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Top 5 Most Purchased Foods</h2>
              <div className="h-64">
                <Bar data={topPurchasedFoodsChartData} options={barChartOptions} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function AnalyticCard({ icon, title, value }) {
  return (
    <div className="bg-white overflow-hidden shadow-lg rounded-lg p-6">
      <div className="flex items-center">
        <div className="flex-shrink-0 mr-4 bg-gray-100 rounded-full p-3">{icon}</div>
        <div>
          <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
          <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;