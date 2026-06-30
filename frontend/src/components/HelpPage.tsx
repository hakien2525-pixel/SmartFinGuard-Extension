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
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';

const HelpPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#f8fafc]">
        
        {/* HEADER */}
        <header className="h-[72px] bg-white border-b border-gray-100 flex items-center justify-between px-4 shrink-0 shadow-sm">
          <h2 className="text-xl font-bold text-[#0d2a63]">Trung tâm hỗ trợ</h2>
          
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
        <div className="flex-1 overflow-auto px-3 py-4 custom-scrollbar">
          <div className="mb-6">
            <h3 className="text-3xl font-bold text-gray-900 mb-2">Bạn cần hỗ trợ gì?</h3>
            <p className="text-[15px] text-gray-500">Tài liệu hướng dẫn sử dụng và hỗ trợ kỹ thuật.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col items-start hover:border-blue-200 cursor-pointer transition-colors">
              <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center mb-4">
                <MenuBookIcon />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Tài liệu HDSD (Wiki)</h4>
              <p className="text-gray-500 text-[15px] mb-4">Xem hướng dẫn cấu hình hệ thống, thiết lập API và giải quyết sự cố phổ biến.</p>
              <button className="mt-auto text-[#6345ed] font-bold text-sm hover:underline">Đọc tài liệu →</button>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col items-start hover:border-blue-200 cursor-pointer transition-colors">
              <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-lg flex items-center justify-center mb-4">
                <ContactSupportIcon />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Gửi Ticket Hỗ Trợ</h4>
              <p className="text-gray-500 text-[15px] mb-4">Gặp lỗi kỹ thuật? Hãy liên hệ với đội ngũ Support qua hệ thống ticket 24/7.</p>
              <button className="mt-auto text-[#6345ed] font-bold text-sm hover:underline">Tạo Ticket →</button>
            </div>
          </div>
        </div>
      </div>
  );
};

export default HelpPage;
