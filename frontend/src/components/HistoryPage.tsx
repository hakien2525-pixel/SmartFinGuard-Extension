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
import type { DocumentRecord } from '../mockData';

interface Props {
  documents: DocumentRecord[];
}

const HistoryPage = ({ documents = [] }: Props) => {
  const navigate = useNavigate();

  const getFormattedDate = (offsetMinutes = 0) => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - offsetMinutes);
    return d.toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  // Ensure documents have mock data for history page
  const displayDocs = (documents && documents.length > 0) ? documents.map((doc, idx) => {
    let submittedDate = doc.submittedDate || doc.timestamp || getFormattedDate(10 * idx);
    let processedTime = '';

    try {
      if (submittedDate.includes(' ')) {
        const parts = submittedDate.split(' ');
        const timeParts = parts[1].split(':');
        let h = parseInt(timeParts[0]);
        let m = parseInt(timeParts[1]);
        m += Math.floor(Math.random() * 5) + 1; // Add 1-5 minutes
        if (m >= 60) {
          m -= 60;
          h += 1;
        }
        processedTime = `${parts[0]} ${h < 10 ? '0'+h : h}:${m < 10 ? '0'+m : m}`;
      } else {
        processedTime = submittedDate + ' (Processed)';
      }
    } catch {
      processedTime = submittedDate;
    }

    return {
      ...doc,
      id: doc.id || `APP-90${idx}`,
      company: doc.company || doc.fileName || 'Không xác định',
      submittedDate: submittedDate,
      processedDate: processedTime,
      status: doc.status || 'Đang Phân Tích'
    };
  }) : [
    { id: 'APP-9123', company: 'Công ty TNHH ABC', submittedDate: getFormattedDate(15), processedDate: getFormattedDate(12), status: 'Đã duyệt' },
    { id: 'APP-4482', company: 'Tập đoàn XYZ', submittedDate: getFormattedDate(45), processedDate: getFormattedDate(40), status: 'Chờ xử lý' },
    { id: 'APP-7711', company: 'Hộ KD Cửa Hàng Xanh', submittedDate: getFormattedDate(60), processedDate: getFormattedDate(55), status: 'Đã chặn' },
    { id: 'APP-8899', company: 'CTCP Thương mại Dịch vụ Delta', submittedDate: getFormattedDate(120), processedDate: getFormattedDate(115), status: 'Phê duyệt' },
    { id: 'APP-1234', company: 'Công ty TNHH Phần mềm Mới', submittedDate: getFormattedDate(240), processedDate: getFormattedDate(230), status: 'Cảnh báo' },
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
      
        {/* HEADER */}
        <header className="h-[72px] bg-white border-b border-gray-100 flex items-center justify-between px-4 shrink-0">
          <h2 className="text-xl font-bold text-[#0d2a63]">Nhật Kí Hệ Thống</h2>
          
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
          
          <div className="mb-6">
            <h3 className="text-3xl font-bold text-gray-900 mb-2">Lịch Sử Hồ Sơ</h3>
            <p className="text-[15px] text-gray-500">Tra cứu toàn bộ lịch sử thẩm định và truy vết thời gian thực.</p>
          </div>

          <div className="bg-white rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <h4 className="text-lg font-bold text-gray-900">Danh sách toàn bộ hồ sơ</h4>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Tìm mã hồ sơ..." 
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm w-64 focus:outline-none focus:border-[#6345ed]"
                />
                <button className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-100">
                  Lọc
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-4 font-semibold text-gray-500 text-sm whitespace-nowrap">Mã Hồ Sơ</th>
                    <th className="px-6 py-4 font-semibold text-gray-500 text-sm whitespace-nowrap">Tên Hồ Sơ</th>
                    <th className="px-6 py-4 font-semibold text-gray-500 text-sm whitespace-nowrap">Ngày Gửi</th>
                    <th className="px-6 py-4 font-semibold text-gray-500 text-sm whitespace-nowrap">Ngày Xử Lí</th>
                    <th className="px-6 py-4 font-semibold text-gray-500 text-sm whitespace-nowrap">Trạng Thái</th>
                    <th className="px-6 py-4 font-semibold text-gray-500 text-sm text-right whitespace-nowrap">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {displayDocs.map((doc, idx) => {
                    let badgeClass = "bg-gray-50 text-gray-600 border-gray-200";
                    let dotClass = "bg-gray-400";
                    
                    if (doc.status === 'Đã duyệt' || doc.status === 'Phê duyệt') {
                      badgeClass = "bg-green-50 text-green-600 border-green-100";
                      dotClass = "bg-green-500";
                    } else if (doc.status === 'Cảnh báo' || doc.status === 'Chờ xử lý') {
                      badgeClass = "bg-yellow-50 text-yellow-600 border-yellow-100";
                      dotClass = "bg-yellow-500";
                    } else if (doc.status === 'Đã chặn') {
                      badgeClass = "bg-red-50 text-red-600 border-red-100";
                      dotClass = "bg-red-500";
                    } else if (doc.status === 'Đang Phân Tích') {
                      badgeClass = "bg-[#f3efff] text-[#6345ed] border-[#e5dfff]";
                      dotClass = "bg-[#6345ed]";
                    }

                    return (
                      <tr key={idx} className="hover:bg-gray-50/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-bold text-[#0d2a63]">{doc.id}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-medium text-gray-900">{doc.company}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
                          {doc.submittedDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm font-medium">
                          {doc.processedDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badgeClass} whitespace-nowrap`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`}></span> {doc.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button className="text-[#6345ed] text-sm font-semibold hover:underline bg-[#f3efff] px-3 py-1.5 rounded-lg border border-[#e5dfff]">
                            Rà soát chi tiết
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 border-t border-gray-50 flex items-center justify-between text-sm text-gray-500">
              <span>Hiển thị {displayDocs.length} kết quả</span>
              <div className="flex gap-1">
                <button className="px-3 py-1 border border-gray-200 rounded text-gray-400 bg-gray-50 cursor-not-allowed">Trang trước</button>
                <button className="px-3 py-1 border border-[#6345ed] rounded text-white bg-[#6345ed]">1</button>
                <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50">2</button>
                <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50">Trang sau</button>
              </div>
            </div>
          </div>

        </div>
      </div>
  );
};

export default HistoryPage;
