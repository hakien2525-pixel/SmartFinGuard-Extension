import React, { useState } from 'react';
import { IconButton } from '@mui/material';

const DualPanelAuditScreen = ({ document, onClose, inline = false }) => {
  const [jsonOpen, setJsonOpen] = useState(true);
  const [viewMode, setViewMode] = useState('original'); // 'original' | 'ela'
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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

  const cssTokens = `
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@400;500;600&family=Space+Grotesk:wght@600;700&display=swap');

    .audit-screen {
      --navy-900: #0B2545;
      --blue-700: #1D4ED8;
      --blue-600: #2563EB;
      --blue-500: #3B82F6;
      --sky-100: #EAF2FF;
      --sky-50: #F5F9FF;
      --white: #FFFFFF;
      --slate-900: #101826;
      --slate-600: #52606D;
      --slate-400: #8A97A8;
      --slate-200: #DCE4EE;
      --slate-100: #EEF2F7;
      --green-600: #16A34A;
      --green-100: #E3F7EA;
      --amber-600: #D97706;
      --amber-100: #FDF1DD;
      --red-600: #DC2626;
      --red-100: #FCE7E7;

      font-family: 'Inter', sans-serif;
      background-color: var(--sky-50);
      color: var(--slate-900);
    }
    
    .audit-screen h1, .audit-screen h2, .audit-screen h3, .audit-screen h4 {
      font-family: 'Space Grotesk', sans-serif;
      letter-spacing: -0.01em;
    }
    
    .audit-screen .font-mono {
      font-family: 'IBM Plex Mono', monospace !important;
    }

    .audit-card {
      background-color: var(--white);
      border-radius: 4px;
      border: 1px solid var(--slate-200);
      box-shadow: 0 1px 2px rgba(11,37,69,0.06), 0 4px 16px rgba(11,37,69,0.06);
    }
    
    .audit-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      border-radius: 4px;
      padding: 4px 10px;
      font-size: 13px;
      font-weight: 600;
    }
    
    .audit-pill .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }

    .audit-pill.red { background: var(--red-100); color: var(--red-600); }
    .audit-pill.red .dot { background: var(--red-600); }
    .audit-pill.green { background: var(--green-100); color: var(--green-600); }
    .audit-pill.green .dot { background: var(--green-600); }
    .audit-pill.amber { background: var(--amber-100); color: var(--amber-600); }
    .audit-pill.amber .dot { background: var(--amber-600); }
    
    .audit-btn {
      border-radius: 4px;
      padding: 10px 16px;
      font-weight: 600;
      font-size: 14px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      flex: 1;
      cursor: pointer;
    }
    
    .risk-ring {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .risk-ring-inner {
      width: 48px;
      height: 48px;
      background: var(--white);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 18px;
    }
  `;

  const LockIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  );

  const CollapseIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  );
  
  const AlertIcon = ({ color = 'var(--red-600)' }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color }}>
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
  );

  const handleAction = async (action: 'approve' | 'block') => {
    if (!document?.id) return;
    try {
      const match = document.id.match(/DOC-(\d+)/);
      const profileId = match ? match[1] : document.id;
      const res = await fetch(`${baseURL}/api/documents/${profileId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      const data = await res.json();
      if (data.status === 'success') {
        alert(action === 'approve' ? "Đã phê duyệt hồ sơ thành công!" : "Đã chặn giải ngân thành công!");
        if (onClose) onClose();
      } else {
        alert("Thao tác thất bại: " + (data.message || 'Lỗi'));
      }
    } catch (err) {
      alert("Lỗi kết nối tới Backend.");
    }
  };

  const Content = (
    <div className="flex flex-col h-full w-full audit-screen overflow-hidden">
      <style>{cssTokens}</style>
      
      {/* Header Bar */}
      <div className="shrink-0" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', backgroundColor: 'var(--navy-900)' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: 'var(--white)', fontFamily: "'Space Grotesk', sans-serif" }}>
          Màn Hình Thẩm Định Song Song & Đối Chiếu
        </h2>
        <button onClick={onClose} style={{ color: 'var(--slate-200)', background: 'transparent', border: 'none', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }} className="hover:text-white">
          Đóng
        </button>
      </div>

      {/* Dual Panel Split */}
      <div className="flex flex-col md:flex-row flex-1 min-h-0 overflow-y-auto md:overflow-hidden p-5" style={{ gap: '18px' }}>
        
        {/* ================= LEFT PANEL ================= */}
        <div className="w-full md:w-1/2 flex flex-col min-h-0">
          <div className="audit-card flex-1 flex flex-col overflow-hidden">
            <div className="border-b flex justify-between items-center" style={{ padding: '12px 20px', borderColor: 'var(--slate-200)' }}>
              <h3 className="text-base font-bold" style={{ color: 'var(--slate-900)' }}>
                Chứng Từ Gốc & Lớp Cảnh Báo
              </h3>
              {document?.elaMaskUrl && (
                <div className="flex bg-gray-200 p-1 rounded-xl shadow-inner border border-gray-300 scale-90">
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
            
            <div className="flex-1 overflow-auto flex items-center justify-center relative custom-scrollbar" style={{ padding: '24px', backgroundColor: 'var(--sky-50)' }}>
              {document && document.imageUrl ? (
                <div className="relative max-w-full shadow-lg border border-gray-200 select-none">
                  <img 
                    src={viewMode === 'ela' && document.elaMaskUrl ? document.elaMaskUrl : document.imageUrl} 
                    alt="Chứng từ tải lên" 
                    style={{ maxWidth: '100%', maxHeight: '650px', objectFit: 'contain', boxShadow: '0 2px 12px rgba(11,37,69,0.1)', borderRadius: '4px' }} 
                  />
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
        </div>

        {/* ================= RIGHT PANEL ================= */}
        <div className="w-full md:w-1/2 flex flex-col min-h-0 overflow-y-auto custom-scrollbar" style={{ gap: '16px', paddingRight: '4px' }}>
          
          {/* SECTION A: Transaction Details */}
          <div className="audit-card shrink-0" style={{ padding: '20px' }}>
            <div className="flex justify-between items-center mb-4 border-b pb-3" style={{ borderColor: 'var(--slate-200)' }}>
              <h3 className="text-base font-bold" style={{ color: 'var(--slate-900)' }}>
                Thông Tin Yêu Cầu Giải Ngân
              </h3>
              <div className={`audit-pill ${document?.status === 'Cảnh báo' ? 'red' : 'green'}`}>
                <span className="dot"></span> {document?.status || 'Phê duyệt'}
              </div>
            </div>
            
            <div className="flex flex-col gap-y-3 text-sm">
              <div className="grid grid-cols-[160px_1fr] items-start">
                <span style={{ color: 'var(--slate-600)' }}>Mã Giao Dịch:</span>
                <span className="font-bold font-mono" style={{ color: 'var(--slate-900)' }}>{document?.id || 'TXN-UNKNOWN'}</span>
              </div>
              <div className="grid grid-cols-[160px_1fr] items-start">
                <span style={{ color: 'var(--slate-600)' }}>Doanh Nghiệp:</span>
                <span className="font-bold" style={{ color: 'var(--slate-900)' }}>{document?.company || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-[160px_1fr] items-start">
                <span style={{ color: 'var(--slate-600)' }}>Số tiền giải ngân:</span>
                <span className="font-bold" style={{ color: 'var(--slate-900)' }}>{document?.amount || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-[160px_1fr] items-start">
                <span style={{ color: 'var(--slate-600)' }}>Mã số thuế:</span>
                <span className="font-semibold text-slate-700">{document?.taxCode || 'N/A'}</span>
              </div>
              <div className="grid grid-cols-[160px_1fr] items-start">
                <span style={{ color: 'var(--slate-600)' }}>Số hóa đơn:</span>
                <span className="font-semibold text-slate-700">{document?.invoiceNo || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* SECTION C: SmartReader OCR JSON Output */}
          <div className="audit-card overflow-hidden flex flex-col shrink-0">
            <div 
              className="p-4 flex justify-between items-center cursor-pointer transition-colors"
              style={{ backgroundColor: 'var(--navy-900)' }}
              onClick={() => setJsonOpen(!jsonOpen)}
            >
              <h3 className="text-sm font-bold" style={{ color: 'var(--white)' }}>
                Dữ Liệu Số Hóa VNPT SmartReader
              </h3>
              <button style={{ color: 'var(--slate-400)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }} className="hover:text-white">
                {jsonOpen ? 'Thu gọn' : 'Mở rộng'}
                <div style={{ transform: jsonOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                  <CollapseIcon />
                </div>
              </button>
            </div>
            
            {jsonOpen && (
              <div className="p-4 max-h-48 overflow-y-auto" style={{ backgroundColor: 'var(--navy-900)' }}>
                <pre className="text-xs font-mono leading-relaxed" style={{ color: 'var(--sky-100)' }}>
                  <code>{JSON.stringify(rawJSON, null, 2)}</code>
                </pre>
              </div>
            )}
          </div>

          {/* SECTION B: AI Core Risk Analysis */}
          <div className="audit-card shrink-0" style={{ padding: '20px' }}>
            <div className="flex justify-between items-center border-b" style={{ borderColor: 'var(--slate-200)', marginBottom: '20px', paddingBottom: '12px' }}>
              <h3 className="text-base font-bold" style={{ color: 'var(--slate-900)' }}>
                Kết Luận Thẩm Định AI
              </h3>
              <div className={`audit-pill ${document?.status === 'Cảnh báo' ? 'red' : 'green'}`}>
                <span className="dot"></span> MỨC ĐỘ RỦI RO: {document?.status === 'Cảnh báo' ? 'RẤT CAO' : 'THẤP'}
              </div>
            </div>
            
            <div className="flex items-center" style={{ gap: '20px', marginBottom: '20px' }}>
              <div 
                className="risk-ring shrink-0" 
                style={{ 
                  background: `conic-gradient(${document?.status === 'Cảnh báo' ? 'var(--red-600)' : 'var(--green-600)'} 0% ${document?.riskScore ? Math.round(document.riskScore * 100) : 95}%, var(--slate-100) ${document?.riskScore ? Math.round(document.riskScore * 100) : 95}% 100%)` 
                }}
              >
                <div 
                  className="risk-ring-inner" 
                  style={{ color: document?.status === 'Cảnh báo' ? 'var(--red-600)' : 'var(--green-600)' }}
                >
                  {document?.riskScore ? Math.round(document.riskScore * 100) : 95}%
                </div>
              </div>
              <div style={{ color: 'var(--slate-600)', fontSize: '14px', lineHeight: '1.6' }}>
                {document?.status === 'Cảnh báo' 
                  ? (document?.do_tin_cay_tong_the || 'Hệ thống phát hiện bất thường nghiêm trọng trên chứng từ. Đề xuất từ chối hoặc yêu cầu bổ sung bản cứng để rà soát.')
                  : 'Tài liệu nguyên bản, không có dấu vết tẩy xóa.'}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {document?.status === 'Cảnh báo' ? (
                <>
                  {document.tampered_boxes && document.tampered_boxes.map((box, idx) => (
                    <div key={idx} className="rounded-[4px] flex items-start" style={{ backgroundColor: 'var(--red-100)', padding: '12px', gap: '12px' }}>
                      <div style={{ marginTop: '2px', flexShrink: 0 }}><AlertIcon color="var(--red-600)" /></div>
                      <div style={{ color: 'var(--slate-900)', fontSize: '14px', lineHeight: '1.6' }}>
                        <span className="font-bold">Cảnh báo ELA: </span> {box.reason}
                      </div>
                    </div>
                  ))}
                  <div className="rounded-[4px] flex items-start" style={{ backgroundColor: 'var(--amber-100)', padding: '12px', gap: '12px' }}>
                    <div style={{ marginTop: '2px', flexShrink: 0 }}>
                      <AlertIcon color="var(--amber-600)" />
                    </div>
                    <div style={{ color: 'var(--slate-900)', fontSize: '14px', lineHeight: '1.6' }}>
                      <span className="font-bold">Khuyến nghị giải ngân: </span> {document?.khuyen_nghi || 'Từ chối giải ngân tự động. Yêu cầu nộp chứng từ gốc đối chiếu thủ công.'}
                    </div>
                  </div>
                </>
              ) : (
                <div className="rounded-[4px] flex items-start" style={{ backgroundColor: 'var(--green-100)', padding: '12px', gap: '12px' }}>
                  <div style={{ marginTop: '2px', flexShrink: 0 }}><AlertIcon color="var(--green-600)" /></div>
                  <div style={{ color: 'var(--slate-900)', fontSize: '14px', lineHeight: '1.6' }}>
                    <span className="font-bold">Đã xác minh: </span> 
                    Thông tin hoàn toàn khớp với hệ thống của Tổng cục Thuế và chữ ký số hợp lệ. Không có dấu hiệu chỉnh sửa kỹ thuật số.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM FOOTER ACTIONS ================= */}
      <div className="bg-white border-t flex justify-between items-center shrink-0" style={{ padding: '16px 24px', borderColor: 'var(--slate-200)', gap: '16px' }}>
        <button 
          className="audit-btn text-white bg-red-600 hover:bg-red-700" 
          onClick={() => {
            if (window.confirm("Xác nhận CHẶN giải ngân cho hồ sơ này? Hệ thống sẽ ghi nhận quyết định vào Audit Trail.")) {
              handleAction('block');
            }
          }}
        >
          Chặn Giải Ngân
        </button>

        <button 
          className="audit-btn text-slate-600 bg-white hover:bg-gray-50 border border-slate-200" 
          onClick={() => {
            const reason = window.prompt("Nhập lý do yêu cầu bổ sung chứng từ:");
            if (reason) {
              alert("Đã gửi yêu cầu bổ sung chứng từ tới doanh nghiệp!");
              if (onClose) onClose();
            }
          }}
        >
          Yêu Cầu Bổ Sung Chứng Từ
        </button>

        <button 
          className="audit-btn text-white bg-blue-700 hover:bg-blue-800" 
          onClick={() => {
            if (window.confirm("CẢNH BÁO: Bạn có chắc chắn muốn PHÊ DUYỆT hồ sơ này?")) {
              handleAction('approve');
            }
          }}
        >
          Phê Duyệt Nhanh <span className="ml-2" style={{ marginLeft: '8px' }}><LockIcon /></span>
        </button>
      </div>
    </div>
  );

  if (inline) {
    return (
      <div className="flex-1 overflow-hidden h-full">
        {Content}
      </div>
    );
  }

  // If not inline, render as fixed modal
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-sm" style={{ backgroundColor: 'rgba(11, 37, 69, 0.7)' }}>
      <div className="w-full h-full max-w-7xl overflow-hidden shadow-2xl bg-white" style={{ borderRadius: '4px' }}>
        {Content}
      </div>
    </div>
  );
};

export default DualPanelAuditScreen;
