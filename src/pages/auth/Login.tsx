import { Mail, Lock } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import api from "../../config/axios";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks"; // Thay đổi import này
import { login } from "../../redux/feature/userSlice";

// Add these functions at the top of your file, after the imports

// Function to decode JWT and extract role
const decodeJwtRole = (token: string): string => {
  try {
    // Split the token into parts
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('Invalid token format');
      return 'Customer'; // Default role if token format is invalid
    }
    
    // Decode the payload (second part)
    const payload = JSON.parse(atob(parts[1]));
    
    // Extract role from payload
    return payload.role || 'Customer'; // Default to Customer if role not found
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return 'Customer'; // Default role on error
  }
};

// Function to get token expiration from JWT
const getTokenExpiration = (token: string): string => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return '';
    
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp) {
      // Convert exp (seconds) to milliseconds and create Date
      return new Date(payload.exp * 1000).toISOString();
    }
    return '';
  } catch (error) {
    console.error('Error getting token expiration:', error);
    return '';
  }
};
interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch(); // Sử dụng custom hook
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.emailOrPhone) {
      newErrors.emailOrPhone = "Email hoặc số điện thoại là bắt buộc";
    } else {
      const isEmail = /\S+@\S+\.\S+/.test(formData.emailOrPhone);
      const isPhone = /^\+?[1-9]\d{7,14}$/.test(formData.emailOrPhone);
      if (!isEmail && !isPhone) {
        newErrors.emailOrPhone =
          "Vui lòng nhập email hoặc số điện thoại hợp lệ";
      }
    }
    if (!formData.password) {
      newErrors.password = "Mật khẩu là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const response = await api.post("api/Auth/login", {
        email: formData.emailOrPhone,
        password: formData.password,
      });

      if (response.data && response.data.isSuccess) {
        const responseData = response.data.value.data;
        const { accessToken, refreshToken, user } = responseData;
        const role = decodeJwtRole(accessToken);

        // Dispatch action và lưu vào localStorage
        dispatch(login(response.data));
        localStorage.setItem("token", accessToken);
        localStorage.setItem("tokenExpiration", getTokenExpiration(accessToken));
        localStorage.setItem("role", role);
        localStorage.setItem("user", JSON.stringify(user));

        onLogin();

        // Điều hướng dựa trên vai trò
        switch (role) {
          case "Customer":
            navigate("/");
            break;
          case "Admin":
            navigate("/dashboard");
            break;
          case "Supplier":
            navigate("/supplier-dashboard");
            break;
          default:
            navigate("/");
        }
      } else {
        // Xử lý trường hợp API trả về isSuccess: false
        setErrors({
          form: response.data.message || "Email hoặc mật khẩu không chính xác.",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors({
        form:
          error.response.data.error.message ||
          "Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf1df] flex items-center justify-center px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-xl w-full">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-amber-900 mb-2">
            <span className="text-yellow-600">Uni</span>Seap
          </h1>
          <h2 className="text-2xl font-bold text-amber-900 mb-2">
            Chào mừng bạn quay lại
          </h2>
          <p className="text-amber-700">Đăng nhập vào tài khoản của bạn</p>
        </div>

        <div className="flex items-center justify-center">
          <div className="max-w-[440px] w-full">
            <div className="mt-6 bg-white rounded-xl shadow-xl p-8 border-2 border-yellow-500">
              <div className="bg-yellow-500 text-white underline text-center py-3 font-bold text-xl rounded-t-lg -mt-8 -mx-8 mb-6">
                ĐĂNG NHẬP
              </div>
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="emailOrPhone"
                    value={formData.emailOrPhone}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                      errors.emailOrPhone ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Email/Số điện thoại"
                  />
                </div>
                {errors.emailOrPhone && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.emailOrPhone}
                  </p>
                )}

                <div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                        errors.password ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Mật khẩu"
                    />
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                {errors.form && (
                  <p className="text-red-500 text-sm text-center">
                    {errors.form}
                  </p>
                )}

                <div className="text-right">
                  <a
                    href="#"
                    className="text-sm text-yellow-600 hover:underline"
                  >
                    Quên mật khẩu?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-300 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  {isLoading ? "Đang xử lý..." : "ĐĂNG NHẬP"}
                </button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Hoặc</span>
                  </div>
                </div>

                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      /* Xử lý đăng nhập bằng Google */
                    }}
                    className="p-2 bg-white hover:bg-gray-100 rounded-full transition-colors duration-200 shadow-sm"
                  >
                    <FcGoogle className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Bạn chưa có tài khoản?{" "}
                  <Link
                    to="/register"
                    className="text-yellow-600 hover:underline"
                  >
                    Đăng ký ngay
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
