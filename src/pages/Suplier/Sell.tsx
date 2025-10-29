import React, { useState, useEffect } from "react";
import { Upload, DollarSign, Percent, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios";
import RegisterSupplier from "./RegisterSupplier";

const Sell: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isSupplier, setIsSupplier] = useState<boolean | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [formData, setFormData] = useState({
    ProductName: "",
    Description: "",
    OriginalPrice: 0,
    ProductImageFile: "",
    UsageHistory: "",
    CategoryId: "",
    Quantity: 1,
    SupplierId: "",
    Discount: 0,
  });

  const usageHistoryOptions = [
    "Mới",
    "Đã sử dụng dưới 1 năm",
    "1-3 năm",
    "Trên 3 năm",
  ];

  // Check if user is a supplier
  const checkSupplier = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const email = user?.email || "";

      if (!email) {
        throw new Error("Email not found");
      }

      const response = await api.post("api/Auth/check-exist-supplier", email, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setIsSupplier(!!response.data.value.data);
    } catch (err) {
      console.error("Error checking supplier:", err);
      setError("Không thể kiểm tra thông tin nhà cung cấp");
      setIsSupplier(false);
    }
  };

  useEffect(() => {
    // Kiểm tra đăng nhập và kiểm tra nhà cung cấp
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    setIsLoggedIn(true);

    // Lấy ID người dùng từ localStorage hoặc từ token
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        const userObject = JSON.parse(userString);
        // Lưu ID người dùng vào state
        setUserId(userObject.userId);
        // Lưu ID người dùng vào formData
        setFormData((prev) => ({
          ...prev,
          SupplierId: userObject.userId,
        }));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }

    // Kiểm tra người dùng có phải là nhà cung cấp không
    checkSupplier();

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
            setFormData((prev) => ({
              ...prev,
              CategoryId: categoriesData[0].id,
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

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    // Xử lý các trường số
    if (type === "number") {
      const numValue = parseFloat(value);
      setFormData((prev) => ({
        ...prev,
        [name]: isNaN(numValue) ? 0 : numValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Lưu file để gửi lên API
      setFormData((prev) => ({
        ...prev,
        ProductImageFile: file,
      }));

      // Tạo URL để preview
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    if (!formData.SupplierId && userId) {
      setFormData((prev) => ({
        ...prev,
        SupplierId: userId,
      }));
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      // Tạo FormData để gửi file
      const formDataToSend = new FormData();
      formDataToSend.append("ProductName", formData.ProductName);
      formDataToSend.append("Description", formData.Description);
      formDataToSend.append("OriginalPrice", formData.OriginalPrice.toString());
      formDataToSend.append("UsageHistory", formData.UsageHistory);
      formDataToSend.append("CategoryId", formData.CategoryId);
      formDataToSend.append("Quantity", formData.Quantity.toString());
      formDataToSend.append("SupplierId", formData.SupplierId || userId || "");
      formDataToSend.append("Discount", formData.Discount.toString());

      // Thêm file hình ảnh nếu có
      if (formData.ProductImageFile) {
        formDataToSend.append("ProductImageFile", formData.ProductImageFile);
      }

      // Gửi request đến API
      const response = await api.post("api/Product", formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Check for success in different possible response formats
      if (
        response.data &&
        (response.data.isSuccess === true ||
          (response.data.id && response.data.productName) ||
          (response.data.value && response.data.value.data))
      ) {
        navigate("/"); // Chuyển về trang chủ sau khi đăng bán thành công
      } else {
        throw new Error(
          response.data?.message ||
            response.data?.error ||
            "Đăng bán sản phẩm thất bại"
        );
      }
    } catch (err: any) {
      console.error("Lỗi khi đăng bán sản phẩm:", err);
      setError(
        err.message || "Đăng bán sản phẩm thất bại. Vui lòng thử lại sau."
      );
    } finally {
      setIsLoading(false);
    }
  };
  if (!isLoggedIn) {
    return null; // Sẽ chuyển hướng trong useEffect
  }

  // Hiển thị form đăng ký nhà cung cấp nếu chưa là nhà cung cấp
  if (isSupplier === false) {
    return <RegisterSupplier />;
  }

  // Hiển thị loading khi đang kiểm tra
  if (isSupplier === null) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
        <p className="ml-3 text-lg text-gray-700">Đang kiểm tra thông tin...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-100 to-yellow-100 p-6 rounded-t-2xl border-b">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-amber-900">
                Đăng bán sản phẩm
              </h1>
              <p className="text-amber-700 mt-2">
                Điền thông tin chi tiết về sản phẩm bạn muốn bán
              </p>
            </div>
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 bg-amber-900 hover:bg-amber-800 text-white px-5 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 whitespace-nowrap"
            >
              <Home className="h-5 w-5" />
              <span>Về trang chủ</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Hiển thị lỗi nếu có */}
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg">{error}</div>
          )}

          {/* Supplier Name */}
          <p className="mt-1">
            Người bán:{" "}
            <strong>
              {(() => {
                try {
                  const userObject = JSON.parse(
                    localStorage.getItem("user") || "{}"
                  );
                  return userObject.username || "Chưa có tên";
                } catch (error) {
                  return "Chưa có tên";
                }
              })()}
            </strong>
          </p>
          {/* Product Image */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-3">
              Hình ảnh sản phẩm *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-yellow-400 transition-colors duration-200">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="h-64 mx-auto object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        ProductImageFile: "",
                      }));
                      setImagePreview("");
                    }}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-3">
                    Chọn ảnh đại diện cho sản phẩm của bạn
                  </p>
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

          {/* Rest of the form remains unchanged */}
          {/* ... existing form fields ... */}

          {/* Product Name */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Tên sản phẩm *
            </label>
            <input
              type="text"
              name="ProductName"
              value={formData.ProductName}
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
                name="CategoryId"
                value={formData.CategoryId}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-lg"
                required
                disabled={isLoading}
              >
                {isLoading ? (
                  <option>Đang tải...</option>
                ) : categories.length > 0 ? (
                  categories.map((cat) => (
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
                name="UsageHistory"
                value={formData.UsageHistory}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-lg"
                required
              >
                <option value="">Chọn tình trạng</option>
                {usageHistoryOptions.map((option) => (
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
                  name="OriginalPrice"
                  value={formData.OriginalPrice || ""}
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
                  name="Discount"
                  value={formData.Discount}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-lg"
                  placeholder="0"
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
              name="Quantity"
              value={formData.Quantity || ""}
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
              name="Description"
              value={formData.Description}
              onChange={handleInputChange}
              rows={5}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-lg"
              placeholder="Mô tả chi tiết về sản phẩm của bạn..."
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-300 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-colors duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Đang xử lý...
                </>
              ) : (
                "Đăng bán sản phẩm"
              )}
            </button>
          </div>

          {/* Terms */}
          <div className="text-center text-gray-600 text-sm">
            Bằng việc đăng bán sản phẩm, bạn đồng ý với các{" "}
            <a href="/terms" className="text-yellow-600 hover:underline">
              điều khoản và điều kiện
            </a>{" "}
            của UniSeapShop
          </div>
        </form>
      </div>
    </div>
  );
};

export default Sell;
