import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="not-found-wrap">
      <div className="card not-found-card">
        <p className="eyebrow">404</p>
        <h1>Không tìm thấy trang</h1>
        <p>Đường dẫn này không tồn tại.</p>
        <div className="button-row center-row">
          <Link to="/" className="primary-btn inline-btn">Về trang chủ</Link>
          <Link to="/laptops" className="outline-btn">Xem sản phẩm</Link>
        </div>
      </div>
    </div>
  );
}
