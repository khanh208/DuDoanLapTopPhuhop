import { useEffect, useState } from 'react';
import { getFormOptions, runRecommendation } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [options, setOptions] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    usageProfile: '',
    budget: { min: 10000000, max: 50000000 },
    filters: { minRamGb: 8, minSsdGb: 256, brandCode: '' }
  });

  useEffect(() => {
    getFormOptions().then(res => {
      setOptions(res.data);
      if (res.data.usageProfiles.length > 0) {
        setForm(prev => ({ ...prev, usageProfile: res.data.usageProfiles[0].code }));
      }
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await runRecommendation(form); // Gọi API POST /api/recommendations/run
      navigate(`/dashboard/${res.data.session.sessionKey}`);
    } catch (err) {
      alert("Lỗi kết nối Backend!");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white p-10 font-sans">
      <div className="max-w-4xl mx-auto border-l-4 border-red-600 pl-6">
        <h1 className="text-5xl font-black italic tracking-tighter mb-2">LAPTOP SELECTOR</h1>
        <p className="text-gray-400 mb-10 uppercase tracking-widest">Formula Performance Edition</p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-[#161b22] p-8 rounded-lg">
          <div>
            <label className="block text-xs font-bold text-red-500 uppercase mb-2">Mục đích sử dụng</label>
            <select 
              value={form.usageProfile}
              onChange={e => setForm({...form, usageProfile: e.target.value})}
              className="w-full bg-[#0d1117] border border-gray-700 p-3 rounded text-white focus:border-red-600 outline-none"
            >
              {options?.usageProfiles.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-red-500 uppercase mb-2">Ngân sách tối đa (VND)</label>
            <input 
              type="number"
              value={form.budget.max}
              onChange={e => setForm({...form, budget: {...form.budget, max: parseInt(e.target.value)}})}
              className="w-full bg-[#0d1117] border border-gray-700 p-3 rounded text-white"
            />
          </div>

          <button 
            disabled={loading}
            className="md:col-span-2 bg-red-600 hover:bg-red-700 text-white font-black py-4 uppercase italic transition-all transform hover:scale-105"
          >
            {loading ? "Đang phân tích dữ liệu..." : "Bắt đầu tính toán phù hợp"}
          </button>
        </form>
      </div>
    </div>
  );
}