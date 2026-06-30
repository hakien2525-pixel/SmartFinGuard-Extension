import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import TimelineIcon from '@mui/icons-material/Timeline';
import BusinessIcon from '@mui/icons-material/Business';
import HistoryIcon from '@mui/icons-material/History';
import AddTaskIcon from '@mui/icons-material/AddTask';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const SMEPortalView = ({ documents = [], onUpload }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'upload' | 'history' | 'profile'>('upload');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0] && onUpload) {
      onUpload(e.target.files[0]);
    }
  };

  const displayDocs = documents.length > 0 ? documents : [
    { id: 'HS-2026-001', fileName: 'Hoa_don_GTGT_01.pdf', status: 'Đã duyệt', date: '30/06/2026 08:30', amount: '45,000,000 VND' },
    { id: 'HS-2026-002', fileName: 'Hop_dong_kinh_te.pdf', status: 'Chờ duyệt', date: '30/06/2026 09:15', amount: '120,000,000 VND' },
    { id: 'HS-2026-003', fileName: 'Uy_nhiem_chi_SCB.jpg', status: 'Cảnh báo', date: '30/06/2026 10:05', amount: '500,000,000 VND' },
    { id: 'HS-2026-004', fileName: 'Bao_cao_tai_chinh.pdf', status: 'Đã duyệt', date: '29/06/2026 14:20', amount: '1,500,000,000 VND' },
    { id: 'HS-2026-005', fileName: 'Giay_de_nghi_giai_ngan.pdf', status: 'Đã chặn', date: '28/06/2026 11:10', amount: '350,000,000 VND' },
  ];

  const getStatusConfig = (status) => {
    if (status === 'Đã duyệt') return { color: 'text-green-600', bg: 'bg-green-100', icon: <CheckCircleIcon fontSize="small" /> };
    if (status === 'Chờ duyệt' || status === 'Đang xử lý') return { color: 'text-amber-600', bg: 'bg-amber-100', icon: <PendingActionsIcon fontSize="small" /> };
    return { color: 'text-red-600', bg: 'bg-red-100', icon: <WarningAmberIcon fontSize="small" /> };
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans">
      
      {/* Outer Wrapper for Fullscreen Layout */}
      <div className="w-full h-screen bg-[#eef5fd] flex overflow-hidden shadow-2xl">
        
        {/* SME Sidebar (Lighter blue theme to distinguish from Admin) */}
        <div className="w-[260px] bg-[#1e3a8a] flex flex-col pt-6 pb-6 text-gray-200 flex-shrink-0 shadow-lg z-20 relative">
          
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>

          {/* Logo Area */}
          <div className="flex items-center gap-3 px-6 pb-8 border-b border-blue-800 relative z-10">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-blue-800 font-bold shadow-md">
              <BusinessIcon />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide leading-tight">SME Portal</h2>
              <span className="text-[10px] text-blue-300 font-bold uppercase tracking-wider">Cổng Doanh Nghiệp</span>
            </div>
          </div>

          {/* Nav Links */}
          <div className="flex-1 flex flex-col gap-2 px-4 mt-8 relative z-10">
            <div 
              onClick={() => setActiveTab('upload')}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl cursor-pointer transition-all font-semibold text-sm ${activeTab === 'upload' ? 'bg-white text-blue-800 shadow-md' : 'hover:bg-blue-800/50 hover:text-white'}`}
            >
              <AddTaskIcon fontSize="small" />
              <span>Nộp hồ sơ & Trạng thái</span>
            </div>
            <div 
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl cursor-pointer transition-all font-semibold text-sm ${activeTab === 'history' ? 'bg-white text-blue-800 shadow-md' : 'hover:bg-blue-800/50 hover:text-white'}`}
            >
              <HistoryIcon fontSize="small" />
              <span>Lịch sử giao dịch</span>
            </div>
            <div 
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl cursor-pointer transition-all font-semibold text-sm ${activeTab === 'profile' ? 'bg-white text-blue-800 shadow-md' : 'hover:bg-blue-800/50 hover:text-white'}`}
            >
              <AccountCircleIcon fontSize="small" />
              <span>Hồ sơ doanh nghiệp</span>
            </div>
          </div>

          {/* Logout */}
          <div className="px-4 pt-4 border-t border-blue-800 mt-auto relative z-10">
            <div 
              onClick={() => navigate('/login')}
              className="flex items-center gap-3 px-4 py-3 mt-1 rounded-xl text-red-300 hover:bg-red-500 hover:text-white cursor-pointer transition-all font-bold shadow-sm"
            >
              <LogoutIcon fontSize="small" />
              <span className="text-sm">Đăng xuất</span>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col p-8 overflow-hidden bg-gray-50/50">
          
          {/* Dynamic Top Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-[#0f172a] tracking-tight">
                {activeTab === 'upload' && 'Quản lý Hồ sơ Giải ngân'}
                {activeTab === 'history' && 'Lịch sử Nộp chứng từ'}
                {activeTab === 'profile' && 'Thông tin Doanh nghiệp'}
              </h1>
              <p className="text-gray-500 mt-1">Công ty Cổ phần Công nghệ SME Việt Nam</p>
            </div>
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-bold text-gray-700">Tài khoản: Đã xác thực (eKYC)</span>
            </div>
          </div>

          {/* ================= TAB 1: UPLOAD & STATUS ================= */}
          {activeTab === 'upload' && (
            <div className="flex gap-8 flex-1 overflow-hidden">
              
              {/* Left Column: Upload */}
              <div className="w-5/12 flex flex-col gap-6">
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col items-center justify-center border-dashed border-2 hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer relative group flex-1">
                  <input 
                    type="file" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.png"
                  />
                  <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-md">
                    <CloudUploadIcon sx={{ fontSize: 36 }} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">Tải lên chứng từ mới</h2>
                  <p className="text-gray-500 mb-8 px-6 text-center leading-relaxed">
                    Kéo thả file hợp đồng, hóa đơn GTGT, hoặc ủy nhiệm chi vào đây. AI sẽ tự động trích xuất và đẩy thẳng lên hệ thống phê duyệt của ngân hàng.
                  </p>
                  <div className="bg-blue-600 text-white font-bold py-3.5 px-10 rounded-xl shadow-lg group-hover:shadow-blue-500/40 transition-all pointer-events-none">
                    Chọn File Tải Lên
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#0f172a] to-blue-900 p-8 rounded-[2rem] shadow-lg text-white relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                  <h3 className="text-xl font-bold mb-6 relative z-10 flex items-center gap-2">
                    <TimelineIcon /> Tổng hạn mức khả dụng
                  </h3>
                  <div className="relative z-10">
                    <p className="text-5xl font-extrabold text-blue-400 drop-shadow-md">4.5 Tỷ <span className="text-xl text-blue-200">VND</span></p>
                    <p className="text-gray-400 text-sm mt-3 border-t border-white/10 pt-3 flex justify-between">
                      <span>Đã giải ngân: 1.5 Tỷ</span>
                      <span>Hạn mức tối đa: 6 Tỷ</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Status Tracking */}
              <div className="flex-1 bg-white rounded-[2rem] shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <PendingActionsIcon className="text-blue-600" />
                    Trạng thái hồ sơ đang xử lý
                  </h2>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                  {displayDocs.slice(0, 3).map((doc, idx) => {
                    const conf = getStatusConfig(doc.status);
                    return (
                      <div key={idx} className="flex flex-col p-5 rounded-2xl border border-gray-100 bg-white hover:border-blue-200 hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${conf.bg} ${conf.color}`}>
                              <ReceiptLongIcon />
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-800 text-lg group-hover:text-blue-700 transition-colors">{doc.fileName}</h4>
                              <p className="text-sm text-gray-500">Mã giao dịch: {doc.id}</p>
                            </div>
                          </div>
                          <div className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full border text-sm font-bold ${conf.color} border-current bg-white shadow-sm`}>
                            {conf.icon}
                            {doc.status}
                          </div>
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t border-gray-50 text-sm">
                          <span className="text-gray-500">Giá trị giải ngân: <strong className="text-gray-800 text-base">{doc.amount}</strong></span>
                          <span className="text-gray-400">Cập nhật: {doc.date}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 2: HISTORY ================= */}
          {activeTab === 'history' && (
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 flex flex-col flex-1 overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Tất cả giao dịch & Chứng từ</h2>
                <div className="flex gap-3">
                  <input type="text" placeholder="Tìm kiếm mã hồ sơ..." className="px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400" />
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-blue-700">Lọc</button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-sm">
                      <th className="p-4 rounded-tl-xl font-medium">Mã Hồ Sơ</th>
                      <th className="p-4 font-medium">Tên Chứng Từ</th>
                      <th className="p-4 font-medium">Thời Gian Nộp</th>
                      <th className="p-4 font-medium">Giá Trị Yêu Cầu</th>
                      <th className="p-4 rounded-tr-xl font-medium">Trạng Thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayDocs.map((doc, idx) => {
                      const conf = getStatusConfig(doc.status);
                      return (
                        <tr key={idx} className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors">
                          <td className="p-4 font-mono text-gray-600">{doc.id}</td>
                          <td className="p-4 font-bold text-gray-800">{doc.fileName}</td>
                          <td className="p-4 text-gray-500 text-sm">{doc.date}</td>
                          <td className="p-4 font-bold text-blue-700">{doc.amount}</td>
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${conf.color} ${conf.bg}`}>
                              {conf.icon} {doc.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= TAB 3: BUSINESS PROFILE ================= */}
          {activeTab === 'profile' && (
            <div className="flex-1 bg-white rounded-[2rem] shadow-sm border border-gray-100 p-10 overflow-y-auto custom-scrollbar">
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-6 mb-10 pb-8 border-b border-gray-100">
                  <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shadow-inner">
                    <BusinessIcon sx={{ fontSize: 48 }} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-extrabold text-gray-800">Công ty Cổ phần Công nghệ SME Việt Nam</h2>
                    <p className="text-gray-500 text-lg mt-1">Trạng thái: <span className="text-green-600 font-bold">Đã xác minh eKYC Doanh nghiệp</span></p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-bold text-gray-400 uppercase tracking-wider block mb-2">Mã Số Thuế</label>
                      <p className="text-xl font-semibold text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-100">0314589231</p>
                    </div>
                    <div>
                      <label className="text-sm font-bold text-gray-400 uppercase tracking-wider block mb-2">Người Đại Diện Pháp Luật</label>
                      <p className="text-xl font-semibold text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-100">Nguyễn Văn Quyết</p>
                    </div>
                    <div>
                      <label className="text-sm font-bold text-gray-400 uppercase tracking-wider block mb-2">Email Đăng Ký</label>
                      <p className="text-xl font-semibold text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-100">contact@smevietnam.vn</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-bold text-gray-400 uppercase tracking-wider block mb-2">Tài Khoản Giải Ngân</label>
                      <p className="text-xl font-semibold text-blue-700 bg-blue-50 p-3 rounded-lg border border-blue-100 font-mono">1903 5555 8888 (Techcombank)</p>
                    </div>
                    <div>
                      <label className="text-sm font-bold text-gray-400 uppercase tracking-wider block mb-2">Ngày Thành Lập</label>
                      <p className="text-xl font-semibold text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-100">15/08/2018</p>
                    </div>
                    <div>
                      <label className="text-sm font-bold text-gray-400 uppercase tracking-wider block mb-2">Địa Chỉ Trụ Sở</label>
                      <p className="text-base font-semibold text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-100">Tầng 12, Tòa nhà Bitexco, Quận 1, TP.HCM</p>
                    </div>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-gray-100 flex justify-end gap-4">
                  <button className="px-6 py-2.5 text-gray-500 font-bold hover:bg-gray-100 rounded-lg transition-colors">Đổi Mật Khẩu</button>
                  <button className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition-colors">Cập Nhật Thông Tin</button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
};

export default SMEPortalView;
