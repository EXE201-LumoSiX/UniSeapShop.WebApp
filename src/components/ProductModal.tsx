import React, { useState } from 'react';
import { X, MapPin, User, RefreshCw, MessageCircle, Heart } from 'lucide-react';
import { Product } from '../types';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  isLoggedIn: boolean;
  onAuthRequired: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ 
  product, 
  onClose, 
  isLoggedIn, 
  onAuthRequired 
}) => {
  const [showExchangeForm, setShowExchangeForm] = useState(false);
  const [exchangeMessage, setExchangeMessage] = useState('');

  const handleActionClick = (action: string) => {
    if (!isLoggedIn) {
      onAuthRequired();
      return;
    }
    
    // Handle the action (buy, exchange, message)
    console.log(`${action} clicked for product:`, product.id);
  };

  const handleExchangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      onAuthRequired();
      return;
    }
    // Handle exchange request
    console.log('Exchange request:', { productId: product.id, message: exchangeMessage });
    setShowExchangeForm(false);
    setExchangeMessage('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-amber-900">{product.title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          {/* Image */}
          <div className="space-y-4">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-96 object-cover rounded-xl"
            />
            
            {/* Seller Info */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-amber-200 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-amber-800" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{product.seller}</h4>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    {product.location}
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleActionClick('message')}
                  className="flex-1 bg-amber-100 text-amber-800 py-2 px-4 rounded-lg hover:bg-amber-200 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Nhắn tin</span>
                </button>
                <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200">
                  <Heart className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-3xl font-bold text-amber-800">{product.price.toLocaleString('vi-VN')} đ</span>
                  {product.originalPrice && (
                    <span className="text-lg text-gray-500 line-through">{product.originalPrice.toLocaleString('vi-VN')} đ</span>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium đ{
                  product.condition === 'Như mới' ? 'bg-green-100 text-green-800' :
                  product.condition === 'Khá tốt' ? 'bg-blue-100 text-blue-800' :
                  product.condition === 'Tốt' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  {product.condition}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <span className="text-sm text-gray-600">Danh mục</span>
                  <p className="font-medium text-gray-900">{product.category}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Ngày đăng</span>
                  <p className="font-medium text-gray-900">{product.postedDate}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Mô tả</h3>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => handleActionClick('buy')}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                Mua ngay - {product.price.toLocaleString('vi-VN')} đ
              </button>

              {product.canExchange && (
                <button
                  onClick={() => setShowExchangeForm(!showExchangeForm)}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                >
                  <RefreshCw className="h-5 w-5" />
                  <span>Đề xuất đổi hàng</span>
                </button>
              )}
            </div>

            {/* Exchange Form */}
            {showExchangeForm && (
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <h4 className="font-semibold text-green-800 mb-3">Đề xuất đổi hàng</h4>
                <form onSubmit={handleExchangeSubmit} className="space-y-3">
                  <textarea
                    value={exchangeMessage}
                    onChange={(e) => setExchangeMessage(e.target.value)}
                    placeholder="Mô tả những gì bạn muốn đổi và lý do tại sao...."
                    className="w-full p-3 border border-green-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows={3}
                    required
                  />
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
                    >
                      Gửi yêu cầu
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowExchangeForm(false)}
                      className="px-4 py-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors duration-200"
                    >
                      Hủy
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;