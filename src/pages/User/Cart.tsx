import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  CreditCard,
  MapPin,
  Clock,
} from "lucide-react";
import {
  selectCartItems,
  selectCartTotal,
  selectCartItemsCount,
  removeFromCart,
  updateQuantity,
  clearCart,
} from "../../redux/feature/cartSlice";
import { useSelector, useDispatch } from "react-redux";
import api from "../../config/axios";
import { toMediaUrl } from '../../helpers/image';


const Cart: React.FC = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const totalItems = useSelector(selectCartItemsCount);
  const totalPrice = useSelector(selectCartTotal);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const shippingFee = 0; // Free shipping over 50M VND
  const finalTotal = totalPrice + shippingFee;

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        // Check if user is logged in
        const token = localStorage.getItem("token");
        if (!token) {
          // If not logged in, we can't fetch cart items
          return;
        }

        setIsLoading(true);
        const response = await api.get("/api/cart");

        if (response.data && response.data.isSuccess) {
          const cartData = response.data.value?.data || {};

          // Update Redux store with cart items from API
          if (cartData.items && cartData.items.length > 0) {
            // Transform API items to match our Redux store structure
            const items = cartData.items.map((item: any) => ({
              id: item.productId,
              product: {
                id: item.productId,
                productName: item.productName,
                price: item.price,
                productImage:
                  item.productImage || "https://via.placeholder.com/150",
                quantity: 10, 
                category: item.categoryName || "Uncategorized",
                condition: item.usageHistory || "Used",
                seller: item.supplierName || "Unknown",
                location: "Việt Nam",
              },
              quantity: item.quantity,
              isChecked: item.isCheck || false,
            }));

            // Update Redux store - you'll need to create an action for this
            dispatch({ type: "cart/setItems", payload: items });
          }
        } else {
          console.error("Failed to fetch cart items:", response.data?.error);
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartItems();
  }, [dispatch]);
  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }

    try {
      setIsLoading(true);
      
      // Call API to update item quantity
      const response = await api.put('/api/cart/items', {
        productId: itemId,
        quantity: newQuantity
      });

      // Check response
      if (response.data && response.data.isSuccess) {
        // Update Redux store
        dispatch(updateQuantity({ id: itemId, quantity: newQuantity }));
        
        // Dispatch an event to update cart count in header
        const event = new CustomEvent("cartUpdated");
        window.dispatchEvent(event);
      } else {
        throw new Error(response.data?.error || "Không thể cập nhật số lượng sản phẩm");
      }
    } catch (err: any) {
      console.error("Error updating cart item quantity:", err);
      
      let errorMessage = "Không thể cập nhật số lượng sản phẩm. Vui lòng thử lại sau.";
      
      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
          localStorage.removeItem("token");
          navigate("/login", { state: { from: "/cart" } });
        } else if (err.response.data?.error) {
          errorMessage = err.response.data.error;
        }
      }
      
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      setIsLoading(true);
      
      // Call API to remove item from cart
      const response = await api.delete(`/api/cart/items/${itemId}`);
      
      // Check response
      if (response.data && response.data.isSuccess) {
        // Update Redux store
        dispatch(removeFromCart(itemId));
        
        // Dispatch an event to update cart count in header
        const event = new CustomEvent("cartUpdated");
        window.dispatchEvent(event);
      } else {
        throw new Error(response.data?.error || "Không thể xóa sản phẩm khỏi giỏ hàng");
      }
    } catch (err: any) {
      console.error("Error removing item from cart:", err);
      
      let errorMessage = "Không thể xóa sản phẩm khỏi giỏ hàng. Vui lòng thử lại sau.";
      
      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
          localStorage.removeItem("token");
          navigate("/login", { state: { from: "/cart" } });
        } else if (err.response.data?.error) {
          errorMessage = err.response.data.error;
        }
      }
      
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };


const handleClearCart = async () => {
  try {
    setIsLoading(true);
    
    // Call API to clear all items from cart
    const response = await api.delete('/api/cart/remove-all');
    
    // Check response
    if (response.data && response.data.isSuccess) {
      // Update Redux store
      dispatch(clearCart());
      
      // Dispatch an event to update cart count in header
      const event = new CustomEvent("cartUpdated");
      window.dispatchEvent(event);
    } else {
      throw new Error(response.data?.error || "Không thể xóa tất cả sản phẩm khỏi giỏ hàng");
    }
  } catch (err: any) {
    console.error("Error clearing cart:", err);
    
    let errorMessage = "Không thể xóa tất cả sản phẩm khỏi giỏ hàng. Vui lòng thử lại sau.";
    
    if (err.response) {
      if (err.response.status === 401) {
        errorMessage = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
        localStorage.removeItem("token");
        navigate("/login", { state: { from: "/cart" } });
      } else if (err.response.data?.error) {
        errorMessage = err.response.data.error;
      }
    }
    
    alert(errorMessage);
  } finally {
    setIsLoading(false);
  }
};

