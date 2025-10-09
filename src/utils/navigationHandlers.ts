import { NavigateFunction } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout as logoutAction } from "../redux/feature/userSlice";
import { removeDiacritics } from './stringUtils'; 


// Hook tùy chỉnh để sử dụng các hàm điều hướng
export const useNavigationHandlers = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  const handleSell = () => {
    navigate("/sell");
  };

  const handleLogout = () => {
    // Xóa token từ localStorage
    localStorage.removeItem("token");
    // Dispatch action logout từ Redux
    dispatch(logoutAction());
    // Gửi sự kiện để các component khác có thể cập nhật
    window.dispatchEvent(new Event("loginStateChange"));
    console.log("User logged out");
    navigate("/"); // Chuyển hướng về trang chủ sau khi đăng xuất
  };

  const handleCategoryClick = (categoryId: string, categoryName: string) => {
    // Convert category name to URL-friendly format: lowercase, no spaces, no diacritics
    const urlFriendlyName = removeDiacritics(categoryName)
      .toLowerCase()
      .replace(/\s+/g, '');
    
    // Navigate to the ProductByCategory page with the URL-friendly category name
    navigate(`/category/${urlFriendlyName}`, { state: { categoryId } });
  };

  const handleCartClick = () => {
    navigate("/cart");
  };

  const goToHome = () => {
    navigate("/");
  };

  const goToUserProfile = () => {
    navigate("/profile");
  };

  const goToDashboard = () => {
    navigate("/dashboard");
  };

  return {
    handleLogin,
    handleRegister,
    handleSell,
    handleLogout,
    handleCategoryClick,
    handleCartClick,
    goToHome,
    goToUserProfile,
    goToDashboard,
  };
};

// Phiên bản không sử dụng hook cho các hàm cần truyền navigate từ bên ngoài
export const navigationHandlers = {
  handleLogin: (navigate: NavigateFunction) => {
    navigate("/login");
  },

  handleRegister: (navigate: NavigateFunction) => {
    navigate("/register");
  },

  handleSell: (navigate: NavigateFunction) => {
    navigate("/sell");
  },

  handleLogout: (navigate: NavigateFunction, dispatch?: any) => {
    localStorage.removeItem("token");

    // Nếu có dispatch, thực hiện dispatch action logout
    if (dispatch) {
      dispatch(logoutAction());
    }

    window.dispatchEvent(new Event("loginStateChange"));
    console.log("User logged out");
    navigate("/");
  },

  handleCategoryClick: (navigate: NavigateFunction, path: string) => {
    navigate(path);
  },

  handleCartClick: (navigate: NavigateFunction) => {
    navigate("/cart");
  },

  goToHome: (navigate: NavigateFunction) => {
    navigate("/");
  },

  goToUserProfile: (navigate: NavigateFunction) => {
    navigate("/profile");
  },

  goToDashboard: (navigate: NavigateFunction) => {
    navigate("/dashboard");
  },
};
