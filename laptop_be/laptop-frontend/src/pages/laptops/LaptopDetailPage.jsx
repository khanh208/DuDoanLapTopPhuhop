import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import http from '../../api/http';
import Loading from '../../components/Loading';
import { formatCurrency } from '../../utils/format';

export default function LaptopDetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await http.get(`/laptops/${id}`);
        setItem(data);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <Loading text="Đang tải chi tiết sản phẩm..." />;
  if (!item) return <div className="empty-state">Không tìm thấy laptop</div>;

  return (
    <div className="page-stack">
      <Link to="/laptops" className="text-link">← Quay lại danh sách sản phẩm</Link>

      <div className="detail-layout card">
        <div className="detail-visual">
          {item.image_url ? (
            <img src={item.image_url} alt={item.name} className="detail-image" />
          ) : (
            <div className="detail-image placeholder">Laptop Image</div>
          )}
        </div>

        <div className="detail-content">
          <span className="product-tag">{item.brand?.name || 'Không rõ hãng'}</span>
          <h1>{item.name}</h1>
          <div className="price-highlight">{formatCurrency(item.price)}</div>
          <p className="description">{item.description || 'Chưa có mô tả cho sản phẩm này.'}</p>

          <div className="detail-grid enhanced-detail-grid">
            <div><strong>Model:</strong> {item.model_code || '—'}</div>
            <div><strong>CPU:</strong> {item.cpu || '—'}</div>
            <div><strong>GPU:</strong> {item.gpu || '—'}</div>
            <div><strong>RAM:</strong> {item.ram_gb || '—'} GB</div>
            <div><strong>SSD:</strong> {item.ssd_gb || '—'} GB</div>
            <div><strong>Màn hình:</strong> {item.screen_size || '—'} inch</div>
            <div><strong>Độ phân giải:</strong> {item.screen_resolution || '—'}</div>
            <div><strong>Cổng kết nối:</strong> {item.ports_count || '—'}</div>
            <div><strong>Pin:</strong> {item.battery_hours || '—'} giờ</div>
            <div><strong>Cân nặng:</strong> {item.weight_kg || '—'} kg</div>
            <div><strong>Năm ra mắt:</strong> {item.release_year || '—'}</div>
            <div><strong>Tình trạng:</strong> {item.condition_status || '—'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
