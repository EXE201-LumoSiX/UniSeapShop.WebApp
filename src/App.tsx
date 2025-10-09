import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// import components
import Layout from "./components/Layout/Layout";

// import pages
import Login from "./pages/auth/Login";
import Home from "./pages/Home";
import RegisterPage from "./pages/auth/register";
import ProtectedRoute from "./components/ProtectedRoute";
import Admin from "./pages/Admin/Dashboard";
import Profile from "./pages/User/Profile";
import ProductByCategory from "./pages/ProductByCategory";
import Cart from "./pages/User/Cart";
import Payment from "./pages/Payment/Payment";
import SellItem from "./pages/Suplier/Sell";
import SellPage from "./pages/Suplier/SellPage";

const App: React.FC = () => {
  const handleLogin = () => {
    console.log("User logged in");
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/category/:categoryName" element={<ProductByCategory />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/sell" element={<SellPage />} />
        {/* Public routes */}
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        {/* Routes cho Admin */}
        <Route path="/dashboard" element={<Admin />} />
        {/* Routes cho Buyer */}
        <Route
          path="/profile"
          element={
            <Layout>
              <Profile />
            </Layout>
          }
        />
        {/* Routes cho Seller */}
      </Routes>
    </Router>
  );
};

export default App;
