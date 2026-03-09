import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Heart, ShoppingBag } from 'lucide-react';

const ProductCard = ({ product, index = 0 }) => {
  const defaultImage = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&h=500&fit=crop';
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link to={`/product/${product._id}`} className="group block">
        <div className="card card-hover relative overflow-hidden">
          {/* Image */}
          <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
            <motion.img
              src={product.images?.[0] || defaultImage}
              alt={product.name}
              className="w-full h-full object-cover"
              animate={{ scale: isHovered ? 1.08 : 1 }}
              transition={{ duration: 0.4 }}
              loading="lazy"
            />
            
            {/* Overlay */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
            
            {/* Quick Actions */}
            <motion.div 
              className="absolute top-3 right-3 flex flex-col gap-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 20 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.preventDefault();
                  setIsLiked(!isLiked);
                }}
                className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
              >
                <Heart 
                  size={18} 
                  className={isLiked ? "text-red-500 fill-red-500" : "text-gray-600"} 
                />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
              >
                <Eye size={18} className="text-gray-600" />
              </motion.button>
            </motion.div>

            {/* Add to Cart Button */}
            <motion.div 
              className="absolute bottom-3 left-3 right-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
              transition={{ duration: 0.3, delay: 0.15 }}
            >
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2.5 bg-white/95 backdrop-blur-sm rounded-lg font-medium text-sm flex items-center justify-center gap-2 shadow-lg"
              >
                <ShoppingBag size={16} className="text-accent" />
                <span className="text-gray-900">Quick Add</span>
              </motion.button>
            </motion.div>

            {/* Status Badge */}
            {product.status === 'draft' && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute top-3 left-3 px-2 py-1 bg-gray-800 text-white text-xs font-medium rounded"
              >
                Draft
              </motion.div>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              {product.category}
            </p>
            <motion.h3 
              className="font-heading text-lg font-medium text-gray-900 mb-2 line-clamp-1"
              animate={{ color: isHovered ? '#6366F1' : '#111827' }}
              transition={{ duration: 0.2 }}
            >
              {product.name}
            </motion.h3>
            <div className="flex items-center justify-between">
              <p className="text-accent font-semibold text-lg">
                ${product.price?.toFixed(2)}
              </p>
              {/* Rating */}
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                <span className="text-xs text-gray-500">4.8</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;

