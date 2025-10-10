import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../config/axios';
import { Heart } from 'lucide-react';

interface ProductDetail {
  id: string;
  productName: string;
  price: number;
  productImage?: string;
  description?: string;
  category?: string;
  stock?: number;
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
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await api.get(`api/Product/${id}`);
        
        if (response.data && response.data.isSuccess) {
          setProduct({
            id: response.data.value.id,
            productName: response.data.value.productName,
            price: response.data.value.price,
            productImage: response.data.value.productImage,
            description: response.data.value.description || 'Không có mô tả chi tiết.',
            category: response.data.value.category || 'Chưa phân loại',
            stock: response.data.value.stock || 0
          });
        } else {
          throw new Error(response.data.message || 'Không thể tải thông tin sản phẩm');
        }
      } catch (err: any) {
        console.error('Error fetching product details:', err);
        setError(err.message || 'Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProductDetails();
  }, [id]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const addToCart = () => {
    // Implement add to cart functionality
    alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-20 max-w-4xl mx-auto px-4">
        <div className="text-red-500 mb-4 text-xl">{error || 'Không tìm thấy sản phẩm'}</div>
        <button 
          onClick={() => navigate(-1)} 
          className="mt-4 bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg"
        >
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8 text-sm text-gray-500">
          <button onClick={() => navigate('/')} className="hover:text-amber-700">Trang chủ</button>
          <span className="mx-2">/</span>
          <span className="text-amber-800 font-medium">{product.productName}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative">
            <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-200">
              <img 
                src={product.productImage || "https://via.placeholder.com/600x600?text=No+Image"} 
                alt={product.productName}
                className="w-full h-auto object-cover aspect-square"
              />
            </div>
            <button 
              onClick={toggleFavorite}
              className="absolute top-4 right-4 p-3 rounded-full bg-white/90 shadow-md hover:bg-white transition-colors duration-200"
            >
              <Heart 
                className={`h-6 w-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
              />
            </button>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.productName}</h1>
            
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
                  <span className="ml-2 text-gray-900">{product.category}</span>
                </div>
                <div>
                  <span className="text-gray-600">Tình trạng:</span>
                  <span className={`ml-2 ${product.stock && product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock && product.stock > 0 ? 'Còn hàng' : 'Hết hàng'}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Quantity Selector */}
            <div className="mb-8">
              <label htmlFor="quantity" className="block text-gray-700 font-medium mb-2">
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
              className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200"
              disabled={!product.stock || product.stock <= 0}
            >
              {product.stock && product.stock > 0 ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
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