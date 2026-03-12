import { useEffect, useState } from 'react';
import http from '../../api/http';
import AdminRoute from '../../components/AdminRoute';
import Loading from '../../components/Loading';

const defaultForm = {
  brand_id: '', name: '', model_code: '', cpu: '', gpu: '', ram_gb: '', ssd_gb: '',
  screen_size: '', screen_resolution: '', weight_kg: '', battery_hours: '', price: '',
  stock_quantity: '0', release_year: '', ports_count: '0', condition_status: 'new', description: '', image_url: '', is_active: true,
};

export default function LaptopAdminPage() {
  const [brands, setBrands] = useState([]);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [brandsRes, laptopsRes] = await Promise.all([
        http.get('/brands'),
        http.get('/laptops', { params: { is_active: 'true' } }),
      ]);
      setBrands(brandsRes.data);
      setItems(laptopsRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Không tải được dữ liệu laptop');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const normalize = () => ({
    ...form,
    brand_id: form.brand_id || null,
    ram_gb: Number(form.ram_gb),
    ssd_gb: Number(form.ssd_gb),
    price: Number(form.price),
    stock_quantity: Number(form.stock_quantity || 0),
    release_year: form.release_year ? Number(form.release_year) : null,
    ports_count: Number(form.ports_count || 0),
    screen_size: form.screen_size ? Number(form.screen_size) : null,
    weight_kg: form.weight_kg ? Number(form.weight_kg) : null,
    battery_hours: form.battery_hours ? Number(form.battery_hours) : null,
  });

  const submitForm = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) await http.put(`/laptops/${editingId}`, normalize());
      else await http.post('/laptops', normalize());
      setForm(defaultForm);
      setEditingId(null);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Không lưu được laptop');
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({ ...defaultForm, ...item, brand_id: item.brand_id || '', is_active: item.is_active ?? true });
  };

  const removeItem = async (id) => {
    if (!window.confirm('Xóa laptop này?')) return;
    try {
      await http.delete(`/laptops/${id}`);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Không xóa được laptop');
    }
  };

  return (
    <AdminRoute>
      <div className="page-grid two-columns-admin">
        <form className="card" onSubmit={submitForm}>
          <div className="section-heading">
            <div>
              <p className="eyebrow">FORM SẢN PHẨM</p>
              <h2>{editingId ? 'Sửa laptop' : 'Tạo laptop'}</h2>
            </div>
          </div>

          <div className="form-grid">
            <select value={form.brand_id} onChange={(e) => setForm({ ...form, brand_id: e.target.value })}>
              <option value="">Chọn hãng</option>
              {brands.map((brand) => <option key={brand.id} value={brand.id}>{brand.name}</option>)}
            </select>
            <input placeholder="Tên laptop" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input placeholder="Model code" value={form.model_code} onChange={(e) => setForm({ ...form, model_code: e.target.value })} />
            <input placeholder="CPU" value={form.cpu} onChange={(e) => setForm({ ...form, cpu: e.target.value })} />
            <input placeholder="GPU" value={form.gpu} onChange={(e) => setForm({ ...form, gpu: e.target.value })} />
            <input placeholder="RAM GB" value={form.ram_gb} onChange={(e) => setForm({ ...form, ram_gb: e.target.value })} />
            <input placeholder="SSD GB" value={form.ssd_gb} onChange={(e) => setForm({ ...form, ssd_gb: e.target.value })} />
            <input placeholder="Giá" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <input placeholder="Tồn kho" value={form.stock_quantity} onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })} />
            <input placeholder="Năm" value={form.release_year} onChange={(e) => setForm({ ...form, release_year: e.target.value })} />
            <input placeholder="Màn hình inch" value={form.screen_size} onChange={(e) => setForm({ ...form, screen_size: e.target.value })} />
            <input placeholder="Độ phân giải" value={form.screen_resolution} onChange={(e) => setForm({ ...form, screen_resolution: e.target.value })} />
          </div>
          <textarea rows="4" placeholder="Mô tả" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          {error && <p className="error-text">{error}</p>}
          <div className="button-row">
            <button className="primary-btn">Lưu laptop</button>
            <button type="button" className="ghost-btn" onClick={() => { setEditingId(null); setForm(defaultForm); }}>Làm mới</button>
          </div>
        </form>

        <div className="card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">DANH SÁCH</p>
              <h2>Laptop hiện có</h2>
            </div>
          </div>
          {loading ? <Loading /> : (
            <div className="table-wrapper">
              <table>
                <thead><tr><th>ID</th><th>Tên</th><th>Hãng</th><th>Giá</th><th>Tồn</th><th></th></tr></thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.name}</td>
                      <td>{item.brand?.name || '—'}</td>
                      <td>{Number(item.price).toLocaleString('vi-VN')}</td>
                      <td>{item.stock_quantity}</td>
                      <td className="actions-cell">
                        <button className="small-btn" onClick={() => startEdit(item)}>Sửa</button>
                        <button className="small-btn danger" onClick={() => removeItem(item.id)}>Xóa</button>
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
