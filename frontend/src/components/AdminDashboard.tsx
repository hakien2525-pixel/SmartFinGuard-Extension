import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DualPanelAuditScreen from './DualPanelAuditScreen';
import LogoutIcon from '@mui/icons-material/Logout';
import ShieldIcon from '@mui/icons-material/Shield';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SecurityIcon from '@mui/icons-material/Security';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SmartButtonIcon from '@mui/icons-material/SmartButton';
import SettingsIcon from '@mui/icons-material/Settings';
import LockIcon from '@mui/icons-material/Lock';
import HelpIcon from '@mui/icons-material/Help';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import BlockIcon from '@mui/icons-material/Block';
import FilterListIcon from '@mui/icons-material/FilterList';

const AdminDashboard = ({ stats, documents, onSelectDoc, onUpload, isScanning }) => {
  const navigate = useNavigate();
  const [activeDoc, setActiveDoc] = useState(null);
  const [activeTab, setActiveTab] = useState('Tổng Quan');

  if (activeDoc) {
    return (
      <div className="flex min-h-screen bg-[#f4f7fb]">
        <DualPanelAuditScreen 
          document={activeDoc} 
          onClose={() => setActiveDoc(null)} 
          inline={true}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* TOPBAR */}
        <header className="h-[72px] bg-white flex items-center justify-between px-4 shrink-0 border-b border-gray-100 gap-6">
          
          <div className="flex items-center gap-6 text-[15px] font-medium whitespace-nowrap">
            {['Tổng Quan', 'Thông Tin Gian Lận', 'Thị Trường'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-1 py-4 relative text-sm ${activeTab === tab ? 'text-[#6345ed] font-bold' : 'text-gray-500 hover:text-gray-900'}`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6345ed] rounded-t-full"></div>
                )}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-4 shrink-0">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fontSize="small" />
              <input 
                type="text" 
                placeholder="Tìm kiếm tài khoản, mã..." 
                className="pl-10 pr-4 py-2 bg-white rounded-full border border-gray-200 text-[15px] w-[240px] focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm"
              />
            </div>
            <button 
              className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 shadow-sm relative"
              style={{ borderRadius: '50%' }}
            >
              <NotificationsNoneIcon fontSize="small" />
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div 
              className="w-10 h-10 rounded-full bg-[#0d2a63] text-white flex items-center justify-center font-bold shadow-sm cursor-pointer border-2 border-white"
              style={{ borderRadius: '50%' }}
            >
              QT
            </div>
          </div>
        </header>

        {/* DASHBOARD CONTENT */}
        <div className="flex-1 overflow-y-auto px-3 py-4 custom-scrollbar">
          <div className="w-full">
            {/* Header section with title and date picker */}
            <div className="mb-5">
              <h3 className="text-2xl font-bold text-gray-900 mb-1">Tổng Quan Hàng Đợi</h3>
              <p className="text-gray-500 text-[15px]">Chỉ số xử lý theo thời gian thực và danh sách hồ sơ cần tác vụ.</p>
            </div>
          </div>

          {/* KPI CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-5">
            {/* Card 1: Tổng Số Hồ Sơ (Cyan) */}
            <div className="bg-[#f0f8fd] px-5 py-4 rounded-lg border border-[#e0f1fa] flex items-center gap-4">
              <div className="w-12 h-12 bg-[#0ea5e9] text-white rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                <DescriptionIcon />
              </div>
              <div className="flex flex-col overflow-hidden">
                <p className="text-[20px] text-gray-800 font-bold whitespace-nowrap truncate">Tổng Số Hồ Sơ</p>
                <h4 className="text-[24px] font-bold text-gray-900 leading-tight mt-1">1,248</h4>
                <p className="text-[11px] font-semibold text-[#0ea5e9] mt-0.5 whitespace-nowrap truncate">+5% so với hôm qua</p>
              </div>
            </div>

            {/* Card 2: Tự Động Duyệt (Green) */}
            <div className="bg-[#f0f9f4] px-5 py-4 rounded-lg border border-[#dcf0e5] flex items-center gap-4">
              <div className="w-12 h-12 bg-[#22c55e] text-white rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                <CheckCircleIcon />
              </div>
              <div className="flex flex-col overflow-hidden">
                <p className="text-[20px] text-gray-800 font-bold whitespace-nowrap truncate">Tự Động Duyệt</p>
                <h4 className="text-[24px] font-bold text-gray-900 leading-tight mt-1">892</h4>
                <p className="text-[11px] font-semibold text-[#22c55e] mt-0.5 whitespace-nowrap truncate">+12% so với tháng trước</p>
              </div>
            </div>

            {/* Card 3: Chờ Duyệt (Yellow) */}
            <div className="bg-[#fffbf0] px-5 py-4 rounded-lg border border-[#fef1cc] flex items-center gap-4">
              <div className="w-12 h-12 bg-[#f59e0b] text-white rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                <WarningIcon />
              </div>
              <div className="flex flex-col overflow-hidden">
                <p className="text-[20px] text-gray-800 font-bold whitespace-nowrap truncate">Hồ Sơ Chờ Duyệt</p>
                <h4 className="text-[24px] font-bold text-gray-900 leading-tight mt-1">315</h4>
                <p className="text-[11px] font-semibold text-[#f59e0b] mt-0.5 whitespace-nowrap truncate">Cần xử lý trong ngày</p>
              </div>
            </div>

            {/* Card 4: Gian Lận Bị Chặn (Red) */}
            <div className="bg-[#fdf4f2] px-5 py-4 rounded-lg border border-[#fce9e6] flex items-center gap-4">
              <div className="w-12 h-12 bg-[#e66c54] text-white rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                <BlockIcon />
              </div>
              <div className="flex flex-col overflow-hidden">
                <p className="text-[20px] text-gray-800 font-bold whitespace-nowrap truncate">Gian Lận Bị Chặn</p>
                <h4 className="text-[24px] font-bold text-gray-900 leading-tight mt-1">41</h4>
                <p className="text-[11px] font-semibold text-[#e66c54] mt-0.5 whitespace-nowrap truncate">-3% so với tháng trước</p>
              </div>
            </div>
          </div>

          {/* TABLE SECTION */}
          <div className="bg-white rounded-lg shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h4 className="text-lg font-bold text-gray-900">Danh Sách Phân Loại</h4>
                <p className="text-sm text-gray-500 mt-1">Sắp xếp theo Điểm Rủi Ro (Ưu tiên từ cao xuống thấp)</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-[15px] font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                <FilterListIcon fontSize="small" /> Lọc
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-4 py-4 text-sm font-semibold text-gray-400 whitespace-nowrap">Mã Hồ Sơ</th>
                    <th className="px-4 py-4 text-sm font-semibold text-gray-400 whitespace-nowrap">Người Nộp</th>
                    <th className="px-4 py-4 text-sm font-semibold text-gray-400 whitespace-nowrap">Loại Sản Phẩm</th>
                    <th className="px-4 py-4 text-sm font-semibold text-gray-400 whitespace-nowrap">Thời Gian Chờ</th>
                    <th className="px-4 py-4 text-sm font-semibold text-gray-400 whitespace-nowrap">Điểm Rủi Ro</th>
                    <th className="px-4 py-4 text-sm font-semibold text-gray-400 text-right whitespace-nowrap">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {/* Fixed Rows for Demo mimicking the screenshot exactly if needed, but we'll use dynamic if passed, else fallback */}
                  {documents && documents.length > 0 ? documents.map((doc, idx) => {
                    
                    // Determine risk level based on status/id for demo purposes
                    let riskScore = 12;
                    let riskLabel = 'Thấp';
                    let riskColor = 'bg-green-500';
                    let riskTextColor = 'text-green-600';
                    let btnClass = 'border border-gray-200 text-gray-700 bg-white hover:bg-gray-50';

                    if (doc.status === 'Đã chặn' || idx === 0) {
                      riskScore = 92;
                      riskLabel = 'Nguy Kịch';
                      riskColor = 'bg-red-500';
                      riskTextColor = 'text-red-600';
                      btnClass = 'bg-[#0d2a63] text-white border border-[#0d2a63] hover:bg-blue-900';
                    } else if (doc.status === 'Cảnh báo' || idx === 1) {
                      riskScore = 65;
                      riskLabel = 'Cao';
                      riskColor = 'bg-yellow-500';
                      riskTextColor = 'text-yellow-600';
                    } else if (idx === 2) {
                      riskScore = 58;
                      riskLabel = 'Cao';
                      riskColor = 'bg-yellow-500';
                      riskTextColor = 'text-yellow-600';
                    }

                    return (
                      <tr key={idx} className="hover:bg-[#fcfdff] transition-colors group cursor-pointer" onClick={() => setActiveDoc(doc)}>
                        <td className="px-4 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">{doc.id || `APP-982${idx}`}</td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0">
                              {idx % 2 === 0 ? 'JW' : 'EL'}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-semibold text-gray-900">{idx % 2 === 0 ? 'James Wilson' : 'Elena Larson'}</span>
                              <span className="text-[11px] text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded-full border border-gray-100">{idx % 2 === 0 ? 'Tài Khoản DN' : 'Cá Nhân'}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">{idx === 0 ? 'Hạn Mức Tín Dụng' : idx === 1 ? 'Vay Cá Nhân' : 'TK Khách Hàng'}</td>
                        <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">{doc.timestamp || '45 phút'}</td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${riskColor}`}></div>
                            <span className={`text-sm font-bold ${riskTextColor}`}>{riskScore} ({riskLabel})</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right whitespace-nowrap">
                          <button 
                            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${btnClass}`}
                            onClick={(e) => { e.stopPropagation(); setActiveDoc(doc); }}
                          >
                            Thẩm Định
                          </button>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr><td colSpan={6} className="text-center py-8 text-gray-500">Không có dữ liệu.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center bg-white">
              <span className="text-sm text-gray-500">Hiển thị {documents ? documents.length : 0} trên 315 hồ sơ chờ</span>
              <div className="flex gap-1">
                <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-100 text-gray-700 font-medium text-sm">1</button>
                <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-50 text-gray-600 font-medium text-sm">2</button>
                <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-50 text-gray-600 font-medium text-sm">3</button>
                <span className="w-8 h-8 flex items-center justify-center text-gray-400">...</span>
              </div>
            </div>

          </div>
        </div>
      </div>
  );
};

export default AdminDashboard;
