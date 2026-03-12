import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDashboard } from '../services/api';

export default function Dashboard() {
  const { sessionKey } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    getDashboard(sessionKey).then(res => setData(res.data)); // GET /api/recommendations/{key}/dashboard
  }, [sessionKey]);

  if (!data) return <div className="bg-[#0b0e11] min-h-screen text-white p-10">Đang tải kết quả...</div>;

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white p-8">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h2 className="text-red-600 font-bold uppercase tracking-widest text-sm">Session: {sessionKey.slice(0,8)}</h2>
          <h1 className="text-4xl font-black">KẾT QUẢ GỢI Ý</h1>
        </div>
        <div className="text-right">
          <p className="text-gray-400">Hệ thống đã lọc qua: <span className="text-white">{data.session.hardFilterTotalCount} máy</span></p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột danh sách Laptop */}
        <div className="lg:col-span-2 space-y-6">
          {data.results.map((item) => (
            <div key={item.laptopId} className="group bg-[#161b22] border border-gray-800 hover:border-red-600 transition-all p-6 rounded-r-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
              <div className="flex gap-6">
                <img src={item.imageUrl || 'https://via.placeholder.com/150'} className="w-40 h-32 object-contain" alt={item.laptopName} />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold">{item.laptopName}</h3>
                    <span className="text-3xl font-black text-red-600 italic">{item.matchPercent}%</span>
                  </div>
                  <p className="text-gray-500 text-sm mb-3">{item.brand} | {item.price?.toLocaleString()} VND</p>
                  <div className="flex flex-wrap gap-2">
                    {item.reasons.map((r, idx) => (
                      <span key={idx} className="bg-red-600/10 text-red-500 text-[10px] font-bold px-2 py-1 rounded uppercase border border-red-600/20">{r}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cột phân tích AHP */}
        <div className="bg-[#0d1117] border border-gray-800 p-6 rounded-lg h-fit">
          <h3 className="text-lg font-bold mb-6 border-b border-gray-800 pb-2 italic">PHÂN TÍCH ƯU TIÊN (AHP)</h3>
          <div className="space-y-4">
            {data.ahp.weights.map(w => (
              <div key={w.criterion}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="uppercase text-gray-400">{w.name}</span>
                  <span className="text-white font-mono">{(w.weight * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-800 h-1.5 rounded-full">
                  <div className="bg-red-600 h-full rounded-full" style={{ width: `${w.weight * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-8 text-[10px] text-gray-500 leading-relaxed italic border-t border-gray-800 pt-4">
            * Chỉ số nhất quán (CR): {data.ahp.consistency.cr?.toFixed(4)} 
            {data.ahp.consistency.isConsistent ? ' (Hợp lệ)' : ' (Cần kiểm tra lại)'}
          </p>
        </div>
      </div>
    </div>
  );
}