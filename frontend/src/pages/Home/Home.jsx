import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, Truck, RefreshCw, Shield, Star, Zap } from 'lucide-react';
import api from '../../api/axios';
import ProductCard from '../../components/Product/ProductCard';
import { ProductGridSkeleton } from '../../components/UI/Skeleton';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { scrollY } = useScroll();
  
  // Parallax and scroll-based animations
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const featuresY = useTransform(scrollY, [200, 600], [50, 0]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          api.get('/products?limit=8&status=published'),
          api.get('/categories')
        ]);
        setProducts(productsRes.data.data.products);
        setCategories(categoriesRes.data.data.categories);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const features = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'On orders over $100'
    },
    {
      icon: RefreshCw,
      title: 'Easy Returns',
      description: '30-day return policy'
    },
    {
      icon: Shield,
      title: 'Secure Payment',
      description: '100% secure checkout'
    },
    {
      icon: Sparkles,
      title: 'Premium Quality',
      description: 'Curated fashion pieces'
    }
  ];

  const defaultCategories = [
    { name: 'Dresses', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop' },
    { name: 'Tops', image: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400&h=500&fit=crop' },
    { name: 'Pants', image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=500&fit=crop' },
    { name: 'Accessories', image: 'https://images.unsplash.com/photo-1611923134239-b9be5816e23c?w=400&h=500&fit=crop' }
  ];

  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section with Parallax */}
      <section className="relative min-h-[90vh] flex items-center bg-primary overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-20 left-20 w-72 h-72 bg-accent/20 rounded-full blur-3xl" 
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.3, 1],
              x: [0, 50, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" 
          />
          <motion.div 
            animate={{ 
              y: [0, -30, 0],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl" 
          />
        </div>

        {/* Floating Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-accent/30 rounded-full"
            initial={{ 
              x: Math.random() * 1000, 
              y: Math.random() * 600 
            }}
            animate={{ 
              y: [null, -100],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: 3 + Math.random() * 2, 
              repeat: Infinity, 
              delay: Math.random() * 2 
            }}
          />
        ))}

        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.span
                variants={itemVariants}
                className="inline-flex items-center gap-2 px-4 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium mb-6"
              >
                <Zap size={14} className="animate-pulse" />
                Welcome to MarketNest
              </motion.span>
              
              <motion.h1 
                variants={itemVariants}
                className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6 leading-tight"
              >
                Discover Your
                <motion.span 
                  className="text-accent block"
                  animate={{ 
                    textShadow: ["0 0 0px rgba(99,102,241,0)", "0 0 20px rgba(99,102,241,0.5)", "0 0 0px rgba(99,102,241,0)"]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Perfect Style
                </motion.span>
              </motion.h1>
              
              <motion.p 
                variants={itemVariants}
                className="text-lg text-gray-300 mb-8 max-w-lg"
              >
                Explore the latest fashion trends from top brands. Curated collections that define your unique style.
              </motion.p>
              
              <motion.div 
                variants={itemVariants}
                className="flex flex-wrap gap-4"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/shop"
                    className="btn btn-primary text-lg px-8 py-4 inline-flex items-center"
                  >
                    Shop Now
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="ml-2" size={20} />
                    </motion.div>
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/register"
                    className="btn bg-white/10 text-white hover:bg-white/20 text-lg px-8 py-4"
                  >
                    Become a Seller
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Hero Image with Enhanced Animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.3, type: "spring", stiffness: 100 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <motion.div 
                  animate={{ 
                    boxShadow: [
                      "0 0 0 0 rgba(99,102,241,0)",
                      "0 0 40px 10px rgba(99,102,241,0.3)",
                      "0 0 0 0 rgba(99,102,241,0)"
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -inset-4 bg-gradient-to-r from-accent to-purple-600 rounded-2xl blur-2xl"
                />
                <motion.div
                  whileHover={{ scale: 1.02, rotate: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=800&fit=crop"
                    alt="Fashion Clothing"
                    className="relative rounded-2xl shadow-2xl"
                  />
                </motion.div>
                
                {/* Floating Badge */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1, type: "spring" }}
                  className="absolute -left-4 top-1/4 bg-white rounded-xl shadow-xl p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Shield className="text-green-600" size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Secure</p>
                      <p className="text-xs text-gray-500">100% Protected</p>
                    </div>
                  </div>
                </motion.div>
                
                {/* Floating Rating Badge */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2, type: "spring" }}
                  className="absolute -right-4 bottom-1/4 bg-white rounded-xl shadow-xl p-4"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="text-yellow-400 fill-yellow-400" size={14} />
                      ))}
                    </div>
                    <span className="text-sm font-semibold">4.9</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Customer Rating</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2"
          >
            <motion.div 
              animate={{ opacity: [1, 0], y: [0, 10] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-1 h-2 bg-white/50 rounded-full" 
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Features with Scroll Animation */}
      <motion.section 
        style={{ y: featuresY }}
        className="py-16 bg-white relative"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ y: -10, transition: { type: "spring", stiffness: 300 } }}
                className="text-center group cursor-pointer"
              >
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-16 h-16 mx-auto mb-4 bg-accent/10 rounded-xl flex items-center justify-center group-hover:bg-accent/20 transition-colors"
                >
                  <feature.icon className="text-accent" size={28} />
                </motion.div>
                <h3 className="font-heading font-semibold text-lg mb-1 group-hover:text-accent transition-colors">{feature.title}</h3>
                <p className="text-gray-500 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Categories with Stagger Animation */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.span 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4"
            >
              Browse Categories
            </motion.span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Shop Different Products</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Explore our curated categories to find exactly what you're looking for
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {displayCategories.slice(0, 4).map((category, index) => (
              <motion.div
                key={category.name || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Link
                  to={`/shop?category=${category.name}`}
                  className="group relative block aspect-[3/4] rounded-2xl overflow-hidden"
                >
                  <motion.img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 p-6"
                    initial={{ y: 20 }}
                    whileHover={{ y: 0 }}
                  >
                    <h3 className="text-white font-heading text-xl font-semibold">{category.name}</h3>
                    <motion.p 
                      className="text-white/70 text-sm mt-1 flex items-center gap-1"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    >
                      Shop Now <ArrowRight size={14} />
                    </motion.p>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.span 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4"
            >
              Featured Collection
            </motion.span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">All Products</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Browse our complete collection of fashion items
            </p>
          </motion.div>

          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : products.length > 0 ? (
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {products.map((product, index) => (
                <motion.div key={product._id} variants={itemVariants}>
                  <ProductCard product={product} index={index} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p className="text-gray-500 text-lg">No products available yet</p>
              <Link to="/shop" className="btn btn-primary mt-4">
                Browse All Products
              </Link>
            </motion.div>
          )}

          {products.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Link to="/shop" className="btn btn-outline">
                View All Products
                <ArrowRight className="ml-2 inline-block" size={18} />
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section with Enhanced Animation */}
      <section className="py-20 bg-primary relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <motion.div 
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-accent/20 to-transparent" 
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 5, repeat: Infinity, delay: 2.5 }}
            className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-purple-500/20 to-transparent" 
          />
          {/* Grid Pattern */}
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.span 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1 bg-white/10 text-white rounded-full text-sm font-medium mb-6"
            >
              Get Started Today
            </motion.span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">
              Start Your Fashion Business Today
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto mb-8">
              Join thousands of brands selling on MarketNest. Create your store and reach millions of customers.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/register?role=brand"
                className="btn btn-primary text-lg px-8 py-4 inline-flex items-center"
              >
                Start Selling
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="ml-2" size={20} />
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;

