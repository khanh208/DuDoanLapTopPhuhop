import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import http from '../../api/http';
import Loading from '../../components/Loading';
import StatCard from '../../components/StatCard';
import { formatCurrency, formatDate } from '../../utils/format';

// --- ĐỊNH NGHĨA CÁC TÙY CHỌN DROPDOWN GIỚI HẠN DỮ LIỆU ---
const MAJOR_OPTIONS = [
  { value: '', label: '-- Chọn chuyên ngành --' },
  { value: 'Công nghệ thông tin', label: 'Công nghệ thông tin (IT / Lập trình)' },
  { value: 'Kinh tế', label: 'Kinh tế / Quản trị kinh doanh' },
  { value: 'Thiết kế đồ họa', label: 'Thiết kế đồ họa / Đa phương tiện' },
  { value: 'Kỹ thuật', label: 'Kỹ thuật / Cơ khí / Điện tử' },
  { value: 'Ngôn ngữ học', label: 'Ngôn ngữ học / Sư phạm' },
  { value: 'Khác', label: 'Chuyên ngành khác' },
];

const NEEDS_OPTIONS = [
  { value: '', label: '-- Chọn nhu cầu sử dụng --' },
  { value: 'Học tập - Văn phòng', label: 'Học tập - Văn phòng (Word, Excel, Lướt web)' },
  { value: 'Lập trình', label: 'Lập trình / Viết code / Chạy máy ảo' },
  { value: 'Thiết kế đồ họa 2D', label: 'Thiết kế đồ họa 2D (Photoshop, AI)' },
  { value: 'Đồ họa 3D - Dựng phim', label: 'Render 3D / Dựng phim / Kỹ thuật nặng' },
  { value: 'Chơi game', label: 'Chơi game (Từ Esports đến AAA)' },
  { value: 'Đa dụng', label: 'Đa dụng (Học tập kết hợp giải trí)' },
];
// --------------------------------------------------------

const defaultForm = {
  student_major: '',
  usage_needs: '',
  budget_min: '',
  budget_max: '',
  prefer_battery: false,
  prefer_lightweight: false,
  prefer_performance: false,
  prefer_durability: false,
  prefer_upgradeability: false,
  ai_enabled: true,
};

