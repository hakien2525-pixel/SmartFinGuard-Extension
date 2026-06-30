import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SecurityIcon from '@mui/icons-material/Security';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SettingsIcon from '@mui/icons-material/Settings';
import LockIcon from '@mui/icons-material/Lock';
import HelpIcon from '@mui/icons-material/Help';
import ShieldIcon from '@mui/icons-material/Shield';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const EmergencyLockPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#f8fafc]">
        
        {/* HEADER */}
        <header className="h-[72px] bg-white border-b border-gray-100 flex items-center justify-between px-4 shrink-0 shadow-sm">
          <h2 className="text-xl font-bold text-[#0d2a63]">Khóa Khẩn Cấp Hệ Thống</h2>
          
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 shadow-sm relative">
              <NotificationsNoneIcon fontSize="small" />
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="w-10 h-10 rounded-full bg-[#0d2a63] text-white flex items-center justify-center font-bold shadow-sm cursor-pointer ml-2 border-2 border-white">
              QT
            </div>
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-auto px-3 py-4 custom-scrollbar flex items-center justify-center">
          <div className="bg-white rounded-lg p-10 shadow-[0_8px_30px_rgb(0,0,0,0.08)] max-w-lg w-full text-center border border-red-100">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <WarningAmberIcon sx={{ fontSize: 48 }} />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Kích Hoạt Khóa Hệ Thống?</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Thao tác này sẽ ngay lập tức khóa toàn bộ quyền truy cập hệ thống, tạm dừng tự động duyệt hồ sơ và ngắt mọi kết nối API đang hoạt động để bảo vệ dữ liệu.
            </p>
            <div className="flex gap-4">
              <button className="flex-1 py-3 px-6 rounded-lg font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors" onClick={() => navigate(-1)}>
                Hủy bỏ
              </button>
              <button className="flex-1 py-3 px-6 rounded-lg font-bold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-[0_4px_14px_rgba(220,38,38,0.3)]">
                Khóa Ngay
              </button>
            </div>
          </div>
        </div>
      </div>
  );
};

export default EmergencyLockPage;
