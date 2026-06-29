import { useState } from 'react';

const mockInvoiceImage = "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

const mockJsonData = {
  "tax_code": "0108999888",
  "invoice_no": "HD-2026/009",
  "total_amount": "500,000,000 VND",
  "buyer_name": "Công ty Cổ phần Công nghệ SME Việt Nam",
  "status": "COMPLETED"
};

export default function DualPanelAuditScreen() {
  const [isJsonOpen, setIsJsonOpen] = useState(true);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-slate-100 font-sans p-6 box-border flex flex-col h-screen overflow-hidden">
      
      {/* HEADER */}
      <header className="mb-6 flex justify-between items-end shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Thẩm Định Hồ Sơ Chi Tiết</h1>
          <p className="text-blue-200 mt-1">SmartFin-Guard AI • Phân tích chuyên sâu (Deep Audit)</p>
        </div>
        <div className="text-right">
          <span className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-200 px-4 py-2 rounded-full border border-blue-500/30 text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            Real-time Audit Active
          </span>
        </div>
      </header>

      {/* MAIN LAYOUT: 50% - 50% SPLIT */}
      <div className="flex-1 flex gap-6 overflow-hidden min-h-0 relative z-10 pb-20">
        
        {/* ================= LEFT PANEL ================= */}
        <section className="w-1/2 flex flex-col bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-white/10 bg-black/20">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              📸 Chứng Từ Gốc & Lớp Cảnh Báo AI
            </h2>
          </div>
          
          <div className="flex-1 p-6 overflow-y-auto bg-black/40 flex justify-center items-start">
            {/* Relative container for the image + bounding box */}
            <div className="relative inline-block border border-white/20 rounded-xl overflow-hidden shadow-2xl bg-white">
              <img 
                src={mockInvoiceImage} 
                alt="Invoice Mockup" 
                className="max-w-full h-auto object-contain opacity-90"
                style={{ maxHeight: '700px' }}
              />
              
              {/* DYNAMIC BOUNDING BOX OVERLAY */}
              <div 
                className="absolute border-2 border-red-500 animate-pulse bg-red-500/10 cursor-help"
                style={{ top: '65%', left: '55%', width: '35%', height: '8%' }}
              >
                {/* Floating Tag */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded shadow-lg whitespace-nowrap flex items-center gap-2">
                  <span>🔴 Vùng Nghi Vấn Photoshop (Độ nén Pixel bất thường)</span>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-red-600 rotate-45"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= RIGHT PANEL ================= */}
        <section className="w-1/2 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
          
          {/* A. TOP SECTION - Giao Dịch */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-4 border-b border-white/10 pb-3">
              💳 Thông Tin Yêu Cầu Giải Ngân
            </h2>
            <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
              <div>
                <p className="text-slate-400 mb-1">Mã Giao Dịch</p>
                <p className="font-mono text-white text-base">TXN-2026-9874</p>
              </div>
              <div>
                <p className="text-slate-400 mb-1">Ngày tạo lệnh</p>
                <p className="text-white text-base">Hôm nay, 15:30</p>
              </div>
              <div className="col-span-2">
                <p className="text-slate-400 mb-1">Doanh Nghiệp</p>
                <p className="text-blue-300 font-medium text-lg">Công ty Cổ phần Công nghệ SME Việt Nam</p>
              </div>
              <div className="col-span-2">
                <p className="text-slate-400 mb-1">Cán bộ thẩm định</p>
                <p className="text-white">Nguyễn Văn A <span className="text-slate-400">(Chi nhánh Đông Sài Gòn)</span></p>
              </div>
              <div className="col-span-2 mt-2 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg flex items-center gap-3">
                <span className="text-emerald-400 text-lg">🟢</span>
                <p className="text-emerald-200 font-medium">Đã xác thực sinh trắc học FaceID thành công</p>
              </div>
            </div>
          </div>

          {/* B. MIDDLE SECTION - Rủi ro AI */}
          <div className="bg-red-950/30 backdrop-blur-xl border border-red-500/30 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            {/* Background glowing effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <h2 className="text-xl font-semibold text-red-400 mb-5 flex items-center gap-2">
              🧠 Kết Luận Thẩm Định AI
            </h2>
            
            <div className="flex items-center gap-6 mb-6 bg-black/40 p-5 rounded-2xl border border-white/5">
              <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path className="text-slate-700" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-red-500" strokeDasharray="78, 100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <div className="absolute text-center">
                  <span className="text-2xl font-bold text-white">78%</span>
                </div>
              </div>
              <div>
                <p className="text-slate-300 text-sm mb-1">Tỷ lệ Rủi ro tổng hợp</p>
                <p className="text-2xl font-bold text-red-500 uppercase tracking-wide">RẤT CAO</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3 items-start bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                <span className="text-red-400 mt-0.5 shrink-0">🚫</span>
                <p className="text-red-100 text-sm leading-relaxed">
                  <strong className="text-white">Lệch Font chữ:</strong> Dòng tổng tiền có kích thước bounding box lệch baseline 4.2 pixel.
                </p>
              </div>
              <div className="flex gap-3 items-start bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                <span className="text-red-400 mt-0.5 shrink-0">🚫</span>
                <p className="text-red-100 text-sm leading-relaxed">
                  <strong className="text-white">Bất thường ELA:</strong> Mức độ phân bố pixel xung quanh số tiền bị nén khác biệt 35% so với nền giấy gốc.
                </p>
              </div>
              <div className="flex gap-3 items-start bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                <span className="text-red-400 mt-0.5 shrink-0">🚫</span>
                <p className="text-red-100 text-sm leading-relaxed">
                  <strong className="text-white">Cảnh báo trùng lặp:</strong> Mã số thuế này trùng khớp với 1 hồ sơ đang chờ duyệt tại ngân hàng đối thủ (Hệ thống Database Hashing).
                </p>
              </div>
            </div>
          </div>

          {/* C. BOTTOM SECTION - VNPT OCR */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl">
            <div 
              className="flex justify-between items-center cursor-pointer border-b border-white/10 pb-3 mb-4"
              onClick={() => setIsJsonOpen(!isJsonOpen)}
            >
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                📄 Dữ Liệu Số Hóa VNPT SmartReader
              </h2>
              <button className="text-blue-400 hover:text-blue-300 transition-colors">
                {isJsonOpen ? 'Thu gọn ▲' : 'Mở rộng ▼'}
              </button>
            </div>
            
            {isJsonOpen && (
              <div className="bg-[#1e1e1e] rounded-xl p-4 overflow-x-auto border border-white/5">
                <pre className="text-sm font-mono leading-relaxed">
                  <code className="text-pink-400">{'{'}</code>
                  <div className="pl-4">
                    {Object.entries(mockJsonData).map(([key, value]) => (
                      <div key={key}>
                        <span className="text-blue-300">"{key}"</span>
                        <span className="text-white">: </span>
                        <span className="text-emerald-300">"{value}"</span>
                        <span className="text-white">,</span>
                      </div>
                    ))}
                  </div>
                  <code className="text-pink-400">{'}'}</code>
                </pre>
              </div>
            )}
          </div>
          
        </section>
      </div>

      {/* ================= 3. BOTTOM FOOTER ACTIONS ================= */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-900/80 backdrop-blur-2xl border-t border-white/10 p-4 z-50">
        <div className="max-w-screen-2xl mx-auto flex justify-between items-center gap-4 px-6">
          
          <button className="flex-1 max-w-sm bg-red-600 hover:bg-red-700 text-white py-3.5 px-6 rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all hover:scale-[1.02] active:scale-95 flex justify-center items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            Chặn Giải Ngân
          </button>
          
          <div className="flex gap-4 flex-1 justify-end">
            <button className="bg-amber-500 hover:bg-amber-600 text-slate-900 py-3.5 px-8 rounded-xl font-bold text-base shadow-lg transition-all hover:scale-[1.02] active:scale-95">
              Yêu Cầu Bổ Sung Chứng Từ
            </button>
            
            <button 
              disabled
              className="bg-slate-700/50 text-slate-400 py-3.5 px-8 rounded-xl font-bold text-base border border-slate-600/50 cursor-not-allowed flex items-center gap-2"
              title="Cần quyền vượt cấp (Override) để duyệt"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              Phê Duyệt Nhanh
            </button>
          </div>
          
        </div>
      </div>
      
    </div>
  );
}
