import { useEffect, useState } from 'react';
import http from '../../api/http';
import AdminRoute from '../../components/AdminRoute';
import Loading from '../../components/Loading';
import { formatDate } from '../../utils/format';

export default function ImportExcelPage() {
  const [file, setFile] = useState(null);
  const [logs, setLogs] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const loadLogs = async () => {
    setLoading(true);
    try {
      const { data } = await http.get('/imports/logs');
      setLogs(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Không tải được log import');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadLogs(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setSubmitting(true);
    setError('');
    const formData = new FormData();
    formData.append('file', file);
    try {
      const { data } = await http.post('/imports/laptops-excel', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(data);
      await loadLogs();
    } catch (err) {
      setError(err.response?.data?.message || 'Import thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminRoute>
      <div className="page-grid two-columns">
        <form className="card" onSubmit={submit}>
          <h2>Import Excel laptop</h2>
          <p>Sheet cần đúng tên: <strong>Laptop_Data</strong></p>
          <input type="file" accept=".xlsx,.xls" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          {error && <p className="error-text">{error}</p>}
          <button className="primary-btn" disabled={!file || submitting}>{submitting ? 'Đang import...' : 'Upload & Import'}</button>
          {result && (
            <div className="result-box">
              <p><strong>{result.message}</strong></p>
              <p>Tổng dòng: {result.summary?.total_rows}</p>
              <p>Thành công: {result.summary?.success_rows}</p>
              <p>Lỗi: {result.summary?.failed_rows}</p>
            </div>
          )}
        </form>

        <div className="card">
          <h2>Lịch sử import</h2>
          {loading ? <Loading /> : (
            <div className="table-wrapper">
              <table>
                <thead><tr><th>File</th><th>Tổng</th><th>OK</th><th>Lỗi</th><th>Ngày</th></tr></thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id}>
                      <td>{log.file_name}</td>
                      <td>{log.total_rows}</td>
                      <td>{log.success_rows}</td>
                      <td>{log.failed_rows}</td>
                      <td>{formatDate(log.created_at)}</td>
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
