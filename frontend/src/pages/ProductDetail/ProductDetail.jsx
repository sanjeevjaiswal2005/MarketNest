import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Share2, ChevronLeft, ChevronRight, Store } from 'lucide-react';
import api from '../../api/axios';
import { ProductDetailSkeleton } from '../../components/UI/Skeleton';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  const defaultImage = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&h=800&fit=crop';

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data.data.product);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const nextImage = () => {
    const images = product?.images?.length > 0 ? product.images : [defaultImage];
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    const images = product?.images?.length > 0 ? product.images : [defaultImage];
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const images = product?.images?.length > 0 ? product.images : [defaultImage];

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductDetailSkeleton />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-heading font-bold mb-4">Product not found</h2>
          <Link to="/shop" className="btn btn-primary">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <Link
            to="/shop"
            className="inline-flex items-center text-gray-500 hover:text-accent transition-colors"
          >
            <ChevronLeft size={20} />
            Back to Shop
          </Link>
        </motion.div>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Main Image */}
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 mb-4">
              <img
                src={images[selectedImage] || defaultImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              
              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-lg hover:bg-white transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-lg hover:bg-white transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index
                        ? 'border-accent'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Category */}
            <p className="text-sm text-gray-500 uppercase tracking-wide">
              {product.category}
            </p>

            {/* Name */}
            <h1 className="text-3xl md:text-4xl font-heading font-bold">
              {product.name}
            </h1>

            {/* Price */}
            <p className="text-3xl font-semibold text-accent">
              ${product.price?.toFixed(2)}
            </p>

            {/* Description */}
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Brand Info */}
            {product.brand && (
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {product.brand.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Sold by</p>
                  <p className="font-medium">{product.brand.name}</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <button className="flex-1 btn btn-primary py-4 text-lg">
                Add to Cart
              </button>
              <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-accent hover:text-accent transition-colors">
                <Heart size={24} />
              </button>
              <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-accent hover:text-accent transition-colors">
                <Share2 size={24} />
              </button>
            </div>

            {/* Additional Info */}
            <div className="border-t border-gray-200 pt-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Category</span>
                <span className="font-medium">{product.category}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Status</span>
                <span className={`font-medium capitalize ${
                  product.status === 'published' ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {product.status}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Listed</span>
                <span className="font-medium">
                  {new Date(product.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

