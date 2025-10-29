import React from "react";
import { useDashboardStore } from "./DashboardStore";
import { useNavigationHandlers } from "../../utils/navigationHandlers";
import {
  BarChart3,
  Users,
  Package,
  Settings,
  Search,
  Filter,
  Plus,
  Trash2,
  Eye,
  Edit,
  ListTree,
  X,
  User,
  Mail,
  Phone,
  CheckCircle,
  CreditCard,
  ReceiptText,
  XCircle,
} from "lucide-react";

const Admin: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    users,
    products,
    categories,
    orders,
    payments,
    paymentStatusFilter,
    setPaymentStatusFilter,
    paymentFromDate,
    setPaymentFromDate,
    paymentToDate,
    setPaymentToDate,
    payouts,
    payoutStatusFilter,
    setPayoutStatusFilter,
    isLoading,
    error,
    stats,
    statusFilter,
    setStatusFilter,
    showAddCategoryModal,
    setShowAddCategoryModal,
    showEditCategoryModal,
    setShowEditCategoryModal,
    currentCategory,
    setCurrentCategory,
    newCategory,
    setNewCategory,
    showCategoryDetailsModal,
    setShowCategoryDetailsModal,
    categoryProducts,
    selectedCategoryName,
    loadingCategoryProducts,
    showUserDetailsModal,
    setShowUserDetailsModal,
    selectedUser,
    loadingUserDetails,
    showPayoutDetailsModal,
    setShowPayoutDetailsModal,
    selectedPayout,
    loadingPayoutDetails,
    getPaymentStatusBadgeClass,
    handleUserAction,
    handleViewUserDetails,
    handleProductAction,
    handleViewCategoryDetails,
    handleAddCategory,
    handleEditCategory,
    handleDeleteCategory,
    handleViewOrderDetails,
    handleViewPayoutDetails,
    handleUpdatePayoutStatus,
  } = useDashboardStore();

  const { handleLogout } = useNavigationHandlers();

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng người dùng</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalUsers.toLocaleString()}
              </p>
            </div>
            <Users className="h-12 w-12 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng sản phẩm</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalProducts.toLocaleString()}
              </p>
            </div>
            <Package className="h-12 w-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng doanh thu</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalSales.toLocaleString()} VNĐ
              </p>
            </div>
            <BarChart3 className="h-12 w-12 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Chờ duyệt</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.pendingApprovals}
              </p>
            </div>
            <Settings className="h-12 w-12 text-red-500" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Hoạt động gần đây
        </h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-700">
              Người dùng mới đăng ký: Nguyễn Văn An
            </span>
            <span className="text-xs text-gray-500 ml-auto">5 phút trước</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      {/* Search and Actions */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm người dùng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          <div className="flex space-x-2">
            {/* <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Thêm người dùng</span>
          </button> */}
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Lọc</span>
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-yellow-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">
            <p>{error}</p>
            <button
              onClick={() => setActiveTab("users")}
              className="mt-2 text-yellow-600 hover:underline"
            >
              Thử lại
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input type="checkbox" className="rounded" />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Người dùng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.userId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input type="checkbox" className="rounded" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={
                              user.userImage ||
                              "https://via.placeholder.com/100?text=User"
                            }
                            alt={user.username}
                            className="w-10 h-10 rounded-full mr-3"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {user.username}
                            </div>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm font-medium text-blue-600">
                                #
                                {user.userId
                                  ? user.userId.substring(0, 8)
                                  : "N/A"}
                                ...
                              </span>
                            </td>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewUserDetails(user.userId)}
                            className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                            title="Xem chi tiết"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm("Chắc chắn xóa?")) {
                                handleUserAction(user.userId, "delete");
                              }
                            }}
                            className="p-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                            title="Xóa"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      Không tìm thấy người dùng nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {showUserDetailsModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Thông tin người dùng
              </h3>
              <button
                onClick={() => setShowUserDetailsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {loadingUserDetails ? (
              <div className="py-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-yellow-500 border-t-transparent"></div>
                <p className="mt-2 text-gray-600">Đang tải thông tin...</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col items-center mb-6">
                  <img
                    src={
                      selectedUser.userImage ||
                      "https://via.placeholder.com/150?text=User"
                    }
                    alt={selectedUser.username}
                    className="w-24 h-24 rounded-full object-cover border-4 border-yellow-100 mb-3"
                  />
                  <h4 className="text-lg font-semibold text-gray-900">
                    {selectedUser.username}
                  </h4>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                    {selectedUser.roleName || "Người dùng"}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <User className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">ID người dùng</p>
                      <p className="text-gray-900">{selectedUser.userId}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-gray-900">{selectedUser.email}</p>
                    </div>
                  </div>

                  {selectedUser.phoneNumber && (
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Số điện thoại</p>
                        <p className="text-gray-900">
                          {selectedUser.phoneNumber}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-200 flex justify-end">
                  <button
                    onClick={() => setShowUserDetailsModal(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderCategories = () => (
    <div className="space-y-6">
      {/* Search and Actions */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm danh mục..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowAddCategoryModal(true)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Thêm danh mục</span>
            </button>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Lọc</span>
            </button>
          </div>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-yellow-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">
            <p>{error}</p>
            <button
              onClick={() => setActiveTab("categories")}
              className="mt-2 text-yellow-600 hover:underline"
            >
              Thử lại
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên danh mục
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số sản phẩm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-blue-600">
                          #{category.id ? category.id.substring(0, 8) : "N/A"}
                          ...
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {category.categoryName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {category.productCount || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setCurrentCategory(category);
                              setShowEditCategoryModal(true);
                            }}
                            className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                            title="Chỉnh sửa"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                            title="Xóa"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleViewCategoryDetails(category.id)
                            }
                            className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200"
                            title="Xem chi tiết"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      Không tìm thấy danh mục nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Category Modal */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Thêm danh mục mới
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddCategory();
              }}
            >
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="categoryName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tên danh mục
                  </label>
                  <input
                    type="text"
                    id="categoryName"
                    value={newCategory.name}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddCategoryModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                  disabled={isLoading}
                >
                  {isLoading ? "Đang xử lý..." : "Thêm danh mục"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {showEditCategoryModal && currentCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Chỉnh sửa danh mục
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditCategory();
              }}
            >
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="editCategoryName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tên danh mục
                  </label>
                  <input
                    type="text"
                    id="editCategoryName"
                    value={currentCategory.categoryName}
                    onChange={(e) =>
                      setCurrentCategory({
                        ...currentCategory,
                        categoryName: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditCategoryModal(false);
                    setCurrentCategory(null);
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                  disabled={isLoading}
                >
                  {isLoading ? "Đang xử lý..." : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Details Modal */}
      {showCategoryDetailsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                Sản phẩm trong danh mục: {selectedCategoryName}
              </h3>
              <button
                onClick={() => setShowCategoryDetailsModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {loadingCategoryProducts ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-yellow-500 border-t-transparent"></div>
                <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
              </div>
            ) : categoryProducts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tên sản phẩm
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Giá
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {categoryProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {product.id.substring(0, 8)}...
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {product.productName}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {product.price.toLocaleString()} VNĐ
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                Không có sản phẩm nào trong danh mục này
              </div>
            )}

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowCategoryDetailsModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6">
      {/* Search and Actions */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          <div className="flex space-x-2">
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Lọc</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            <img
              src={
                product.productImage ||
                "https://via.placeholder.com/300x200?text=No+Image"
              }
              alt={product.productName}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900 line-clamp-2">
                  {product.productName}
                </h3>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {product.productCondition || "N/A"}
                </span>
              </div>
              <span className="text-sm font-medium text-blue-600">
                #{product.id ? product.id.substring(0, 8) : "N/A"}...
              </span>
              <p className="text-sm text-gray-600 mb-2">
                Danh mục: {product.categoryName}
              </p>
              <p className="text-lg font-bold text-amber-800 mb-2">
                {product.price.toLocaleString()} VNĐ
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Quantity: {product.quantity}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Người bán: {product.supplierName || "N/A"}
              </p>
              <div className="text-sm text-gray-600 mb-4 line-clamp-3">
                Mô tả: {product.description}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleProductAction(product.id, "delete")}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  <Trash2 className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm đơn hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          <div className="flex space-x-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="all">Tất cả đơn hàng</option>
              <option value="Pending">Đang chờ</option>
              <option value="Completed">Đã hoàn thành</option>
              <option value="Cancelled">Đã hủy</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-yellow-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">
            <p>{error}</p>
            <button
              onClick={() => setActiveTab("orders")}
              className="mt-2 text-yellow-600 hover:underline"
            >
              Thử lại
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã đơn hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sản phẩm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hình ảnh
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số lượng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đơn giá
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tổng tiền
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.length > 0 ? (
                  orders
                    .filter((order) => {
                      // Filter by search term
                      const matchesSearch =
                        !searchTerm ||
                        (order.id &&
                          order.id
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())) ||
                        (order.orderDetails &&
                          order.orderDetails.some(
                            (detail) =>
                              detail.productName &&
                              detail.productName
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase())
                          ));

                      // Filter by status
                      const matchesStatus =
                        statusFilter === "all" || order.status === statusFilter;

                      return matchesSearch && matchesStatus;
                    })
                    .map((order) => (
                      <tr
                        key={order.id || `order-${Math.random()}`}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-blue-600">
                            #{order.id ? order.id.substring(0, 8) : "N/A"}...
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {order.orderDetails && order.orderDetails.length > 0
                              ? order.orderDetails[0].productName
                              : "N/A"}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID:{" "}
                            {order.orderDetails &&
                            order.orderDetails.length > 0 &&
                            order.orderDetails[0].productId
                              ? order.orderDetails[0].productId.substring(0, 8)
                              : "N/A"}
                            ...
                          </div>
                          {order.orderDetails &&
                            order.orderDetails.length > 1 && (
                              <div className="text-xs text-gray-400 mt-1">
                                +{order.orderDetails.length - 1} sản phẩm khác
                              </div>
                            )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <img
                            src={
                              order.orderDetails &&
                              order.orderDetails.length > 0
                                ? order.orderDetails[0].productImage
                                : "https://via.placeholder.com/60x60?text=No+Image"
                            }
                            alt={
                              order.orderDetails &&
                              order.orderDetails.length > 0
                                ? order.orderDetails[0].productName
                                : "Product"
                            }
                            className="w-12 h-12 rounded-lg object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://via.placeholder.com/60x60?text=No+Image";
                            }}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-semibold text-gray-900">
                            {order.orderDetails && order.orderDetails.length > 0
                              ? order.orderDetails.reduce(
                                  (sum, detail) => sum + (detail.quantity || 0),
                                  0
                                )
                              : 0}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">
                            {order.orderDetails && order.orderDetails.length > 0
                              ? `${order.orderDetails[0].unitPrice.toLocaleString()} VNĐ`
                              : "0 VNĐ"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-bold text-green-600">
                            {order.totalAmount
                              ? `${order.totalAmount.toLocaleString()} VNĐ`
                              : "0 VNĐ"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            onClick={() =>
                              order.id && handleViewOrderDetails(order.id)
                            }
                            disabled={!order.id}
                            className={`p-2 rounded-lg transition-colors ${
                              order.id
                                ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                            }`}
                            title={
                              order.id ? "Xem chi tiết" : "Không có ID đơn hàng"
                            }
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      Không tìm thấy đơn hàng nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary */}
      {orders.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Tổng đơn hàng</p>
              <p className="text-2xl font-bold text-blue-600">
                {orders.length}
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Đã hoàn thành</p>
              <p className="text-2xl font-bold text-green-600">
                {orders.filter((o) => o.status === "Completed").length}
              </p>
            </div>
            <div className="p-4 bg-amber-50 rounded-lg">
              <p className="text-sm text-gray-600">Tổng doanh thu</p>
              <p className="text-2xl font-bold text-amber-600">
                {orders
                  .reduce((sum, o) => sum + (o.totalAmount || 0), 0)
                  .toLocaleString()}{" "}
                VNĐ
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderPayments = () => (
    <div className="space-y-6">
      {/* Payments Header */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900">
            Quản lý thanh toán
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm thanh toán..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <select
              value={paymentStatusFilter}
              onChange={(e) => setPaymentStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Completed">Đã hoàn thành</option>
              <option value="Pending">Chờ xử lý</option>
              <option value="Failed">Thất bại</option>
              <option value="Refunded">Đã hoàn tiền</option>
              <option value="Cancelled">Đã hủy</option>
            </select>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={paymentFromDate}
                onChange={(e) => setPaymentFromDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <span>đến</span>
              <input
                type="date"
                value={paymentToDate}
                onChange={(e) => setPaymentToDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-yellow-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">
            <p>{error}</p>
            <button
              onClick={() => setActiveTab("payments")}
              className="mt-2 text-yellow-600 hover:underline"
            >
              Thử lại
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã đơn hàng
                  </th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Khách hàng
                  </th> */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phương thức
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số tiền
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày thanh toán
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments && payments.length > 0 ? (
                  payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-blue-600">
                          #{payment.id ? payment.id.substring(0, 8) : "N/A"}...
                        </span>
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.customerName}
                      </td> */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.paymentGateway}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-amber-800">
                        {payment.amount?.toLocaleString()} VNĐ
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(payment.createdAt).toLocaleDateString(
                          "vi-VN"
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusBadgeClass(
                            payment.status
                          )}`}
                        >
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      Không tìm thấy thanh toán nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  const renderPayouts = () => (
    <div className="space-y-6">
      {/* Payouts Header */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900">Quản lý rút tiền</h2>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm yêu cầu rút tiền..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <select
              value={payoutStatusFilter}
              onChange={(e) => setPayoutStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Pending">Chờ duyệt</option>
              <option value="Completed">Đã duyệt</option>
              <option value="Rejected">Đã từ chối</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payouts Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-yellow-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">
            <p>{error}</p>
            <button
              onClick={() => setActiveTab("payouts")}
              className="mt-2 text-yellow-600 hover:underline"
            >
              Thử lại
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID Đơn hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Người nhận
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số tiền
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payouts && payouts.length > 0 ? (
                  payouts
                    .filter((payout) => {
                      // Filter by search term
                      const matchesSearch =
                        !searchTerm ||
                        payout.orderID
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()) ||
                        payout.id
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()) ||
                        payout.recieverId
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase());

                      // Filter by status
                      const matchesStatus =
                        payoutStatusFilter === "all" ||
                        payout.status === payoutStatusFilter;

                      return matchesSearch && matchesStatus;
                    })
                    .map((payout) => (
                      <tr key={payout.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-blue-600">
                            #{payout.id ? payout.id.substring(0, 8) : "N/A"}...
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {payout.recieverName}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-semibold text-green-600">
                            {payout.totalPrice.toLocaleString()} VNĐ
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusBadgeClass(
                              payout.status
                            )}`}
                          >
                            {payout.status === "Pending" && "Chờ duyệt"}
                            {payout.status === "Completed" && "Đã duyệt"}
                            {payout.status === "Rejected" && "Đã từ chối"}
                            {!["Pending", "Completed", "Rejected"].includes(
                              payout.status
                            ) && payout.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            onClick={() => handleViewPayoutDetails(payout.id)}
                            className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                            title="Xem chi tiết"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      Không có yêu cầu rút tiền nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary */}
      {payouts && payouts.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-gray-600">Chờ duyệt</p>
              <p className="text-2xl font-bold text-yellow-600">
                {payouts.filter((p) => p.status === "Pending").length}
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Đã duyệt</p>
              <p className="text-2xl font-bold text-green-600">
                {payouts.filter((p) => p.status === "Completed").length}
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Tổng số tiền</p>
              <p className="text-2xl font-bold text-blue-600">
                {payouts
                  .reduce((sum, p) => sum + p.totalPrice, 0)
                  .toLocaleString()}{" "}
                VNĐ
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Payout Details Modal */}
      {showPayoutDetailsModal && selectedPayout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Chi tiết yêu cầu rút tiền
              </h3>
              <button
                onClick={() => setShowPayoutDetailsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {loadingPayoutDetails ? (
              <div className="py-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-yellow-500 border-t-transparent"></div>
                <p className="mt-2 text-gray-600">Đang tải thông tin...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Status Badge */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Trạng thái</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getPaymentStatusBadgeClass(
                      selectedPayout.status
                    )}`}
                  >
                    {selectedPayout.status === "Pending" && "Chờ duyệt"}
                    {selectedPayout.status === "Completed" && "Đã duyệt"}
                    {selectedPayout.status === "Rejected" && "Đã từ chối"}
                  </span>
                </div>

                {/* Payout Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">ID Đơn hàng</p>
                    <p className="font-medium text-gray-900 break-all">
                      {selectedPayout.orderID}
                    </p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Số tiền</p>
                    <p className="text-xl font-bold text-green-600">
                      {selectedPayout.totalPrice.toLocaleString()} VNĐ
                    </p>
                  </div>
                </div>

                {/* Bank Account Information */}
                <div className="border-t pt-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Thông tin tài khoản ngân hàng
                  </h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Ngân hàng</p>
                      <p className="font-semibold text-gray-900">
                        {selectedPayout.accountBank || "Chưa có thông tin"}
                      </p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Số tài khoản</p>
                      <p className="font-semibold text-gray-900">
                        {selectedPayout.accountNumber || "Chưa có thông tin"}
                      </p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Tên chủ tài khoản</p>
                      <p className="font-semibold text-gray-900">
                        {selectedPayout.accountName || "Chưa có thông tin"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {selectedPayout.status === "Pending" && (
                  <div className="flex gap-3 pt-4 border-t">
                    <button
                      onClick={() => handleUpdatePayoutStatus(selectedPayout.id, "Completed")}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="h-5 w-5" />
                      Duyệt yêu cầu
                    </button>
                    <button
                      onClick={() => handleUpdatePayoutStatus(selectedPayout.id, "Rejected")}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <XCircle className="h-5 w-5" />
                      Từ chối
                    </button>
                  </div>
                )}

                {selectedPayout.status !== "Pending" && (
                  <div className="pt-4 border-t">
                    <button
                      onClick={() => setShowPayoutDetailsModal(false)}
                      className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                      Đóng
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Cài đặt hệ thống
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">
                Tự động duyệt sản phẩm
              </h4>
              <p className="text-sm text-gray-600">
                Tự động duyệt sản phẩm từ người dùng đáng tin cậy
              </p>
            </div>
            <input type="checkbox" className="rounded" />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Thông báo email</h4>
              <p className="text-sm text-gray-600">
                Gửi thông báo email cho admin khi có hoạt động mới
              </p>
            </div>
            <input type="checkbox" defaultChecked className="rounded" />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Bảo trì hệ thống</h4>
              <p className="text-sm text-gray-600">Kích hoạt chế độ bảo trì</p>
            </div>
            <input type="checkbox" className="rounded" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={handleLogout}
              className="text-2xl font-bold text-amber-900"
            >
              Đăng xuất
            </button>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Xin chào, Admin</span>
              <div className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center">
                <span className="text-amber-800 font-semibold">T</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-auto mx-auto px-2 sm:px-4 lg:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <div className="bg-white rounded-xl shadow-md p-4">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                    activeTab === "dashboard"
                      ? "bg-yellow-100 text-yellow-800"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <BarChart3 className="h-5 w-5" />
                  <span>Tổng quan</span>
                </button>

                <button
                  onClick={() => setActiveTab("users")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                    activeTab === "users"
                      ? "bg-yellow-100 text-yellow-800"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Users className="h-5 w-5" />
                  <span>Quản lý người dùng</span>
                </button>
                <button
                  onClick={() => setActiveTab("categories")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                    activeTab === "categories"
                      ? "bg-yellow-100 text-yellow-800"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <ListTree className="h-5 w-5" />
                  <span>Quản lý danh mục</span>
                </button>
                <button
                  onClick={() => setActiveTab("products")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                    activeTab === "products"
                      ? "bg-yellow-100 text-yellow-800"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Package className="h-5 w-5" />
                  <span>Quản lý sản phẩm</span>
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                    activeTab === "orders"
                      ? "bg-yellow-100 text-yellow-800"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <ReceiptText className="h-5 w-5" />
                  <span>Quản lý đơn hàng</span>
                </button>
                <button
                  onClick={() => setActiveTab("payments")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                    activeTab === "payments"
                      ? "bg-yellow-100 text-yellow-800"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <CreditCard className="h-5 w-5" />
                  <span>Quản lý thanh toán</span>
                </button>
                <button
                  onClick={() => setActiveTab("payouts")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                    activeTab === "payouts"
                      ? "bg-yellow-100 text-yellow-800"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <CreditCard className="h-5 w-5" />
                  <span>Quản lý rút tiền</span>
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                    activeTab === "settings"
                      ? "bg-yellow-100 text-yellow-800"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Settings className="h-5 w-5" />
                  <span>Cài đặt</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === "dashboard" && renderDashboard()}
            {activeTab === "users" && renderUsers()}
            {activeTab === "categories" && renderCategories()}
            {activeTab === "products" && renderProducts()}
            {activeTab === "orders" && renderOrders()}
            {activeTab === "payments" && renderPayments()}
            {activeTab === "payouts" && renderPayouts()}
            {activeTab === "settings" && renderSettings()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
