import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';
import SettingsIcon from '@mui/icons-material/Settings';
import TimelineIcon from '@mui/icons-material/Timeline';
import LogoutIcon from '@mui/icons-material/Logout';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import ShieldIcon from '@mui/icons-material/Shield';
import Switch from '@mui/material/Switch';

const SettingsPage = () => {
  const navigate = useNavigate();
  
  const [settings, setSettings] = useState({
    autoApprove: true,
    smartVoiceAlert: true,
    ekycStrict: false,
    aiThreshold: 75
  });

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans">
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
            <div 
              onClick={() => navigate('/admin-dashboard')}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 hover:text-white cursor-pointer transition-colors"
            >
              <DashboardIcon fontSize="small" />
              <span className="font-medium text-sm">Tổng quan (Dashboard)</span>
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
            <div className="flex items-center gap-3 bg-[#172554] text-blue-400 px-4 py-3 rounded-lg cursor-pointer">
              <SettingsIcon fontSize="small" />
              <span className="font-semibold text-sm">Cài đặt hệ thống</span>
            </div>
            <div 
              onClick={() => navigate('/login')}
              className="flex items-center gap-3 px-4 py-3 mt-1 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 cursor-pointer transition-colors"
            >
              <LogoutIcon fontSize="small" />
              <span className="font-medium text-sm">Đăng xuất</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col p-10 pr-12 overflow-y-auto custom-scrollbar">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-[32px] font-extrabold text-[#0f172a] tracking-tight">Cài đặt hệ thống</h1>
            <p className="text-[#64748b] text-base mt-1">Cấu hình API VNPT, Ngưỡng rủi ro AI & Tùy chọn tự động hóa</p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {/* Left Column: API & AI Engine */}
            <div className="space-y-8">
              {/* API Keys Card */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-white">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-blue-100 p-2 rounded-xl text-blue-600"><VpnKeyIcon /></div>
                  <h3 className="text-xl font-bold text-[#0f172a]">Cấu hình API VNPT</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">VNPT SmartReader (OCR) API Key</label>
                    <input type="password" value="************************" readOnly className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">VNPT eKYC (Face Liveness) API Key</label>
                    <input type="password" value="************************" readOnly className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-500 outline-none" />
                  </div>
                  <div className="pt-2">
                    <button className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">Kiểm tra kết nối (Ping)</button>
                  </div>
                </div>
              </div>

              {/* Automation Rules Card */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-white">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-green-100 p-2 rounded-xl text-green-600"><ShieldIcon /></div>
                  <h3 className="text-xl font-bold text-[#0f172a]">Quy tắc tự động hóa</h3>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-gray-800">Tự động duyệt (Auto-Approve)</h4>
                      <p className="text-xs text-gray-500 mt-1">Duyệt ngay nếu điểm rủi ro &lt; 20%</p>
                    </div>
                    <Switch checked={settings.autoApprove} onChange={() => handleToggle('autoApprove')} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-gray-800">Chế độ eKYC Nghiêm ngặt</h4>
                      <p className="text-xs text-gray-500 mt-1">Yêu cầu quay mặt trái/phải để chống deepfake</p>
                    </div>
                    <Switch checked={settings.ekycStrict} onChange={() => handleToggle('ekycStrict')} />
                  </div>

                  <div className="pt-2">
                    <label className="block text-sm font-bold text-gray-800 mb-2">Ngưỡng cảnh báo ĐỎ (Chặn gian lận)</label>
                    <div className="flex items-center gap-4">
                      <input type="range" min="50" max="100" value={settings.aiThreshold} onChange={(e) => setSettings({...settings, aiThreshold: e.target.value})} className="flex-1 accent-blue-600" />
                      <span className="font-bold text-red-600 bg-red-50 px-3 py-1 rounded-lg">{settings.aiThreshold}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Notifications & User */}
            <div className="space-y-8">
              {/* Alerts Card */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-white">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-amber-100 p-2 rounded-xl text-amber-600"><NotificationsActiveIcon /></div>
                  <h3 className="text-xl font-bold text-[#0f172a]">Cảnh báo Khẩn cấp</h3>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-gray-800">Gọi điện khẩn cấp (VNPT SmartVoice)</h4>
                      <p className="text-xs text-gray-500 mt-1">Tự động gọi Trưởng phòng khi có hồ sơ giả mạo tinh vi</p>
                    </div>
                    <Switch checked={settings.smartVoiceAlert} onChange={() => handleToggle('smartVoiceAlert')} color="warning" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Số điện thoại Trưởng phòng Rủi ro</label>
                    <input type="text" defaultValue="0912 345 678" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 font-medium outline-none focus:border-blue-300" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button className="px-6 py-3 rounded-full text-sm font-semibold text-gray-600 bg-white shadow-sm hover:bg-gray-50 transition-colors">Khôi phục mặc định</button>
                <button className="px-8 py-3 rounded-full text-sm font-bold text-white bg-[#1a65d8] shadow-md hover:bg-blue-700 transition-colors">Lưu Cài Đặt</button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
