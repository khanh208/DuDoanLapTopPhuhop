import { useEffect, useState } from 'react';
import http from '../../api/http';
import AdminRoute from '../../components/AdminRoute';
import Loading from '../../components/Loading';

const defaultForm = { full_name: '', email: '', password: '', role: 'user', phone_number: '', address: '' };

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    try {
      const { data } = await http.get('/admin/users');
      setUsers(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Không tải được danh sách user');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const submitForm = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      if (editingId) {
        await http.put(`/admin/users/${editingId}`, form);
        setMessage('Cập nhật user thành công');
      } else {
        await http.post('/admin/users', form);
        setMessage('Tạo user thành công');
      }
      setForm(defaultForm);
      setEditingId(null);
      await loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Lưu user thất bại');
    }
  };

  const startEdit = (user) => {
    setEditingId(user.id);
    setForm({ ...defaultForm, ...user, password: '' });
  };

  const removeUser = async (id) => {
    if (!window.confirm('Xóa user này?')) return;
    try {
      await http.delete(`/admin/users/${id}`);
      await loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Không xóa được user');
    }
  };

  return (
    <AdminRoute>
      <div className="page-grid two-columns">
        <form className="card" onSubmit={submitForm}>
          <h2>{editingId ? 'Sửa user' : 'Tạo user mới'}</h2>
          <label>Họ tên</label>
          <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
          <label>Email</label>
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          {!editingId && <>
            <label>Mật khẩu</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </>}
          <label>Role</label>
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
          <label>Số điện thoại</label>
          <input value={form.phone_number} onChange={(e) => setForm({ ...form, phone_number: e.target.value })} />
          <label>Địa chỉ</label>
          <textarea rows="3" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          {message && <p className="success-text">{message}</p>}
          {error && <p className="error-text">{error}</p>}
          <div className="button-row">
            <button className="primary-btn">{editingId ? 'Lưu thay đổi' : 'Tạo user'}</button>
            <button type="button" className="ghost-btn" onClick={() => { setEditingId(null); setForm(defaultForm); }}>Làm mới</button>
          </div>
        </form>

        <div className="card">
          <h2>Danh sách users</h2>
          {loading ? <Loading /> : (
            <div className="table-wrapper">
              <table>
                <thead><tr><th>ID</th><th>Họ tên</th><th>Email</th><th>Role</th><th></th></tr></thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.full_name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td className="actions-cell">
                        <button className="small-btn" onClick={() => startEdit(user)}>Sửa</button>
                        <button className="small-btn danger" onClick={() => removeUser(user.id)}>Xóa</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminRoute>
  );
}
