import { Suspense, lazy } from "react";
import "./index.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Loding from "./components/admin/Loding";
import AdminPanel from "./components/admin/Sidebar/AdminPanel";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Cart from "./pages/Cart";
import AllProducts from "./pages/AllProducts";
import Login from "./pages/Login";
import { Toaster } from "react-hot-toast";

const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Transactions = lazy(() => import("./pages/admin/Transactions"));
const Customers = lazy(() => import("./pages/admin/Customers"));
const Products = lazy(() => import("./pages/admin/Products"));
const NewProduct = lazy(() => import("./pages/admin/management/NewProduct"));
const ProductManagement = lazy(
  () => import("./pages/admin/management/ProductManagement")
);
const TransactionManagement = lazy(
  () => import("./pages/admin/management/TransactionManagement")
);
const BarCharts = lazy(() => import("./pages/admin/charts/SalesReports"));
const PieCharts = lazy(() => import("./pages/admin/charts/ProductsStats"));
const LineCharts = lazy(() => import("./pages/admin/charts/YearlyReports"));
const Coupons = lazy(() => import("./pages/admin/Coupons"));

function App() {
  const location = useLocation();
  const isAdminRoute: boolean = location.pathname.includes("/admin");

  return (
    // <BrowserRouter>
    <div
      className={`${
        isAdminRoute
          ? "xsm:bg-stone-100 lg:grid lg:grid-cols-5 lg:h-[100vh]"
          : ""
      }`}
    >
      {isAdminRoute ? <AdminPanel /> : <Navbar />}
      <Suspense fallback={<Loding />}>
        <Routes>
          {/* Admin  Routes  */}
          <Route path="/admin/dashboard" element={<Dashboard />}></Route>
          <Route path="/admin/products" element={<Products />}></Route>
          <Route path="/admin/customers" element={<Customers />}></Route>
          <Route path="/admin/transactions" element={<Transactions />}></Route>
          <Route path="/admin/transactions" element={<Transactions />}></Route>
          <Route path="/admin/product/new" element={<NewProduct />}></Route>
          <Route
            path="/admin/product/:id"
            element={<ProductManagement />}
          ></Route>
          <Route
            path="/admin/transaction/:id"
            element={<TransactionManagement />}
          ></Route>

          {/* Charts */}
          <Route path="/admin/sales-reports" element={<BarCharts />}></Route>
          <Route path="/admin/products-stats" element={<PieCharts />}></Route>
          <Route path="/admin/yearly-reports" element={<LineCharts />}></Route>

          {/* Coupon  */}
          <Route path="/admin/coupons" element={<Coupons />}></Route>

          {/* User Routes  */}
          <Route path="/" element={<Home />}></Route>
          <Route path="/cart" element={<Cart />}></Route>
          <Route path="/products" element={<AllProducts />}></Route>
          {/* Auth Routes  */}
          <Route path="/login" element={<Login />}></Route>
        </Routes>
      </Suspense>
      <Toaster
  position="bottom-center"
/>
   </div>
    // </BrowserRouter>
  );
}

export default App;
