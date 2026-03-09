import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Package, Plus, LogOut, ShoppingBag } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const DashboardSidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      path: '/dashboard'
    },
    {
      icon: Package,
      label: 'My Products',
      path: '/dashboard/products'
    },
    {
      icon: Plus,
      label: 'Add Product',
      path: '/dashboard/products/new'
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:left-0 md:w-64 bg-primary text-white">
      {/* Logo */}
      <div className="flex items-center space-x-2 px-6 py-6 border-b border-gray-700">
        <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
          <span className="text-white font-heading text-xl font-bold">M</span>
        </div>
        <span className="font-heading text-xl font-bold">MarketNest</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-accent text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="px-4 py-4 border-t border-gray-700">
        <div className="flex items-center space-x-3 px-4 py-3 mb-2">
          <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
            <span className="text-white font-medium">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default DashboardSidebar;

