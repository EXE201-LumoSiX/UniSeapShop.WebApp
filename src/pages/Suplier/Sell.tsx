import React, { useState, useEffect } from 'react';
import { Upload, DollarSign, Percent } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../config/axios';

const SellItem: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    originalPrice: 0,
    productImage: '',
    usageHistory: '',
    categoryId: '',
    quantity: 1,
    supplierId: '',
    discount: 0
  });

  const usageHistoryOptions = ['Mới', 'Đã sử dụng dưới 1 năm', '1-3 năm', 'Trên 3 năm'];

  useEffect(() => {
    // Kiểm tra đăng nhập
    const token = localStorage.getItem("token");
    if (!token) {
      navigate('/login');
      return;
    }
    setIsLoggedIn(true);
    
    // Lấy ID người dùng từ localStorage hoặc từ token
    const userIdFromStorage = localStorage.getItem("userId");
    if (userIdFromStorage) {
      setUserId(userIdFromStorage);
      setFormData(prev => ({
        ...prev,
        supplierId: userIdFromStorage
      }));
    }
    
    // Lấy danh sách danh mục
    const fetchCategories = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get("api/categories");
        if (response.data && response.data.isSuccess) {
          const categoriesData = response.data.value.data || [];
          setCategories(categoriesData);
          if (categoriesData.length > 0) {
            setFormData(prev => ({
              ...prev,
              categoryId: categoriesData[0].id
            }));
          }
        } else {
          throw new Error(response.data.message || "Không thể tải danh mục");
        }
      } catch (err) {
        console.error("Lỗi khi tải danh mục:", err);
        setError("Không thể tải danh mục sản phẩm");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Xử lý các trường số
    if (type === 'number') {
      const numValue = parseFloat(value);
      setFormData(prev => ({
        ...prev,
        [name]: isNaN(numValue) ? 0 : numValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        // Chuyển đổi hình ảnh thành base64 string
        const base64String = reader.result as string;
        setFormData(prev => ({
          ...prev,
          productImage: base64String
        }));
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    
    if (!formData.supplierId && userId) {
      setFormData(prev => ({
        ...prev,
        supplierId: userId
      }));
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Chuẩn bị dữ liệu để gửi
      const productData = {
        productName: formData.productName,
        description: formData.description,
        originalPrice: formData.originalPrice,
        productImage: formData.productImage,
        usageHistory: formData.usageHistory,
        categoryId: formData.categoryId,
        quantity: formData.quantity,
        supplierId: formData.supplierId || userId,
        discount: formData.discount
      };
      
      // Gửi request đến API
      const response = await api.post('api/Product', productData);
      
      if (response.data && response.data.isSuccess) {
        alert('Đăng bán sản phẩm thành công!');
        navigate('/'); // Chuyển về trang chủ sau khi đăng bán thành công
      } else {
        throw new Error(response.data.message || 'Đăng bán sản phẩm thất bại');
      }
    } catch (err: any) {
      console.error('Lỗi khi đăng bán sản phẩm:', err);
      setError(err.message || 'Đăng bán sản phẩm thất bại. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoggedIn) {
    return null; // Sẽ chuyển hướng trong useEffect
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-100 to-yellow-100 p-6 rounded-t-2xl border-b">
          <h1 className="text-3xl font-bold text-amber-900">Đăng bán sản phẩm</h1>
          <p className="text-amber-700 mt-2">Điền thông tin chi tiết về sản phẩm bạn muốn bán</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Hiển thị lỗi nếu có */}
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg">
              {error}
            </div>
          )}
          
          {/* Product Image */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-3">
              Hình ảnh sản phẩm *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-yellow-400 transition-colors duration-200">
              {formData.productImage ? (
                <div className="relative">
                  <img 
                    src={formData.productImage} 
                    alt="Product preview" 
                    className="h-64 mx-auto object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, productImage: '' }))}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-3">Chọn ảnh đại diện cho sản phẩm của bạn</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg cursor-pointer transition-colors duration-200 text-lg font-medium"
                  >
                    Chọn ảnh
                  </label>
                </>
              )}
            </div>
          </div>

          {/* Product Name */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Tên sản phẩm *
            </label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-lg"
              placeholder="Nhập tên sản phẩm"
              required
            />
          </div>

          {/* Category & Usage History */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Danh mục *
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-lg"
                required
                disabled={isLoading}
              >
                {isLoading ? (
                  <option>Đang tải...</option>
                ) : categories.length > 0 ? (
                  categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.categoryName}
                    </option>
                  ))
                ) : (
                  <option>Không có danh mục</option>
                )}
              </select>
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Tình trạng sử dụng *
              </label>
              <select
                name="usageHistory"
                value={formData.usageHistory}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-lg"
                required
              >
                <option value="">Chọn tình trạng</option>
                {usageHistoryOptions.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price & Original Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Giá bán (VNĐ) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice || ''}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-lg"
                  placeholder="Nhập giá bán"
                  min="0"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Giảm giá (%)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Percent className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount || ''}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-lg"
                  placeholder="Nhập % giảm giá (nếu có)"
                  min="0"
                  max="100"
                />
              </div>
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Số lượng *
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity || ''}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-lg"
              placeholder="Nhập số lượng sản phẩm"
              min="1"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Mô tả sản phẩm *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-lg"
              placeholder="Mô tả chi tiết về sản phẩm của bạn"
              rows={5}
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-yellow-500 hover:bg-yellow-600 text-white py-4 rounded-lg text-xl font-medium transition-colors duration-200 ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Đang xử lý...' : 'Đăng bán sản phẩm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellItem;