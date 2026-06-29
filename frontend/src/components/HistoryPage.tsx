import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';
import SettingsIcon from '@mui/icons-material/Settings';
import TimelineIcon from '@mui/icons-material/Timeline';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import type { DocumentRecord } from '../mockData';

interface Props {
  documents: DocumentRecord[];
}

const HistoryPage = ({ documents }: Props) => {
  const navigate = useNavigate();

  // Ensure documents have a mock date/time if not present in API data
  const displayDocs = (documents && documents.length > 0) ? documents.map((doc, idx) => ({
    ...doc,
    timestamp: doc.timestamp || `29/06/2026 ${10 + Math.floor(idx/6)}:${(30 + idx*5)%60 < 10 ? '0' : ''}${(30 + idx*5)%60}`,
    amount: doc.amount || `${Math.floor(Math.random() * 900) + 10}0,000,000 VND`
  })) : [
    { id: 'DOC-9123', company: 'Công ty TNHH ABC', timestamp: '29/06/2026 10:30', amount: '1,250,000 VND', riskScore: 0.12, status: 'Đã duyệt' },
    { id: 'DOC-4482', company: 'Tập đoàn XYZ', timestamp: '29/06/2026 10:45', amount: '500,000,000 VND', riskScore: 0.65, status: 'Chờ xử lý' },
    { id: 'DOC-7711', company: 'Hộ KD Cửa Hàng Xanh', timestamp: '29/06/2026 11:15', amount: '45,000,000 VND', riskScore: 0.95, status: 'Đã chặn' },
    { id: 'DOC-8899', company: 'CTCP Thương mại Dịch vụ Delta', timestamp: '28/06/2026 14:20', amount: '2,500,000,000 VND', riskScore: 0.05, status: 'Phê duyệt' },
    { id: 'DOC-1234', company: 'Công ty TNHH Phần mềm Mới', timestamp: '28/06/2026 09:10', amount: '150,000,000 VND', riskScore: 0.88, status: 'Cảnh báo' },
  ];

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
            <div className="flex items-center gap-3 bg-[#172554] text-blue-400 px-4 py-3 rounded-lg cursor-pointer">
              <TimelineIcon fontSize="small" />
              <span className="font-semibold text-sm">Nhật ký hệ thống</span>
            </div>
          </div>

          {/* Bottom Settings */}
          <div className="px-4 pt-4 border-t border-gray-800 mt-auto">
            <div 
              onClick={() => navigate('/settings')}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 hover:text-white cursor-pointer transition-colors"
            >
              <SettingsIcon fontSize="small" />
              <span className="font-medium text-sm">Cài đặt hệ thống</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col p-10 pr-12 overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-[32px] font-extrabold text-[#0f172a] tracking-tight">Nhật ký hệ thống</h1>
              <p className="text-[#64748b] text-base mt-1">Lịch sử thẩm định & truy vết hồ sơ theo thời gian thực</p>
            </div>
            <div className="flex gap-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Tìm kiếm mã hồ sơ, doanh nghiệp..." 
                  className="pl-5 pr-12 py-3 bg-white rounded-full w-80 text-sm shadow-sm outline-none border border-transparent focus:border-blue-300 font-medium text-gray-700"
                />
                <SearchIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" fontSize="small"/>
              </div>
              <button className="bg-white text-gray-600 px-5 py-3 rounded-full text-sm font-semibold shadow-sm hover:bg-gray-50 border border-transparent transition-colors flex items-center gap-2">
                <FilterListIcon fontSize="small" /> Lọc
              </button>
              <button className="bg-white text-blue-600 px-5 py-3 rounded-full text-sm font-semibold shadow-sm hover:bg-gray-50 border border-transparent transition-colors flex items-center gap-2">
                <CloudDownloadIcon fontSize="small" /> Xuất File
              </button>
            </div>
          </div>

          {/* Data Table */}
          <div className="flex-1 bg-white rounded-3xl shadow-sm border border-white overflow-hidden flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                    <th className="px-6 py-4 font-medium rounded-tl-3xl">Mã Hồ sơ</th>
                    <th className="px-6 py-4 font-medium">Doanh nghiệp</th>
                    <th className="px-6 py-4 font-medium">Ngày & Giờ (Timestamp)</th>
                    <th className="px-6 py-4 font-medium text-right">Tổng tiền (VND)</th>
                    <th className="px-6 py-4 font-medium text-center">Tỷ lệ rủi ro</th>
                    <th className="px-6 py-4 font-medium rounded-tr-3xl">Trạng thái AI</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 text-sm font-medium">
                  {displayDocs.map((doc, i) => {
                    let statusColor = "bg-gray-100 text-gray-700";
                    let riskColor = "text-gray-700";
                    const riskPercent = Math.round((doc.riskScore || doc.risk || 0) * (doc.riskScore <= 1 ? 100 : 1));

                    if (doc.status === 'Phê duyệt' || doc.status === 'Đã duyệt') {
                      statusColor = "bg-green-100 text-green-700 border border-green-200";
                      riskColor = "text-green-600";
                    } else if (doc.status === 'Chờ xử lý' || doc.status === 'Kiểm tra thêm') {
                      statusColor = "bg-amber-100 text-amber-700 border border-amber-200";
                      riskColor = "text-amber-500";
                    } else if (doc.status === 'Đã chặn' || doc.status === 'Cảnh báo') {
                      statusColor = "bg-red-100 text-red-700 border border-red-200";
                      riskColor = "text-red-600";
                    }

                    return (
                      <tr key={i} className="border-b border-gray-50 hover:bg-blue-50/50 transition-colors">
                        <td className="px-6 py-5 font-bold text-[#1a65d8]">{doc.id}</td>
                        <td className="px-6 py-5">{doc.company || doc.fileName || 'Không xác định'}</td>
                        <td className="px-6 py-5 text-gray-500 font-semibold">{doc.timestamp || doc.time}</td>
                        <td className="px-6 py-5 text-right font-bold">{doc.amount}</td>
                        <td className={`px-6 py-5 text-center font-bold ${riskColor}`}>{riskPercent}%</td>
                        <td className="px-6 py-5">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${statusColor}`}>
                            {doc.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Mock */}
            <div className="p-5 border-t border-gray-100 flex items-center justify-between mt-auto">
              <span className="text-sm text-gray-400 font-medium">Hiển thị {displayDocs.length} kết quả</span>
              <div className="flex gap-2">
                <button className="px-4 py-2 text-sm font-semibold text-gray-400 bg-gray-50 rounded-lg cursor-not-allowed">Trang trước</button>
                <button className="px-4 py-2 text-sm font-bold text-white bg-[#1a65d8] rounded-lg shadow-sm">1</button>
                <button className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 rounded-lg">2</button>
                <button className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 rounded-lg">Trang sau</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
