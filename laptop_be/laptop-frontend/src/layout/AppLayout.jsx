import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const linkClass = ({ isActive }) => (isActive ? 'nav-link active' : 'nav-link');

export default function AppLayout() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link className="brand" to="/laptops">
          Laptop Advisor
        </Link>
        <nav className="nav-menu">
          <NavLink to="/laptops" className={linkClass}>Laptop</NavLink>
          <NavLink to="/brands" className={linkClass}>Brands</NavLink>
          <NavLink to="/ahp/criteria" className={linkClass}>AHP Criteria</NavLink>
          <NavLink to="/evaluations" className={linkClass}>Evaluation Session</NavLink>
          <NavLink to="/profile" className={linkClass}>Hồ sơ</NavLink>
          {isAdmin && <NavLink to="/admin/users" className={linkClass}>Quản lý Users</NavLink>}
          {isAdmin && <NavLink to="/admin/laptops" className={linkClass}>Quản lý Laptops</NavLink>}
          {isAdmin && <NavLink to="/admin/imports" className={linkClass}>Import Excel</NavLink>}
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <h1>Frontend React cho chức năng A-F</h1>
            <p>{user?.full_name} · {user?.role}</p>
          </div>
          <button className="ghost-btn" onClick={handleLogout}>Đăng xuất</button>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