const handleCheckout = () => {
  try {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Vui lòng đăng nhập để tiến hành thanh toán');
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    
    // Navigate to the order page
    navigate('/orderdetail');
  } catch (error) {
    console.error('Error navigating to checkout:', error);
    alert('Có lỗi xảy ra. Vui lòng thử lại sau.');
  }
};

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Link
              to="/"
              className="flex items-center text-amber-800 hover:text-amber-900 transition-colors duration-200 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Tiếp tục mua sắm
            </Link>
            <h1 className="text-3xl font-bold text-amber-900">Giỏ hàng</h1>
          </div>

          {/* Empty Cart */}
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-600 mb-4">
              Giỏ hàng trống
            </h2>
            <p className="text-gray-500 mb-8">
              Bạn chưa có sản phẩm nào trong giỏ hàng
            </p>
            <Link
              to="/"
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-full font-semibold transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Khám phá sản phẩm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center text-amber-800 hover:text-amber-900 transition-colors duration-200 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Tiếp tục mua sắm
            </Link>
            <h1 className="text-3xl font-bold text-amber-900">
              Giỏ hàng ({totalItems} sản phẩm)
            </h1>
          </div>

          {cartItems.length > 0 && (
            <button
              onClick={handleClearCart}
              className="text-red-600 hover:text-red-700 font-medium transition-colors duration-200"
            >
              Xóa tất cả
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={toMediaUrl(item.product.productImage)}
                      alt={item.product.productName}
                      className="w-full md:w-32 h-32 object-cover rounded-lg"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {item.product.productName}
                      </h3>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors duration-200"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="flex items-center space-x-4 mb-3">
                      <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {item.product.category}
                      </span>
                      <span
                        className={`text-sm px-2 py-1 rounded ${
                          item.product.condition === "Like New"
                            ? "bg-green-100 text-green-800"
                            : item.product.condition === "Excellent"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {item.product.condition}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 mb-3">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {item.product.seller}
                      </span>
                      <span className="text-sm text-gray-400">•</span>
                      <span className="text-sm text-gray-600">
                        {item.product.location}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg font-bold text-amber-800">
                          {item.product.price.toLocaleString()} VNĐ
                        </span>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity - 1)
                            }
                            className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-12 text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity + 1)
                            }
                            disabled={item.quantity >= item.product.quantity}
                            className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          {(
                            item.product.price * item.quantity
                          ).toLocaleString()}{" "}
                          VNĐ
                        </div>
                        <div className="text-sm text-gray-500">
                          Còn {item.product.quantity} sản phẩm
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Tóm tắt đơn hàng
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Tạm tính ({totalItems} sản phẩm)
                  </span>
                  <span className="font-medium">
                    {totalPrice.toLocaleString()} VNĐ
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Phí vận chuyển</span>
                  <span className="font-medium">
                    {shippingFee === 0 ? (
                      <span className="text-green-600">Miễn phí</span>
                    ) : (
                      `${shippingFee.toLocaleString()} VNĐ`
                    )}
                  </span>
                </div>

                {shippingFee === 0 && (
                  <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                    🎉 Bạn được miễn phí vận chuyển!
                  </div>
                )}

                <hr className="border-gray-200" />

                <div className="flex justify-between text-lg font-bold">
                  <span>Tổng cộng</span>
                  <span className="text-amber-800">
                    {finalTotal.toLocaleString()} VNĐ
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleCheckout}
                  disabled={isLoading}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-300 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Đang xử lý...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5" />
                      <span>Thanh toán</span>
                    </>
                  )}
                </button>

                <div className="text-center">
                  <Link
                    to="/"
                    className="text-amber-800 hover:text-amber-900 font-medium transition-colors duration-200"
                  >
                    ← Tiếp tục mua sắm
                  </Link>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                  <Clock className="h-4 w-4" />
                  <span>Giao hàng trong 2-3 ngày</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>Giao hàng toàn quốc</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
