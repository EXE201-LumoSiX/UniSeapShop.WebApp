import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  CreditCard,
  Package,
  MapPin,
  User,
  Phone,
  Mail,
  CheckCircle,
  Clock,
  Truck,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCartItems,
  selectCartTotal,
  selectCartItemsCount,
  clearCart,
} from "../../redux/feature/cartSlice";
import api from "../../config/axios";


// Define payment methods
const paymentMethods = [
  {
    id: "PayOS",
    name: "Thanh toán online",
    icon: CreditCard,
    description: "Thanh toán qua cổng PayOS",
    fee: 0,
  },
  {
    id: "COD",
    name: "Thanh toán khi nhận hàng (COD)",
    icon: Package,
    description: "Thanh toán bằng tiền mặt khi nhận hàng",
    fee: 15000,
  },
];

const Order: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const totalItems = useSelector(selectCartItemsCount);
  const subtotal = useSelector(selectCartTotal);

  const [isLoading, setIsLoading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    paymentMethods[0].id
  );
  const [shippingAddress, setShippingAddress] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Calculate fees and total
  const shippingFee = 0; // Free shipping
  const paymentFee =
    paymentMethods.find((method) => method.id === selectedPaymentMethod)?.fee ||
    0;
  const total = subtotal + shippingFee + paymentFee;

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vui lòng đăng nhập để tiến hành thanh toán");
      navigate("/login", { state: { from: "/order-detail" } });
      return;
    }

    // Check if cart is empty
    if (cartItems.length === 0) {
      navigate("/cart");
      return;
    }

    // Load user profile data
    const fetchUserProfile = async () => {
      try {
        const response = await api.get("/api/users/profile");
        if (response.data && response.data.isSuccess) {
          const userData = response.data.value?.data;
          if (userData) {
            setFullName(userData.fullName || "");
            setPhone(userData.phoneNumber || "");
            setEmail(userData.email || "");
            setShippingAddress(userData.address || "");
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [navigate, cartItems.length]);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!fullName.trim()) errors.fullName = "Vui lòng nhập họ tên";
    if (!phone.trim()) errors.phone = "Vui lòng nhập số điện thoại";
    else if (!/^[0-9]{10}$/.test(phone.trim()))
      errors.phone = "Số điện thoại không hợp lệ";

    if (!email.trim()) errors.email = "Vui lòng nhập email";
    else if (!/\S+@\S+\.\S+/.test(email.trim()))
      errors.email = "Email không hợp lệ";

    if (!shippingAddress.trim())
      errors.shippingAddress = "Vui lòng nhập địa chỉ giao hàng";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      setIsLoading(true);

      // Create order via API
      const response = await api.post("/api/orders", {
        shipAddress: shippingAddress,
        paymentGateway: selectedPaymentMethod,
      });

      if (response.data && response.data.isSuccess) {
        const orderId = response.data.value?.data?.id;

        if (selectedPaymentMethod === "COD") {
          // For COD, navigate to success page with order data
          dispatch(clearCart());

          // Get current date and time for order confirmation
          const orderDate = new Date().toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });

          // Prepare order data to pass to success page
          const orderData = {
            orderId: orderId,
            orderDate: orderDate,
            totalAmount: total,
            items: cartItems,
            shippingAddress: shippingAddress,
            fullName: fullName,
            phone: phone,
            email: email,
            note: note,
            paymentMethod: "COD",
            shippingFee: shippingFee,
            paymentFee: paymentFee,
          };

          // Navigate to success page with order data
          navigate("/ordersuccess", { state: { orderData } });
        } else if (selectedPaymentMethod === "PayOS" && orderId) {
          // For PayOS, create payment link and redirect
          const paymentResponse = await api.post(
            `/api/payments/create-link/${orderId}`
          );

          if (paymentResponse.data && paymentResponse.data.isSuccess) {
            const paymentUrl = paymentResponse.data.value?.data;
            if (paymentUrl) {
              // Clear cart before redirecting to payment page
              dispatch(clearCart());
              // Redirect to payment gateway
              window.location.href = paymentUrl;
            } else {
              throw new Error("Không nhận được đường dẫn thanh toán");
            }
          } else {
            throw new Error(
              paymentResponse.data?.error ||
                "Không thể tạo đường dẫn thanh toán"
            );
          }
        } else {
          throw new Error(
            "Phương thức thanh toán không hợp lệ hoặc không nhận được mã đơn hàng"
          );
        }
      } else {
        throw new Error(response.data?.error || "Không thể tạo đơn hàng");
      }
    } catch (error: any) {
      console.error("Error creating order:", error);

      let errorMessage = "Không thể tạo đơn hàng. Vui lòng thử lại sau.";

      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
          localStorage.removeItem("token");
          navigate("/login", { state: { from: "/orderdetail" } });
        } else if (error.response.data?.error) {
          errorMessage = error.response.data.error;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-yellow-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link
            to="/cart"
            className="flex items-center text-amber-800 hover:text-amber-900 transition-colors duration-200 mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Quay lại giỏ hàng
          </Link>
          <h1 className="text-3xl font-bold text-amber-900">Thanh toán</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-amber-600" />
                Thông tin giao hàng
              </h3>

              <div className="space-y-4">
                {/* Form errors */}
                {Object.keys(formErrors).length > 0 && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                    <p className="font-medium">
                      Vui lòng kiểm tra lại thông tin:
                    </p>
                    <ul className="list-disc pl-5 mt-2 text-sm">
                      {Object.values(formErrors).map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className={`pl-10 w-full rounded-lg border ${
                          formErrors.fullName
                            ? "border-red-300"
                            : "border-gray-300"
                        } py-3 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
                        placeholder="Nguyễn Văn A"
                      />
                    </div>
                    {formErrors.fullName && (
                      <p className="mt-1 text-sm text-red-600">
                        {formErrors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={`pl-10 w-full rounded-lg border ${
                          formErrors.phone
                            ? "border-red-300"
                            : "border-gray-300"
                        } py-3 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
                        placeholder="0912345678"
                      />
                    </div>
                    {formErrors.phone && (
                      <p className="mt-1 text-sm text-red-600">
                        {formErrors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`pl-10 w-full rounded-lg border ${
                        formErrors.email ? "border-red-300" : "border-gray-300"
                      } py-3 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
                      placeholder="example@gmail.com"
                    />
                  </div>
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Địa chỉ giao hàng <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                      id="address"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      rows={3}
                      className={`pl-10 w-full rounded-lg border ${
                        formErrors.shippingAddress
                          ? "border-red-300"
                          : "border-gray-300"
                      } py-3 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
                      placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                    />
                  </div>
                  {formErrors.shippingAddress && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.shippingAddress}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="note"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Ghi chú (không bắt buộc)
                  </label>
                  <textarea
                    id="note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 py-3 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Thông tin bổ sung về đơn hàng, ví dụ: thời gian hay địa điểm giao hàng chi tiết"
                  />
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-amber-600" />
                Phương thức thanh toán
              </h3>

              <div className="space-y-4">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <div key={method.id} className="relative">
                      <input
                        type="radio"
                        id={`payment-${method.id}`}
                        name="paymentMethod"
                        value={method.id}
                        checked={selectedPaymentMethod === method.id}
                        onChange={() => setSelectedPaymentMethod(method.id)}
                        className="hidden peer"
                      />
                      <label
                        htmlFor={`payment-${method.id}`}
                        className="flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 peer-checked:border-amber-500 peer-checked:bg-amber-50 hover:bg-gray-50"
                      >
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 text-amber-600 mr-3">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">
                            {method.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {method.description}
                          </div>
                        </div>
                        <div className="ml-4">
                          {method.fee > 0 ? (
                            <span className="text-gray-600">
                              +{method.fee.toLocaleString()} VNĐ
                            </span>
                          ) : (
                            <span className="text-green-600">Miễn phí</span>
                          )}
                        </div>
                        {selectedPaymentMethod === method.id && (
                          <div className="absolute right-4 text-amber-600">
                            <CheckCircle className="h-5 w-5" />
                          </div>
                        )}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Package className="h-5 w-5 mr-2 text-amber-600" />
                Sản phẩm ({totalItems})
              </h3>

              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center py-4 border-b border-gray-100 last:border-0"
                  >
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={item.product.productImage}
                        alt={item.product.productName}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="text-base font-medium text-gray-900 line-clamp-1">
                        {item.product.productName}
                      </h4>
                      <div className="mt-1 flex text-sm">
                        <p className="text-gray-500">
                          {item.product.category} • {item.product.condition}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-sm font-medium text-gray-900">
                          {item.product.price.toLocaleString()} VNĐ x{" "}
                          {item.quantity}
                        </p>
                        <p className="text-sm font-bold text-amber-800">
                          {(
                            item.product.price * item.quantity
                          ).toLocaleString()}{" "}
                          VNĐ
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
                    {subtotal.toLocaleString()} VNĐ
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

                {paymentFee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phí thanh toán</span>
                    <span className="font-medium">
                      {paymentFee.toLocaleString()} VNĐ
                    </span>
                  </div>
                )}

                <hr className="border-gray-200" />

                <div className="flex justify-between text-lg font-bold">
                  <span>Tổng cộng</span>
                  <span className="text-amber-800">
                    {total.toLocaleString()} VNĐ
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handlePlaceOrder}
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
                      <CheckCircle className="h-5 w-5" />
                      <span>Đặt hàng</span>
                    </>
                  )}
                </button>

                <p className="text-center text-sm text-gray-600">
                  Bằng việc đặt hàng, bạn đồng ý với các{" "}
                  <Link to="/terms" className="text-amber-800 hover:underline">
                    điều khoản
                  </Link>{" "}
                  của chúng tôi
                </p>
              </div>

              {/* Delivery Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                  <Clock className="h-4 w-4" />
                  <span>Giao hàng trong 2-3 ngày</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Truck className="h-4 w-4" />
                  <span>Miễn phí đổi trả trong 7 ngày</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
