import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const linkClass = ({ isActive }) => (isActive ? 'admin-nav-link active' : 'admin-nav-link');

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand-block">
          <div className="admin-brand-icon">💻</div>
          <div>
            <h2>Admin Panel</h2>
            <p>E-Commerce & AI</p>
          </div>
        </div>

        <nav className="admin-nav-menu">
          <NavLink end to="/admin" className={linkClass}>📊 Dashboard</NavLink>

          <div className="nav-group-title" style={{ marginTop: '20px', fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', paddingLeft: '1rem' }}>Cửa hàng</div>
          <NavLink to="/admin/laptops" className={linkClass}>💻 Quản lý Laptop</NavLink>
          <NavLink to="/admin/brands" className={linkClass}>🏷️ Thương hiệu</NavLink>
          <NavLink to="/admin/orders" className={linkClass}>🛒 Đơn hàng</NavLink>

          <div className="nav-group-title" style={{ marginTop: '20px', fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', paddingLeft: '1rem' }}>Hệ thống AI / AHP</div>
          <NavLink to="/admin/criteria" className={linkClass}>⚖️ Tiêu chí AHP</NavLink>
          <NavLink to="/evaluations" className={linkClass}>🤖 Lịch sử AI Suggest</NavLink>

          <div className="nav-group-title" style={{ marginTop: '20px', fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', paddingLeft: '1rem' }}>Hệ thống</div>
          <NavLink to="/admin/users" className={linkClass}>👥 Người dùng</NavLink>
          <NavLink to="/admin/imports" className={linkClass}>📁 Import Data Excel</NavLink>
          
          <div className="nav-separator" style={{ borderTop: '1px solid #333', margin: '20px 1rem' }}></div>
          <NavLink to="/" className={linkClass}>🏠 Về trang khách</NavLink>
        </nav>
      </aside>

      <section className="admin-content-shell">
        <header className="admin-topbar">
          <div>
            <p className="eyebrow">KHU VỰC QUẢN TRỊ</p>
            <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Xin chào, {user?.full_name || 'Admin'} 👋</h1>
          </div>
          <div className="admin-topbar-actions">
            <div className="user-pill admin-user-pill">
              <span>{user?.email || 'admin@email.com'}</span>
              <small style={{ color: 'var(--primary-color)' }}>{user?.role?.toUpperCase() || 'ADMIN'}</small>
            </div>
            <button className="ghost-btn" style={{ color: 'red' }} onClick={handleLogout}>Đăng xuất</button>
          </div>
        </header>

        <main className="admin-main-area" style={{ padding: '24px', backgroundColor: '#f9fafb', minHeight: 'calc(100vh - 80px)' }}>
          <Outlet />
        </main>
      </section>
    </div>
  );
}