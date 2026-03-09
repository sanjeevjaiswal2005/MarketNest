import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import api from '../../api/axios';
import ProductCard from '../../components/Product/ProductCard';
import { ProductGridSkeleton } from '../../components/UI/Skeleton';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  
  // Filters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [showFilters, setShowFilters] = useState(false);

  // Default categories if API fails
  const defaultCategories = ['Dresses', 'Tops', 'Pants', 'Skirts', 'Jackets', 'Shoes', 'Bags', 'Accessories'];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data.data.categories.length > 0) {
          setCategories(res.data.data.categories.map(c => c.name));
        } else {
          setCategories(defaultCategories);
        }
      } catch (error) {
        setCategories(defaultCategories);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append('page', pagination.page);
        params.append('limit', 12);
        params.append('status', 'published');
        
        if (search) params.append('search', search);
        if (category) params.append('category', category);

        const res = await api.get(`/products?${params.toString()}`);
        setProducts(res.data.data.products);
        setPagination(prev => ({
          ...prev,
          ...res.data.data.pagination
        }));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [pagination.page, search, category]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    if (search) {
      setSearchParams({ search, ...(category && { category }) });
    } else {
      setSearchParams(category ? { category } : {});
    }
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setPagination(prev => ({ ...prev, page: 1 }));
    if (cat) {
      setSearchParams({ ...(search && { search }), category: cat });
    } else {
      setSearchParams(search ? { search } : {});
    }
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setPagination(prev => ({ ...prev, page: 1 }));
    setSearchParams({});
  };

  const hasFilters = search || category;

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">Shop</h1>
          <p className="text-gray-500">
            {pagination.total} products available
          </p>
        </motion.div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="input pl-12"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-outline lg:hidden"
            >
              <SlidersHorizontal size={20} />
            </button>
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </form>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryChange('')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !category
                  ? 'bg-accent text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === cat
                    ? 'bg-accent text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Active Filters */}
          {hasFilters && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Active filters:</span>
              {search && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-accent/10 text-accent rounded-full text-sm">
                  Search: {search}
                  <button onClick={() => setSearch('')}><X size={14} /></button>
                </span>
              )}
              {category && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-accent/10 text-accent rounded-full text-sm">
                  {category}
                  <button onClick={() => handleCategoryChange('')}><X size={14} /></button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-sm text-red-500 hover:underline"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Products Grid */}
        {loading ? (
          <ProductGridSkeleton count={12} />
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <ProductCard key={product._id} product={product} index={index} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="mt-12 flex justify-center gap-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 rounded-lg border border-gray-200 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).slice(
                  Math.max(0, pagination.page - 3),
                  Math.min(pagination.pages, pagination.page + 2)
                ).map(page => (
                  <button
                    key={page}
                    onClick={() => setPagination(prev => ({ ...prev, page }))}
                    className={`px-4 py-2 rounded-lg ${
                      page === pagination.page
                        ? 'bg-accent text-white'
                        : 'border border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.pages}
                  className="px-4 py-2 rounded-lg border border-gray-200 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg mb-4">No products found</p>
            {hasFilters && (
              <button onClick={clearFilters} className="btn btn-primary">
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;