export default function EvaluationSessionsPage() {
  const navigate = useNavigate();
  
  const [form, setForm] = useState(defaultForm);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [results, setResults] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await http.get('/evaluations');
      setSessions(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Không tải được danh sách session');
    } finally {
      setLoading(false);
    }
  };

  const loadResults = async (sessionId) => {
    try {
      const { data } = await http.get(`/evaluations/${sessionId}/results`);
      setResults(Array.isArray(data) ? data : []);
      setSelectedSessionId(sessionId);
    } catch (err) {
      setResults([]);
      setError(err.response?.data?.message || 'Không tải được kết quả đánh giá');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setResults([]);
    setSelectedSessionId(null);

    const parsedBudgetMin = form.budget_min ? Number(form.budget_min) : null;
    const parsedBudgetMax = form.budget_max ? Number(form.budget_max) : null;

    let createdSessionId = null;

    try {
      setSubmitting(true);

      const { data: createRes } = await http.post('/evaluations', {
        ...form,
        budget_min: parsedBudgetMin,
        budget_max: parsedBudgetMax,
      });

      createdSessionId = createRes?.session?.id;
      if (!createdSessionId) throw new Error('Không lấy được session id');

      await http.post(`/evaluations/${createdSessionId}/filters`, {
        min_price: parsedBudgetMin,
        max_price: parsedBudgetMax,
      });

      if (form.ai_enabled) {
        await http.post(`/evaluations/${createdSessionId}/ai-rank`, {});
        setForm(defaultForm);
        setSuccess('Tạo session và sinh kết quả bằng AI thành công');
        await loadSessions();
        await loadResults(createdSessionId);
      } else {
        navigate(`/evaluations/${createdSessionId}/ahp-step`);
      }

    } catch (err) {
      if (createdSessionId) {
        try {
          await http.delete(`/evaluations/${createdSessionId}`);
        } catch (rollbackErr) {
          console.error('Không thể xóa session rác:', rollbackErr);
        }
      }
      setError(err.response?.data?.message || err.message || 'Không tạo được session / kết quả');
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa session này?')) return;
    try {
      setError('');
      await http.delete(`/evaluations/${id}`);
      if (selectedSessionId === id) {
        setSelectedSessionId(null);
        setResults([]);
      }
      await loadSessions();
    } catch (err) {
      setError(err.response?.data?.message || 'Không xóa được session');
    }
  };

  return (
    <div className="page-stack">
      <div className="stats-row">
        <StatCard label="Tổng session" value={sessions.length} />
        <StatCard label="Có đề xuất" value={sessions.filter((x) => x.recommended_laptop_id).length} />
        <StatCard label="Đang dùng AI" value={sessions.filter((x) => x.ai_enabled).length} />
      </div>

      <form className="card" onSubmit={submit}>
        <h2>Tạo Evaluation Session</h2>

        <div className="form-grid">
          {/* Thay thế Input Text bằng Select Dropdown cho Chuyên ngành */}
          <select
            name="student_major"
            value={form.student_major}
            onChange={handleChange}
            className="input-field"
            required
          >
            {MAJOR_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.value === ''}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Thay thế Input Text bằng Select Dropdown cho Nhu cầu */}
          <select
            name="usage_needs"
            value={form.usage_needs}
            onChange={handleChange}
            className="input-field"
            required
          >
            {NEEDS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.value === ''}>
                {opt.label}
              </option>
            ))}
          </select>

          <input
            name="budget_min"
            placeholder="Ngân sách tối thiểu (VNĐ)"
            type="number"
            value={form.budget_min}
            onChange={handleChange}
            className="input-field"
          />
          <input
            name="budget_max"
            placeholder="Ngân sách tối đa (VNĐ)"
            type="number"
            value={form.budget_max}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div className="checkbox-grid">
          {[
            ['prefer_battery', 'Ưu tiên Pin trâu'],
            ['prefer_lightweight', 'Ưu tiên Mỏng nhẹ'],
            ['prefer_performance', 'Ưu tiên Hiệu năng cao'],
            ['prefer_durability', 'Ưu tiên Độ bền'],
            ['prefer_upgradeability', 'Ưu tiên Khả năng nâng cấp'],
            ['ai_enabled', 'Bật tự động xếp hạng bằng AI'],
          ].map(([key, label]) => (
            <label key={key} className="checkbox-item">
              <input
                type="checkbox"
                name={key}
                checked={form[key]}
                onChange={handleChange}
              />{' '}
              {label}
            </label>
          ))}
        </div>

        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}

        <button className="primary-btn" disabled={submitting}>
          {submitting ? 'Đang xử lý...' : (form.ai_enabled ? 'Tạo session & xếp hạng bằng AI' : 'Tạo session & cấu hình AHP')}
        </button>
      </form>

      <div className="card">
        <h2>Lịch sử session</h2>
        {loading ? (
          <Loading />
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Chuyên ngành</th>
                  <th>Nhu cầu</th>
                  <th>Ngân sách</th>
                  <th>Đề xuất</th>
                  <th>Ngày tạo</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s) => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>{s.student_major || '—'}</td>
                    <td>{s.usage_needs || '—'}</td>
                    <td>{formatCurrency(s.budget_min)} - {formatCurrency(s.budget_max)}</td>
                    <td>{s.recommended_laptop?.name || s.recommended_laptop_id || '—'}</td>
                    <td>{formatDate(s.created_at)}</td>
                    <td className="actions-cell">
                      <button
                        type="button"
                        className="small-btn"
                        onClick={() => loadResults(s.id)}
                      >
                        Xem kết quả
                      </button>
                      <button
                        type="button"
                        className="small-btn danger"
                        onClick={() => remove(s.id)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
                {sessions.length === 0 && (
                  <tr>
                    <td colSpan="7">Chưa có session nào</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedSessionId && (
        <div className="card">
          <h2>Kết quả session #{selectedSessionId}</h2>

          {results.length === 0 ? (
            <p>Chưa có kết quả để hiển thị.</p>
          ) : (
            <div className="result-list">
              {results.map((item) => (
                <div key={item.id || item.laptop_id} className="result-card">
                  <div className="result-card-head">
                    <div>
                      <h3>{item.laptop?.name || `Laptop #${item.laptop_id}`}</h3>
                      <p>
                        Hạng: <strong>{item.rank_position ?? '—'}</strong> • Điểm:{' '}
                        <strong>{typeof item.total_score === 'number' ? item.total_score.toFixed(4) : item.total_score}</strong>
                      </p>
                    </div>
                  </div>

                  {item.laptop && (
                    <div className="result-meta">
                      <span>CPU: {item.laptop.cpu || '—'}</span>
                      <span>RAM: {item.laptop.ram_gb || '—'} GB</span>
                      <span>SSD: {item.laptop.ssd_gb || '—'} GB</span>
                      <span>Giá: {formatCurrency(item.laptop.price)}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}