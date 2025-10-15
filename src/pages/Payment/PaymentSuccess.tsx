import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ShoppingBag, Home } from 'lucide-react';

const PaymentSuccess: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-yellow-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Success Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-5">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Thanh toán thành công!</h1>
            <p className="text-gray-600">
              Cảm ơn bạn đã mua sắm tại UniSeap Shop. Đơn hàng của bạn đã được xác nhận và đang được xử lý.
            </p>
          </div>

          {/* Payment Info */}
          <div className="bg-green-50 border border-green-100 rounded-xl p-6 mb-8">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 rounded-full p-2 mr-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-green-800">Thanh toán PayOS thành công</h3>
            </div>
            <p className="text-green-700 ml-10">
              Chúng tôi đã nhận được thanh toán của bạn. Đơn hàng của bạn sẽ được giao trong thời gian sớm nhất.
            </p>
          </div>

          {/* Actions */}
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

export default PaymentSuccess;