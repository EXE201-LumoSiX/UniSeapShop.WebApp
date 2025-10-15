import React from "react";
import { Link } from "react-router-dom";
import { AlertCircle, ShoppingCart, Home } from "lucide-react";

const PaymentFailed: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-yellow-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Failed Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-red-100 mb-5">
              <AlertCircle className="h-12 w-12 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Thanh toán không thành công
            </h1>
            <p className="text-gray-600">
              Rất tiếc, giao dịch thanh toán của bạn không thể hoàn tất.
            </p>
          </div>

          {/* Payment Info */}
          <div className="bg-red-50 border border-red-100 rounded-xl p-6 mb-8">
            <div className="flex items-center mb-4">
              <div className="bg-red-100 rounded-full p-2 mr-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-red-800">
                Thanh toán PayOS thất bại
              </h3>
            </div>
            <p className="text-red-700 ml-10">
              Có lỗi xảy ra trong quá trình thanh toán. Vui lòng kiểm tra lại
              thông tin thanh toán hoặc thử lại sau.
            </p>
          </div>

          {/* Possible Reasons */}
          <div className="border border-gray-200 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Nguyên nhân có thể
            </h3>

            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="inline-block h-5 w-5 rounded-full bg-gray-200 mr-2 flex-shrink-0"></span>
                <span>Thẻ của bạn không đủ số dư để thực hiện giao dịch</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block h-5 w-5 rounded-full bg-gray-200 mr-2 flex-shrink-0"></span>
                <span>Thông tin thẻ không chính xác</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block h-5 w-5 rounded-full bg-gray-200 mr-2 flex-shrink-0"></span>
                <span>Ngân hàng từ chối giao dịch vì lý do bảo mật</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block h-5 w-5 rounded-full bg-gray-200 mr-2 flex-shrink-0"></span>
                <span>
                  Kết nối mạng không ổn định trong quá trình thanh toán
                </span>
              </li>
            </ul>
          </div>

          {/* What to do next */}
          <div className="border border-gray-200 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Bạn có thể làm gì?
            </h3>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-semibold text-sm">
                  1
                </div>
                <div className="ml-3">
                  <p className="text-gray-700">
                    Kiểm tra lại thông tin thẻ và tài khoản ngân hàng của bạn
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-semibold text-sm">
                  2
                </div>
                <div className="ml-3">
                  <p className="text-gray-700">
                    Thử lại với phương thức thanh toán khác
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-semibold text-sm">
                  3
                </div>
                <div className="ml-3">
                  <p className="text-gray-700">
                    Liên hệ với chúng tôi nếu bạn cần hỗ trợ thêm
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/cart"
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-full font-semibold transition-colors duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Quay lại giỏ hàng
            </Link>
            <Link
              to="/"
              className="bg-amber-800 hover:bg-amber-900 text-white px-6 py-3 rounded-full font-semibold transition-colors duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
            >
              <Home className="h-5 w-5 mr-2" />
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
