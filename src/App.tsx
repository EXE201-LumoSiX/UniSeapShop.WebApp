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
import SellItem from "./pages/Suplier/Sell";
import ProductById from "./pages/Product/ProductById";
import Order from "./pages/Payment/Order";
import OrderSuccess from "./pages/Payment/OrderSucces";

const App: React.FC = () => {
  const handleLogin = () => {
    console.log("User logged in");
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route path="/cart" element={<Cart />} />
        <Route path="/orderdetail" element={<Order />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        {/* Public routes */}
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route path="/register" element={<Register />} />
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
        <Route element={<ProtectedRoute allowedRoles={["Suplier"]} />}>
          <Route
            path="/sell"
            element={
              <Layout>
                <SellItem />
              </Layout>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
