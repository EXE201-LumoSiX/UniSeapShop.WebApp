import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, User, Phone, RefreshCw } from "lucide-react";
import api from "../../config/axios";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [isCountdownActive, setIsCountdownActive] = useState(false);

    // Add useEffect for countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isCountdownActive && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsCountdownActive(false);
      setCountdown(30); // Reset for next use
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown, isCountdownActive]);

  // Start countdown when OTP form is shown
  useEffect(() => {
    if (showOtpForm) {
      setIsCountdownActive(true);
    }
  }, [showOtpForm]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateRegisterForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName) newErrors.fullName = "Họ và tên là bắt buộc";
    if (!formData.email) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Vui lòng nhập email hợp lệ";
    }
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Số điện thoại là bắt buộc";
    } else if (!/^\d{10,11}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Vui lòng nhập số điện thoại hợp lệ";
    }
    if (!formData.password) {
      newErrors.password = "Mật khẩu là bắt buộc";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRegisterForm()) return;
    setIsLoading(true);
    setErrors({});

    try {
      await api.post("/api/Auth/register", {
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
      });
      setIsLoading(false);
      setShowOtpForm(true);
    } catch (error: any) {
      setIsLoading(false);
      if (error.response && error.response.data) {
        setErrors({
          form:
            error.response.data.message ||
            "Đăng ký thất bại. Vui lòng thử lại.",
        });
      } else {
        setErrors({ form: "Đã xảy ra lỗi. Vui lòng thử lại." });
      }
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const response = await api.post("/api/Auth/verify-otp", {
        email: formData.email,
        otp: otp,
      });
      console.log(response);
      setIsLoading(false);
      // Redirect to login page after successful verification
      navigate("/login");
    } catch (error: any) {
      setIsLoading(false);
      if (error.response && error.response.data) {
        setErrors({
          otp: error.response.data.message || "Mã OTP không hợp lệ.",
        });
      } else {
        setErrors({ otp: "Đã xảy ra lỗi khi xác thực OTP." });
      }
    }
  };

  const handleResendOtp = async () => {
    setIsResendingOtp(true);
    setResendSuccess(false);
    setErrors({});

    try {
      await api.post(
        "/api/Auth/resend-otp",
        {
          Email: formData.email,
          Type: "Register",
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResendSuccess(true);
      // Reset and start countdown after successful resend
      setCountdown(30);
      setIsCountdownActive(true);
      setTimeout(() => setResendSuccess(false), 5000); // Hide success message after 5 seconds
    } catch (error: any) {
      if (error.response && error.response.data) {
        setErrors({
          resend: error.response.data.message || "Không thể gửi lại mã OTP.",
        });
      } else {
        setErrors({ resend: "Đã xảy ra lỗi khi gửi lại mã OTP." });
      }
    } finally {
      setIsResendingOtp(false);
    }
  };

  const renderRegisterForm = () => (
    <form onSubmit={handleRegisterSubmit} className="space-y-4">
      {/* Full Name */}
      <div>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="Họ và tên"
            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
              errors.fullName ? "border-red-500" : "border-gray-300"
            }`}
          />
        </div>
        {errors.fullName && (
          <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
        )}
      </div>
      {/* Email */}
      <div>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
        </div>
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
        )}
      </div>
      {/* Phone Number */}
      <div>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            placeholder="Số điện thoại"
            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
              errors.phoneNumber ? "border-red-500" : "border-gray-300"
            }`}
          />
        </div>
        {errors.phoneNumber && (
          <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
        )}
      </div>
      {/* Password */}
      <div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Mật khẩu"
            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
          />
        </div>
        {errors.password && (
          <p className="text-red-500 text-xs mt-1">{errors.password}</p>
        )}
      </div>
      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-300 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-200 shadow-md hover:shadow-lg"
      >
        {isLoading ? "Đang xử lý..." : "Đăng ký"}
      </button>
      {/* Error Message */}
      {errors.form && (
        <p className="text-red-500 text-sm text-center">{errors.form}</p>
      )}
      {/* Login Link */}
      <div className="text-center mt-4">
        <p className="text-gray-600">
          Bạn đã có tài khoản?{" "}
          <Link
            to="/login"
            className="text-yellow-600 hover:underline"
          >
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </form>
  );

  const renderOtpForm = () => (
    <form onSubmit={handleOtpSubmit} className="space-y-4">
      <div>
        <p className="text-gray-700 text-center mb-4">
          Mã OTP đã được gửi đến email của bạn
        </p>
        <div className="relative">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Nhập mã OTP"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 border-gray-300"
          />
        </div>
        {errors.otp && (
          <p className="text-red-500 text-xs mt-1">{errors.otp}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-300 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-200 shadow-md hover:shadow-lg"
      >
        {isLoading ? "Đang xử lý..." : "Xác thực OTP"}
      </button>

      {/* Resend OTP button */}
      <div className="text-center">
        <button
          type="button"
          onClick={handleResendOtp}
          disabled={isResendingOtp || isCountdownActive}
          className={`inline-flex items-center text-yellow-600 hover:text-yellow-700 font-medium text-sm ${
                    isCountdownActive 
              ? "text-gray-400 cursor-not-allowed" 
              : "text-yellow-600 hover:text-yellow-700"
          }`}
        >
          <RefreshCw
            className={`h-4 w-4 mr-1 ${isResendingOtp ? "animate-spin" : ""}`}
          />
          {isResendingOtp ? "Đang gửi..." : isCountdownActive
              ? `Gửi lại mã OTP (${countdown}s)` 
              : "Gửi lại mã OTP"}
        </button>

        {resendSuccess && (
          <p className="text-green-500 text-xs mt-1">
            Mã OTP đã được gửi lại thành công!
          </p>
        )}

        {errors.resend && (
          <p className="text-red-500 text-xs mt-1">{errors.resend}</p>
        )}
      </div>
    </form>
  );

  return (
    <div className="min-h-screen bg-[#faf1df] flex items-center justify-center px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-xl w-full">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-amber-900 mb-2">
            <span className="text-yellow-600">Uni</span>Seap
          </h1>
          <h2 className="text-2xl font-bold text-amber-900 mb-2">
            Tham gia cùng chúng tôi
          </h2>
          <p className="text-amber-700">
            Tạo tài khoản của bạn để bắt đầu dạo chợ
          </p>
        </div>

        {/* Form */}
        <div className="flex items-center justify-center mt-6">
          <div className="max-w-[440px] w-full">
            <div className="bg-white rounded-xl shadow-xl p-8 overflow-y-auto border-2 border-yellow-500">
              <div className="bg-yellow-500 text-white underline text-center py-3 font-bold text-xl rounded-t-lg -mt-8 -mx-8 mb-6">
                ĐĂNG KÝ
              </div>
              {showOtpForm ? renderOtpForm() : renderRegisterForm()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
