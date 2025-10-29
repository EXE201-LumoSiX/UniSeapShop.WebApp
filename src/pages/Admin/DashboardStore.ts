import { useState, useEffect, useCallback } from "react";
import api from "../../config/axios";

export const useDashboardStore = () => {
  // State variables
  const [activeTab, setActiveTab] = useState<
    | "dashboard"
    | "users"
    | "categories"
    | "products"
    | "orders"
    | "payments"
    | "payouts"
    | "settings"
  >("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<any>(null);
  const [newCategory, setNewCategory] = useState({ name: "" });
  const [shouldRefetchCategories, setShouldRefetchCategories] = useState(false);
  const [showCategoryDetailsModal, setShowCategoryDetailsModal] =
    useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryProducts, setCategoryProducts] = useState<[]>([]);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [loadingCategoryProducts, setLoadingCategoryProducts] = useState(false);
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [loadingUserDetails, setLoadingUserDetails] = useState(false);
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [loadingOrderDetails, setLoadingOrderDetails] = useState(false);
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [paymentFromDate, setPaymentFromDate] = useState("");
  const [paymentToDate, setPaymentToDate] = useState("");
  const [payouts, setPayouts] = useState<any[]>([]);
  const [payoutStatusFilter, setPayoutStatusFilter] = useState("all");
  const [showPayoutDetailsModal, setShowPayoutDetailsModal] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState<any>(null);
  const [loadingPayoutDetails, setLoadingPayoutDetails] = useState(false);

  // Dashboard stats - these could be fetched from API in the future
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalSales: 0,
    pendingApprovals: 0,
  });
  // Fetch dashboard stats
  const fetchDashboardStats = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Fetch all data in parallel
      const [
        usersResponse,
        productsResponse,
        ordersResponse,
      ] = await Promise.all([
        api.get("api/User", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get("api/Product", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get("api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      // Calculate stats from real data
      const totalUsers = usersResponse.data?.isSuccess
        ? usersResponse.data.value?.data?.length || 0
        : 0;

      const totalProducts = productsResponse.data?.isSuccess
        ? productsResponse.data.value?.data?.length || 0
        : 0;

      const ordersData = ordersResponse.data?.isSuccess
        ? ordersResponse.data.value?.data || []
        : [];
      const completedOrders = ordersData.filter(
        (order) => order.status === "Completed" || order.status === "Delivered"
      );
      const totalSales = completedOrders.reduce(
        (sum, order) => sum + (order.totalAmount || 0),
        0
      );

      const productsData = productsResponse.data?.isSuccess
        ? productsResponse.data.value?.data || []
        : [];
      const pendingApprovals = productsData.filter(
        (product) => product.status === "Pending"
      ).length;

      setStats({
        totalUsers,
        totalProducts,
        totalSales,
        pendingApprovals,
      });
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
      // Keep default values on error
      setStats({
        totalUsers: 0,
        totalProducts: 0,
        totalSales: 0,
        pendingApprovals: 0,
      });
    }
  }, []);

  // Fetch stats when dashboard tab is active
  useEffect(() => {
    if (activeTab === "dashboard") {
      fetchDashboardStats();
    }
  }, [activeTab, fetchDashboardStats]);

  // Also update stats when data changes in other tabs
  useEffect(() => {
    if (users.length > 0 || products.length > 0 || orders.length > 0) {
      const totalUsers = users.length;
      const totalProducts = products.length;
      const completedOrders = orders.filter(
        (order) => order.status === "Completed" || order.status === "Delivered"
      );
      const totalSales = completedOrders.reduce(
        (sum, order) => sum + (order.totalAmount || 0),
        0
      );
      const pendingApprovals = products.filter(
        (product) => product.status === "Pending"
      ).length;

      setStats({
        totalUsers,
        totalProducts,
        totalSales,
        pendingApprovals,
      });
    }
  }, [users, products, orders]);

  // Create a reusable function to fetch categories
  const fetchCategories = useCallback(async () => {
    if (activeTab === "categories") {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await api.get("api/categories", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && response.data.isSuccess) {
          setCategories(response.data.value.data || []);
        } else {
          throw new Error(
            response.data.message || "Failed to fetch categories"
          );
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories. Please try again later.");
      } finally {
        setIsLoading(false);
        // Reset the refetch flag
        setShouldRefetchCategories(false);
      }
    }
  }, [activeTab]);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      if (activeTab === "users") {
        setIsLoading(true);
        setError(null);
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            throw new Error("No authentication token found");
          }

          const response = await api.get("api/User", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.data && response.data.isSuccess) {
            setUsers(response.data.value.data || []);
          } else {
            throw new Error(response.data.message || "Failed to fetch users");
          }
        } catch (err) {
          console.error("Error fetching users:", err);
          setError("Failed to load users. Please try again later.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUsers();
  }, [activeTab]);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      if (activeTab === "products") {
        setIsLoading(true);
        setError(null);
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            throw new Error("No authentication token found");
          }

          const response = await api.get("api/Product", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.data && response.data.isSuccess) {
            setProducts(response.data.value.data || []);
          } else {
            throw new Error(
              response.data.message || "Failed to fetch products"
            );
          }
        } catch (err) {
          console.error("Error fetching products:", err);
          setError("Failed to load products. Please try again later.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchProducts();
  }, [activeTab]);

  // Fetch categories from API
  useEffect(() => {
    fetchCategories();
  }, [activeTab, shouldRefetchCategories, fetchCategories]);

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      if (activeTab === "orders") {
        setIsLoading(true);
        setError(null);
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            throw new Error("No authentication token found");
          }

          const response = await api.get("api/orders", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.data && response.data.isSuccess) {
            setOrders(response.data.value.data || []);
          } else {
            throw new Error(response.data.message || "Failed to fetch orders");
          }
        } catch (err) {
          console.error("Error fetching orders:", err);
          setError("Failed to load orders. Please try again later.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchOrders();
  }, [activeTab]);

  // Fetch payments from API
  useEffect(() => {
    const fetchPayments = async () => {
      if (activeTab === "payments") {
        setIsLoading(true);
        setError(null);
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            throw new Error("No authentication token found");
          }

          // Build query parameters
          const queryParams = new URLSearchParams();

          // Add status filter if not 'all'
          if (paymentStatusFilter && paymentStatusFilter !== "all") {
            queryParams.append("status", paymentStatusFilter);
          }

          // Add date filters if provided
          if (paymentFromDate) {
            queryParams.append("fromDate", paymentFromDate);
          }

          if (paymentToDate) {
            queryParams.append("toDate", paymentToDate);
          }

          // Construct the URL with query parameters
          const queryString = queryParams.toString();
          const url = queryString
            ? `api/payments?${queryString}`
            : "api/payments";

          const response = await api.get(url, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.data && response.data.isSuccess) {
            setPayments(response.data.value.data || []);
          } else {
            throw new Error(
              response.data.message || "Failed to fetch payments"
            );
          }
        } catch (err) {
          console.error("Error fetching payments:", err);
          setError("Failed to load payments. Please try again later.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchPayments();
  }, [activeTab, paymentStatusFilter, paymentFromDate, paymentToDate]);

  // Fetch payouts from API
  useEffect(() => {
    const fetchPayouts = async () => {
      if (activeTab === "payouts") {
        setIsLoading(true);
        setError(null);
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            throw new Error("No authentication token found");
          }

          const response = await api.get("api/Payout", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.data && response.data.isSuccess) {
            setPayouts(response.data.value.data || []);
          } else {
            throw new Error(
              response.data.message || "Failed to fetch payouts"
            );
          }
        } catch (err) {
          console.error("Error fetching payouts:", err);
          setError("Failed to load payouts. Please try again later.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchPayouts();
  }, [activeTab, payoutStatusFilter]);

  // User actions (activate, deactivate, delete)
  const handleUserAction = async (
    userId: string,
    action: "activate" | "deactivate" | "delete"
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      if (action === "delete") {
        const response = await api.delete(`api/User/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && response.data.isSuccess) {
          setUsers(users.filter((user) => user.id !== userId));
        } else {
          throw new Error(
            response.data.error.message || "Failed to delete user"
          );
        }
      } else {
        // For activate/deactivate, we would typically use a PATCH or PUT request
        const status = action === "activate" ? true : false;
        const response = await api.put(
          `api/User/${userId}/status`,
          { isActive: status },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data && response.data.isSuccess) {
          // Update user status in the list
          setUsers(
            users.map((user) =>
              user.id === userId ? { ...user, isActive: status } : user
            )
          );
        } else {
          throw new Error(response.data.message || `Failed to ${action} user`);
        }
      }
    } catch (err) {
      console.error(`Error performing ${action} on user:`, err);
      alert(`Failed to ${action} user. Please try again.`);
    }
  };
  const handleViewUserDetails = async (userId: string) => {
    if (!userId) {
      alert("Invalid user ID");
      return;
    }
    setLoadingUserDetails(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await api.get(`api/User/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.isSuccess) {
        setSelectedUser(response.data.value.data);
        setShowUserDetailsModal(true);
      } else {
        throw new Error(
          response.data.message || "Failed to fetch user details"
        );
      }
    } catch (err) {
      console.error("Error fetching user details:", err);
      alert("Không thể tải thông tin người dùng. Vui lòng thử lại sau.");
    } finally {
      setLoadingUserDetails(false);
    }
  };

  // Product actions (approve, reject, delete)
  const handleProductAction = async (
    productId: number,
    action: "approve" | "reject" | "delete"
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      if (action === "delete") {
        if (!confirm("Are you sure you want to delete this product?")) {
          return;
        }

        const response = await api.delete(`api/Product/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && response.data.isSuccess) {
          setProducts(products.filter((product) => product.id !== productId));
        } else {
          throw new Error(response.data.message || "Failed to delete product");
        }
      } else {
        // For approve/reject, we would typically use a PATCH or PUT request
        const status = action === "approve" ? "Approved" : "Rejected";
        const response = await api.put(
          `api/Product/${productId}/status`,
          { status },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data && response.data.isSuccess) {
          // Update product status in the list
          setProducts(
            products.map((product) =>
              product.id === productId ? { ...product, status } : product
            )
          );
        } else {
          throw new Error(
            response.data.message || `Failed to ${action} product`
          );
        }
      }
    } catch (err) {
      console.error(`Error performing ${action} on product:`, err);
      alert(`Failed to ${action} product. Please try again.`);
    }
  };

  // Category management functions
  const handleViewCategoryDetails = async (categoryId: string) => {
    setLoadingCategoryProducts(true);
    setShowCategoryDetailsModal(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await api.get(`api/categories/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.isSuccess) {
        setCategoryProducts(response.data.value.data.products || []);
        setSelectedCategoryName(response.data.value.data.categoryName);
      } else {
        throw new Error(
          response.data.message || "Failed to fetch category details"
        );
      }
    } catch (err) {
      console.error("Error fetching category details:", err);
      alert("Failed to load category details. Please try again.");
    } finally {
      setLoadingCategoryProducts(false);
    }
  };
  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) {
      alert("Category name is required");
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      const categoryPayload = {
        categoryName: newCategory.name,
      };
      const response = await api.post("api/categories", categoryPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.isSuccess) {
        // Add the new category to the list
        setCategories([...categories, response.data.value]);
        setShowAddCategoryModal(false);
        setNewCategory({ name: "" });
        setShouldRefetchCategories(true);
      } else {
        throw new Error(
          response.data.error.message || "Failed to add category"
        );
      }
    } catch (err) {
      console.error("Error adding category:", err);
      alert("Failed to add category. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleEditCategory = async () => {
    if (!currentCategory || !currentCategory.categoryName?.trim()) {
      alert("Category name is required");
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Create the payload with just the categoryName
      const payload = {
        categoryName: currentCategory.categoryName,
      };

      // Update the API endpoint to match the correct URL format
      const response = await api.put(
        `api/categories/${currentCategory.id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.isSuccess) {
        // Update the category in the list
        setCategories(
          categories.map((cat) =>
            cat.id === currentCategory.id
              ? { ...cat, categoryName: currentCategory.categoryName }
              : cat
          )
        );
        setShowEditCategoryModal(false);
        setCurrentCategory(null);
      } else {
        throw new Error(
          response.data.error?.message || "Failed to update category"
        );
      }
    } catch (err) {
      console.error("Error updating category:", err);
      alert("Failed to update category. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleDeleteCategory = async (categoryId: number) => {
    if (!confirm("Are you sure you want to delete this category?")) {
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await api.delete(`api/categories/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.isSuccess) {
        // Remove the category from the list
        setCategories(categories.filter((cat) => cat.id !== categoryId));
      } else {
        throw new Error(response.data.message || "Failed to delete category");
      }
    } catch (err) {
      console.error("Error deleting category:", err);
      alert("Failed to delete category. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Order actions (view details, update status)
  const handleViewOrderDetails = async (orderId: string) => {
    if (!orderId) {
      alert("Invalid order ID");
      return;
    }
    setLoadingOrderDetails(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await api.get(`api/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.isSuccess) {
        setSelectedOrder(response.data.value.data);
        setShowOrderDetailsModal(true);
      } else {
        throw new Error(
          response.data.message || "Failed to fetch order details"
        );
      }
    } catch (err) {
      console.error("Error fetching order details:", err);
      alert("Không thể tải thông tin đơn hàng. Vui lòng thử lại sau.");
    } finally {
      setLoadingOrderDetails(false);
    }
  };

  // Payment actions
  const handleUpdateStatusPayment = async (
    orderId: string,
    newStatus: string
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await api.put(
        `api/payments/order/${orderId}/status`,
        JSON.stringify(newStatus),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.isSuccess) {
        // Update the payment status in the payments list
        setPayments(
          payments.map((payment) =>
            payment.orderId === orderId
              ? { ...payment, status: newStatus }
              : payment
          )
        );

        // Also update orders if the order exists in the orders list
        setOrders(
          orders.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );

        alert("Cập nhật trạng thái thanh toán thành công!");
        return response.data.value;
      } else {
        throw new Error(
          response.data.error?.message || "Failed to update payment status"
        );
      }
    } catch (err) {
      console.error("Error updating payment status:", err);
      alert("Không thể cập nhật trạng thái thanh toán. Vui lòng thử lại.");
      throw err;
    }
  };
  const handleCancelPayment = async (paymentId: string, reason?: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const payload = {
        reason: reason || "Cancelled by admin",
      };

      const response = await api.post(
        `api/payments/${paymentId}/cancel`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.isSuccess) {
        // Update the payment status in the payments list
        setPayments(
          payments.map((payment) =>
            payment.id === paymentId
              ? { ...payment, status: "Cancelled" }
              : payment
          )
        );

        alert("Payment cancelled successfully");
        return true;
      } else {
        throw new Error(response.data.message || "Failed to cancel payment");
      }
    } catch (err) {
      console.error("Error cancelling payment:", err);
      alert("Failed to cancel payment. Please try again.");
      return false;
    }
  };

  const getPaymentStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Failed":
        return "bg-red-100 text-red-800";
      case "Refunded":
        return "bg-blue-100 text-blue-800";
      case "Cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Payout actions
  const handleViewPayoutDetails = async (payoutId: string) => {
    if (!payoutId) {
      alert("Invalid payout ID");
      return;
    }
    setLoadingPayoutDetails(true);
    setShowPayoutDetailsModal(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await api.get(`api/Payout/${payoutId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.isSuccess) {
        setSelectedPayout(response.data.value.data);
      } else {
        throw new Error(
          response.data.message || "Failed to fetch payout details"
        );
      }
    } catch (err) {
      console.error("Error fetching payout details:", err);
      alert("Không thể tải thông tin chi tiết. Vui lòng thử lại sau.");
      setShowPayoutDetailsModal(false);
    } finally {
      setLoadingPayoutDetails(false);
    }
  };

  const handleUpdatePayoutStatus = async (payoutId: string, newStatus: string) => {
    if (!confirm(`Bạn có chắc chắn muốn ${newStatus === "Completed" ? "duyệt" : "từ chối"} yêu cầu rút tiền này?`)) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await api.put(
        `api/Payout/${payoutId}`,
        JSON.stringify(newStatus),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.isSuccess) {
        // Update the payout status in the payouts list
        setPayouts(
          payouts.map((payout) =>
            payout.id === payoutId
              ? { ...payout, status: newStatus }
              : payout
          )
        );

        // Update selected payout if it's the one being viewed
        if (selectedPayout && selectedPayout.id === payoutId) {
          setSelectedPayout({ ...selectedPayout, status: newStatus });
        }

        alert(`Đã ${newStatus === "Completed" ? "duyệt" : "từ chối"} yêu cầu rút tiền thành công!`);
        setShowPayoutDetailsModal(false);
        return true;
      } else {
        throw new Error(
          response.data.message || "Failed to update payout status"
        );
      }
    } catch (err) {
      console.error("Error updating payout status:", err);
      alert("Không thể cập nhật trạng thái. Vui lòng thử lại.");
      return false;
    }
  };

  const handleApprovePayout = async (orderId: string) => {
    if (!confirm("Bạn có chắc chắn muốn duyệt yêu cầu rút tiền này?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await api.post(
        "api/Payout",
        JSON.stringify(orderId),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.isSuccess) {
        // Update the payout status in the payouts list
        setPayouts(
          payouts.map((payout) =>
            payout.orderID === orderId
              ? { ...payout, status: "Completed" }
              : payout
          )
        );

        alert("Đã duyệt yêu cầu rút tiền thành công!");
        return true;
      } else {
        throw new Error(
          response.data.message || "Failed to approve payout"
        );
      }
    } catch (err) {
      console.error("Error approving payout:", err);
      alert("Không thể duyệt yêu cầu rút tiền. Vui lòng thử lại.");
      return false;
    }
  };

  const handleRejectPayout = async (payoutId: string) => {
    if (!confirm("Bạn có chắc chắn muốn từ chối yêu cầu rút tiền này?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Update the payout status to rejected
      setPayouts(
        payouts.map((payout) =>
          payout.id === payoutId
            ? { ...payout, status: "Rejected" }
            : payout
        )
      );

      alert("Đã từ chối yêu cầu rút tiền!");
      return true;
    } catch (err) {
      console.error("Error rejecting payout:", err);
      alert("Không thể từ chối yêu cầu rút tiền. Vui lòng thử lại.");
      return false;
    }
  };

  // Return all the state and handlers for use in the Dashboard component
  return {
    // State
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
    setSelectedUser,
    loadingUserDetails,
    showOrderDetailsModal,
    setShowOrderDetailsModal,
    selectedOrder,
    setSelectedOrder,
    loadingOrderDetails,
    showPayoutDetailsModal,
    setShowPayoutDetailsModal,
    selectedPayout,
    setSelectedPayout,
    loadingPayoutDetails,
    getPaymentStatusBadgeClass,
    // Handlers
    handleUserAction,
    handleViewUserDetails,
    handleProductAction,
    handleViewCategoryDetails,
    handleAddCategory,
    handleEditCategory,
    handleDeleteCategory,
    handleViewOrderDetails,
    handleUpdateStatusPayment,
    handleCancelPayment,
    handleViewPayoutDetails,
    handleUpdatePayoutStatus,
    handleApprovePayout,
    handleRejectPayout,
  };
};
