import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  return (
    <nav style={{ padding: "12px 24px", borderBottom: "1px solid #ddd" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 16 }}>
          <Link to="/">Trang chủ</Link>
          <Link to="/laptops">Sản phẩm</Link>
          <Link to="/evaluations">Đánh giá</Link>
        </div>

        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          {!isAuthenticated ? (
            <>
              <Link to="/login">Đăng nhập</Link>
              <Link to="/register">Đăng ký</Link>
            </>
          ) : (
            <>
              <Link to="/profile">{user?.full_name || "Tài khoản"}</Link>

              {isAdmin && <Link to="/admin">Quản trị</Link>}

              <button onClick={logout}>Đăng xuất</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}