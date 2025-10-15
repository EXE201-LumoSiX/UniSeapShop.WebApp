import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// import components
import Layout from "./components/Layout/Layout";

// import pages
import Home from "./pages/Home";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./pages/Auth/Unauthorized";
import Admin from "./pages/Admin/Dashboard";
import Profile from "./pages/User/Profile";
import ProductByCategory from "./pages/Product/ProductByCategory";
import Cart from "./pages/User/Cart";
import Sell from "./pages/Suplier/Sell";
import ProductById from "./pages/Product/ProductById";
import Order from "./pages/Payment/Order";
import OrderSuccess from "./pages/Payment/OrderSucces";
import SearchResults from "./pages/SearchResult";
import RegisterSupplier from "./pages/Suplier/RegisterSupplier";
import PaymentSuccess from "./pages/Payment/PaymentSuccess";
import PaymentFailed from "./pages/Payment/PaymentFailed";

const App: React.FC = () => {
  const handleLogin = () => {
    console.log("User logged in t");
  };

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/search"
          element={
            <Layout>
              <SearchResults />
            </Layout>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orderdetail" element={<Order />} />
        <Route path="/ordersuccess" element={<OrderSuccess />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/register-supplier" element={<RegisterSupplier />} />
        <Route path="/success-payment" element={<PaymentSuccess />} />
        <Route path="/failed-payment" element={<PaymentFailed />} />
        <Route
          path="/category/:categoryName"
          element={
            <Layout>
              <ProductByCategory />
            </Layout>
          }
        />
        <Route
          path="/product/:id"
          element={
            <Layout>
              <ProductById />
            </Layout>
          }
        />
        {/* Routes cho Admin */}
        <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
          <Route path="/dashboard" element={<Admin />} />
        </Route>
        {/* Routes cho Buyer */}
        <Route element={<ProtectedRoute allowedRoles={["User"]} />}>
          <Route
            path="/profile"
            element={
              <Layout>
                <Profile />
              </Layout>
            }
          />
        </Route>

        {/* Routes cho Seller */}
        <Route element={<ProtectedRoute allowedRoles={["Suplier"]} />}></Route>
      </Routes>
    </Router>
  );
};

export default App;
