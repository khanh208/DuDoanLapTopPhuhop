import { useEffect, useState } from 'react';
import http from '../../api/http';
import { useAuth } from '../../context/AuthContext';
import Loading from '../../components/Loading';

const defaultForm = { name: '', logo_url: '' };

export default function BrandsPage() {
  const { isAdmin } = useAuth();
  const [brands, setBrands] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadBrands = async () => {
    setLoading(true);
    try {
      const { data } = await http.get('/brands');
      setBrands(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Không tải được brands');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadBrands(); }, []);

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      if (editingId) await http.put(`/brands/${editingId}`, form);
      else await http.post('/brands', form);
      setForm(defaultForm);
      setEditingId(null);
      await loadBrands();
    } catch (err) {
      setError(err.response?.data?.message || 'Không lưu được brand');
    }
  };

  const removeBrand = async (id) => {
    if (!window.confirm('Xóa hãng này?')) return;
    try {
      await http.delete(`/brands/${id}`);
      await loadBrands();
    } catch (err) {
      setError(err.response?.data?.message || 'Không xóa được brand');
    }
  };

  return (
    <div className="page-grid two-columns">
      {isAdmin && (
        <form className="card" onSubmit={submitForm}>
          <h2>{editingId ? 'Sửa hãng' : 'Thêm hãng'}</h2>
          <label>Tên hãng</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <label>Logo URL</label>
          <input value={form.logo_url} onChange={(e) => setForm({ ...form, logo_url: e.target.value })} />
          {error && <p className="error-text">{error}</p>}
          <div className="button-row">
            <button className="primary-btn">Lưu</button>
            <button type="button" className="ghost-btn" onClick={() => { setEditingId(null); setForm(defaultForm); }}>Làm mới</button>
          </div>
        </form>
      )}

      <div className="card">
        <h2>Danh sách brands</h2>
        {loading ? <Loading /> : (
          <div className="table-wrapper">
            <table>
              <thead><tr><th>ID</th><th>Tên</th><th>Logo</th>{isAdmin && <th></th>}</tr></thead>
              <tbody>
                {brands.map((brand) => (
                  <tr key={brand.id}>
                    <td>{brand.id}</td>
                    <td>{brand.name}</td>
                    <td>{brand.logo_url ? <a href={brand.logo_url} target="_blank">Xem</a> : '—'}</td>
                    {isAdmin && <td className="actions-cell">
                      <button className="small-btn" onClick={() => { setEditingId(brand.id); setForm({ name: brand.name || '', logo_url: brand.logo_url || '' }); }}>Sửa</button>
                      <button className="small-btn danger" onClick={() => removeBrand(brand.id)}>Xóa</button>
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
