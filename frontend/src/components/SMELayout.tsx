import React from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LockIcon from '@mui/icons-material/Lock';
import HelpIcon from '@mui/icons-material/Help';
import ShieldIcon from '@mui/icons-material/Shield';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

const SMELayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const getNavClass = (targetPath: string) => {
    const isActive = path === targetPath;
    return `flex items-center gap-3 px-4 py-3 rounded-xl transition-all mt-1 ${
      isActive
        ? 'bg-[#6345ed] text-white font-medium shadow-[0_4px_12px_rgba(99,69,237,0.3)]'
        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
    }`;
  };

  return (
    <div className="flex h-screen bg-white font-sans text-gray-800 overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-[260px] bg-white border-r border-gray-100 flex flex-col shrink-0 z-10 shadow-[2px_0_8px_rgba(0,0,0,0.02)] justify-between">
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

          <div className="flex-1 px-4 py-6 overflow-y-auto">
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/sme/portal'); }} className={getNavClass('/sme/portal')}>
              <AccountBalanceWalletIcon fontSize="small" className="shrink-0" />
              <span className="whitespace-nowrap">Cổng Doanh Nghiệp</span>
            </a>
            
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/sme/history'); }} className={getNavClass('/sme/history')}>
              <AnalyticsIcon fontSize="small" className="shrink-0" /> 
              <span className="whitespace-nowrap">Nhật kí hệ thống</span>
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/sme/settings'); }} className={getNavClass('/sme/settings')}>
              <SettingsIcon fontSize="small" className="shrink-0" /> 
              <span className="whitespace-nowrap">Cài đặt</span>
            </a>
          </div>
        </div>

        <div className="p-4 border-t border-gray-50 flex flex-col gap-1">
          <button className="flex items-center gap-3 w-full px-4 py-2.5 bg-red-50 text-red-600 rounded-xl font-medium border border-red-100 hover:bg-red-100 transition-colors mb-2">
            <LockIcon fontSize="small" className="shrink-0" /> 
            <span className="whitespace-nowrap">Khóa Khẩn Cấp</span>
          </button>
          <a href="#" className="flex items-center gap-3 text-gray-600 hover:text-gray-900 px-4 py-2 transition-colors text-[15px] font-medium">
            <HelpIcon fontSize="small" className="shrink-0" /> 
            <span className="whitespace-nowrap">Hỗ trợ kỹ thuật</span>
          </a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }} className="flex items-center gap-3 text-gray-600 hover:text-gray-900 px-4 py-2 transition-colors text-[15px] font-medium">
            <LogoutIcon fontSize="small" className="shrink-0" /> 
            <span className="whitespace-nowrap">Đăng Xuất</span>
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

export default SMELayout;
