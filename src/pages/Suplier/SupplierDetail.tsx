import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  Star,
  ArrowLeft,
  Store,
  Package,
  Clock,
  Mail,
  Phone,
  User,
} from "lucide-react";
import api from "../../config/axios";

interface SupplierDetail {
  fullName: string;
  email: string;
  phone: string;
  description: string;
  location: string;
  rating: number;
}

const SupplierDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState<SupplierDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSupplierDetails = async () => {
      if (!id) {
        setError("Không tìm thấy ID nhà cung cấp");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await api.get(`/api/User/supplier/${id}`, {
          headers,
        });

        if (response.data && response.data.isSuccess) {
          const supplierData = response.data.value?.data;
          if (supplierData) {
            setSupplier(supplierData);
          } else {
            throw new Error("Không tìm thấy thông tin nhà cung cấp");
          }
        } else {
          throw new Error(
            response.data?.message || "Không thể tải thông tin nhà cung cấp"
          );
        }
      } catch (err) {
        console.error("Error fetching supplier details:", err);

        let errorMessage =
          "Không thể tải thông tin nhà cung cấp. Vui lòng thử lại sau.";

        if (err && typeof err === "object" && "response" in err) {
          const error = err as {
            response?: { status?: number; data?: { message?: string } };
            request?: unknown;
          };
          if (error.response) {
            if (error.response.status === 401) {
              errorMessage =
                "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
              localStorage.removeItem("token");
              navigate("/login", { state: { from: `/supplierid/${id}` } });
            } else if (error.response.status === 404) {
              errorMessage = "Không tìm thấy thông tin nhà cung cấp.";
            } else if (error.response.data?.message) {
              errorMessage = error.response.data.message;
            }
          } else if (error.request) {
            errorMessage =
              "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.";
          }
        }

        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSupplierDetails();
  }, [id, navigate]);

  // Render stars based on rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="h-5 w-5 fill-yellow-200 text-yellow-400" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-5 w-5 text-gray-300" />);
    }

    return stars;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-amber-50 to-yellow-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500"></div>
        <p className="mt-4 text-gray-600">Đang tải thông tin nhà cung cấp...</p>
      </div>
    );
  }

  if (error || !supplier) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-yellow-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-amber-800 hover:text-amber-900 transition-colors duration-200 mb-6"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Quay lại
          </button>

          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="text-red-500 mb-4 text-xl font-semibold">
                {error || "Không tìm thấy thông tin nhà cung cấp"}
              </div>
              <button
                onClick={() => navigate("/")}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-full font-medium transition-colors duration-200"
              >
                Về trang chủ
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-yellow-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-amber-800 hover:text-amber-900 transition-colors duration-200 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Quay lại
        </button>

        {/* Supplier Info Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-amber-100 to-yellow-100 p-8">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-white p-4 rounded-full shadow-md">
                  <Store className="h-12 w-12 text-amber-800" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-amber-900 mb-2">
                    {supplier.fullName}
                  </h1>
                  <div className="flex items-center space-x-2">
                    {renderStars(supplier.rating)}
                    <span className="text-lg font-semibold text-amber-800 ml-2">
                      {supplier.rating.toFixed(1)}
                    </span>
                    <p className="text-sm text-amber-600">
                      {supplier.rating === 5
                        ? "Xuất sắc"
                        : supplier.rating >= 4
                        ? "Rất tốt"
                        : supplier.rating >= 3
                        ? "Tốt"
                        : "Trung bình"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Description Section */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Package className="h-6 w-6 mr-2 text-amber-600" />
                    Mô tả
                  </h2>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-700 leading-relaxed">
                      {supplier.description}
                    </p>
                  </div>
                </div>

                {/* Location Section */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <MapPin className="h-6 w-6 mr-2 text-amber-600" />
                    Địa chỉ
                  </h2>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-700 leading-relaxed">
                      {supplier.location}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats & Info Section */}
              <div className="space-y-6">
                {/* Rating Card */}
                {/* <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg p-6 border border-yellow-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Đánh giá
                  </h3>
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-amber-800 mb-2">
                        {supplier.rating.toFixed(1)}
                      </div>
                      <div className="flex justify-center mb-2">
                        {renderStars(supplier.rating)}
                      </div>
                      <p className="text-sm text-gray-600">
                        {supplier.rating === 5
                          ? "Xuất sắc"
                          : supplier.rating >= 4
                          ? "Rất tốt"
                          : supplier.rating >= 3
                          ? "Tốt"
                          : "Trung bình"}
                      </p>
                    </div>
                  </div>
                </div> */}

                {/* Additional Info */}
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Thông tin liên hệ
                  </h3>

                  {/* <div className="flex items-center space-x-3 text-gray-700">
                    <User className="h-5 w-5 text-amber-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Họ và tên</p>
                      <p className="font-medium">{supplier.fullName}</p>
                    </div>
                  </div> */}

                  <div className="flex items-center space-x-3 text-gray-700">
                    <Mail className="h-5 w-5 text-amber-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium break-all">{supplier.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-gray-700">
                    <Phone className="h-5 w-5 text-amber-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Số điện thoại</p>
                      <p className="font-medium">{supplier.phone}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-200 mt-4">
                    <div className="flex items-center space-x-3 text-gray-700">
                      <Clock className="h-5 w-5 text-amber-600" />
                      <span>Hoạt động hàng ngày</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-gray-700">
                    <Package className="h-5 w-5 text-amber-600" />
                    <span>Giao hàng toàn quốc</span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => navigate("/")}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  Xem sản phẩm của nhà cung cấp
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              Mọi thắc mắc vui lòng liên hệ với nhà cung cấp qua thông tin trên
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierDetail;
