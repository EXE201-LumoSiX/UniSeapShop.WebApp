import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import api from "../config/axios";
import { Product } from "../types";
import ProductGrid from "../components/ProductGrid";
import ProductModal from "../components/ProductModal";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Filter, Search } from "lucide-react";

interface CategoryDetails {
  id: string;
  name: string;
  description: string;
  products: Product[];
}

const ProductByCategory: React.FC = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const location = useLocation();
  const categoryId = location.state?.categoryId;
  const navigate = useNavigate();
  const [category, setCategory] = useState<CategoryDetails | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sortOption, setSortOption] = useState<string>("newest");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const tokenExpiration = localStorage.getItem("tokenExpiration");

    if (token && tokenExpiration) {
      const now = new Date();
      const expiration = new Date(tokenExpiration);
      setIsLoggedIn(now < expiration);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      if (!categoryId) {
        // If categoryId is not available in state, try to find it by name
        try {
          const response = await api.get("/api/categories");
          if (response.data && Array.isArray(response.data)) {
            // Find the category with a matching URL-friendly name
            const foundCategory = response.data.find((cat: any) => {
              const urlFriendlyName = removeDiacritics(cat.categoryName)
                .toLowerCase()
                .replace(/\s+/g, "");
              return urlFriendlyName === categoryName;
            });

            if (foundCategory) {
              fetchCategoryById(foundCategory.id);
            } else {
              setError("Không tìm thấy danh mục này");
              setLoading(false);
            }
          }
        } catch (err) {
          console.error("Error finding category by name:", err);
          setError("Không thể tải thông tin danh mục. Vui lòng thử lại sau.");
          setLoading(false);
        }
      } else {
        // If we have the categoryId from state, use it directly
        fetchCategoryById(categoryId);
      }
    };

    const fetchCategoryById = async (id: string) => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get(`/api/categories/${id}`);
        setCategory(response.data);

        // Transform the products data to match our Product type
        if (response.data.products && Array.isArray(response.data.products)) {
          const formattedProducts = response.data.products.map(
            (product: any) => ({
              id: product.id,
              title: product.name,
              price: product.price,
              originalPrice: product.originalPrice || product.price * 1.2,
              category: response.data.name,
              condition: product.condition || "Tốt",
              seller: product.seller?.fullName || "Unknown",
              location: product.location || "N/A",
              image:
                product.images?.[0]?.url ||
                "https://via.placeholder.com/300x200?text=No+Image",
              description: product.description || "Không có mô tả",
              canExchange: product.canExchange || false,
              postedDate:
                new Date(product.createdAt).toLocaleDateString("vi-VN") ||
                "N/A",
            })
          );

          setProducts(formattedProducts);
        }
      } catch (err: any) {
        console.error("Error fetching category details:", err);
        setError(
          err.response?.data?.message ||
            "Không thể tải thông tin danh mục. Vui lòng thử lại sau."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryDetails();
  }, [categoryId, categoryName]);

  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "priceAsc":
        return a.price - b.price;
      case "priceDesc":
        return b.price - a.price;
      case "newest":
        // Assuming postedDate is in a format that can be compared
        return (
          new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
        );
      default:
        return 0;
    }
  });

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
  };

  const handleAuthRequired = () => {
    navigate("/login");
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
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Đã xảy ra lỗi
          </h2>
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

        <h1 className="text-3xl font-bold text-gray-900">
          {category?.name || "Danh mục sản phẩm"}
        </h1>
        {category?.description && (
          <p className="mt-2 text-gray-600">{category.description}</p>
        )}
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
        <ProductGrid
          products={sortedProducts}
          onProductClick={openProductModal}
          searchQuery=""
        />
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

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={closeProductModal}
          isLoggedIn={isLoggedIn}
          onAuthRequired={handleAuthRequired}
        />
      )}
    </div>
  );
};

export default ProductByCategory;
