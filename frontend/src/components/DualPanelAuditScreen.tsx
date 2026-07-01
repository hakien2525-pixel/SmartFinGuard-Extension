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
  const [viewMode, setViewMode] = useState('original'); // 'original' | 'ela'

  // Dynamically structure the OCR JSON to display
  const rawJSON = {
    document_id: document?.id || "N/A",
    invoice_no: document?.invoiceNo || "Không tìm thấy",
    tax_code: document?.taxCode || "Không tìm thấy",
    buyer_name: document?.company || "Không tìm thấy",
    total_amount: document?.amount || "Không tìm thấy",
    status: document?.status || "Phê duyệt",
    file_hash_md5: document?.fileHash || "N/A",
    ela_max_intensity: document?.do_tin_cay ? (100 - document.do_tin_cay) : 0,
    tampered_regions_detected: document?.tampered_boxes?.length || 0
  };

  const renderLeftPanel = () => (
    <div className="w-1/2 border-r border-gray-200 bg-gray-100 p-6 flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          📸 Chứng Từ & Đối Chứng ELA
        </h3>
        {/* Toggle View Mode between Original and ELA Mask */}
        {document?.elaMaskUrl && (
          <div className="flex bg-gray-200 p-1 rounded-xl shadow-inner border border-gray-300">
            <button 
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${viewMode === 'original' ? 'bg-white shadow text-indigo-700' : 'text-gray-600 hover:text-gray-900'}`}
              onClick={() => setViewMode('original')}
            >
              Bản Gốc
            </button>
            <button 
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${viewMode === 'ela' ? 'bg-white shadow text-red-600' : 'text-gray-600 hover:text-gray-900'}`}
              onClick={() => setViewMode('ela')}
            >
              Mặt nạ ELA
            </button>
          </div>
        )}
      </div>
      
      <div className="flex-1 bg-white rounded-xl shadow-inner border border-gray-300 overflow-auto relative p-8 flex justify-center items-center custom-scrollbar">
        {document?.imageUrl ? (
          <div className="relative max-w-full shadow-lg border border-gray-200 select-none">
            <img 
              src={viewMode === 'ela' && document.elaMaskUrl ? document.elaMaskUrl : document.imageUrl} 
              alt="Uploaded Invoice"
              className="max-h-[750px] w-auto object-contain"
            />
            {/* Draw Real Bounding Boxes dynamically from the ELA results */}
            {document.tampered_boxes && document.tampered_boxes.map((box, idx) => (
              <div 
                key={idx}
                className="absolute border-2 border-red-500 bg-red-500/10 rounded-sm pointer-events-none group animate-pulse"
                style={{
                  left: `${box.x_pct}%`,
                  top: `${box.y_pct}%`,
                  width: `${box.width_pct}%`,
                  height: `${box.height_pct}%`,
                }}
              >
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 bg-red-700 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg whitespace-nowrap mb-1">
                  Nghi vấn ELA ({box.intensity}%)
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-400 text-center font-semibold">
            Không tìm thấy ảnh chứng từ hợp lệ.
          </div>
        )}
      </div>
    </div>
  );

  const renderRightPanel = () => (
    <div className="w-1/2 bg-gray-50 p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar h-full">
      {/* SECTION A: Transaction Details */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h3 className="text-md font-bold text-slate-800 mb-4 border-b border-gray-100 pb-2">
          💳 Thông Tin Yêu Cầu Giải Ngân
        </h3>
        <div className="grid grid-cols-1 gap-y-3 text-[15px]">
          <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
            <span className="text-gray-500 font-medium">Mã Giao Dịch:</span>
            <span className="font-bold text-gray-800 font-mono">{document?.id || 'TXN-UNKNOWN'}</span>
          </div>
          <div className="flex justify-between items-center p-2">
            <span className="text-gray-500 font-medium">Doanh Nghiệp:</span>
            <span className="font-bold text-indigo-700">{document?.company || 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
            <span className="text-gray-500 font-medium">Số tiền giải ngân:</span>
            <span className="font-bold text-slate-800">{document?.amount || 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center p-2">
            <span className="text-gray-500 font-medium">Mã số thuế:</span>
            <span className="font-semibold text-slate-700">{document?.taxCode || 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
            <span className="text-gray-500 font-medium">Số hóa đơn:</span>
            <span className="font-semibold text-slate-700">{document?.invoiceNo || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* SECTION B: AI Core Risk Analysis */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-transparent pointer-events-none"></div>
        
        <h3 className="text-md font-bold text-slate-800 mb-4 border-b border-gray-100 pb-2 relative z-10">
          🧠 Kết Luận Thẩm Định AI
        </h3>
        
        <div className="flex items-center gap-4 mb-6 relative z-10">
          <div className={`w-20 h-20 rounded-full border-4 ${document?.status === 'Cảnh báo' ? 'border-red-500 shadow-red-200' : 'border-green-500 shadow-green-200'} flex items-center justify-center bg-white shadow-inner`}>
            <span className={`text-2xl font-extrabold ${document?.status === 'Cảnh báo' ? 'text-red-600' : 'text-green-600'}`}>
              {document?.riskScore ? Math.round(document.riskScore * 100) : 95}%
            </span>
          </div>
          <div>
            <p className={`font-bold text-xl uppercase tracking-wider ${document?.status === 'Cảnh báo' ? 'text-red-600' : 'text-green-600'}`}>
              Trạng Thái: {document?.status || 'Phê duyệt'}
            </p>
            <p className="text-gray-600 text-sm mt-1">Độ tin cậy tài liệu: {document?.do_tin_cay ?? 100}%</p>
          </div>
        </div>

        <div className="space-y-3 relative z-10">
          <div className={`flex items-start gap-3 p-3 ${document?.status === 'Cảnh báo' ? 'bg-red-50 border-red-100 text-red-900' : 'bg-green-50 border-green-100 text-green-900'} rounded-lg border`}>
            <CancelIcon className={document?.status === 'Cảnh báo' ? 'text-red-500 mt-0.5' : 'text-green-500 mt-0.5'} fontSize="small" />
            <p className="text-sm leading-relaxed">
              <strong>Kết luận ELA:</strong> {document?.do_tin_cay_tong_the || 'Tài liệu nguyên bản, không có dấu vết tẩy xóa.'}
            </p>
          </div>
          {document?.logic_so_hoc && (
            <div className="flex items-start gap-3 p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-900">
              <ShieldIcon className="text-indigo-500 mt-0.5" fontSize="small" />
              <p className="text-sm leading-relaxed">
                <strong>Kiểm tra số học:</strong> {document.logic_so_hoc}
              </p>
            </div>
          )}
          <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900">
            <WarningAmberIcon className="text-amber-500 mt-0.5" fontSize="small" />
            <p className="text-sm leading-relaxed">
              <strong>Khuyến nghị giải ngân:</strong> {document?.khuyen_nghi || 'Sẵn sàng phê duyệt.'}
            </p>
          </div>
        </div>
      </div>

      {/* SECTION C: SmartReader OCR JSON Output */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex-1 flex flex-col min-h-[250px]">
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
          <div className="bg-[#1e293b] p-4 flex-1 overflow-auto custom-scrollbar font-mono text-[14px]">
            <pre className="text-[#a5b4fc] leading-relaxed">
              <code>{JSON.stringify(rawJSON, null, 2)}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );

  if (inline) {
    return (
      <div className="flex-1 bg-white rounded-3xl shadow-sm border border-white overflow-hidden flex flex-col font-sans h-full">
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <div className="flex items-center gap-3">
            <ShieldIcon className="text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-800">Màn Hình Thẩm Định Song Song & Đối Chiếu</h2>
            <span className={`ml-4 px-3 py-1 ${document?.status === 'Cảnh báo' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-green-100 text-green-700 border-green-200'} text-sm font-bold rounded-full border`}>
              Trạng thái: {document?.status || 'Phê duyệt'}
            </span>
          </div>
          <IconButton onClick={onClose} size="small" className="hover:bg-gray-200">
            <CloseIcon />
          </IconButton>
        </div>

        {/* Dual Panel Split */}
        <div className="flex flex-1 overflow-hidden">
          {renderLeftPanel()}
          {renderRightPanel()}
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
            <span className={`ml-4 px-3 py-1 ${document?.status === 'Cảnh báo' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-green-100 text-green-700 border-green-200'} text-sm font-bold rounded-full border`}>
              Trạng thái: {document?.status || 'Phê duyệt'}
            </span>
          </div>
          <IconButton onClick={onClose} size="small" className="hover:bg-gray-200">
            <CloseIcon />
          </IconButton>
        </div>

        {/* Dual Panel Split */}
        <div className="flex flex-1 overflow-hidden">
          {renderLeftPanel()}
          {renderRightPanel()}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default DualPanelAuditScreen;
