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
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import GppBadIcon from '@mui/icons-material/GppBad';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';

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
    <div className="flex min-h-screen bg-[#f4f7fb] font-sans text-gray-800">
      
      {/* SIDEBAR */}
      <aside className="w-[260px] bg-white flex flex-col justify-between py-6 px-4 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-10 h-10 bg-[#0d2a63] rounded-lg flex items-center justify-center text-white font-bold text-xl">
              N
            </div>
            <div>
              <h1 className="font-bold text-base leading-tight">Nexus</h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Enterprise Banking</p>
            </div>
          </div>

          {/* Menu */}
          <nav className="flex flex-col gap-1">
            <a href="#" className="flex items-center gap-3 bg-[#6345ed] text-white px-4 py-3 rounded-xl font-medium shadow-[0_4px_12px_rgba(99,69,237,0.3)]">
              <DashboardIcon fontSize="small" /> Bảng Điều Khiển
            </a>
            <a href="#" className="flex items-center gap-3 text-gray-500 hover:bg-gray-50 hover:text-gray-900 px-4 py-3 rounded-xl transition-colors">
              <SecurityIcon fontSize="small" /> Bảo Mật & Thẩm Định
            </a>
            <a href="#" className="flex items-center gap-3 text-gray-500 hover:bg-gray-50 hover:text-gray-900 px-4 py-3 rounded-xl transition-colors">
              <AnalyticsIcon fontSize="small" /> Phân Tích
            </a>
            <a href="#" className="flex items-center gap-3 text-gray-500 hover:bg-gray-50 hover:text-gray-900 px-4 py-3 rounded-xl transition-colors">
              <SmartButtonIcon fontSize="small" /> Tự Động Hóa
            </a>
            <a href="#" className="flex items-center gap-3 text-gray-500 hover:bg-gray-50 hover:text-gray-900 px-4 py-3 rounded-xl transition-colors">
              <SettingsIcon fontSize="small" /> Cài Đặt
            </a>
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col gap-2">
          <button className="flex items-center justify-center gap-2 w-full py-2.5 bg-red-50 text-red-600 rounded-xl font-medium border border-red-100 hover:bg-red-100 transition-colors mb-2">
            <LockIcon fontSize="small" /> Khóa Khẩn Cấp
          </button>
          <a href="#" className="flex items-center gap-3 text-gray-500 hover:text-gray-900 px-4 py-2 transition-colors text-sm">
            <HelpIcon fontSize="small" /> Trợ Giúp
          </a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }} className="flex items-center gap-3 text-gray-500 hover:text-gray-900 px-4 py-2 transition-colors text-sm">
            <LogoutIcon fontSize="small" /> Đăng Xuất
          </a>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* TOPBAR */}
        <header className="h-[72px] bg-[#f4f7fb] flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-8">
            <h2 className="text-xl font-bold text-[#0d2a63]">Bảng Điều Khiển Quản Trị</h2>
            <div className="flex gap-6 text-sm font-medium">
              {['Tổng Quan', 'Thông Tin Gian Lận', 'Thị Trường'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative pb-1 transition-colors ${activeTab === tab ? 'text-[#0d2a63]' : 'text-gray-500 hover:text-gray-800'}`}
                >
                  {tab}
                  {activeTab === tab && (
                    <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#6345ed] rounded-t-full"></span>
                  )}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-5">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fontSize="small" />
              <input 
                type="text" 
                placeholder="Tìm kiếm tài khoản, mã..." 
                className="pl-10 pr-4 py-2 bg-white rounded-full border border-gray-200 text-sm w-[240px] focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm"
              />
            </div>
            <button className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 shadow-sm relative">
              <NotificationsNoneIcon fontSize="small" />
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white"></span>
            </button>
            <button className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[#6345ed] hover:bg-purple-50 shadow-sm">
              <AutoAwesomeIcon fontSize="small" />
            </button>
            <div className="w-10 h-10 rounded-full bg-[#0d2a63] text-white flex items-center justify-center font-bold shadow-sm cursor-pointer border-2 border-white">
              QT
            </div>
          </div>
        </header>

        {/* DASHBOARD CONTENT */}
        <div className="flex-1 overflow-y-auto p-8 pt-4 custom-scrollbar">
          
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-1">Tổng Quan Hàng Đợi</h3>
            <p className="text-gray-500 text-sm">Chỉ số xử lý theo thời gian thực và danh sách hồ sơ cần tác vụ.</p>
          </div>

          {/* KPI CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Card 1 */}
            <div className="bg-white p-6 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col justify-between h-[140px]">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
                  <DescriptionIcon fontSize="small" />
                </div>
                <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-full border border-gray-100">Hôm Nay</span>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Tổng Số Hồ Sơ</p>
                <h4 className="text-3xl font-bold text-gray-900">1,248</h4>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-6 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col justify-between h-[140px]">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 bg-green-50 text-green-500 rounded-xl flex items-center justify-center border border-green-100">
                  <CheckCircleOutlineIcon fontSize="small" />
                </div>
                <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
                  12%
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Tự Động Duyệt (Hồ Sơ Xanh)</p>
                <h4 className="text-3xl font-bold text-gray-900">892</h4>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-6 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col justify-between h-[140px]">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 bg-yellow-50 text-yellow-500 rounded-xl flex items-center justify-center border border-yellow-100">
                  <WarningAmberIcon fontSize="small" />
                </div>
                <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-full border border-gray-100">Chờ Xử Lý</span>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Chờ Duyệt (Hồ Sơ Vàng)</p>
                <h4 className="text-3xl font-bold text-gray-900">315</h4>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white p-6 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col justify-between h-[140px]">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center border border-red-100">
                  <GppBadIcon fontSize="small" />
                </div>
                <span className="text-xs font-bold text-red-500 flex items-center gap-1">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M7 7L17 17M17 17H7M17 17V7"/></svg>
                  3%
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Gian Lận Bị Chặn (Hồ Sơ Đỏ)</p>
                <h4 className="text-3xl font-bold text-gray-900">41</h4>
              </div>
            </div>
          </div>

          {/* TABLE SECTION */}
          <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h4 className="text-lg font-bold text-gray-900">Danh Sách Phân Loại</h4>
                <p className="text-xs text-gray-500 mt-1">Sắp xếp theo Điểm Rủi Ro (Ưu tiên từ cao xuống thấp)</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                <FilterAltOutlinedIcon fontSize="small" /> Lọc
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-semibold text-gray-400">Mã Hồ Sơ</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-400">Người Nộp</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-400">Loại Sản Phẩm</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-400">Thời Gian Chờ</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-400">Điểm Rủi Ro</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 text-right">Thao Tác</th>
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
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">{doc.id || `APP-982${idx}`}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0">
                              {idx % 2 === 0 ? 'JW' : 'EL'}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900">{idx % 2 === 0 ? 'James Wilson' : 'Elena Larson'}</p>
                              <p className="text-xs text-gray-500">{idx % 2 === 0 ? 'Tài Khoản DN' : 'Cá Nhân'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{idx === 0 ? 'Hạn Mức Tín Dụng' : idx === 1 ? 'Vay Cá Nhân' : 'TK Khách Hàng'}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{doc.timestamp || '45 phút'}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${riskColor}`}></div>
                            <span className={`text-sm font-bold ${riskTextColor}`}>{riskScore} ({riskLabel})</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${btnClass}`}
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
      </main>
    </div>
  );
};

export default AdminDashboard;
