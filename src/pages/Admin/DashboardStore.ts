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
    | "settings"
  >("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<any>(null);
  const [newCategory, setNewCategory] = useState({ name: "" });
  const [shouldRefetchCategories, setShouldRefetchCategories] = useState(false);
  const [showCategoryDetailsModal, setShowCategoryDetailsModal] =
    useState(false);
  const [categoryProducts, setCategoryProducts] = useState<any[]>([]);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [loadingCategoryProducts, setLoadingCategoryProducts] = useState(false);
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [loadingUserDetails, setLoadingUserDetails] = useState(false);
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [loadingOrderDetails, setLoadingOrderDetails] = useState(false);

  // Dashboard stats - these could be fetched from API in the future
  const stats = {
    totalUsers: 1250,
    totalProducts: 3420,
    totalSales: 89500000,
    pendingApprovals: 15,
  };

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
          alert("Xóa người dùng thành công!");
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
    isLoading,
    error,
    stats,
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
    // Handlers
    handleUserAction,
    handleViewUserDetails,
    handleProductAction,
    handleViewCategoryDetails,
    handleAddCategory,
    handleEditCategory,
    handleDeleteCategory,
    handleViewOrderDetails,
  };
};
