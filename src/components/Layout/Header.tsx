import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, User, Menu, X, ChevronDown, ShoppingCart } from "lucide-react";
import logoImage from "../../assets/images/logo _uniseap.png";
import { useNavigationHandlers } from "../../utils/navigationHandlers";
import api from "../../config/axios";
import { useDispatch, useSelector } from "react-redux";
import { selectCartItemsCount } from "../../redux/feature/cartSlice";
import { AppDispatch } from "../../redux/store";
import { fetchCartItems } from "../../redux/feature/cartActions";

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const cartItemsCount = useSelector(selectCartItemsCount);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const {
    handleLogin,
    handleRegister,
    handleSell,
    handleLogout,
    handleCategoryClick,
    handleCartClick,
  } = useNavigationHandlers();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const handleStorageChange = () => {
      const updatedToken = localStorage.getItem("token");
      setIsLoggedIn(!!updatedToken);
    };

    window.addEventListener("storage", handleStorageChange);

    // Lắng nghe sự kiện tùy chỉnh để cập nhật ngay lập tức
    const handleLoginStateChange = () => {
      handleStorageChange();
    };
    window.addEventListener("loginStateChange", handleLoginStateChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("loginStateChange", handleLoginStateChange);
    };
  }, []);

    useEffect(() => {
    // Initial cart fetch when component mounts
    if (isLoggedIn) {
      dispatch(fetchCartItems());
    }
    
    // Listen for cart update events
    const handleCartUpdate = () => {
      if (isLoggedIn) {
        dispatch(fetchCartItems());
      }
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    // Clean up event listener
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [dispatch, isLoggedIn]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        // For categories in header, we might want to fetch them even without a token
        // for public display, so we'll make the request without requiring authentication

        const response = await api.get("api/categories");

        if (response.data && response.data.isSuccess) {
          setCategories(response.data.value.data || []);
        } else {
          throw new Error(
            response.data.message || "Failed to fetch categories"
          );
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <header className="bg-white shadow-lg border-b-4 border-yellow-400 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-2 lg:px-auto">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 p-2">
              <img
                className="h-60 w-auto cursor-pointer hover:opacity-90 transition-opacity"
                src={logoImage}
                alt="Uniseap Logo"
                onClick={() => navigate("/")}
              />
            </div>

            {/* Categories Dropdown - Desktop */}
            <div className="hidden md:block relative ml-4">
              <button
                className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 mr-8 rounded-full font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
                onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
              >
                <Menu className="h-5 w-5 mr-2" />
                Danh mục
              </button>

              {isCategoryMenuOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-10">
                  {isLoading ? (
                    <div className="px-4 py-2 text-sm text-gray-500">
                      Đang tải...
                    </div>
                  ) : error ? (
                    <div className="px-4 py-2 text-sm text-red-500">
                      {error}
                    </div>
                  ) : categories.length > 0 ? (
                    categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() =>
                          handleCategoryClick(
                            category.id,
                            category.categoryName
                          )
                        }
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {category.categoryName}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-gray-500">
                      Không có danh mục nào
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-lg mx-6">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Tìm kiếm sản phẩm..."
                />
              </div>
            </form>
          </div>

          {/* Navigation - Desktop */}
          <div className="hidden md:flex items-center space-x-1">
            <button
              onClick={handleSell}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 mr-8 rounded-full font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Đăng Bán
            </button>

            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleCartClick}
                  className="flex items-center text-gray-700 hover:text-amber-800 transition-colors duration-200 relative"
                >
                  <ShoppingCart className="h-6 w-6" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </button>
                <div className="relative group">
                  <button className="flex items-center text-gray-700 hover:text-amber-800 transition-colors duration-200">
                    <User className="h-6 w-6" />
                  </button>
                  <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <a
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Thông tin
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Mua hàng
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Tin nhắn
                    </a>
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Đăng xuất
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleLogin}
                  className="text-gray-700 hover:text-amber-800 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={handleRegister}
                  className="bg-amber-800 hover:bg-amber-900 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Đăng ký
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-amber-800 focus:outline-none focus:text-amber-800"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {/* Search Bar - Mobile */}
              <form onSubmit={handleSearchSubmit} className="mb-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Search for items..."
                  />
                </div>
              </form>

              {/* Categories - Mobile */}
              <div className="mb-2">
                <button
                  onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                  className="flex items-center justify-between w-full text-left text-gray-700 hover:text-amber-800 px-3 py-2 rounded-md text-base font-medium"
                >
                  <span>Danh mục</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {isCategoryMenuOpen && (
                  <div className="pl-4 mt-1 space-y-1">
                    {isLoading ? (
                      <div className="px-3 py-2 text-sm text-gray-500">
                        Đang tải...
                      </div>
                    ) : error ? (
                      <div className="px-3 py-2 text-sm text-red-500">
                        {error}
                      </div>
                    ) : categories.length > 0 ? (
                      categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() =>
                            handleCategoryClick(
                              category.id,
                              category.categoryName
                            )
                          }
                          className="block w-full text-left text-gray-700 hover:text-amber-800 px-3 py-2 rounded-md text-sm"
                        >
                          {category.categoryName}
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-sm text-gray-500">
                        Không có danh mục nào
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={handleSell}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-full font-medium transition-colors duration-200 mb-2"
              >
                Đăng Bài
              </button>

              {isLoggedIn ? (
                <div className="space-y-2">
                  <a
                    href="#"
                    className="block text-gray-700 hover:text-amber-800 px-3 py-2 rounded-md text-base font-medium"
                  >
                    Thông tin
                  </a>
                  <a
                    href="#"
                    className="block text-gray-700 hover:text-amber-800 px-3 py-2 rounded-md text-base font-medium"
                  >
                    Mua hàng
                  </a>
                  <a
                    href="#"
                    className="block text-gray-700 hover:text-amber-800 px-3 py-2 rounded-md text-base font-medium"
                  >
                    Tin nhắn
                  </a>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left text-gray-700 hover:text-amber-800 px-3 py-2 rounded-md text-base font-medium"
                  >
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={handleLogin}
                    className="block w-full text-left text-gray-700 hover:text-amber-800 px-3 py-2 rounded-md text-base font-medium"
                  >
                    Đăng nhập
                  </button>
                  <button
                    onClick={handleRegister}
                    className="block w-full text-left bg-amber-800 hover:bg-amber-900 text-white px-3 py-2 rounded-md text-base font-medium"
                  >
                    Đăng ký
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
