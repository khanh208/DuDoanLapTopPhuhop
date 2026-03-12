import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navClass = ({ isActive }) => (isActive ? 'site-nav-link active' : 'site-nav-link');

export default function PublicLayout() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="site-header-inner">
          <Link to="/" className="site-logo">
            <span className="site-logo-badge">L</span>
            <div>
              <strong>Laptop AI</strong>
              <small>Modern UI • rõ ràng • dễ chèn hình</small>
            </div>
          </Link>

          <nav className="site-nav">
            <NavLink to="/" className={navClass}>Trang chủ</NavLink>
            <NavLink to="/laptops" className={navClass}>Sản phẩm</NavLink>
            <NavLink to="/brands" className={navClass}>Thương hiệu</NavLink>
            <NavLink to="/evaluations" className={navClass}>Đánh giá</NavLink>
          </nav>

          <div className="site-actions">
            {user ? (
              <>
                <Link to="/profile" className="user-pill">
                  <span>{user.full_name || 'Tài khoản'}</span>
                  <small>{user.role}</small>
                </Link>
                {isAdmin && <Link to="/admin" className="outline-btn">Admin</Link>}
                <button className="ghost-btn" onClick={handleLogout}>Đăng xuất</button>
              </>
            ) : (
              <>
                <Link to="/login" className="outline-btn">Đăng nhập</Link>
                <Link to="/register" className="primary-btn inline-btn">Bắt đầu</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="public-main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div>
          <strong>Laptop AI</strong>
          <p>Khung giao diện sáng, thoáng và ưu tiên vùng ảnh.</p>
        </div>
        <div className="footer-highlight">
          <span>React + Vite</span>
          <span>Role-based UI</span>
          <span>Admin riêng</span>
        </div>
      </footer>
    </div>
  );
}
