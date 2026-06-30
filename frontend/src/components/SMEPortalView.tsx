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
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import DescriptionIcon from '@mui/icons-material/Description';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

const SMEPortalView = ({ documents = [], onUpload }) => {
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0] && onUpload) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <div className="flex h-screen bg-[#f4f7fb] font-sans text-gray-800 overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-[260px] bg-white border-r border-gray-100 flex flex-col shrink-0 z-10 shadow-[2px_0_8px_rgba(0,0,0,0.02)]">
        <div className="h-[72px] flex items-center px-6 gap-3 border-b border-gray-50">
          <div className="w-8 h-8 bg-[#0d2a63] rounded-md flex items-center justify-center text-white font-bold text-lg shrink-0">
            N
          </div>
          <div>
            <h1 className="font-bold text-base leading-tight text-[#0d2a63]">Nexus AI</h1>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Enterprise Banking</p>
          </div>
        </div>

        <div className="flex-1 px-4 py-6 overflow-y-auto">
          <button className="flex items-center gap-3 w-full px-4 py-3 bg-[#6345ed] text-white rounded-xl shadow-[0_4px_12px_rgba(99,69,237,0.3)] transition-all">
            <AccountBalanceWalletIcon fontSize="small" />
            <span className="font-bold text-[15px]">Cổng Doanh Nghiệp</span>
          </button>
        </div>

        <div className="p-4 border-t border-gray-50 flex flex-col gap-1">
          <button className="flex items-center justify-center gap-2 w-full py-2.5 bg-red-50 text-red-600 rounded-xl font-medium border border-red-100 hover:bg-red-100 transition-colors mb-2">
            <LockIcon fontSize="small" /> Khóa Khẩn Cấp
          </button>
          <a href="#" className="flex items-center gap-3 text-gray-500 hover:text-gray-900 px-4 py-2 transition-colors text-[15px]">
            <HelpIcon fontSize="small" /> Trợ Giúp
          </a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }} className="flex items-center gap-3 text-gray-500 hover:text-gray-900 px-4 py-2 transition-colors text-[15px]">
            <LogoutIcon fontSize="small" /> Đăng Xuất
          </a>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* HEADER */}
        <header className="h-[72px] bg-[#f4f7fb] flex items-center justify-between px-8 shrink-0">
          <h2 className="text-xl font-bold text-[#0d2a63]">Cổng Doanh Nghiệp</h2>
          
          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-gray-600">
              <NotificationsNoneIcon />
            </button>
            <button className="text-[#6345ed] hover:text-[#5035cc]">
              <AutoAwesomeIcon />
            </button>
            <div className="w-10 h-10 rounded-full bg-[#0d2a63] text-white flex items-center justify-center font-bold shadow-sm cursor-pointer ml-2">
              JW
            </div>
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-auto p-8 pt-4">
          
          <div className="mb-6">
            <h3 className="text-3xl font-bold text-gray-900 mb-2">Tự Động Hóa Hóa Đơn</h3>
            <p className="text-[15px] text-gray-500">Trích xuất dữ liệu thông minh và xử lý luồng cho tài khoản SME.</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            
            {/* LEFT COLUMN */}
            <div className="flex-1 flex flex-col gap-6">
              
              {/* UPLOAD AREA */}
              <div 
                className="bg-white rounded-3xl p-10 flex flex-col items-center justify-center text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 min-h-[320px] cursor-pointer hover:border-blue-200 transition-colors"
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
              <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100">
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
                        <th className="pb-3 font-semibold text-gray-400 text-sm">Mã Hồ Sơ</th>
                        <th className="pb-3 font-semibold text-gray-400 text-sm">Ngày Gửi</th>
                        <th className="pb-3 font-semibold text-gray-400 text-sm">Số Tiền Yêu Cầu</th>
                        <th className="pb-3 font-semibold text-gray-400 text-sm text-right">Trạng Thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      <tr>
                        <td className="py-4">
                          <div className="flex items-center gap-2 text-[15px] font-bold text-[#0d2a63]">
                            <DescriptionIcon fontSize="small" className="text-gray-400" /> APP-9821
                          </div>
                        </td>
                        <td className="py-4 text-[15px] text-gray-500">24 Th10, 10:45 SA</td>
                        <td className="py-4 text-[15px] font-bold text-gray-900">$4,520.00</td>
                        <td className="py-4 text-right">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f3efff] text-[#6345ed] text-xs font-bold border border-[#e5dfff]">
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
                        <td className="py-4 text-[15px] text-gray-500">23 Th10, 08:30 SA</td>
                        <td className="py-4 text-[15px] font-bold text-gray-900">$125.50</td>
                        <td className="py-4 text-right">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-bold border border-green-100">
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
            <div className="w-full lg:w-[340px] flex flex-col gap-6 shrink-0">
              
              {/* SYSTEM PROGRESS */}
              <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100">
                <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <AutoAwesomeIcon className="text-[#6345ed]" /> Tiến Trình Hệ Thống
                </h4>
                
                <div className="relative pl-3">
                  <div className="absolute left-[19px] top-4 bottom-8 w-[2px] bg-gray-100"></div>
                  
                  <div className="flex gap-4 mb-6 relative z-10">
                    <div className="w-8 h-8 rounded-full bg-white border-2 border-green-500 text-green-500 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                      <CheckCircleOutlineIcon fontSize="small" />
                    </div>
                    <div>
                      <h5 className="font-bold text-[15px] text-gray-900">Xác Thực Tài Khoản</h5>
                      <p className="text-sm text-gray-500 mt-1">Đã xác minh kết nối đến Cổng SME Nexus.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 mb-6 relative z-10">
                    <div className="w-8 h-8 rounded-full bg-white border-2 border-green-500 text-green-500 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                      <CheckCircleOutlineIcon fontSize="small" />
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
              <div className="bg-white rounded-3xl p-6 flex items-center gap-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100">
                <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center shrink-0">
                  <DescriptionIcon />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Đã gửi tháng này</p>
                  <h4 className="text-3xl font-bold text-gray-900">2</h4>
                </div>
              </div>

              {/* CREDIT LIMIT */}
              <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100">
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

      </div>

      {/* FAB - AI Assistant */}
      <button 
        className="fixed bottom-8 right-8 w-14 h-14 bg-[#6345ed] text-white rounded-full flex items-center justify-center shadow-[0_8px_24px_rgba(99,69,237,0.4)] hover:scale-105 transition-transform z-50"
      >
        <SupportAgentIcon />
      </button>

    </div>
  );
};

export default SMEPortalView;
