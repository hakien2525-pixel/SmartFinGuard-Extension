import React, { useState } from 'react';

const DualPanelAuditScreen = ({ document, onClose, inline = false }) => {
  const [jsonOpen, setJsonOpen] = useState(true);

  const rawJSON = {
    invoice_no: document?.invoice_no || "INV-2026-88392",
    tax_code: document?.tax_code || "0314589231",
    buyer_name: document?.company || "Công ty Cổ phần Công nghệ SME Việt Nam",
    total_amount: document?.total_amount || "50,000,000 VND",
    issue_date: document?.issue_date || "24/06/2026"
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
      color: var(--red-600);
      font-size: 18px;
    }
  `;

  // Lock Icon (only allowed icon as per prompt "có icon khoá nhỏ")
  const LockIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  );

  // Chevron down for collapse
  const CollapseIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  );
  
  // Alert Icon for flag items (as per "icon cảnh báo bên trái")
  const AlertIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: 'var(--red-600)'}}>
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
  );

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
            <div className="border-b" style={{ padding: '12px 20px', borderColor: 'var(--slate-200)' }}>
              <h3 className="text-base font-bold" style={{ color: 'var(--slate-900)' }}>
                Chứng Từ Gốc & Lớp Cảnh Báo
              </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto flex items-center justify-center" style={{ padding: '24px', backgroundColor: 'var(--sky-50)' }}>
              {document && document.imageUrl ? (
                <img src={document.imageUrl} alt="Chứng từ tải lên" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', boxShadow: '0 2px 12px rgba(11,37,69,0.1)', borderRadius: '4px' }} />
              ) : (
                <div className="w-full bg-white shadow-sm border mx-auto relative" style={{ padding: '32px', maxWidth: '100%', borderColor: 'var(--slate-200)' }}>
                  {/* Mock Invoice Header */}
                  <div className="text-center border-b-2 border-dashed" style={{ marginBottom: '24px', paddingBottom: '16px', borderColor: 'var(--slate-200)' }}>
                    <h1 className="text-xl font-bold uppercase" style={{ color: 'var(--slate-900)' }}>Hóa Đơn Giá Trị Gia Tăng</h1>
                    <p className="text-sm" style={{ marginTop: '8px', color: 'var(--slate-600)' }}>Ngày 24 tháng 06 năm 2026</p>
                    <p className="text-sm font-mono" style={{ color: 'var(--slate-600)' }}>Mã số thuế: 0314589231</p>
                  </div>
                  
                  {/* Mock Invoice Body */}
                  <div className="text-sm" style={{ color: 'var(--slate-900)' }}>
                    <div style={{ marginBottom: '12px' }}><strong style={{ color: 'var(--slate-600)' }}>Đơn vị bán:</strong> Công ty TNHH Thương mại Dịch vụ ABC</div>
                    <div style={{ marginBottom: '12px' }}><strong style={{ color: 'var(--slate-600)' }}>Đơn vị mua:</strong> Công ty Cổ phần Công nghệ SME Việt Nam</div>
                    
                    <table className="w-full border-collapse text-sm" style={{ marginTop: '16px' }}>
                      <thead>
                        <tr style={{ backgroundColor: 'var(--slate-100)' }}>
                          <th className="border text-left" style={{ padding: '8px', borderColor: 'var(--slate-200)' }}>STT</th>
                          <th className="border text-left" style={{ padding: '8px', borderColor: 'var(--slate-200)' }}>Tên hàng hóa</th>
                          <th className="border text-right" style={{ padding: '8px', borderColor: 'var(--slate-200)' }}>Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border" style={{ padding: '8px', borderColor: 'var(--slate-200)' }}>1</td>
                          <td className="border" style={{ padding: '8px', borderColor: 'var(--slate-200)' }}>Máy chủ Server Dell PowerEdge</td>
                          <td className="border text-right font-mono" style={{ padding: '8px', borderColor: 'var(--slate-200)' }}>45,454,545 VND</td>
                        </tr>
                      </tbody>
                    </table>
                    
                    {/* Dynamic Bounding Box over Total Amount */}
                    <div className="text-right relative w-full flex justify-end" style={{ marginTop: '32px' }}>
                      <div className="relative inline-block text-base">
                        {/* The Bounding Box */}
                        <div className="absolute -inset-x-2 -inset-y-2 border border-dashed pointer-events-none" style={{ borderColor: 'var(--red-600)', backgroundColor: 'rgba(252, 231, 231, 0.5)', borderRadius: '4px' }}>
                          <div className="absolute right-0 audit-pill red shadow-sm" style={{ top: '-32px' }}>
                            <span className="dot"></span>
                            Vùng Nghi Vấn Photoshop
                          </div>
                        </div>

                        <p style={{ marginBottom: '8px' }}><strong style={{ color: 'var(--slate-600)' }}>Cộng tiền hàng:</strong> <span className="font-mono">45,454,545 VND</span></p>
                        <p style={{ marginBottom: '8px' }}><strong style={{ color: 'var(--slate-600)' }}>Thuế GTGT (10%):</strong> <span className="font-mono">4,545,455 VND</span></p>
                        <p className="text-lg font-bold border-t" style={{ marginTop: '8px', paddingTop: '8px', borderColor: 'var(--slate-200)' }}>
                          Tổng cộng: <span className="font-mono">50,000,000 VND</span>
                        </p>
                      </div>
                    </div>
                  </div>
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
              <div className="audit-pill" style={{ background: 'var(--amber-100)', color: 'var(--amber-600)' }}>
                <span className="dot" style={{ background: 'var(--amber-600)' }}></span> Đang rà soát
              </div>
            </div>
            
            <div className="flex flex-col gap-y-3 text-sm">
              <div className="grid grid-cols-[160px_1fr] items-start">
                <span style={{ color: 'var(--slate-600)' }}>Mã Giao Dịch:</span>
                <span className="font-bold font-mono" style={{ color: 'var(--slate-900)' }}>{document?.id || 'TXN-2026-9874'}</span>
              </div>
              <div className="grid grid-cols-[160px_1fr] items-start">
                <span style={{ color: 'var(--slate-600)' }}>Doanh Nghiệp:</span>
                <span className="font-bold" style={{ color: 'var(--slate-900)' }}>{document?.company || 'Công ty Cổ phần Công nghệ SME Việt Nam'}</span>
              </div>
              <div className="grid grid-cols-[160px_1fr] items-start">
                <span style={{ color: 'var(--slate-600)' }}>Cán bộ thẩm định:</span>
                <span className="font-bold" style={{ color: 'var(--slate-900)' }}>Nguyễn Văn A (CN Đông Sài Gòn)</span>
              </div>
              <div className="grid grid-cols-[160px_1fr] items-start">
                <span style={{ color: 'var(--slate-600)' }}>eKYC Nhân viên:</span>
                <span className="font-bold" style={{ color: 'var(--slate-900)' }}>Đã xác thực FaceID thành công</span>
              </div>
              <div className="grid grid-cols-[160px_1fr] items-start">
                <span style={{ color: 'var(--slate-600)' }}>Ngày tạo lệnh:</span>
                <span className="font-bold" style={{ color: 'var(--slate-900)' }}>Hôm nay, 15:30</span>
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
                Kết Luận Thẩm Định
              </h3>
              <div className={`audit-pill ${document?.riskLevel === 'Thấp' ? 'green' : 'red'}`}>
                <span className="dot"></span> MỨC ĐỘ RỦI RO: {document?.riskLevel === 'Thấp' ? 'THẤP' : 'RẤT CAO'}
              </div>
            </div>
            
            <div className="flex items-center" style={{ gap: '20px', marginBottom: '20px' }}>
              <div className="risk-ring shrink-0" style={{ background: `conic-gradient(${document?.riskLevel === 'Thấp' ? 'var(--green-600)' : 'var(--red-600)'} 0% ${document?.riskPercentage || 78}%, var(--slate-100) ${document?.riskPercentage || 78}% 100%)` }}>
                <div className="risk-ring-inner" style={{ color: document?.riskLevel === 'Thấp' ? 'var(--green-600)' : 'var(--red-600)' }}>
                  {document?.riskPercentage || 78}%
                </div>
              </div>
              <div style={{ color: 'var(--slate-600)', fontSize: '14px', lineHeight: '1.6' }}>
                {document?.comment || 'Hệ thống phát hiện bất thường nghiêm trọng trên chứng từ. Đề xuất từ chối hoặc yêu cầu bổ sung bản cứng để rà soát.'}
              </div>
            </div>

            {document?.riskLevel === 'Thấp' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="rounded-[4px] flex items-start" style={{ backgroundColor: 'var(--green-100)', padding: '12px', gap: '12px' }}>
                  <div style={{ marginTop: '2px', flexShrink: 0 }}><AlertIcon /></div>
                  <div style={{ color: 'var(--slate-900)', fontSize: '14px', lineHeight: '1.6' }}>
                    <span className="font-bold">Đã xác minh: </span> 
                    Thông tin hoàn toàn khớp với hệ thống của Tổng cục Thuế và chữ ký số hợp lệ. Không có dấu hiệu chỉnh sửa kỹ thuật số.
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="rounded-[4px] flex items-start" style={{ backgroundColor: 'var(--red-100)', padding: '12px', gap: '12px' }}>
                  <div style={{ marginTop: '2px', flexShrink: 0 }}><AlertIcon /></div>
                  <div style={{ color: 'var(--slate-900)', fontSize: '14px', lineHeight: '1.6' }}>
                    <span className="font-bold">Lệch Font chữ: </span> 
                    Dòng tổng tiền có kích thước bounding box lệch baseline 4.2 pixel so với cấu trúc bảng gốc.
                  </div>
                </div>
                <div className="rounded-[4px] flex items-start" style={{ backgroundColor: 'var(--red-100)', padding: '12px', gap: '12px' }}>
                  <div style={{ marginTop: '2px', flexShrink: 0 }}><AlertIcon /></div>
                  <div style={{ color: 'var(--slate-900)', fontSize: '14px', lineHeight: '1.6' }}>
                    <span className="font-bold">Bất thường ELA: </span> 
                    Mức độ phân bố pixel xung quanh số tiền bị nén khác biệt 35% so với nền giấy gốc, dấu hiệu của tẩy xóa kỹ thuật số.
                  </div>
                </div>
                <div className="rounded-[4px] flex items-start" style={{ backgroundColor: 'var(--amber-100)', padding: '12px', gap: '12px' }}>
                  <div style={{ marginTop: '2px', flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: 'var(--amber-600)'}}>
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                      <line x1="12" y1="9" x2="12" y2="13"></line>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                  </div>
                  <div style={{ color: 'var(--slate-900)', fontSize: '14px', lineHeight: '1.6' }}>
                    <span className="font-bold">Cảnh báo trùng lặp: </span> 
                    Mã số thuế này trùng khớp với 1 hồ sơ đang chờ duyệt tại ngân hàng đối thủ (Phát hiện bởi hệ thống Database Hashing Ledger).
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= BOTTOM FOOTER ACTIONS ================= */}
      <div className="bg-white border-t flex justify-between items-center shrink-0" style={{ padding: '16px 24px', borderColor: 'var(--slate-200)', gap: '16px' }}>
        <button 
          className="audit-btn" 
          style={{ border: '1px solid var(--red-600)', color: 'var(--red-600)', backgroundColor: 'var(--white)' }}
          onClick={() => {
            if (window.confirm("Xác nhận CHẶN giải ngân cho hồ sơ này? Hệ thống sẽ ghi nhận quyết định vào Audit Trail.")) {
              alert("Đã chặn giải ngân thành công!");
              if (onClose) onClose();
            }
          }}
        >
          Chặn Giải Ngân
        </button>

        <button 
          className="audit-btn" 
          style={{ border: '1px solid var(--slate-200)', color: 'var(--slate-600)', backgroundColor: 'var(--white)' }}
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
          className="audit-btn" 
          style={{ backgroundColor: 'var(--blue-700)', color: 'var(--white)', opacity: 0.9 }}
          onClick={() => {
            if (window.confirm("CẢNH BÁO: Hồ sơ có rủi ro cao. Bạn có chắc chắn muốn PHÊ DUYỆT NGOẠI LỆ (bỏ qua rủi ro)?")) {
              alert("Đã phê duyệt ngoại lệ thành công!");
              if (onClose) onClose();
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
      <div className="w-full h-full max-w-7xl overflow-hidden shadow-2xl" style={{ borderRadius: '4px' }}>
        {Content}
      </div>
    </div>
  );
};

export default DualPanelAuditScreen;
