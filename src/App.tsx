import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// import components
import Layout from "./components/Layout/Layout";

// import pages
import Login from "./pages/Auth/Login";
import Home from "./pages/Home";
import RegisterPage from "./pages/Auth/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Admin from "./pages/Admin/Dashboard";
import Profile from "./pages/User/Profile";
import ProductByCategory from "./pages/Product/ProductByCategory";
import Cart from "./pages/User/Cart";
import Payment from "./pages/Payment/Payment";
import SellItem from "./pages/Suplier/Sell";
import ProductById from "./pages/Product/ProductById";
import Unauthorized from "./pages/Auth/Unauthorized";

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
        <Route path="/payment" element={<Payment />} />
        {/* Public routes */}
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route path="/register" element={<RegisterPage />} />
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
