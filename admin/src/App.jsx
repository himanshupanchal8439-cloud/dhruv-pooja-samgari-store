import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RequireAuth from './components/RequireAuth';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Customers from './pages/Customers';
import Coupons from './pages/Coupons';
import ActivityLogs from './pages/ActivityLogs';
import Blog from './pages/Blog';
import Subscribers from './pages/Subscribers';
import './App.css';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            element={
              <RequireAuth>
                <Layout />
              </RequireAuth>
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route
              path="/categories"
              element={
                <RequireAuth roles={['admin']}>
                  <Categories />
                </RequireAuth>
              }
            />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetail />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/subscribers" element={<Subscribers />} />
            <Route path="/blog" element={<Blog />} />
            <Route
              path="/coupons"
              element={
                <RequireAuth roles={['admin']}>
                  <Coupons />
                </RequireAuth>
              }
            />
            <Route
              path="/activity-logs"
              element={
                <RequireAuth roles={['admin']}>
                  <ActivityLogs />
                </RequireAuth>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
