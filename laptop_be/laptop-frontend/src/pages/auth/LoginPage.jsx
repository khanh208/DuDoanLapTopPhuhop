import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Hứng dữ liệu trả về từ hàm login (chứa thông tin user và role)
      const data = await login(form);
      const userRole = data?.user?.role;
      
      // Xác định trang mặc định dựa trên role
      const defaultPath = userRole === 'admin' ? '/admin' : '/';

      // Điều hướng: Ưu tiên trang người dùng muốn vào trước đó (nếu có), nếu không thì về trang mặc định
      navigate(location.state?.from?.pathname || defaultPath, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-showcase">
        <p className="eyebrow">WELCOME BACK</p>
        <h1>Đăng nhập để tiếp tục.</h1>
        <p>User dùng evaluation. Admin có thêm dashboard quản trị.</p>
      </div>

      <form className="card auth-card modern-auth-card" onSubmit={handleSubmit}>
        <h2>Đăng nhập</h2>
        <label>Email</label>
        <input 
          value={form.email} 
          onChange={(e) => setForm({ ...form, email: e.target.value })} 
        />
        <label>Mật khẩu</label>
        <input 
          type="password" 
          value={form.password} 
          onChange={(e) => setForm({ ...form, password: e.target.value })} 
        />
        {error && <p className="error-text">{error}</p>}
        <button className="primary-btn" disabled={loading}>
          {loading ? 'Đang xử lý...' : 'Đăng nhập'}
        </button>
        <p>Chưa có tài khoản? <Link to="/register" className="text-link">Đăng ký</Link></p>
      </form>
    </div>
  );
}