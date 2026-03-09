import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Upload,
  X,
  Image as ImageIcon,
  Save,
  Send,
  Loader2,
} from "lucide-react";
import api from "../../api/axios";

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const fileInputRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingProduct, setFetchingProduct] = useState(isEditing);
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    images: [],
    status: "draft",
  });

  const defaultCategories = [
    "Dresses",
    "Tops",
    "Pants",
    "Skirts",
    "Jackets",
    "Shoes",
    "Bags",
    "Accessories",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes] = await Promise.all([api.get("/categories")]);

        if (categoriesRes.data.data.categories.length > 0) {
          setCategories(categoriesRes.data.data.categories.map((c) => c.name));
        } else {
          setCategories(defaultCategories);
        }
      } catch (error) {
        setCategories(defaultCategories);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (isEditing) {
      const fetchProduct = async () => {
        try {
          const res = await api.get(`/products/${id}`);
          const product = res.data.data.product;
          setFormData({
            name: product.name,
            description: product.description,
            category: product.category,
            price: product.price,
            images: product.images || [],
            status: product.status,
          });
        } catch (error) {
          console.error("Error fetching product:", error);
        } finally {
          setFetchingProduct(false);
        }
      };
      fetchProduct();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageUrlAdd = () => {
    const url = prompt("Enter image URL:");
    if (url) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, url],
      }));
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Handle file selection and upload to Cloudinary
  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (formData.images.length + files.length > 5) {
      setErrors((prev) => ({
        ...prev,
        general: "Maximum 5 images allowed",
      }));
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadedUrls = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate file type
        if (!file.type.startsWith("image/")) {
          setErrors((prev) => ({
            ...prev,
            general: "Only image files are allowed",
          }));
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          setErrors((prev) => ({
            ...prev,
            general: "Image size must be less than 5MB",
          }));
          continue;
        }

        const formDataUpload = new FormData();
        formDataUpload.append("images", file);

        const response = await api.post("/products/upload", formDataUpload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            setUploadProgress(progress);
          },
        });

        if (response.data.success) {
          uploadedUrls.push(...response.data.data.images);
        }
      }

      if (uploadedUrls.length > 0) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...uploadedUrls],
        }));
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      setErrors((prev) => ({
        ...prev,
        general: error.response?.data?.message || "Error uploading images",
      }));
    } finally {
      setUploading(false);
      setUploadProgress(0);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!formData.category) {
      newErrors.category = "Category is required";
    }
    if (!formData.price || formData.price <= 0) {
      newErrors.price = "Valid price is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e, status) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const data = {
        ...formData,
        status: status || formData.status,
      };

      if (isEditing) {
        await api.put(`/products/${id}`, data);
      } else {
        await api.post("/products", data);
      }

      navigate("/dashboard");
    } catch (error) {
      const message = error.response?.data?.message || "Error saving product";
      setErrors({ general: message });
    } finally {
      setLoading(false);
    }
  };

  if (fetchingProduct) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Link
          to="/dashboard"
          className="inline-flex items-center text-gray-500 hover:text-accent mb-4"
        >
          <ChevronLeft size={20} />
          Back to Dashboard
        </Link>
        <h1 className="text-2xl font-heading font-bold">
          {isEditing ? "Edit Product" : "Add New Product"}
        </h1>
        <p className="text-gray-500">
          {isEditing
            ? "Update your product details"
            : "Create a new product listing"}
        </p>
      </motion.div>

      {/* Error Message */}
      {errors.general && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {errors.general}
        </div>
      )}

      <form onSubmit={(e) => handleSubmit(e, formData.status)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-lg font-semibold mb-6">Basic Information</h2>

              {/* Product Name */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  className={`input ${errors.name ? "input-error" : ""}`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Describe your product..."
                  className={`input resize-none ${errors.description ? "input-error" : ""}`}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Category & Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`input ${errors.category ? "input-error" : ""}`}
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.category}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className={`input ${errors.price ? "input-error" : ""}`}
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-500">{errors.price}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-lg font-semibold mb-6">Product Images</h2>

              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                multiple
                className="hidden"
              />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images.map((img, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group"
                  >
                    <img
                      src={img}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} className="text-red-500" />
                    </button>
                  </div>
                ))}

                {formData.images.length < 5 && (
                  <>
                    {/* Upload from device button */}
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      disabled={uploading}
                      className="aspect-square rounded-lg border-2 border-dashed border-gray-200 hover:border-accent flex flex-col items-center justify-center text-gray-400 hover:text-accent transition-colors disabled:opacity-50"
                    >
                      {uploading ? (
                        <>
                          <Loader2 size={24} className="mb-2 animate-spin" />
                          <span className="text-xs">{uploadProgress}%</span>
                        </>
                      ) : (
                        <>
                          <Upload size={24} className="mb-2" />
                          <span className="text-xs">Upload</span>
                        </>
                      )}
                    </button>

                    {/* Add via URL button */}
                    <button
                      type="button"
                      onClick={handleImageUrlAdd}
                      className="aspect-square rounded-lg border-2 border-dashed border-gray-200 hover:border-accent flex flex-col items-center justify-center text-gray-400 hover:text-accent transition-colors"
                    >
                      <ImageIcon size={24} className="mb-2" />
                      <span className="text-xs">URL</span>
                    </button>
                  </>
                )}
              </div>

              <p className="mt-4 text-sm text-gray-500">
                Add up to 5 images. Click "Upload" to select from device or
                "URL" to add image link. Images will be uploaded to cloud
                storage.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-lg font-semibold mb-4">Status</h2>

              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="status"
                    value="draft"
                    checked={formData.status === "draft"}
                    onChange={handleChange}
                    className="text-accent"
                  />
                  <div>
                    <p className="font-medium">Save as Draft</p>
                    <p className="text-sm text-gray-500">Save and edit later</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="status"
                    value="published"
                    checked={formData.status === "published"}
                    onChange={handleChange}
                    className="text-accent"
                  />
                  <div>
                    <p className="font-medium">Publish Now</p>
                    <p className="text-sm text-gray-500">
                      Make visible to customers
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full btn btn-primary"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  <>
                    <Save size={20} className="mr-2" />
                    {isEditing ? "Update Product" : "Create Product"}
                  </>
                )}
              </button>

              {formData.status === "draft" && (
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, "published")}
                  disabled={loading}
                  className="w-full btn bg-green-600 text-white hover:bg-green-700"
                >
                  <Send size={20} className="mr-2" />
                  Save & Publish
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
