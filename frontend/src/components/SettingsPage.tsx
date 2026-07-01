// @ts-nocheck
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LockIcon from '@mui/icons-material/Lock';
import HelpIcon from '@mui/icons-material/Help';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ShieldIcon from '@mui/icons-material/Shield';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SettingsIcon from '@mui/icons-material/Settings';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SecurityIcon from '@mui/icons-material/Security';
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
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#f8fafc]">
        
        {/* HEADER */}
        <header className="h-[72px] bg-white border-b border-gray-100 flex items-center justify-between px-4 shrink-0 shadow-sm">
          <h2 className="text-xl font-bold text-[#0d2a63]">Cài đặt hệ thống</h2>
          
          <div className="flex items-center gap-4">
            <button 
              className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 shadow-sm relative"
              style={{ borderRadius: '50%' }}
            >
              <NotificationsNoneIcon fontSize="small" />
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div 
              className="w-10 h-10 rounded-full bg-[#0d2a63] text-white flex items-center justify-center font-bold shadow-sm cursor-pointer ml-2 border-2 border-white"
              style={{ borderRadius: '50%' }}
            >
              JW
            </div>
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-auto px-3 py-4 custom-scrollbar">
          
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Cấu hình & Tùy chọn</h1>
            <p className="text-gray-500 text-[15px] mt-2">Quản lý API, điều chỉnh ngưỡng rủi ro AI và tự động hóa.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            {/* Left Column */}
            <div className="space-y-2">
              
              {/* API Keys Card */}
              <div className="bg-white rounded-lg p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-blue-50 p-2.5 rounded-xl text-blue-600"><VpnKeyIcon /></div>
                  <h3 className="text-xl font-bold text-gray-900">Cấu hình API VNPT</h3>
                </div>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">VNPT OCR API Key</label>
                    <input 
                      type="password" 
                      defaultValue="vnpt_sk_test_1234567890" 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#6345ed] focus:ring-1 focus:ring-[#6345ed] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mã Doanh Nghiệp (VNPT ID)</label>
                    <input 
                      type="text" 
                      defaultValue="DN-8492-VN" 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#6345ed] focus:ring-1 focus:ring-[#6345ed] transition-all"
                    />
                  </div>
                  <button className="px-6 py-2.5 bg-[#0d2a63] text-white rounded-xl font-semibold hover:bg-blue-900 transition-colors shadow-sm">
                    Lưu cấu hình API
                  </button>
                </div>
              </div>

              {/* Security Card */}
              <div className="bg-white rounded-lg p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-red-50 p-2.5 rounded-xl text-red-600"><SecurityIcon /></div>
                  <h3 className="text-xl font-bold text-gray-900">Bảo mật & Trích xuất</h3>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">Kiểm duyệt eKYC nghiêm ngặt</h4>
                      <p className="text-sm text-gray-500 mt-0.5">Bắt buộc đối chiếu khuôn mặt khi phát hiện rủi ro cao.</p>
                    </div>
                    <Switch checked={settings.ekycStrict} onChange={() => handleToggle('ekycStrict')} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">Mã hóa đầu cuối 256-bit</h4>
                      <p className="text-sm text-gray-500 mt-0.5">Dữ liệu hồ sơ luôn được mã hóa trước khi lưu trữ.</p>
                    </div>
                    <Switch checked={true} disabled />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-2">
              
              {/* AI Engine Card */}
              <div className="bg-white rounded-lg p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-purple-50 p-2.5 rounded-xl text-[#6345ed]"><AutoAwesomeIcon /></div>
                  <h3 className="text-xl font-bold text-gray-900">Engine AI VNPT & Automation</h3>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">Tự động Phê Duyệt</h4>
                      <p className="text-sm text-gray-500 mt-0.5">Duyệt ngay các hồ sơ SME nếu điểm rủi ro &lt; 20%.</p>
                    </div>
                    <Switch checked={settings.autoApprove} onChange={() => handleToggle('autoApprove')} />
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex justify-between mb-2">
                      <label className="font-semibold text-gray-900">Ngưỡng cảnh báo gian lận AI</label>
                      <span className="font-bold text-[#6345ed]">{settings.aiThreshold}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="50" max="99" 
                      value={settings.aiThreshold}
                      onChange={(e) => setSettings(prev => ({...prev, aiThreshold: parseInt(e.target.value)}))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#6345ed]"
                    />
                    <p className="text-sm text-gray-500 mt-2">Hệ thống sẽ gắn cờ đỏ "Gian lận" nếu điểm rủi ro vượt mức này.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
  );
};

export default SettingsPage;
