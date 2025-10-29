import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../config/axios";
import { Heart } from "lucide-react";

interface ProductDetail {
  id: string;
  productName: string;
  price: number;
  productImage?: string;
  description?: string;
  categoryName?: string;
  quantity?: number;
  productCondition?: string;
  supplierName?: string;
  supplierId?: string;
}

const ProductById: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!id) {
        setError("Không tìm thấy ID sản phẩm");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        console.log("Fetching product with ID:", id);
        const response = await api.get(`/api/Product/${id}`);
        console.log("Full API Response:", response);
        console.log("Response data:", response.data);

        // Check if response has the expected structure
        if (!response.data) {
          throw new Error("API không trả về dữ liệu");
        }

        // Handle different response structures
        let productData = response.data;

        // If response has isSuccess property (wrapped response)
        if (response.data.isSuccess !== undefined) {
          if (!response.data.isSuccess) {
            throw new Error(
              response.data.message || "Không thể tải thông tin sản phẩm"
            );
          }
          productData =
            response.data.value?.data ||
            response.data.value ||
            response.data.data;
        }

        console.log("Product data:", productData);

        if (!productData || !productData.id) {
          throw new Error("Dữ liệu sản phẩm không hợp lệ");
        }

        // Process the image URL
        let imageUrl = productData.productImage;

        if (
          imageUrl &&
          !imageUrl.startsWith("http") &&
          !imageUrl.startsWith("data:")
        ) {
          imageUrl = `${api.defaults.baseURL}/${imageUrl.replace(/^\//, "")}`;
        }

        setProduct({
          id: productData.id,
          productName: productData.productName || "Không có tên",
          price: productData.price || 0,
          productImage: imageUrl,
          description: productData.description || "Không có mô tả chi tiết.",
          categoryName: productData.categoryName || "Chưa phân loại",
          quantity: productData.quantity || 0,
          productCondition: productData.productCondition || "Không xác định",
          supplierName: productData.supplierName || "Không xác định",
          supplierId: productData.supplierId || "",
        });
      } catch (err: any) {
        console.error("Error fetching product details:", err);
        console.error("Error response:", err.response);

        let errorMessage =
          "Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.";

        if (err.response) {
          // Server responded with error
          if (err.response.status === 404) {
            errorMessage = "Không tìm thấy sản phẩm này";
          } else if (err.response.status === 500) {
            errorMessage = "Lỗi server. Vui lòng thử lại sau.";
          } else if (err.response.data?.message) {
            errorMessage = err.response.data.message;
          }
        } else if (err.request) {
          // Request made but no response
          errorMessage =
            "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.";
        } else if (err.message) {
          errorMessage = err.message;
        }

        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      // Check if the value doesn't exceed available stock
      if (product && product.quantity && value <= product.quantity) {
        setQuantity(value);
      } else if (product && product.quantity) {
        setQuantity(product.quantity);
      }
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    // Check if we can increase based on available stock
    if (product && product.quantity && quantity < product.quantity) {
      setQuantity(quantity + 1);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const addToCart = async () => {
    if (!product) return;

    try {
      // Check if user is logged in
      const token = localStorage.getItem("token");
      if (!token) {
        // If not logged in, redirect to login page
        alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
        navigate("/login", { state: { from: `/product/${id}` } });
        return;
      }

      // Show loading state
      setIsLoading(true);

      // Call API to add item to cart
      const response = await api.post("/api/cart/items", {
        productId: product.id,
        quantity: quantity,
      });

      // Check response
      if (response.data && response.data.isSuccess) {
        // Dispatch an event to update cart count in header
        const event = new CustomEvent("cartUpdated");
        window.dispatchEvent(event);
      } else {
        throw new Error(
          response.data?.error || "Không thể thêm sản phẩm vào giỏ hàng"
        );
      }
    } catch (err: any) {
      console.error("Error adding to cart:", err);

      let errorMessage =
        "Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại sau.";

      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
          // Clear token and redirect to login
          localStorage.removeItem("token");
          navigate("/login", { state: { from: `/product/${id}` } });
        } else if (err.response.data?.error) {
          errorMessage = err.response.data.error;
        }
      }

      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error("Image failed to load:", product?.productImage);
    e.currentTarget.src = "https://via.placeholder.com/400x400?text=No+Image";
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500"></div>
        <p className="mt-4 text-gray-600">Đang tải thông tin sản phẩm...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-20 max-w-4xl mx-auto px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="text-red-500 mb-4 text-xl font-semibold">
            {error || "Không tìm thấy sản phẩm"}
          </div>
          <p className="text-gray-600 mb-4">Product ID: {id}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8 text-sm text-gray-500">
          <button
            onClick={() => navigate("/")}
            className="hover:text-amber-700"
          >
            Trang chủ
          </button>
          {/* <span className="mx-2">/</span>
          <span className="text-amber-800 font-medium">
            {category.categoryName}
          </span> */}
          <span className="mx-2">/</span>
          <span className="text-amber-800 font-medium">
            {product.productName}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative">
            <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-200">
              {product.productImage ? (
                <img
                  src={product.productImage}
                  alt={product.productName}
                  className="w-full h-auto object-cover aspect-square"
                  onError={handleImageError}
                />
              ) : (
                <div className="w-full aspect-square flex items-center justify-center bg-gray-100">
                  <p className="text-gray-500">Không có hình ảnh</p>
                </div>
              )}
            </div>
            <button
              onClick={toggleFavorite}
              className="absolute top-4 right-4 p-3 rounded-full bg-white/90 shadow-md hover:bg-white transition-colors duration-200"
            >
              <Heart
                className={`h-6 w-6 ${
                  isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
                }`}
              />
            </button>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {product.productName}
            </h1>

            <div className="text-3xl font-bold text-amber-800 mb-6">
              {product.price.toLocaleString()} VNĐ
            </div>

            <div className="border-t border-b border-gray-200 py-6 mb-6">
              <div className="text-gray-700 mb-4">
                <h3 className="font-semibold mb-2">Mô tả sản phẩm:</h3>
                <p className="text-gray-600">{product.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <span className="text-gray-600">Danh mục:</span>
                  <span className="ml-2 text-gray-900">
                    {product.categoryName}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Người bán:</span>
                  <a
                    className="ml-2 text-gray-900 underline hover:text-amber-600"
                    href={`/supplierid/${product.supplierId}`}
                  >
                    {product.supplierName}
                  </a>
                </div>
                <div>
                  <span className="text-gray-600">Tình trạng:</span>
                  <span
                    className={`ml-2 ${
                      product.quantity && product.quantity > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {product.quantity && product.quantity > 0
                      ? "Còn hàng"
                      : "Hết hàng"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Trạng thái sản phẩm:</span>
                  <span className="ml-2 text-green-600">
                    {product.productCondition}
                  </span>
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-8">
              <label
                htmlFor="quantity"
                className="block text-gray-700 font-medium mb-2"
              >
                Số lượng:
              </label>
              <div className="flex">
                <button
                  onClick={decreaseQuantity}
                  className="bg-gray-100 border border-gray-300 px-4 py-2 rounded-l-lg hover:bg-gray-200"
                >
                  -
                </button>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  min="1"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-20 border-t border-b border-gray-300 text-center py-2 focus:outline-none focus:ring-0"
                />
                <button
                  onClick={increaseQuantity}
                  className="bg-gray-100 border border-gray-300 px-4 py-2 rounded-r-lg hover:bg-gray-200"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={addToCart}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={!product.quantity || product.quantity <= 0}
            >
              {product.quantity && product.quantity > 0
                ? "Thêm vào giỏ hàng"
                : "Hết hàng"}
            </button>

            {/* Additional Info */}
            <div className="mt-8 text-sm text-gray-500">
              <p className="mb-1">✓ Giao hàng nhanh chóng</p>
              <p className="mb-1">✓ Đổi trả trong vòng 30 ngày</p>
              <p>✓ Bảo hành chính hãng</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductById;
