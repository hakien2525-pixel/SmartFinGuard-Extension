import React from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import ShieldIcon from '@mui/icons-material/Shield';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SecurityIcon from '@mui/icons-material/Security';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SettingsIcon from '@mui/icons-material/Settings';
import LockIcon from '@mui/icons-material/Lock';
import HelpIcon from '@mui/icons-material/Help';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

const UserManagementPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#f8fafc]">
        
        {/* HEADER */}
        <header className="h-[72px] bg-white border-b border-gray-100 flex items-center justify-between px-4 shrink-0 shadow-sm">
          <h2 className="text-xl font-bold text-[#0d2a63]">Quản lý người dùng</h2>
          
          <div className="flex items-center gap-4">
            <button 
              className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 shadow-sm relative"
            >
              <NotificationsNoneIcon fontSize="small" />
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="w-10 h-10 rounded-full bg-[#0d2a63] text-white flex items-center justify-center font-bold shadow-sm cursor-pointer ml-2 border-2 border-white">
              QT
            </div>
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-auto px-3 py-4 custom-scrollbar">
          <div className="mb-6">
            <h3 className="text-3xl font-bold text-gray-900 mb-2">Danh sách User</h3>
            <p className="text-[15px] text-gray-500">Quản lý phân quyền và trạng thái hoạt động của nhân viên.</p>
          </div>
          <div className="bg-white rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <h4 className="text-lg font-bold text-gray-900">Người dùng hệ thống</h4>
            </div>
            <div className="overflow-x-auto p-4">
               Table of users
            </div>
          </div>
        </div>
      </div>
  );
};

export default UserManagementPage;
