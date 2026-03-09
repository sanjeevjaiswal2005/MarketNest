import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Bell, ShoppingBag } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const DashboardHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'My Products', path: '/dashboard/products' },
    { label: 'Add Product', path: '/dashboard/products/new' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-heading font-semibold text-primary">
            Brand Dashboard
          </h1>
          <p className="text-sm text-gray-500">Welcome back, {user?.name}</p>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            to="/"
            className="flex items-center space-x-2 text-gray-700 hover:text-accent transition-colors"
          >
            <ShoppingBag size={20} />
            <span>View Store</span>
          </Link>
          <button className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <nav className="px-4 py-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              View Store
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default DashboardHeader;

