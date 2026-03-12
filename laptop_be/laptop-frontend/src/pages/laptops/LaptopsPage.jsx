import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import http from '../../api/http';
import { formatCurrency } from '../../utils/format';
import Loading from '../../components/Loading';

const initialFilters = {
  keyword: '',
  brand_id: '',
  min_price: '',
  max_price: '',
  min_ssd: '',
  min_year: '',
  max_year: '',
  condition_status: '',
};

export default function LaptopsPage() {
  const [items, setItems] = useState([]);
  const [brands, setBrands] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(true);

  const activeFilterCount = useMemo(
    () => Object.values(filters).filter((value) => value !== '').length,
    [filters]
  );

  const loadBrands = async () => {
    const { data } = await http.get('/brands');
    setBrands(Array.isArray(data) ? data : []);
  };

  const loadLaptops = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== '')
      );
      const { data } = await http.get('/laptops', { params });
      setItems(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBrands();
    loadLaptops();
  }, []);

  const onSearch = (e) => {
    e.preventDefault();
    loadLaptops();
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    setTimeout(() => {
      http.get('/laptops').then(({ data }) => setItems(Array.isArray(data) ? data : []));
    }, 0);
  };

  return (
    <div className="page-stack">
      <section className="catalog-hero card">
        <div>
          <p className="eyebrow">DANH SÁCH SẢN PHẨM</p>
          <h1>Chọn laptop theo cấu hình, giá và tình trạng.</h1>
          <p>
            Bộ lọc được đặt ở trên cùng để người dùng thấy ngay phần quan trọng nhất khi vào trang sản phẩm.
          </p>
        </div>
        <div className="catalog-hero-side">
          <div className="mini-stat">
            <strong>{items.length}</strong>
            <span>Sản phẩm đang hiển thị</span>
          </div>
          <div className="mini-stat emphasis">
            <strong>{activeFilterCount}</strong>
            <span>Bộ lọc đang áp dụng</span>
          </div>
        </div>
      </section>

      <form className="card filter-grid modern-filter-grid" onSubmit={onSearch}>
        <div className="section-heading">
          <div>
            <p className="eyebrow">BỘ LỌC</p>
            <h2>Tìm nhanh sản phẩm phù hợp</h2>
          </div>
          <div className="button-row compact-row">
            <button className="primary-btn">Áp dụng</button>
            <button type="button" className="ghost-btn" onClick={clearFilters}>Xóa lọc</button>
          </div>
        </div>

        <input placeholder="Từ khóa tên laptop" value={filters.keyword} onChange={(e) => setFilters({ ...filters, keyword: e.target.value })} />
        <select value={filters.brand_id} onChange={(e) => setFilters({ ...filters, brand_id: e.target.value })}>
          <option value="">Tất cả hãng</option>
          {brands.map((brand) => <option key={brand.id} value={brand.id}>{brand.name}</option>)}
        </select>
        <input placeholder="Giá từ" value={filters.min_price} onChange={(e) => setFilters({ ...filters, min_price: e.target.value })} />
        <input placeholder="Giá đến" value={filters.max_price} onChange={(e) => setFilters({ ...filters, max_price: e.target.value })} />
        <input placeholder="SSD tối thiểu" value={filters.min_ssd} onChange={(e) => setFilters({ ...filters, min_ssd: e.target.value })} />
        <input placeholder="Năm từ" value={filters.min_year} onChange={(e) => setFilters({ ...filters, min_year: e.target.value })} />
        <input placeholder="Năm đến" value={filters.max_year} onChange={(e) => setFilters({ ...filters, max_year: e.target.value })} />
        <select value={filters.condition_status} onChange={(e) => setFilters({ ...filters, condition_status: e.target.value })}>
          <option value="">Tình trạng</option>
          <option value="new">new</option>
          <option value="used">used</option>
        </select>
      </form>

      {loading ? (
        <Loading text="Đang tải danh sách sản phẩm..." />
      ) : items.length === 0 ? (
        <div className="empty-state">Không có laptop phù hợp với bộ lọc hiện tại.</div>
      ) : (
        <div className="cards-grid modern-cards-grid">
          {items.map((laptop) => (
            <Link className="card product-card modern-product-card" to={`/laptops/${laptop.id}`} key={laptop.id}>
              <div className="product-thumb">
                {laptop.image_url ? (
                  <img src={laptop.image_url} alt={laptop.name} />
                ) : (
                  <div className="product-thumb-fallback">Laptop</div>
                )}
              </div>
              <div className="product-content">
                <span className="product-tag">{laptop.brand?.name || 'Không rõ hãng'}</span>
                <h3>{laptop.name}</h3>
                <p>{laptop.cpu || 'Chưa có CPU'} · {laptop.ram_gb} GB RAM · {laptop.ssd_gb} GB SSD</p>
                <div className="product-meta-row">
                  <strong>{formatCurrency(laptop.price)}</strong>
                  <span className="text-link">Xem chi tiết</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
