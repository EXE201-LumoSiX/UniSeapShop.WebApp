import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  ArrowLeft,
} from "lucide-react";
import api from "../../config/axios";

const RegisterSupplier: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form data state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    location: "",
    description: "",
  });

  // Load user data if available
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { state: { from: "/register-supplier" } });
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const userData = localStorage.getItem("user");
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setFormData((prev) => ({
            ...prev,
            fullName: parsedUser.username || "",
            email: parsedUser.email || "",
            phoneNumber: parsedUser.phoneNumber || "",
            location: parsedUser.location || "",
          }));
        }
        const response = await api.get("/api/User/profile");
        if (response.data && response.data.isSuccess) {
          const userData = response.data.value?.data;
          if (userData) {
            setFormData((prev) => ({
              ...prev,
              fullName: userData.username || "",
              email: userData.email || "",
              phoneNumber: userData.phoneNumber || "",
              location: userData.location || "",
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        // If API call fails, try to get data from localStorage as fallback
        try {
          const user = JSON.parse(localStorage.getItem("user") || "{}");
          setFormData((prev) => ({
            ...prev,
            fullName: user.username || "",
            email: user.email || "",
            phoneNumber: user.phoneNumber || "",
            location: user.location || "",
          }));
        } catch (e) {
          console.error("Error parsing user data from localStorage:", e);
        }
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Validate form data
      if (!formData.description.trim()) {
        throw new Error("Vui lòng nhập mô tả doanh nghiệp");
      }

      if (!formData.location.trim()) {
        throw new Error("Vui lòng nhập địa chỉ");
      }

      // Register supplier
      const response = await api.post(
        "/api/Auth/register-supplier",
        {
          email: formData.email,
          description: formData.description,
          location: formData.location,
          isActive: true,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.isSuccess) {
        setSuccess("Đăng ký nhà cung cấp thành công!");

        // Update local storage to reflect supplier status
        try {
          const user = JSON.parse(localStorage.getItem("user") || "{}");
          user.isSupplier = true;
          localStorage.setItem("user", JSON.stringify(user));
        } catch (e) {
          console.error("Error updating user in localStorage:", e);
        }
        // Redirect to sell page after a short delay
        setTimeout(() => {
          window.location.reload(); // Reload to trigger supplier check again
        }, 2000);
      } else {
        // Handle API error response
        const errorMessage =
          response.data?.error?.message ||
          "Đăng ký không thành công. Vui lòng thử lại sau.";
        throw new Error(errorMessage);
      }
    } catch (err: any) {
      console.error("Error registering supplier:", err);
      setError(
        err.response.data.error.message || "Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại sau."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-100 to-yellow-100 p-6 rounded-t-2xl border-b">
          <div className="flex items-center mb-4">
            <button
              onClick={() => navigate("/")}
              className="text-amber-800 hover:text-amber-900 flex items-center"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Quay lại trang chủ
            </button>
          </div>
          <h1 className="text-3xl font-bold text-amber-900">
            Đăng ký trở thành nhà cung cấp
          </h1>
          <p className="text-amber-700 mt-2">
            Hoàn thành thông tin để bắt đầu bán sản phẩm trên UniSeapShop
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Error message */}
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg">{error}</div>
          )}

          {/* Success message */}
          {success && (
            <div className="bg-green-50 text-green-700 p-4 rounded-lg">
              {success}
            </div>
          )}

          {/* User Information Section */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Thông tin cá nhân
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và tên
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 bg-gray-100 text-gray-700 cursor-not-allowed"
                    disabled
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 bg-gray-100 text-gray-700 cursor-not-allowed"
                    disabled
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 bg-gray-100 text-gray-700 cursor-not-allowed"
                    disabled
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="Nhập địa chỉ của bạn"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Business Information Section */}
          <div>
            <div className="space-y-6">
              {/* Business Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="Mô tả sản phẩm của bạn"
                    required
                  ></textarea>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Hãy mô tả chi tiết về loại sản phẩm bạn muốn bán và kinh nghiệm kinh doanh của bạn.
                </p>
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="text-gray-600">
                  Tôi đồng ý với{" "}
                  <a href="/terms" className="text-yellow-600 hover:underline">
                    Điều khoản dịch vụ
                  </a>{" "}
                  và{" "}
                  <a
                    href="/privacy"
                    className="text-yellow-600 hover:underline"
                  >
                    Chính sách bảo mật
                  </a>{" "}
                  của UniSeapShop
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div>
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
                "Đăng ký nhà cung cấp"
              )}
            </button>
          </div>

          {/* Additional Info */}
          <div className="text-center text-gray-600 text-sm">
            <p>
              Sau khi đăng ký thành công, bạn sẽ có thể đăng bán sản phẩm trên UniSeapShop.
            </p>
            <p className="mt-1">
              Tên cửa hàng của bạn sẽ được hiển thị là: <strong>{formData.fullName}</strong>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterSupplier;