import React from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SecurityIcon from '@mui/icons-material/Security';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SettingsIcon from '@mui/icons-material/Settings';
import LockIcon from '@mui/icons-material/Lock';
import HelpIcon from '@mui/icons-material/Help';
import ShieldIcon from '@mui/icons-material/Shield';
import LogoutIcon from '@mui/icons-material/Logout';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const getNavClass = (targetPath: string) => {
    const isActive = path === targetPath;
    return `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
      isActive
        ? 'bg-[#6345ed] text-white font-medium shadow-[0_4px_12px_rgba(99,69,237,0.3)]'
        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
    }`;
  };

  return (
    <div className="flex h-screen font-sans text-gray-800 overflow-hidden bg-[#f4f7fb]">
      {/* SIDEBAR */}
      <aside className="w-[260px] bg-white border-r border-gray-100 flex flex-col shrink-0 z-10 shadow-[2px_0_8px_rgba(0,0,0,0.02)] justify-between pb-6">
        <div>
          <div className="h-[72px] flex items-center gap-3 border-b border-gray-100 px-6 shrink-0">
            <div className="w-10 h-10 flex items-center justify-center shrink-0 rounded-lg bg-gradient-to-br from-[#0d2a63] to-[#6345ed] shadow-md">
              <ShieldIcon sx={{ fontSize: 24 }} className="text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="font-bold leading-none mb-1 tracking-tight" style={{ fontSize: '35px' }}>
                <span className="text-[#0d2a63]">Smart</span>
                <span className="text-[#f97316]">Fin</span>
              </h1>
              <p className="text-[14px] text-gray-400 font-medium leading-none">Guard AI System</p>
            </div>
          </div>

          <nav className="flex flex-col gap-1 px-4 mt-6">
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin/dashboard'); }} className={getNavClass('/admin/dashboard')}>
              <DashboardIcon fontSize="small" /> Tổng quan
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin/users'); }} className={getNavClass('/admin/users')}>
              <SecurityIcon fontSize="small" /> Quản lí user
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin/history'); }} className={getNavClass('/admin/history')}>
              <AnalyticsIcon fontSize="small" /> Nhật kí hệ thống
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin/settings'); }} className={getNavClass('/admin/settings')}>
              <SettingsIcon fontSize="small" /> Cài đặt
            </a>
          </nav>
        </div>

        <div className="flex flex-col px-4 mt-auto">
          <button onClick={() => navigate('/admin/emergency-lock')} className="flex items-center gap-3 w-full px-4 py-3 bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-colors mb-2 rounded-sm border-0">
            <LockIcon fontSize="small" /> Khóa Khẩn Cấp
          </button>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin/help'); }} className="flex items-center gap-3 text-gray-600 hover:text-gray-900 px-4 py-2 transition-colors text-[15px] font-medium">
            <HelpIcon fontSize="small" /> Trợ Giúp
          </a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }} className="flex items-center gap-3 text-gray-600 hover:text-gray-900 px-4 py-2 transition-colors text-[15px] font-medium">
            <LogoutIcon fontSize="small" /> Đăng Xuất
          </a>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
