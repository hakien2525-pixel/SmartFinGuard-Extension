import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LockIcon from '@mui/icons-material/Lock';
import HelpIcon from '@mui/icons-material/Help';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import DescriptionIcon from '@mui/icons-material/Description';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ShieldIcon from '@mui/icons-material/Shield';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SettingsIcon from '@mui/icons-material/Settings';
import WarningIcon from '@mui/icons-material/Warning';
import BlockIcon from '@mui/icons-material/Block';

const SMEPortalView = ({ documents = [], onUpload }) => {
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0] && onUpload) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#f4f7fb]">
        
        {/* HEADER */}
        <header className="h-[72px] bg-white border-b border-gray-100 flex items-center justify-between px-4 shrink-0">
          <h2 className="text-xl font-bold text-[#0d2a63]">Cổng Doanh Nghiệp</h2>
          
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
          
          <div className="mb-5">
            <h3 className="text-3xl font-bold text-gray-900 mb-2">Tự Động Hóa Hóa Đơn</h3>
            <p className="text-[15px] text-gray-500">Trích xuất dữ liệu thông minh và xử lý luồng cho tài khoản SME.</p>
          </div>

          {/* STATUS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
            {/* Card 1: Tổng Số Hồ Sơ (Cyan) */}
            <div className="bg-[#f0f8fd] px-5 py-4 rounded-lg border border-[#e0f1fa] flex items-center gap-4">
              <div className="w-12 h-12 bg-[#0ea5e9] text-white rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                <DescriptionIcon />
              </div>
              <div className="flex flex-col overflow-hidden">
                <p className="text-[20px] text-gray-800 font-bold whitespace-nowrap truncate">Tổng Số Hồ Sơ</p>
                <h4 className="text-[24px] font-bold text-gray-900 leading-tight mt-1">1,248</h4>
                <p className="text-[11px] font-semibold text-[#0ea5e9] mt-0.5 whitespace-nowrap truncate">+5% hôm qua</p>
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
                <p className="text-[11px] font-semibold text-[#22c55e] mt-0.5 whitespace-nowrap truncate">+12% tháng trước</p>
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
                <p className="text-[11px] font-semibold text-[#f59e0b] mt-0.5 whitespace-nowrap truncate">Cần xử lý gấp</p>
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
                <p className="text-[11px] font-semibold text-[#e66c54] mt-0.5 whitespace-nowrap truncate">-3% tháng trước</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
            
            {/* LEFT COLUMN */}
            <div className="lg:col-span-3 flex flex-col gap-2 min-w-0">
              
              {/* UPLOAD AREA */}
              <div 
                className="bg-white rounded-lg p-10 flex flex-col items-center justify-center text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 min-h-[320px] cursor-pointer hover:border-blue-200 transition-colors"
                onClick={() => document.getElementById('smeUpload').click()}
              >
                <input 
                  id="smeUpload"
                  type="file" 
                  className="hidden" 
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.png"
                />
                
                <div className="w-20 h-20 bg-[#0d2a63] rounded-full flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-900/20">
                  <CloudUploadIcon fontSize="large" />
                </div>
                
                <h4 className="text-xl font-bold text-gray-900 mb-3">Kéo & Thả Hóa Đơn (Hoặc Click)</h4>
                <p className="text-[15px] text-gray-500 max-w-md mx-auto mb-8 leading-relaxed">
                  Tải lên tệp PDF hoặc hình ảnh. Hệ thống sẽ tự động gửi tới bộ phận quản trị để xử lý.
                </p>
                
                <button className="bg-[#0d2a63] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#0a204d] transition-colors shadow-md">
                  <FolderOpenIcon fontSize="small" /> Duyệt Tệp
                </button>
              </div>

              {/* HISTORY */}
              <div className="bg-white rounded-lg p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-lg font-bold text-gray-900">Lịch Sử Của Bạn</h4>
                  <a href="#" className="text-sm font-bold text-[#0d2a63] flex items-center gap-1 hover:underline">
                    Xem Tất Cả <ArrowForwardIcon fontSize="small" />
                  </a>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="pb-3 font-semibold text-gray-400 text-sm whitespace-nowrap">Mã Hồ Sơ</th>
                        <th className="pb-3 font-semibold text-gray-400 text-sm whitespace-nowrap">Ngày Gửi</th>
                        <th className="pb-3 font-semibold text-gray-400 text-sm whitespace-nowrap">Số Tiền Yêu Cầu</th>
                        <th className="pb-3 font-semibold text-gray-400 text-sm text-right whitespace-nowrap">Trạng Thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      <tr>
                        <td className="py-4">
                          <div className="flex items-center gap-2 text-[15px] font-bold text-[#0d2a63]">
                            <DescriptionIcon fontSize="small" className="text-gray-400" /> APP-9821
                          </div>
                        </td>
                        <td className="py-4 text-[15px] text-gray-500 whitespace-nowrap">24 Th10, 10:45 SA</td>
                        <td className="py-4 text-[15px] font-bold text-gray-900 whitespace-nowrap">$4,520.00</td>
                        <td className="py-4 text-right whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f3efff] text-[#6345ed] text-xs font-bold border border-[#e5dfff] whitespace-nowrap">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#6345ed]"></span> Đang Phân Tích
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-4">
                          <div className="flex items-center gap-2 text-[15px] font-bold text-[#0d2a63]">
                            <DescriptionIcon fontSize="small" className="text-gray-400" /> APP-9799
                          </div>
                        </td>
                        <td className="py-4 text-[15px] text-gray-500 whitespace-nowrap">23 Th10, 08:30 SA</td>
                        <td className="py-4 text-[15px] font-bold text-gray-900 whitespace-nowrap">$125.50</td>
                        <td className="py-4 text-right whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-bold border border-green-100 whitespace-nowrap">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Đã Duyệt
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN */}
            <div className="lg:col-span-1 flex flex-col gap-2">
              
              {/* SYSTEM PROGRESS */}
              <div className="bg-white rounded-lg p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100">
                <h4 className="text-lg font-bold text-gray-900 mb-6">
                  Tiến Trình Hệ Thống
                </h4>
                
                <div className="relative pl-3">
                  <div className="absolute left-[19px] top-4 bottom-8 w-[2px] bg-gray-100"></div>
                  
                  <div className="flex gap-4 mb-6 relative z-10">
                    <div className="w-8 h-8 rounded-full bg-white border-2 border-green-500 text-green-500 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                      <CheckCircleIcon fontSize="small" />
                    </div>
                    <div>
                      <h5 className="font-bold text-[15px] text-gray-900">Xác Thực Tài Khoản</h5>
                      <p className="text-sm text-gray-500 mt-1">Đã xác minh kết nối đến Cổng SME SmartFinGuard.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 mb-6 relative z-10">
                    <div className="w-8 h-8 rounded-full bg-white border-2 border-green-500 text-green-500 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                      <CheckCircleIcon fontSize="small" />
                    </div>
                    <div>
                      <h5 className="font-bold text-[15px] text-gray-900">Gửi Đến Quản Trị</h5>
                      <p className="text-sm text-gray-500 mt-1">Hồ sơ đã được mã hóa và chuyển cho nhân viên xử lý.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 relative z-10">
                    <div className="w-8 h-8 rounded-full bg-white border-2 border-[#6345ed] text-[#6345ed] flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                      <AutorenewIcon fontSize="small" className="animate-spin-slow" />
                    </div>
                    <div>
                      <h5 className="font-bold text-[15px] text-[#6345ed]">Quét Gian Lận AI</h5>
                      <p className="text-sm text-gray-500 mt-1">Đối chiếu lịch sử nhà cung cấp và thuật toán phát hiện bất thường.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* STATS */}
              <div className="bg-white rounded-lg p-6 flex items-center gap-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100">
                <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center shrink-0">
                  <DescriptionIcon />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Đã gửi tháng này</p>
                  <h4 className="text-3xl font-bold text-gray-900">2</h4>
                </div>
              </div>

              {/* CREDIT LIMIT */}
              <div className="bg-white rounded-lg p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100">
                <h4 className="text-lg font-bold text-gray-900 mb-5">Hạn Mức Tín Dụng</h4>
                
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[15px] font-semibold text-gray-700">Đã sử dụng</span>
                  <span className="text-[15px] font-bold text-[#6345ed]">245,000 USD</span>
                </div>
                
                <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-[#6345ed] rounded-full w-[49%]"></div>
                </div>
                
                <div className="flex justify-between text-xs text-gray-500 mb-6">
                  <span>Tổng: 500,000 USD</span>
                  <span>Còn lại: 255,000 USD</span>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 bg-[#eef2fc] text-[#0d2a63] py-2.5 rounded-xl font-bold text-[13px] hover:bg-blue-100 transition-colors flex flex-col items-center justify-center gap-1">
                    <FolderOpenIcon fontSize="small" /> Quản Lý Hợp Đồng
                  </button>
                  <button className="flex-1 bg-[#e6f4ea] text-green-700 py-2.5 rounded-xl font-bold text-[13px] hover:bg-green-100 transition-colors flex flex-col items-center justify-center gap-1">
                    <ArrowForwardIcon fontSize="small" /> Liên Kết Ngân Hàng
                  </button>
                </div>
              </div>

            </div>
          </div>
          
        </div>

      {/* FAB - AI Assistant */}
      <button 
        className="fixed bottom-8 right-8 w-16 h-16 bg-[#6345ed] text-white rounded-full flex items-center justify-center shadow-[0_8px_24px_rgba(99,69,237,0.4)] hover:scale-105 transition-transform z-[9999] border-2 border-white"
        style={{ borderRadius: '50%' }}
      >
        <SupportAgentIcon sx={{ fontSize: 32 }} />
      </button>

    </div>
  );
};

export default SMEPortalView;
