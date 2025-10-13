import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, Truck, Clock, ArrowRight, Home, ShoppingBag, MapPin, User, Phone, Mail } from 'lucide-react';

const OrderSuccess: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state?.orderData;

  useEffect(() => {
    // If no order data is passed, redirect to home
    if (!orderData) {
      navigate('/');
    }
  }, [orderData, navigate]);

  // If no order data and we're still on this page, show a simplified version
  if (!orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-yellow-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Đặt hàng thành công!</h1>
            <p className="text-gray-600 mb-8">Cảm ơn bạn đã mua sắm tại UniSeap Shop.</p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/"
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-full font-semibold transition-colors duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
              >
                <Home className="h-5 w-5 mr-2" />
                Trang chủ
              </Link>
              <Link
                to="/user/orders"
                className="bg-amber-800 hover:bg-amber-900 text-white px-6 py-3 rounded-full font-semibold transition-colors duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Xem đơn hàng của tôi
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { 
    orderId, 
    orderDate, 
    totalAmount, 
    items = [], 
    shippingAddress, 
    fullName, 
    phone, 
    email, 
    note, 
    paymentMethod,
    shippingFee,
    paymentFee
  } = orderData;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-yellow-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Success Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-5">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Đặt hàng thành công!</h1>
            <p className="text-gray-600">
              Cảm ơn bạn đã mua sắm tại UniSeap Shop. Đơn hàng của bạn đã được xác nhận.
            </p>
          </div>

          {/* Order Info */}
          <div className="border border-gray-200 rounded-xl p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Thông tin đơn hàng</h2>
              <span className="text-sm font-medium text-gray-500">Mã đơn: #{orderId}</span>
            </div>

            <div className="space-y-4">
              {/* Order Date */}
              <div className="flex justify-between pb-4 border-b border-gray-100">
                <span className="text-gray-600">Ngày đặt hàng:</span>
                <span className="font-medium">{orderDate || new Date().toLocaleDateString('vi-VN')}</span>
              </div>
              
              {/* Order Items Summary */}
              <div className="flex justify-between pb-4 border-b border-gray-100">
                <span className="text-gray-600">Tổng số sản phẩm:</span>
                <span className="font-medium">{items.length} sản phẩm</span>
              </div>

              {/* Payment Method */}
              <div className="flex justify-between pb-4 border-b border-gray-100">
                <span className="text-gray-600">Phương thức thanh toán:</span>
                <span className="font-medium">Thanh toán khi nhận hàng (COD)</span>
              </div>

              {/* Subtotal */}
              <div className="flex justify-between pb-4 border-b border-gray-100">
                <span className="text-gray-600">Tạm tính:</span>
                <span className="font-medium">
                  {(totalAmount - (shippingFee || 0) - (paymentFee || 0)).toLocaleString()} VNĐ
                </span>
              </div>

              {/* Shipping Fee */}
              <div className="flex justify-between pb-4 border-b border-gray-100">
                <span className="text-gray-600">Phí vận chuyển:</span>
                <span className="font-medium">
                  {shippingFee === 0 ? (
                    <span className="text-green-600">Miễn phí</span>
                  ) : (
                    `${shippingFee.toLocaleString()} VNĐ`
                  )}
                </span>
              </div>

              {/* Payment Fee */}
              {              paymentFee > 0 && (
                <div className="flex justify-between pb-4 border-b border-gray-100">
                  <span className="text-gray-600">Phí thanh toán:</span>
                  <span className="font-medium">{paymentFee.toLocaleString()} VNĐ</span>
                </div>
              )}

              {/* Total Amount */}
              <div className="flex justify-between pb-4 border-b border-gray-100">
                <span className="text-gray-600 font-semibold">Tổng tiền:</span>
                <span className="font-bold text-amber-800 text-lg">{totalAmount.toLocaleString()} VNĐ</span>
              </div>

              {/* Customer Info */}
              <div className="pt-2 space-y-3">
                <div className="flex items-start">
                  <User className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
                  <div>
                    <span className="text-gray-600 text-sm">Người nhận:</span>
                    <p className="font-medium text-gray-800">{fullName}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
                  <div>
                    <span className="text-gray-600 text-sm">Số điện thoại:</span>
                    <p className="font-medium text-gray-800">{phone}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
                  <div>
                    <span className="text-gray-600 text-sm">Email:</span>
                    <p className="font-medium text-gray-800">{email}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
                  <div>
                    <span className="text-gray-600 text-sm">Địa chỉ giao hàng:</span>
                    <p className="font-medium text-gray-800">{shippingAddress}</p>
                  </div>
                </div>
                
                {note && (
                  <div className="flex items-start pt-2 border-t border-gray-100">
                    <div>
                      <span className="text-gray-600 text-sm">Ghi chú:</span>
                      <p className="font-medium text-gray-800">{note}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Delivery Timeline */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Trạng thái đơn hàng</h3>
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 h-full w-0.5 bg-gray-200"></div>

              {/* Timeline Steps */}
              <div className="space-y-8">
                <div className="flex items-center relative">
                  <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center z-10">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-6">
                    <h4 className="font-medium text-gray-900">Đơn hàng đã xác nhận</h4>
                    <p className="text-sm text-gray-500">
                      {orderDate || new Date().toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center relative">
                  <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center z-10">
                    <Package className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="ml-6">
                    <h4 className="font-medium text-gray-600">Đang chuẩn bị hàng</h4>
                    <p className="text-sm text-gray-500">Đơn hàng của bạn đang được chuẩn bị</p>
                  </div>
                </div>

                <div className="flex items-center relative">
                  <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center z-10">
                    <Truck className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="ml-6">
                    <h4 className="font-medium text-gray-600">Đang giao hàng</h4>
                    <p className="text-sm text-gray-500">Đơn hàng sẽ được giao trong 2-3 ngày</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="bg-amber-50 rounded-xl p-6 mb-8">
            <div className="flex items-start">
              <Clock className="h-6 w-6 text-amber-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Thông tin giao hàng</h4>
                <p className="text-gray-600 mb-3">
                  Đơn hàng của bạn sẽ được giao trong vòng 2-3 ngày làm việc. Chúng tôi sẽ liên hệ với bạn trước khi giao hàng.
                </p>
                <p className="text-gray-600">
                  Nếu bạn có bất kỳ câu hỏi nào về đơn hàng, vui lòng liên hệ với chúng tôi qua số điện thoại <span className="font-medium">1900 1234</span> hoặc email <span className="font-medium">support@uniseap.com</span>
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/"
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-full font-semibold transition-colors duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
            >
              <Home className="h-5 w-5 mr-2" />
              Trang chủ
            </Link>
            <Link
              to="/user/orders"
              className="bg-amber-800 hover:bg-amber-900 text-white px-6 py-3 rounded-full font-semibold transition-colors duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
            >
              <ShoppingBag className="h-5 w-5 mr-2" />
              Xem đơn hàng của tôi
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;