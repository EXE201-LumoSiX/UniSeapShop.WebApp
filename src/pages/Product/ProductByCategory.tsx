
import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import api from "../../config/axios";
import { ChevronLeft, Filter, Search, Heart } from "lucide-react";
import { removeDiacritics } from "../../utils/stringUtils";

interface Product {
  id: string;
  productName: string;
  price: number;
  originalPrice: number;
  discount: number;
  productImage: string;
  description: string;
  categoryId: string;
  categoryName: string;
}

const ProductByCategory: React.FC = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const location = useLocation();
  const categoryId = location.state?.categoryId;
  const navigate = useNavigate();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<string>("newest");
  const [categoryTitle, setCategoryTitle] = useState<string>("Danh mục sản phẩm");

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let catId = categoryId;
        
        // If we don't have categoryId, find it by name
        if (!catId) {
          const categoriesResponse = await api.get("/api/categories");
          if (categoriesResponse.data && categoriesResponse.data.isSuccess) {
            const categories = categoriesResponse.data.value.data;
            const foundCategory = categories.find((cat: any) => {
              const urlFriendlyName = removeDiacritics(cat.categoryName)
                .toLowerCase()
                .replace(/\s+/g, "");
              return urlFriendlyName === categoryName;
            });
            
            if (foundCategory) {
              catId = foundCategory.id;
              setCategoryTitle(foundCategory.categoryName);
            } else {
              throw new Error("Không tìm thấy danh mục này");
            }
          } else {
            throw new Error("Không thể tải danh sách danh mục");
          }
        } else {
          // If we have categoryId but not the name, fetch category details
          const categoryResponse = await api.get(`/api/categories/${catId}`);
          if (categoryResponse.data && categoryResponse.data.isSuccess) {
            setCategoryTitle(categoryResponse.data.value.data.categoryName);
          }
        }
        
        // Fetch products by category
        const productsResponse = await api.get(`/api/categories/${catId}`);
        if (productsResponse.data && productsResponse.data.isSuccess) {
          const categoryData = productsResponse.data.value.data;
          setCategoryTitle(categoryData.categoryName);
          
          // Extract products from the category response
          if (categoryData.products && Array.isArray(categoryData.products)) {
            setProducts(categoryData.products);
          } else {
            setProducts([]);
          }
        } else {
          throw new Error("Không thể tải sản phẩm");
        }
      } catch (err: any) {
        console.error("Error:", err);
        setError(err.message || "Đã xảy ra lỗi khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategoryProducts();
  }, [categoryId, categoryName]);
  
  // Filter products based on search query
  const filteredProducts = products.filter(product =>
    product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Sort products based on selected option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "priceAsc":
        return a.price - b.price;
      case "priceDesc":
        return b.price - a.price;
      case "newest":
      default:
        return 0; // Default sorting (could be by ID or date if available)
    }
  });

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-yellow-500 border-t-transparent"></div>
          <p className="mt-4 text-lg text-gray-700">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Đã xảy ra lỗi</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button and Category title */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-yellow-600 hover:text-yellow-700 mb-4"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          <span>Quay lại</span>
        </button>

        <h1 className="text-3xl font-bold text-gray-900">{categoryTitle}</h1>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          <div className="flex space-x-2">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white appearance-none cursor-pointer"
              >
                <option value="newest">Mới nhất</option>
                <option value="priceAsc">Giá: Thấp đến cao</option>
                <option value="priceDesc">Giá: Cao đến thấp</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {sortedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden border border-gray-200"
              onClick={() => handleProductClick(product.id)}
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                <img
                  src={product.productImage || "https://via.placeholder.com/300x200?text=No+Image"}
                  alt={product.productName}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Wishlist */}
                <button 
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors duration-200 group"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the parent onClick
                    // Add wishlist functionality here
                  }}
                >
                  <Heart className="h-4 w-4 text-gray-600 group-hover:text-red-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-amber-800 transition-colors duration-200">
                  {product.productName}
                </h3>

                <div className="flex items-center">
                  <span className="text-xl font-bold text-amber-800">
                    {product.price.toLocaleString()} VNĐ
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <h3 className="text-xl font-medium text-gray-700">
            Không tìm thấy sản phẩm nào
          </h3>
          <p className="mt-2 text-gray-500">
            Không có sản phẩm nào trong danh mục này hoặc phù hợp với tìm kiếm
            của bạn.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductByCategory;