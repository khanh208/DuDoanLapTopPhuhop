import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const metrics = [
  { value: '120+', label: 'Mẫu laptop' },
  { value: '18', label: 'Thương hiệu' },
  { value: 'AHP + AI', label: 'Hệ thống gợi ý' },
];

const highlights = [
  { title: 'Mua sắm dễ dàng', text: 'Hệ thống bộ lọc thông minh giúp bạn tìm kiếm nhanh chóng.' },
  { title: 'Tư vấn bằng AI', text: 'Trợ lý AI phân tích nhu cầu và đưa ra gợi ý chuẩn xác nhất.' },
  { title: 'Đánh giá chuyên sâu', text: 'Tích hợp thuật toán AHP để chấm điểm và xếp hạng khách quan.' },
];

export default function HomePage() {
  const { isAdmin } = useAuth();

  return (
    <div className="page-stack">
      <section className="hero-section">
        <div className="card glass-card hero-copy">
          <p className="eyebrow">LAPTOP AI STORE</p>
          <h1>Tìm laptop "chân ái" với Trợ lý AI thông minh.</h1>
          <p>Trải nghiệm mua sắm thế hệ mới. Ứng dụng trí tuệ nhân tạo và thuật toán xếp hạng chuyên sâu giúp bạn đưa ra quyết định dễ dàng nhất.</p>
          <div className="hero-actions">
            <Link to="/laptops" className="primary-btn inline-btn">Xem sản phẩm</Link>
            <Link to="/evaluations" className="outline-btn">Gợi ý theo nhu cầu</Link>
          </div>
          <div className="hero-metrics stats-row responsive-four">
            {metrics.map((item) => (
              <div className="metric-card" key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Khu vực chèn ảnh Hero Banner */}
        <div className="hero-visual" style={{ overflow: 'hidden', borderRadius: '12px' }}>
          <img 
            src="/images/hero-banner.jpg" // Đổi đường dẫn ảnh của bạn vào đây sau
            alt="Hero Banner" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            // Thêm thuộc tính onError tạm thời để không bị vỡ giao diện khi chưa có ảnh thực tế
            onError={(e) => {
              e.target.src = 'https://placehold.co/800x600/1e3a8a/FFF?text=Hero+Banner';
            }}
          />
        </div>
      </section>

      <section className="feature-grid">
        {highlights.map((item) => (
          <article className="feature-card" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </section>

      <section className="showcase-grid">
        <div className="showcase-card">
          <p className="eyebrow">KHÁCH HÀNG</p>
          <h2>Đa dạng sản phẩm chính hãng.</h2>
          <p>Khám phá hàng trăm mẫu laptop từ các thương hiệu hàng đầu thế giới với mức giá tốt nhất.</p>
          
          {/* Khu vực chèn ảnh Showcase 1 */}
          <div className="placeholder-banner" style={{ overflow: 'hidden', padding: 0, border: 'none' }}>
            <img 
              src="/images/product-showcase.jpg" // Đổi đường dẫn ảnh
              alt="Laptop Showcase" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={(e) => {
                e.target.src = 'https://placehold.co/600x400/e2e8f0/475569?text=Product+Image';
              }}
            />
          </div>
          <Link to="/laptops" className="text-link">Mở danh sách sản phẩm →</Link>
        </div>

        <div className="showcase-card emphasis-card">
          <p className="eyebrow">HỆ THỐNG QUẢN TRỊ</p>
          <h2>Kiểm soát toàn diện.</h2>
          <p>Dành riêng cho ban quản trị: Quản lý kho hàng, theo dõi đơn đặt hàng và điều chỉnh thông số AI.</p>
          
          {/* Khu vực chèn ảnh Showcase 2 */}
          <div className="placeholder-banner" style={{ overflow: 'hidden', padding: 0, border: 'none' }}>
             <img 
              src="/images/admin-dashboard.jpg" // Đổi đường dẫn ảnh
              alt="Admin Dashboard" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={(e) => {
                e.target.src = 'https://placehold.co/600x400/3b82f6/FFF?text=Admin+Dashboard';
              }}
            />
          </div>
          <Link to={isAdmin ? '/admin' : '/login'} className="text-link">
            {isAdmin ? 'Đi tới dashboard admin →' : 'Đăng nhập để vào admin →'}
          </Link>
        </div>
      </section>
    </div>
  );
}