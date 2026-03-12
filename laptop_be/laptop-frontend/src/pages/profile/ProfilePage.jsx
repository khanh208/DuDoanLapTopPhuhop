import { useEffect, useState } from 'react';
import http from '../../api/http';
import { useAuth } from '../../context/AuthContext';

export default function ProfilePage() {
  const { user, fetchProfile, setUser } = useAuth();
  const [profile, setProfile] = useState({ full_name: '', phone_number: '', address: '' });
  const [passwordForm, setPasswordForm] = useState({ old_password: '', new_password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setProfile({
        full_name: user.full_name || '',
        phone_number: user.phone_number || '',
        address: user.address || '',
      });
    }
  }, [user]);

  const updateProfile = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const { data } = await http.put('/users/me', profile);
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      setMessage('Cập nhật hồ sơ thành công');
      await fetchProfile();
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể cập nhật hồ sơ');
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const { data } = await http.put('/users/me/password', passwordForm);
      setMessage(data.message);
      setPasswordForm({ old_password: '', new_password: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể đổi mật khẩu');
    }
  };

  return (
    <div className="page-stack">
      <section className="catalog-hero card">
        <div>
          <p className="eyebrow">HỒ SƠ CÁ NHÂN</p>
          <h1>Quản lý thông tin tài khoản và bảo mật.</h1>
          <p>Những thông tin cần dùng thường xuyên được tách thành hai khối riêng để dễ theo dõi.</p>
        </div>
        <div className="mini-stat emphasis">
          <strong>{user?.role || 'user'}</strong>
          <span>Vai trò hiện tại</span>
        </div>
      </section>

      <div className="page-grid two-columns">
        <form className="card" onSubmit={updateProfile}>
          <h2>Thông tin cá nhân</h2>
          <label>Họ tên</label>
          <input value={profile.full_name} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} />
          <label>Số điện thoại</label>
          <input value={profile.phone_number} onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })} />
          <label>Địa chỉ</label>
          <textarea rows="4" value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} />
          <button className="primary-btn">Lưu hồ sơ</button>
        </form>

        <form className="card" onSubmit={updatePassword}>
          <h2>Đổi mật khẩu</h2>
          <label>Mật khẩu cũ</label>
          <input type="password" value={passwordForm.old_password} onChange={(e) => setPasswordForm({ ...passwordForm, old_password: e.target.value })} />
          <label>Mật khẩu mới</label>
          <input type="password" value={passwordForm.new_password} onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })} />
          <button className="primary-btn">Cập nhật mật khẩu</button>
          {message && <p className="success-text">{message}</p>}
          {error && <p className="error-text">{error}</p>}
        </form>
      </div>
    </div>
  );
}
