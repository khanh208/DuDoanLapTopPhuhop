import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import PublicLayout from './components/layout/PublicLayout';
import AdminLayout from './components/layout/AdminLayout';

// --- Pages: Public ---
import HomePage from './pages/public/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import NotFoundPage from './pages/public/NotFoundPage';
import BrandsPage from './pages/brands/BrandsPage';
import LaptopsPage from './pages/laptops/LaptopsPage';
import LaptopDetailPage from './pages/laptops/LaptopDetailPage';
import AhpCriteriaPage from './pages/ahp/AhpCriteriaPage';

// --- Pages: User (Protected) ---
import ProfilePage from './pages/profile/ProfilePage';
import EvaluationSessionsPage from './pages/evaluations/EvaluationSessionsPage';

// --- Pages: Admin ---
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import LaptopAdminPage from './pages/laptops/LaptopAdminPage';
import ImportExcelPage from './pages/imports/ImportExcelPage';
// Vui lòng tạo 2 file này nếu chưa có để tránh lỗi "Module not found"
import BrandAdminPage from './pages/brands/BrandAdminPage'; 
import OrderManagementPage from './pages/orders/OrderManagementPage'; 

export default function App() {
  return (
    <Routes>
      {/* KHU VỰC PUBLIC (Khách vãng lai) */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/laptops" element={<LaptopsPage />} />
        <Route path="/laptops/:id" element={<LaptopDetailPage />} />
        <Route path="/brands" element={<BrandsPage />} />
        <Route path="/ahp/criteria" element={<AhpCriteriaPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* KHU VỰC USER (Đã đăng nhập) */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <PublicLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ProfilePage />} />
      </Route>

      <Route
        path="/evaluations"
        element={
          <ProtectedRoute>
            <PublicLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<EvaluationSessionsPage />} />
      </Route>

      {/* KHU VỰC ADMIN (Chỉ Admin mới được vào) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="users" element={<UserManagementPage />} />
        <Route path="laptops" element={<LaptopAdminPage />} />
        <Route path="imports" element={<ImportExcelPage />} />
        <Route path="criteria" element={<AhpCriteriaPage />} />
        
        {/* === 2 ROUTE MỚI THÊM CHO ADMIN === */}
        <Route path="brands" element={<BrandAdminPage />} />
        <Route path="orders" element={<OrderManagementPage />} />
      </Route>

      {/* ROUTE 404 CATCH-ALL */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}