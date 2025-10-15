
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, Filter, Search, Heart } from "lucide-react";
import { removeDiacritics } from "../utils/stringUtils";
import { useNavigationHandlers } from "../utils/navigationHandlers";
import api from "../config/axios";

interface Product {
  id: string;
  productName: string;
  price: number;
  description?: string;
  productImage?: string;
  categoryId?: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

const SearchResults: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get("query") || "";
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [sortOption, setSortOption] = useState<string>("newest");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
    const {
      handleProductClick,
    } = useNavigationHandlers();
  
  // Fetch products and filter based on search query
  useEffect(() => {
    const fetchAndFilterProducts = async () => {
      setLoading(true);
      try {
        // Try to get products from localStorage first
        const storedProducts = localStorage.getItem("allProducts");
        let allProducts: Product[] = [];
        
        if (storedProducts) {
          allProducts = JSON.parse(storedProducts);
        } else {
          // If not in localStorage, fetch from API
          const response = await api.get("/api/Product");
          if (response.data && response.data.isSuccess) {
            allProducts = response.data.value.data || [];
            // Store in localStorage for future use
            localStorage.setItem("allProducts", JSON.stringify(allProducts));
          }
        }
        
        setProducts(allProducts);
        
        // Filter products based on search query
        if (initialQuery && allProducts.length > 0) {
          const normalizedQuery = removeDiacritics(initialQuery.toLowerCase());
          console.log("Normalized query:", normalizedQuery);
          console.log("All products:", allProducts);
          
          const filtered = allProducts.filter(product => {
            const normalizedName = removeDiacritics((product.productName || "").toLowerCase());
            const normalizedDesc = product.description ? 
              removeDiacritics(product.description.toLowerCase()) : '';
            
            const nameMatch = normalizedName.includes(normalizedQuery);
            const descMatch = normalizedDesc.includes(normalizedQuery);
            
            console.log(`Product: ${product.productName}, Name match: ${nameMatch}, Desc match: ${descMatch}`);
            
            return nameMatch || descMatch;
          });
          
          console.log("Filtered products:", filtered);
          setFilteredProducts(filtered);
        } else {
          setFilteredProducts([]);
        }
      } catch (error) {
        console.error("Error processing search:", error);
        setError("Có lỗi xảy ra khi tìm kiếm sản phẩm");
      } finally {
        setLoading(false);
      }
    };
    
    fetchAndFilterProducts();
  }, [initialQuery]);

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Handle sort change
  useEffect(() => {
    if (filteredProducts.length > 0) {
      let sorted = [...filteredProducts];
      
      switch (sortOption) {
        case "newest":
          sorted = sorted.sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
          });
          break;
        case "price-asc":
          sorted = sorted.sort((a, b) => a.price - b.price);
          break;
        case "price-desc":
          sorted = sorted.sort((a, b) => b.price - a.price);
          break;
        case "name-asc":
          sorted = sorted.sort((a, b) => a.productName.localeCompare(b.productName));
          break;
        default:
          break;
      }
      
      setFilteredProducts(sorted);
    }
  }, [sortOption]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-amber-800 hover:text-amber-900 mb-4"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Quay lại
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Kết quả tìm kiếm: "{initialQuery}"
          </h1>
          
          {!loading && filteredProducts.length > 0 && (
            <p className="text-gray-600">
              Tìm thấy {filteredProducts.length} sản phẩm
            </p>
          )}
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Search Form */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Tìm kiếm sản phẩm..."
                />
              </div>
            </form>
            
            {/* Sort Options */}
            <div className="flex items-center">
              <label htmlFor="sort" className="mr-2 text-gray-700 whitespace-nowrap">
                Sắp xếp theo:
              </label>
              <select
                id="sort"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="border border-gray-300 rounded-lg py-2 pl-3 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="newest">Mới nhất</option>
                <option value="price-asc">Giá tăng dần</option>
                <option value="price-desc">Giá giảm dần</option>
                <option value="name-asc">Tên A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-8 rounded-lg text-center">
            <p className="text-lg font-medium">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
            >
              Thử lại
            </button>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
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
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Không tìm thấy sản phẩm
            </h3>
            <p className="text-gray-500 mb-6">
              Không có sản phẩm nào phù hợp với từ khóa "{initialQuery}"
            </p>
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
            >
              Quay về trang chủ
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;