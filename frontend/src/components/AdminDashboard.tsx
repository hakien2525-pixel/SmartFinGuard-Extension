import React from 'react';
import { IconButton } from '@mui/material';
import ShieldIcon from '@mui/icons-material/Shield';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';
import SettingsIcon from '@mui/icons-material/Settings';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CircularProgress from '@mui/material/CircularProgress';
import TimelineIcon from '@mui/icons-material/Timeline';
import { useNavigate } from 'react-router-dom';
import DualPanelAuditScreen from './DualPanelAuditScreen';
import { useState } from 'react';

const AdminDashboard = ({ stats, documents, onSelectDoc, onUpload, isScanning }) => {
  const navigate = useNavigate();
  const [activeDoc, setActiveDoc] = useState(null);
  const displayStats = {
    total: stats?.total || 142,
    valid: stats?.valid || 98,
    pending: stats?.pending || 35,
    fraud: stats?.fraud || 9
  };

  const displayDocs = (documents && documents.length > 0) ? documents : [
    { id: 'DOC-9123', fileName: 'Công ty TNHH ABC', timestamp: '10:30 - 29/06', amount: '1,250,000 VND', risk: 12, status: 'Đã duyệt' },
    { id: 'DOC-4482', fileName: 'Tập đoàn XYZ', timestamp: '10:45 - 29/06', amount: '500,000,000 VND', risk: 65, status: 'Chờ duyệt' },
    { id: 'DOC-7711', fileName: 'Hộ KD Cửa Hàng Xanh', timestamp: '11:15 - 29/06', amount: '45,000,000 VND', risk: 95, status: 'Đã chặn' },
  ];

  const fileInputRef = React.useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
      // Mock opening the uploaded document immediately
      setActiveDoc({
        id: 'DOC-NEW-' + Math.floor(Math.random() * 1000),
        fileName: e.target.files[0].name,
        timestamp: 'Vừa xong',
        amount: 'Đang trích xuất...',
        risk: 0,
        status: 'Đang xử lý'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans">
      
      {/* Outer wrapper expanded to full screen for maximum space */}
      <div className="w-full h-screen bg-[#eef5fd] flex overflow-hidden shadow-2xl">
        
        {/* Dark Expanded Sidebar */}
        <div className="w-[260px] bg-[#0b1120] flex flex-col pt-6 pb-6 text-gray-300 flex-shrink-0">
          
          {/* Logo Area */}
          <div className="flex items-center gap-3 px-6 pb-6 border-b border-gray-800">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              SG
            </div>
            <span className="text-white font-bold text-lg tracking-wide">SmartFin-Guard</span>
          </div>
          
          {/* Navigation Links */}
          <div className="flex flex-col gap-2 mt-6 px-4 flex-1">
            <div className="flex items-center gap-3 bg-[#172554] text-blue-400 px-4 py-3 rounded-lg cursor-pointer">
              <DashboardIcon fontSize="small" />
              <span className="font-semibold text-sm">Tổng quan (Dashboard)</span>
            </div>
            <div 
              onClick={() => navigate('/audit-screen')}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 hover:text-white cursor-pointer transition-colors"
            >
              <DescriptionIcon fontSize="small" />
              <span className="font-medium text-sm">Rà soát chi tiết</span>
            </div>
            <div 
              onClick={() => navigate('/history')}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 hover:text-white cursor-pointer transition-colors"
            >
              <TimelineIcon fontSize="small" />
              <span className="font-medium text-sm">Nhật ký hệ thống</span>
            </div>
          </div>

          {/* Bottom Settings */}
          <div className="px-4 pt-4 border-t border-gray-800 mt-auto">
            <div 
              onClick={() => navigate('/settings')}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 hover:text-white cursor-pointer transition-colors"
            >
              <SettingsIcon fontSize="small" />
              <span className="font-medium text-sm">Cài đặt hệ thống</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col p-10 pr-12">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-[32px] font-extrabold text-[#0f172a] tracking-tight">SmartFin-Guard Dashboard</h1>
              <p className="text-[#64748b] text-base mt-1">Chào mừng trở lại, Cán bộ tín dụng!</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Tìm kiếm mã hồ sơ..." 
                  className="pl-5 pr-12 py-3 bg-white rounded-full w-72 text-sm shadow-sm outline-none border border-transparent focus:border-blue-300 font-medium text-gray-700"
                />
                <SearchIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" fontSize="small"/>
              </div>
              <input type="file" accept="image/*,application/pdf" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isScanning}
                className="bg-[#1a65d8] hover:bg-blue-700 text-white px-5 py-3 rounded-full text-sm font-bold shadow-md shadow-blue-200 transition-colors flex items-center gap-2 disabled:bg-blue-400"
              >
                {isScanning ? <CircularProgress size={18} sx={{ color: 'white' }} /> : <CloudUploadIcon fontSize="small" />}
                Tải lên Hồ sơ
              </button>
            </div>
          </div>

          {/* Top Cards Row */}
          <div className="grid grid-cols-4 gap-6 mb-10">
            
            {/* Blue Card */}
            <div className="bg-[#1a65d8] rounded-3xl p-6 text-white shadow-lg shadow-blue-200 flex flex-col justify-between h-44">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg">Tổng Hồ Sơ</span>
                <TrendingUpIcon fontSize="small" className="text-white/80" />
              </div>
              <h2 className="text-6xl font-bold tracking-tight text-center mt-2">{displayStats.total}</h2>
              <p className="text-sm text-blue-100 text-left mt-2">+12% so với hôm qua</p>
            </div>

            {/* Green Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm flex flex-col justify-between h-44 border border-white">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg text-green-500">Hồ Sơ Xanh</span>
                <div className="bg-green-500 rounded-full p-1"><CheckCircleIcon fontSize="small" className="text-white" /></div>
              </div>
              <h2 className="text-6xl font-bold text-[#0f172a] text-center mt-2">{displayStats.valid}</h2>
              <p className="text-sm text-gray-400 text-left mt-2">Tỷ lệ Auto-approve: 69%</p>
            </div>

            {/* Yellow Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm flex flex-col justify-between h-44 border border-white">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg text-amber-500">Hồ Sơ Vàng</span>
                <WarningIcon fontSize="small" className="text-amber-500" />
              </div>
              <h2 className="text-6xl font-bold text-[#0f172a] text-center mt-2">{displayStats.pending}</h2>
              <p className="text-sm text-gray-400 text-left mt-2">Cần chuyên viên rà soát</p>
            </div>

            {/* Red Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm flex flex-col justify-between h-44 border border-white">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg text-red-500">Hồ Sơ Đỏ</span>
                <ErrorIcon fontSize="small" className="text-red-500" />
              </div>
              <h2 className="text-6xl font-bold text-[#0f172a] text-center mt-2">{displayStats.fraud}</h2>
              <p className="text-sm text-gray-400 text-left mt-2">Chặn gian lận</p>
            </div>
          </div>

          {/* Bottom Split Section */}
          <div className="flex gap-8 flex-1 overflow-hidden mt-6">
            
            {activeDoc ? (
              <DualPanelAuditScreen 
                inline={true} 
                document={activeDoc} 
                onClose={() => setActiveDoc(null)} 
              />
            ) : (
              <>
                {/* Traffic Light Queue */}
                <div className="flex-[7] flex flex-col bg-[#eef5fd] rounded-3xl">
                  <h3 className="text-xl font-bold text-[#0f172a] mb-5">Hàng Đợi Ưu Tiên (Traffic Light Queue)</h3>
                  
                  <div className="flex-1 overflow-y-auto pr-3 pb-6 space-y-4 custom-scrollbar">
                    {displayDocs.map((doc, idx) => {
                      let statusColor = "bg-gray-400";
                      let badgeColor = "bg-gray-500";
                      
                      if (doc.status === 'Đã duyệt') {
                        statusColor = "bg-[#10b981]";
                        badgeColor = "bg-[#10b981]";
                      } else if (doc.status === 'Chờ duyệt') {
                        statusColor = "bg-[#f59e0b]";
                        badgeColor = "bg-[#f59e0b]";
                      } else if (doc.status === 'Đã chặn' || doc.status === 'Cảnh báo') {
                        statusColor = "bg-[#ef4444]";
                        badgeColor = "bg-[#ef4444]";
                      }

                      const amount = doc.amount || (idx === 0 ? '1,250,000 VND' : idx === 1 ? '500,000,000 VND' : '45,000,000 VND');
                      const risk = doc.risk !== undefined ? doc.risk : (doc.fraudScore || 0);
                      const title = doc.fileName || doc.id;
                      const timeStr = doc.timestamp || `10:${30 + idx} - 29/06`;

                      return (
                        <div 
                          key={doc.id || idx} 
                          onClick={() => setActiveDoc(doc)}
                          className="flex bg-white rounded-2xl shadow-sm hover:shadow-md cursor-pointer transition-all items-center p-5 relative border border-transparent hover:border-blue-100"
                        >
                          {/* Floating pill colored bar instead of full border */}
                          <div className={`absolute left-5 w-2 h-12 rounded-full ${statusColor}`}></div>
                          
                          {/* Document Info */}
                          <div className="flex-1 pl-8">
                            <h4 className="font-bold text-[#0f172a] text-lg">{title}</h4>
                            <p className="text-sm text-gray-400 mt-1">Mã HS: {doc.id} • {timeStr}</p>
                          </div>

                          {/* Financial & Risk */}
                          <div className="text-right flex flex-col items-end mr-4">
                            <span className="font-bold text-[#1a65d8] text-lg">{amount}</span>
                            <span className={`text-xs font-bold px-3 py-1 rounded-full mt-2 text-white shadow-sm ${badgeColor}`}>
                              Risk Score: {risk}%
                            </span>
                          </div>
                          
                          {/* Arrow */}
                          <ChevronRightIcon className="text-gray-400" />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* VNPT SmartUX Panel */}
                <div className="flex-[3] bg-white rounded-3xl shadow-sm p-8 flex flex-col border border-white">
                  <h3 className="text-xl font-bold text-[#0f172a] mb-2">VNPT SmartUX Metrics</h3>
                  <p className="text-sm text-gray-400 mb-8">Thống kê hiệu suất tự động hóa</p>
                  
                  <div className="space-y-8 mt-2">
                    <div>
                      <p className="text-base text-gray-500 mb-2 font-medium">Thời gian xử lý 1 hồ sơ</p>
                      <div className="flex items-end gap-3">
                        <span className="text-5xl font-extrabold text-[#1a65d8]">1.2s</span>
                        <span className="text-sm font-bold text-green-500 mb-1 flex items-center bg-green-50 px-2 py-0.5 rounded">(▼ 98%)</span>
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t border-gray-100">
                      <p className="text-base text-gray-500 mb-2 font-medium">Độ chính xác SmartReader OCR</p>
                      <div className="flex items-end gap-3">
                        <span className="text-5xl font-extrabold text-[#1a65d8]">99.8%</span>
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t border-gray-100 mt-auto">
                      <p className="text-sm text-gray-500 mb-3 font-medium">Trạng thái hệ thống</p>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-sm shadow-green-200"></div>
                        <span className="text-base font-semibold text-[#0f172a]">Tất cả API đang hoạt động</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1; 
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8; 
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
