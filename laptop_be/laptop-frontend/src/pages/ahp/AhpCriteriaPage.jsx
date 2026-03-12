import { useEffect, useState } from 'react';
import http from '../../api/http';
import { useAuth } from '../../context/AuthContext';
import Loading from '../../components/Loading';

const defaultForm = { code: '', name: '', description: '' };

export default function AhpCriteriaPage() {
  const { isAdmin } = useAuth();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const { data } = await http.get('/ahp/criteria');
      setItems(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Không tải được tiêu chí');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const save = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;
    try {
      if (editingId) await http.put(`/admin/ahp/criteria/${editingId}`, form);
      else await http.post('/admin/ahp/criteria', form);
      setForm(defaultForm);
      setEditingId(null);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Không lưu được tiêu chí');
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Xóa tiêu chí này?')) return;
    try {
      await http.delete(`/admin/ahp/criteria/${id}`);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Không xóa được tiêu chí');
    }
  };

  return (
    <div className="page-grid two-columns">
      {isAdmin && (
        <form className="card" onSubmit={save}>
          <h2>{editingId ? 'Sửa tiêu chí' : 'Thêm tiêu chí AHP'}</h2>
          <input placeholder="Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
          <input placeholder="Tên tiêu chí" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <textarea rows="4" placeholder="Mô tả" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          {error && <p className="error-text">{error}</p>}
          <div className="button-row">
            <button className="primary-btn">Lưu</button>
            <button type="button" className="ghost-btn" onClick={() => { setEditingId(null); setForm(defaultForm); }}>Làm mới</button>
          </div>
        </form>
      )}
      <div className="card">
        <h2>8 tiêu chí AHP</h2>
        {loading ? <Loading /> : (
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Code</th><th>Tên</th><th>Mô tả</th>{isAdmin && <th></th>}</tr></thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.code}</td>
                    <td>{item.name}</td>
                    <td>{item.description || '—'}</td>
                    {isAdmin && <td className="actions-cell">
                      <button className="small-btn" onClick={() => { setEditingId(item.id); setForm(item); }}>Sửa</button>
                      <button className="small-btn danger" onClick={() => remove(item.id)}>Xóa</button>
                    </td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
