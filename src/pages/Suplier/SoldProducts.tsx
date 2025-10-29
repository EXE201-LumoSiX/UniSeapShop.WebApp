import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Eye,
  Search,
  Filter,
  ArrowLeft,
  DollarSign,
  ShoppingBag,
  AlertCircle,
  Wallet,
  CheckCircle,
  Clock,
} from "lucide-react";
import api from "../../config/axios";

interface SoldProduct {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: string; // "Pending" | "Completed"
}

interface PayoutRequest {
  id: string;
  recieverId: string;
  totalPrice: number;
  status: string;
  accountBank: string;
  accountNumber: string;
  accountName: string;
  orderID: string;
}

const SoldProducts: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<SoldProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<SoldProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [withdrawingIds, setWithdrawingIds] = useState<Set<string>>(new Set());
  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>([]);

  // Statistics
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    completedOrders: 0,
    pendingRevenue: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Fetch sold products
        const productsResponse = await api.get("api/orders/supplier/sold-products", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Fetch payout requests
        const payoutsResponse = await api.get("api/Payout/supplier", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (productsResponse.data && productsResponse.data.isSuccess) {
          const soldProducts = productsResponse.data.value.data || [];

          setProducts(soldProducts);
          setFilteredProducts(soldProducts);

          // Calculate statistics
          const totalRevenue = soldProducts.reduce(
            (sum: number, product: SoldProduct) => sum + product.totalPrice,
            0
          );
          const completedProducts = soldProducts.filter(
            (p: SoldProduct) => p.status === "Completed"
          );
          const pendingProducts = soldProducts.filter(
            (p: SoldProduct) => p.status === "Pending"
          );
          const pendingRevenue = pendingProducts.reduce(
            (sum: number, product: SoldProduct) => sum + product.totalPrice,
            0
          );

          setStats({
            totalOrders: soldProducts.length,
            totalRevenue,
            completedOrders: completedProducts.length,
            pendingRevenue,
          });
        } else {
          throw new Error(
            productsResponse.data.message || "Failed to fetch sold products"
          );
        }

        // Set payout requests
        if (payoutsResponse.data && payoutsResponse.data.isSuccess) {
          setPayoutRequests(payoutsResponse.data.value.data || []);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        const error = err as Error;
        setError(
          error.message || "Không thể tải danh sách sản phẩm đã bán. Vui lòng thử lại sau."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Filter products based on search and status
  useEffect(() => {
    let filtered = products;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.productName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter((product) => {
        if (filterStatus === "completed") {
          return product.status === "Completed";
        } else if (filterStatus === "pending") {
          return product.status === "Pending";
        }
        return true;
      });
    }

    setFilteredProducts(filtered);
  }, [searchTerm, filterStatus, products]);

  // Helper function to check if order has pending payout
  const hasPendingPayout = (orderId: string): boolean => {
    return payoutRequests.some(
      (payout) => payout.orderID === orderId && payout.status === "Pending"
    );
  };

  // Helper function to check if order has completed payout
  const hasCompletedPayout = (orderId: string): boolean => {
    return payoutRequests.some(
      (payout) => payout.orderID === orderId && payout.status === "Completed"
    );
  };

  // Helper function to get payout status for an order
  const getPayoutStatus = (orderId: string): string | null => {
    const payout = payoutRequests.find((p) => p.orderID === orderId);
    return payout?.status || null;
  };

  const handleWithdraw = async (orderId: string, productName: string, totalPrice: number) => {
    if (!window.confirm(`Bạn có chắc chắn muốn rút tiền từ đơn hàng "${productName}"?\nSố tiền: ${totalPrice.toLocaleString()} VNĐ`)) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      navigate("/login");
      return;
    }

    setWithdrawingIds(prev => new Set(prev).add(orderId));

    try {
      const response = await api.post(
        "api/Payout/orderId",
        JSON.stringify(orderId),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.isSuccess) {
        alert(`Yêu cầu rút tiền đã được gửi thành công!\nSản phẩm: ${productName}\nSố tiền: ${totalPrice.toLocaleString()} VNĐ\n\nYêu cầu của bạn đang chờ admin duyệt.`);
        
        // Refresh the page to update payout status
        window.location.reload();
      } else {
        throw new Error(response.data.message || "Không thể rút tiền");
      }
    } catch (err) {
      console.error("Error withdrawing money:", err);
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      const errorMessage = error.response?.data?.message || error.message || "Không thể rút tiền. Vui lòng thử lại sau.";
      alert(errorMessage);
    } finally {
      setWithdrawingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-amber-50 to-yellow-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500"></div>
        <p className="mt-4 text-gray-600">Đang tải danh sách sản phẩm...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-yellow-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center text-amber-800 hover:text-amber-900 transition-colors duration-200 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Trang chủ
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-amber-900">
                Sản phẩm đã bán
              </h1>
              <p className="text-amber-700 mt-1">
                Quản lý các đơn hàng và rút tiền
              </p>
            </div>
            <button
              onClick={() => navigate("/sell")}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-md hover:shadow-lg flex items-center"
            >
              <Package className="h-5 w-5 mr-2" />
              Đăng bán mới
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Tổng đơn hàng
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats.totalOrders}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <ShoppingBag className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Tổng doanh thu
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats.totalRevenue.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">VNĐ</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Đơn hoàn thành
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats.completedOrders}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <CheckCircle className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Chờ thanh toán
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats.pendingRevenue.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">VNĐ</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="all">Tất cả</option>
                <option value="completed">Đã hoàn thành</option>
                <option value="pending">Đang chờ</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Products List */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Package className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {searchTerm || filterStatus !== "all"
                ? "Không tìm thấy đơn hàng"
                : "Chưa có đơn hàng nào"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || filterStatus !== "all"
                ? "Thử điều chỉnh bộ lọc hoặc tìm kiếm"
                : "Bắt đầu đăng bán sản phẩm để nhận đơn hàng"}
            </p>
            {!searchTerm && filterStatus === "all" && (
              <button
                onClick={() => navigate("/sell")}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Đăng bán ngay
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Sản phẩm
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Số lượng
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Đơn giá
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Tổng tiền
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img
                            src={product.productImage}
                            alt={product.productName}
                            className="h-16 w-16 rounded-lg object-cover mr-4"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://via.placeholder.com/64?text=No+Image";
                            }}
                          />
                          <div>
                            <p className="font-semibold text-gray-900">
                              {product.productName}
                            </p>
                            {/* <p className="text-sm text-gray-500">
                              ID: {product.productId}
                            </p> */}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900">
                          {product.quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {product.unitPrice.toLocaleString()} VNĐ
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-green-600 text-lg">
                          {product.totalPrice.toLocaleString()} VNĐ
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            product.status === "Completed"
                              ? hasCompletedPayout(product.orderId)
                                ? "bg-green-100 text-green-700"
                                : hasPendingPayout(product.orderId)
                                ? "bg-orange-100 text-orange-700"
                                : "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {product.status === "Completed" 
                            ? hasCompletedPayout(product.orderId)
                              ? "Đã rút tiền" 
                              : hasPendingPayout(product.orderId)
                              ? "Đang chờ duyệt rút tiền"
                              : "Có thể rút tiền" 
                            : "Chưa thanh toán"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {/* State 2: Pending approval - show waiting status */}
                          {hasPendingPayout(product.orderId) ? (
                            <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-lg">
                              <Clock className="h-4 w-4 text-orange-600" />
                              <span className="text-sm font-medium text-orange-700">
                                Chờ admin duyệt
                              </span>
                            </div>
                          ) : hasCompletedPayout(product.orderId) ? (
                            /* State 3: Already withdrawn - show success status */
                            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-medium text-green-700">
                                Đã rút tiền thành công
                              </span>
                            </div>
                          ) : (
                            /* State 1: Can withdraw - show withdraw button */
                            <button
                              onClick={() => handleWithdraw(product.orderId, product.productName, product.totalPrice)}
                              disabled={product.status !== "Completed" || withdrawingIds.has(product.orderId)}
                              className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                                product.status === "Completed" && !withdrawingIds.has(product.orderId)
                                  ? "bg-green-600 hover:bg-green-700 text-white"
                                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                              }`}
                              title={
                                product.status !== "Completed"
                                  ? "Chỉ có thể rút tiền từ đơn hàng đã hoàn thành"
                                  : "Rút tiền"
                              }
                            >
                              {withdrawingIds.has(product.orderId) ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                                  <span>Đang xử lý...</span>
                                </>
                              ) : (
                                <>
                                  <Wallet className="h-4 w-4" />
                                  <span>Rút tiền</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Summary Footer */}
        {filteredProducts.length > 0 && (
          <div className="mt-6 bg-white rounded-xl shadow-md p-4 flex justify-between items-center">
            <p className="text-gray-600">
              Hiển thị <span className="font-semibold">{filteredProducts.length}</span> đơn hàng
              {searchTerm || filterStatus !== "all" ? " (đã lọc)" : ""}
            </p>
            <p className="text-gray-600">
              Tổng giá trị:{" "}
              <span className="font-semibold text-amber-800">
                {filteredProducts
                  .reduce((sum, p) => sum + p.totalPrice, 0)
                  .toLocaleString()}{" "}
                VNĐ
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SoldProducts;
