import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import http from '../../api/http';
import StatCard from '../../components/StatCard';
import Loading from '../../components/Loading';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ laptops: 0, brands: 0, users: 0, evaluations: 0, orders: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // Cố gắng gọi thêm API đơn hàng nếu bạn đã có ở Backend
        const [laptopsRes, brandsRes, usersRes, evalsRes, ordersRes] = await Promise.allSettled([
          http.get('/laptops'),
          http.get('/brands'),
          http.get('/admin/users'),
          http.get('/evaluations'),
          http.get('/orders') // Giả định route này tồn tại
        ]);

        setStats({
          laptops: laptopsRes.status === 'fulfilled' ? (laptopsRes.value.data?.length || 0) : 0,
          brands: brandsRes.status === 'fulfilled' ? (brandsRes.value.data?.length || 0) : 0,
          users: usersRes.status === 'fulfilled' ? (usersRes.value.data?.length || 0) : 0,
          evaluations: evalsRes.status === 'fulfilled' ? (evalalsRes.value.data?.length || 0) : 0,
          orders: ordersRes.status === 'fulfilled' ? (ordersRes.value.data?.length || 0) : 0,
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="page-stack" style={{ gap: '2rem' }}>
      
      {/* KHU VỰC CHÀO MỪNG */}
      <section className="dashboard-hero card" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', color: 'white' }}>
        <div>
          <p className="eyebrow" style={{ color: '#bfdbfe' }}>TỔNG QUAN HỆ THỐNG</p>
          <h2 style={{ color: 'white', marginTop: '0.5rem' }}>Theo dõi và Quản lý hoạt động</h2>
          <p style={{ color: '#eff6ff', opacity: 0.9 }}>
            Kiểm soát sản phẩm, theo dõi lượt người dùng yêu cầu AI tư vấn và duyệt đơn hàng.
          </p>
        </div>
      </section>

      {/* THỐNG KÊ NHANH */}
      <section className="stats-row responsive-four">
        <StatCard label="💻 Tổng Laptop" value={stats.laptops} />
        <StatCard label="🏷️ Thương hiệu" value={stats.brands} />
        <StatCard label="👥 Người dùng" value={stats.users} />
        <StatCard label="🤖 Lượt tư vấn AI" value={stats.evaluations} />
        {/* Nếu bạn muốn show thêm Đơn hàng, bỏ comment dòng dưới */}
        {/* <StatCard label="🛒 Đơn hàng mới" value={stats.orders} /> */}
      </section>

      {/* THAO TÁC NHANH (QUICK ACTIONS) */}
      <section className="card">
        <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>⚡ Thao tác nhanh</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          
          <button 
            className="primary-btn" 
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.5rem', gap: '0.5rem' }}
            onClick={() => navigate('/admin/laptops')}
          >
            <span style={{ fontSize: '1.5rem' }}>➕</span>
            Thêm Laptop mới
          </button>

          <button 
            className="ghost-btn" 
            style={{ border: '1px solid #ccc', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.5rem', gap: '0.5rem' }}
            onClick={() => navigate('/admin/imports')}
          >
            <span style={{ fontSize: '1.5rem' }}>📥</span>
            Import Excel
          </button>

          <button 
            className="ghost-btn" 
            style={{ border: '1px solid #ccc', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.5rem', gap: '0.5rem' }}
            onClick={() => navigate('/admin/criteria')}
          >
            <span style={{ fontSize: '1.5rem' }}>⚙️</span>
            Cập nhật Trọng số AHP
          </button>

          <button 
            className="ghost-btn" 
            style={{ border: '1px solid #ccc', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.5rem', gap: '0.5rem' }}
            onClick={() => navigate('/admin/users')}
          >
            <span style={{ fontSize: '1.5rem' }}>👤</span>
            Quản lý tài khoản
          </button>

        </div>
      </section>

    </div>
  );
}