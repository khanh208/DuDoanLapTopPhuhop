import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await register(form);
      setMessage('Đăng ký thành công, hãy đăng nhập.');
      setTimeout(() => navigate('/login'), 800);
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-showcase">
        <p className="eyebrow">CREATE ACCOUNT</p>
        <h1>Tạo tài khoản nhanh.</h1>
        <p>Đăng ký để lưu hồ sơ và dùng evaluation session.</p>
      </div>

      <form className="card auth-card modern-auth-card" onSubmit={handleSubmit}>
        <h2>Đăng ký</h2>
        <label>Họ tên</label>
        <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
        <label>Email</label>
        <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <label>Mật khẩu</label>
        <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {message && <p className="success-text">{message}</p>}
        {error && <p className="error-text">{error}</p>}
        <button className="primary-btn" disabled={loading}>{loading ? 'Đang xử lý...' : 'Tạo tài khoản'}</button>
        <p>Đã có tài khoản? <Link to="/login" className="text-link">Đăng nhập</Link></p>
      </form>
    </div>
  );
}
