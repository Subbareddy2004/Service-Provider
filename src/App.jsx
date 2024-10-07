import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/common/PrivateRoute';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import Footer from './components/common/Footer';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import FoodItems from './pages/FoodItems';
import Subscriptions from './pages/Subscriptions';
import Users from './pages/Users';

function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {!isLoginPage && <Header />}
      <div className="flex flex-1">
        {!isLoginPage && <Sidebar />}
        <main className={`flex-1 ${isLoginPage ? '' : 'p-6'}`}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/food-items" element={<FoodItems />} />
              <Route path="/subscriptions" element={<Subscriptions />} />
              <Route path="/users" element={<Users />} />
            </Route>
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;