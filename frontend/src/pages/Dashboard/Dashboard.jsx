import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Plus, Eye, Edit, Trash2, MoreVertical, Archive, Send } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    archived: 0,
    draft: 0
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [openMenu, setOpenMenu] = useState(null);

  const { user } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, [filter]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = filter !== 'all' ? `?status=${filter}` : '';
      const res = await api.get(`/products/brand/my-products${params}`);
      setProducts(res.data.data.products);
      setStats(res.data.data.stats);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (id) => {
    try {
      await api.put(`/products/${id}/publish`);
      fetchProducts();
    } catch (error) {
      console.error('Error publishing product:', error);
    }
  };

  const handleArchive = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error('Error archiving product:', error);
    }
  };

  const statCards = [
    { label: 'Total Products', value: stats.total, color: 'bg-blue-500' },
    { label: 'Published', value: stats.published, color: 'bg-green-500' },
    { label: 'Drafts', value: stats.draft, color: 'bg-yellow-500' },
    { label: 'Archived', value: stats.archived, color: 'bg-gray-500' }
  ];

  return (
    <div>
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-heading font-bold mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-500">
          Manage your products and track your store performance
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 border border-gray-100"
          >
            <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
              <Package className="text-white" size={24} />
            </div>
            <p className="text-3xl font-bold mb-1">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Products Section */}
      <div className="bg-white rounded-xl border border-gray-100">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-heading font-semibold mb-2">My Products</h2>
            <div className="flex flex-wrap gap-2">
              {['all', 'published', 'draft', 'archived'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-3 py-1 rounded-full text-sm font-medium capitalize transition-colors ${
                    filter === status
                      ? 'bg-accent text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
          <Link to="/dashboard/products/new" className="btn btn-primary">
            <Plus size={20} className="mr-2" />
            Add Product
          </Link>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent"></div>
                    </div>
                  </td>
                </tr>
              ) : products.length > 0 ? (
                products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <img
                            src={product.images?.[0] || 'https://via.placeholder.com/100'}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 line-clamp-1">{product.name}</p>
                          <p className="text-sm text-gray-500 line-clamp-1">{product.description?.substring(0, 50)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600">{product.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-accent">${product.price?.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium capitalize ${
                        product.status === 'published'
                          ? 'bg-green-100 text-green-700'
                          : product.status === 'draft'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-500 text-sm">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/product/${product._id}`}
                          className="p-2 text-gray-500 hover:text-accent hover:bg-gray-100 rounded-lg"
                        >
                          <Eye size={18} />
                        </Link>
                        <Link
                          to={`/dashboard/products/edit/${product._id}`}
                          className="p-2 text-gray-500 hover:text-accent hover:bg-gray-100 rounded-lg"
                        >
                          <Edit size={18} />
                        </Link>
                        {product.status === 'draft' && (
                          <button
                            onClick={() => handlePublish(product._id)}
                            className="p-2 text-gray-500 hover:text-green-600 hover:bg-gray-100 rounded-lg"
                            title="Publish"
                          >
                            <Send size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => handleArchive(product._id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-lg"
                          title="Archive"
                        >
                          <Archive size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <Package className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <p className="text-gray-500 mb-4">No products found</p>
                    <Link to="/dashboard/products/new" className="btn btn-primary">
                      <Plus size={20} className="mr-2" />
                      Add Your First Product
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

