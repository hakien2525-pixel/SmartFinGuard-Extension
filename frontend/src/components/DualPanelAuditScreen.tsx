import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import ShieldIcon from '@mui/icons-material/Shield';
import CancelIcon from '@mui/icons-material/Cancel';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const DualPanelAuditScreen = ({ document, onClose, inline = false }) => {
  const [jsonOpen, setJsonOpen] = useState(true);

  // Fake JSON Data based on VNPT SmartReader output
  const rawJSON = {
    invoice_no: "INV-2026-88392",
    tax_code: "0314589231",
    buyer_name: "Công ty Cổ phần Công nghệ SME Việt Nam",
    total_amount: "50,000,000 VND",
    issue_date: "24/06/2026"
  };

  if (inline) {
    return (
      <div className="flex-1 bg-white rounded-3xl shadow-sm border border-white overflow-hidden flex flex-col font-sans h-full">
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <div className="flex items-center gap-3">
            <ShieldIcon className="text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-800">Màn Hình Thẩm Định Song Song & Đối Chiếu</h2>
            <span className="ml-4 px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full border border-red-200">
              Cảnh báo rủi ro cao
            </span>
          </div>
          <IconButton onClick={onClose} size="small" className="hover:bg-gray-200">
            <CloseIcon />
          </IconButton>
        </div>

        {/* Dual Panel Split */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* ================= LEFT PANEL ================= */}
          <div className="w-1/2 border-r border-gray-200 bg-gray-100 p-6 flex flex-col">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              📸 Chứng Từ Gốc & Lớp Cảnh Báo Hệ Thống
            </h3>
            
            <div className="flex-1 bg-white rounded-xl shadow-inner border border-gray-300 overflow-auto relative p-8 flex justify-center custom-scrollbar">
              
              {/* Mock Invoice Image Container */}
              <div className="relative w-full max-w-lg bg-white shadow-md border border-gray-200 min-h-[800px] p-10">
                {/* Mock Invoice Header */}
                <div className="text-center mb-8 border-b-2 border-dashed border-gray-300 pb-6">
                  <h1 className="text-2xl font-bold text-gray-800 uppercase">Hóa Đơn Giá Trị Gia Tăng</h1>
                  <p className="text-sm text-gray-500 mt-2">Ngày 24 tháng 06 năm 2026</p>
                  <p className="text-sm text-gray-500">Mã số thuế: 0314589231</p>
                </div>
                
                {/* Mock Invoice Body */}
                <div className="space-y-4 text-sm text-gray-700">
                  <p><strong>Đơn vị bán:</strong> Công ty TNHH Thương mại Dịch vụ ABC</p>
                  <p><strong>Đơn vị mua:</strong> Công ty Cổ phần Công nghệ SME Việt Nam</p>
                  
                  <table className="w-full mt-6 border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-2 text-left">STT</th>
                        <th className="border border-gray-300 p-2 text-left">Tên hàng hóa</th>
                        <th className="border border-gray-300 p-2 text-right">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 p-2">1</td>
                        <td className="border border-gray-300 p-2">Máy chủ Server Dell PowerEdge</td>
                        <td className="border border-gray-300 p-2 text-right">45,454,545 VND</td>
                      </tr>
                    </tbody>
                  </table>
                  
                  {/* Dynamic Bounding Box over Total Amount */}
                  <div className="mt-8 text-right relative inline-block float-right w-64 text-lg">
                    
                    {/* The Bounding Box */}
                    <div className="absolute -inset-2 border-2 border-red-500 animate-pulse bg-red-500/10 rounded-md z-10 pointer-events-none">
                      {/* Floating Tag */}
                      <div className="absolute -top-12 -right-4 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap flex items-center gap-1">
                        🔴 Vùng Nghi Vấn Photoshop
                        <div className="absolute -bottom-1.5 right-8 w-3 h-3 bg-red-600 transform rotate-45"></div>
                      </div>
                    </div>

                    <p><strong>Cộng tiền hàng:</strong> 45,454,545 VND</p>
                    <p><strong>Thuế GTGT (10%):</strong> 4,545,455 VND</p>
                    <p className="text-xl font-bold mt-2 pt-2 border-t border-gray-400">
                      Tổng cộng: 50,000,000 VND
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT PANEL ================= */}
          <div className="w-1/2 bg-gray-50 p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
            
            {/* SECTION A: Transaction Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h3 className="text-md font-bold text-slate-800 mb-4 border-b border-gray-100 pb-2">
                💳 Thông Tin Yêu Cầu Giải Ngân
              </h3>
              <div className="grid grid-cols-1 gap-y-3 text-sm">
                <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                  <span className="text-gray-500 font-medium">Mã Giao Dịch:</span>
                  <span className="font-bold text-gray-800 font-mono">TXN-2026-9874</span>
                </div>
                <div className="flex justify-between items-center p-2">
                  <span className="text-gray-500 font-medium">Doanh Nghiệp:</span>
                  <span className="font-bold text-indigo-700">Công ty Cổ phần Công nghệ SME Việt Nam</span>
                </div>
                <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                  <span className="text-gray-500 font-medium">Cán bộ thẩm định:</span>
                  <span className="text-gray-800">Nguyễn Văn A (CN Đông Sài Gòn)</span>
                </div>
                <div className="flex justify-between items-center p-2">
                  <span className="text-gray-500 font-medium">eKYC Nhân viên:</span>
                  <span className="font-bold text-green-600 flex items-center gap-1">
                    <CheckCircleIcon fontSize="small"/> Đã xác thực FaceID thành công
                  </span>
                </div>
                <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                  <span className="text-gray-500 font-medium">Ngày tạo lệnh:</span>
                  <span className="text-gray-800">Hôm nay, 15:30</span>
                </div>
              </div>
            </div>

            {/* SECTION B: AI Core Risk Analysis */}
            <div className="bg-white rounded-xl shadow-sm border border-red-200 p-5 relative overflow-hidden">
              {/* Subtle danger gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-transparent pointer-events-none"></div>
              
              <h3 className="text-md font-bold text-slate-800 mb-4 border-b border-red-100 pb-2 relative z-10">
                🧠 Kết Luận Thẩm Định
              </h3>
              
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-20 h-20 rounded-full border-4 border-red-500 flex items-center justify-center bg-white shadow-inner shadow-red-200">
                  <span className="text-2xl font-extrabold text-red-600">78%</span>
                </div>
                <div>
                  <p className="text-red-600 font-bold text-xl uppercase tracking-wider">Mức Độ Rủi Ro: RẤT CAO</p>
                  <p className="text-gray-600 text-sm mt-1">Hệ thống phát hiện bất thường nghiêm trọng trên chứng từ.</p>
                </div>
              </div>

              <div className="space-y-3 relative z-10">
                <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                  <CancelIcon className="text-red-500 mt-0.5" fontSize="small" />
                  <p className="text-sm text-red-900 leading-relaxed">
                    <strong>Lệch Font chữ:</strong> Dòng tổng tiền có kích thước bounding box lệch baseline 4.2 pixel so với cấu trúc bảng gốc.
                  </p>
                </div>
                <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                  <CancelIcon className="text-red-500 mt-0.5" fontSize="small" />
                  <p className="text-sm text-red-900 leading-relaxed">
                    <strong>Bất thường ELA:</strong> Mức độ phân bố pixel xung quanh số tiền bị nén khác biệt 35% so với nền giấy gốc, dấu hiệu của tẩy xóa kỹ thuật số.
                  </p>
                </div>
                <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <WarningAmberIcon className="text-orange-500 mt-0.5" fontSize="small" />
                  <p className="text-sm text-orange-900 leading-relaxed">
                    <strong>Cảnh báo trùng lặp:</strong> Mã số thuế này trùng khớp với 1 hồ sơ đang chờ duyệt tại ngân hàng đối thủ (Phát hiện bởi hệ thống Database Hashing Ledger).
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION C: SmartReader OCR JSON Output */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex-1 flex flex-col">
              <div 
                className="bg-slate-800 p-4 flex justify-between items-center cursor-pointer hover:bg-slate-700 transition-colors"
                onClick={() => setJsonOpen(!jsonOpen)}
              >
                <h3 className="text-md font-bold text-white flex items-center gap-2">
                  📄 Dữ Liệu Số Hóa VNPT SmartReader
                </h3>
                <IconButton size="small" sx={{ color: 'white' }}>
                  {jsonOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
              </div>
              
              {jsonOpen && (
                <div className="bg-[#1e293b] p-4 flex-1 overflow-auto custom-scrollbar">
                  <pre className="text-[#a5b4fc] text-sm font-mono leading-relaxed">
                    <code>{JSON.stringify(rawJSON, null, 2)}</code>
                  </pre>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* ================= BOTTOM FOOTER ACTIONS ================= */}
        <div className="px-6 py-4 bg-white border-t border-gray-200 flex justify-between items-center">
          <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-red-200 transition-all hover:-translate-y-0.5">
            <ShieldIcon /> Chặn Giải Ngân
          </button>

          <div className="flex gap-4">
            <button className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-amber-200 transition-all">
              Yêu Cầu Bổ Sung Chứng Từ
            </button>
            <button className="bg-gray-100 text-gray-400 px-6 py-3 rounded-xl font-bold border border-gray-200 cursor-not-allowed flex items-center gap-2" disabled>
              Phê Duyệt Nhanh <LockIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If not inline, render as fixed modal
  return (
    <div className="fixed inset-0 z-50 bg-[#0b172a] bg-opacity-95 flex items-center justify-center p-6 backdrop-blur-sm">
      <div className="w-full h-full max-w-[1600px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col font-sans">
        
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <div className="flex items-center gap-3">
            <ShieldIcon className="text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-800">Màn Hình Thẩm Định Song Song & Đối Chiếu</h2>
            <span className="ml-4 px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full border border-red-200">
              Cảnh báo rủi ro cao
            </span>
          </div>
          <IconButton onClick={onClose} size="small" className="hover:bg-gray-200">
            <CloseIcon />
          </IconButton>
        </div>

        {/* Dual Panel Split */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* ================= LEFT PANEL ================= */}
          <div className="w-1/2 border-r border-gray-200 bg-gray-100 p-6 flex flex-col">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              📸 Chứng Từ Gốc & Lớp Cảnh Báo Hệ Thống
            </h3>
            
            <div className="flex-1 bg-white rounded-xl shadow-inner border border-gray-300 overflow-auto relative p-8 flex justify-center custom-scrollbar">
              
              {/* Mock Invoice Image Container */}
              <div className="relative w-full max-w-lg bg-white shadow-md border border-gray-200 min-h-[800px] p-10">
                {/* Mock Invoice Header */}
                <div className="text-center mb-8 border-b-2 border-dashed border-gray-300 pb-6">
                  <h1 className="text-2xl font-bold text-gray-800 uppercase">Hóa Đơn Giá Trị Gia Tăng</h1>
                  <p className="text-sm text-gray-500 mt-2">Ngày 24 tháng 06 năm 2026</p>
                  <p className="text-sm text-gray-500">Mã số thuế: 0314589231</p>
                </div>
                
                {/* Mock Invoice Body */}
                <div className="space-y-4 text-sm text-gray-700">
                  <p><strong>Đơn vị bán:</strong> Công ty TNHH Thương mại Dịch vụ ABC</p>
                  <p><strong>Đơn vị mua:</strong> Công ty Cổ phần Công nghệ SME Việt Nam</p>
                  
                  <table className="w-full mt-6 border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-2 text-left">STT</th>
                        <th className="border border-gray-300 p-2 text-left">Tên hàng hóa</th>
                        <th className="border border-gray-300 p-2 text-right">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 p-2">1</td>
                        <td className="border border-gray-300 p-2">Máy chủ Server Dell PowerEdge</td>
                        <td className="border border-gray-300 p-2 text-right">45,454,545 VND</td>
                      </tr>
                    </tbody>
                  </table>
                  
                  {/* Dynamic Bounding Box over Total Amount */}
                  <div className="mt-8 text-right relative inline-block float-right w-64 text-lg">
                    
                    {/* The Bounding Box */}
                    <div className="absolute -inset-2 border-2 border-red-500 animate-pulse bg-red-500/10 rounded-md z-10 pointer-events-none">
                      {/* Floating Tag */}
                      <div className="absolute -top-12 -right-4 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap flex items-center gap-1">
                        🔴 Vùng Nghi Vấn Photoshop
                        <div className="absolute -bottom-1.5 right-8 w-3 h-3 bg-red-600 transform rotate-45"></div>
                      </div>
                    </div>

                    <p><strong>Cộng tiền hàng:</strong> 45,454,545 VND</p>
                    <p><strong>Thuế GTGT (10%):</strong> 4,545,455 VND</p>
                    <p className="text-xl font-bold mt-2 pt-2 border-t border-gray-400">
                      Tổng cộng: 50,000,000 VND
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT PANEL ================= */}
          <div className="w-1/2 bg-gray-50 p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
            
            {/* SECTION A: Transaction Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h3 className="text-md font-bold text-slate-800 mb-4 border-b border-gray-100 pb-2">
                💳 Thông Tin Yêu Cầu Giải Ngân
              </h3>
              <div className="grid grid-cols-1 gap-y-3 text-sm">
                <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                  <span className="text-gray-500 font-medium">Mã Giao Dịch:</span>
                  <span className="font-bold text-gray-800 font-mono">TXN-2026-9874</span>
                </div>
                <div className="flex justify-between items-center p-2">
                  <span className="text-gray-500 font-medium">Doanh Nghiệp:</span>
                  <span className="font-bold text-indigo-700">Công ty Cổ phần Công nghệ SME Việt Nam</span>
                </div>
                <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                  <span className="text-gray-500 font-medium">Cán bộ thẩm định:</span>
                  <span className="text-gray-800">Nguyễn Văn A (CN Đông Sài Gòn)</span>
                </div>
                <div className="flex justify-between items-center p-2">
                  <span className="text-gray-500 font-medium">eKYC Nhân viên:</span>
                  <span className="font-bold text-green-600 flex items-center gap-1">
                    <CheckCircleIcon fontSize="small"/> Đã xác thực FaceID thành công
                  </span>
                </div>
                <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                  <span className="text-gray-500 font-medium">Ngày tạo lệnh:</span>
                  <span className="text-gray-800">Hôm nay, 15:30</span>
                </div>
              </div>
            </div>

            {/* SECTION B: AI Core Risk Analysis */}
            <div className="bg-white rounded-xl shadow-sm border border-red-200 p-5 relative overflow-hidden">
              {/* Subtle danger gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-transparent pointer-events-none"></div>
              
              <h3 className="text-md font-bold text-slate-800 mb-4 border-b border-red-100 pb-2 relative z-10">
                🧠 Kết Luận Thẩm Định
              </h3>
              
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-20 h-20 rounded-full border-4 border-red-500 flex items-center justify-center bg-white shadow-inner shadow-red-200">
                  <span className="text-2xl font-extrabold text-red-600">78%</span>
                </div>
                <div>
                  <p className="text-red-600 font-bold text-xl uppercase tracking-wider">Mức Độ Rủi Ro: RẤT CAO</p>
                  <p className="text-gray-600 text-sm mt-1">Hệ thống phát hiện bất thường nghiêm trọng trên chứng từ.</p>
                </div>
              </div>

              <div className="space-y-3 relative z-10">
                <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                  <CancelIcon className="text-red-500 mt-0.5" fontSize="small" />
                  <p className="text-sm text-red-900 leading-relaxed">
                    <strong>Lệch Font chữ:</strong> Dòng tổng tiền có kích thước bounding box lệch baseline 4.2 pixel so với cấu trúc bảng gốc.
                  </p>
                </div>
                <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                  <CancelIcon className="text-red-500 mt-0.5" fontSize="small" />
                  <p className="text-sm text-red-900 leading-relaxed">
                    <strong>Bất thường ELA:</strong> Mức độ phân bố pixel xung quanh số tiền bị nén khác biệt 35% so với nền giấy gốc, dấu hiệu của tẩy xóa kỹ thuật số.
                  </p>
                </div>
                <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <WarningAmberIcon className="text-orange-500 mt-0.5" fontSize="small" />
                  <p className="text-sm text-orange-900 leading-relaxed">
                    <strong>Cảnh báo trùng lặp:</strong> Mã số thuế này trùng khớp với 1 hồ sơ đang chờ duyệt tại ngân hàng đối thủ (Phát hiện bởi hệ thống Database Hashing Ledger).
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION C: SmartReader OCR JSON Output */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex-1 flex flex-col">
              <div 
                className="bg-slate-800 p-4 flex justify-between items-center cursor-pointer hover:bg-slate-700 transition-colors"
                onClick={() => setJsonOpen(!jsonOpen)}
              >
                <h3 className="text-md font-bold text-white flex items-center gap-2">
                  📄 Dữ Liệu Số Hóa VNPT SmartReader
                </h3>
                <IconButton size="small" sx={{ color: 'white' }}>
                  {jsonOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
              </div>
              
              {jsonOpen && (
                <div className="bg-[#1e293b] p-4 flex-1 overflow-auto custom-scrollbar">
                  <pre className="text-[#a5b4fc] text-sm font-mono leading-relaxed">
                    <code>{JSON.stringify(rawJSON, null, 2)}</code>
                  </pre>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* ================= BOTTOM FOOTER ACTIONS ================= */}
        <div className="px-6 py-4 bg-white border-t border-gray-200 flex justify-between items-center">
          <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-red-200 transition-all hover:-translate-y-0.5">
            <ShieldIcon /> Chặn Giải Ngân
          </button>

          <div className="flex gap-4">
            <button className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-amber-200 transition-all">
              Yêu Cầu Bổ Sung Chứng Từ
            </button>
            <button className="bg-gray-100 text-gray-400 px-6 py-3 rounded-xl font-bold border border-gray-200 cursor-not-allowed flex items-center gap-2" disabled>
              Phê Duyệt Nhanh <LockIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// SVG Icon for Lock
const LockIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
  </svg>
);

export default DualPanelAuditScreen;
