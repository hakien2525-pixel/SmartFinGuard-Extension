import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const SMEPortalView = ({ documents = [], onUploadComplete }: any) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [notifOpen, setNotifOpen] = useState(false);

  // Helper to switch pages using navigate
  const switchPage = (path: string) => {
    navigate(path);
  };

  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [viewingDoc, setViewingDoc] = useState<any>(null);
  const [recordsFilter, setRecordsFilter] = useState('Tất cả');
  const [recordsSearch, setRecordsSearch] = useState('');
  const [historySearch, setHistorySearch] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  
  // Support form state
  const [supportForm, setSupportForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportForm.name || !supportForm.email || !supportForm.subject || !supportForm.message) {
      alert("Vui lòng điền đầy đủ thông tin trước khi gửi!");
      return;
    }
    // Simulate sending email and show success message
    alert(`Gửi yêu cầu thành công!\n\nChúng tôi đã ghi nhận thắc mắc của bạn và sẽ gửi thư phản hồi về địa chỉ email: ${supportForm.email} trong thời gian sớm nhất.`);
    
    // Reset form to allow more questions
    setSupportForm({ name: '', email: '', subject: '', message: '' });
  };

  const exportToExcel = () => {
    const historyDocs = documents.filter((doc: any) => doc && doc.status && ['Đã duyệt', 'Hoàn tất', 'Thành công', 'Đã huỷ', 'Đã chặn'].includes(doc.status));
    const headers = ["Mã giao dịch", "Hồ sơ", "Số tiền", "Ngày giải ngân", "Trạng thái"];
    const rows = historyDocs.map((doc: any) => [
      `GD-${(doc.id || '').replace('HD-', '')}`,
      doc.id || 'N/A',
      doc.total_amount || 'Liên hệ ngân hàng',
      doc.issue_date || '24/06/2026',
      doc.status || 'N/A'
    ]);
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "lich_su_giao_dich.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedFile(reader.result as string);
        setIsAnalyzing(true);
        navigate('/sme/upload');
        setTimeout(() => setIsAnalyzing(false), 2500);
      };
      reader.readAsDataURL(file);
    }
    // reset input
    e.target.value = '';
  };

  return (
    <>
      {/* Document View Modal */}
      {viewingDoc && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(11,37,69,0.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ width: '100%', maxWidth: '1000px', height: '100%', backgroundColor: '#fff', borderRadius: '8px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid var(--slate-200)' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Chi tiết hồ sơ: {viewingDoc.id}</h2>
              <button className="btn-outline" onClick={() => setViewingDoc(null)} style={{ padding: '6px 16px' }}>Đóng</button>
            </div>
            <div style={{ flex: 1, backgroundColor: 'var(--slate-50)', padding: '24px', overflow: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {viewingDoc.imageUrl ? (
                <img src={viewingDoc.imageUrl} alt="Tài liệu" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              ) : (
                <div style={{ color: 'var(--slate-500)', fontSize: '15px' }}>Không có hình ảnh bản scan cho chứng từ này.</div>
              )}
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--slate-200)', background: '#fff', display: 'flex', gap: '24px' }}>
              <div><span style={{color: 'var(--slate-500)', fontSize: '13px'}}>Loại:</span> <span style={{fontWeight: 600}}>{viewingDoc.type}</span></div>
              <div><span style={{color: 'var(--slate-500)', fontSize: '13px'}}>Doanh nghiệp:</span> <span style={{fontWeight: 600}}>{viewingDoc.company}</span></div>
              <div><span style={{color: 'var(--slate-500)', fontSize: '13px'}}>Trạng thái:</span> <span style={{fontWeight: 600}} className={`pill ${viewingDoc.status === 'Đã duyệt' ? 'green' : viewingDoc.status === 'Đã chặn' || viewingDoc.status === 'Cần bổ sung' ? 'red' : 'amber'}`}>{viewingDoc.status}</span></div>
            </div>
          </div>
        </div>
      )}

      <input type="file" id="sme-file-upload" accept="image/*,application/pdf" style={{ display: 'none' }} onChange={handleFileUpload} />

      {/* ---- biz-overview ---- */}
      <div className={`page ${currentPath === '/sme/dashboard' || currentPath === '/sme/portal' ? 'active' : ''}`} style={{display: (currentPath === '/sme/dashboard' || currentPath === '/sme/portal') ? 'block' : 'none'}}>
        <div className="topbar">
          <div><h1>Tổng quan hồ sơ giải ngân</h1><p className="sub">Theo dõi tiến độ thẩm định và trạng thái chứng từ theo thời gian thực.</p></div>
          <div className="top-actions">
            <button className="icon-btn" onClick={() => setNotifOpen(!notifOpen)}>
              <svg className="icon" width="17" height="17" viewBox="0 0 24 24"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>
              <span className="dot-alert"></span>
              <div className={`notif-panel ${notifOpen ? 'show' : ''}`} id="notif-biz">
                <div className="nh">Thông báo</div>
                <div className="notif-item"><b>Hồ sơ #HD-2026-0091 cần bổ sung chứng từ</b>Hoá đơn VAT cần tải lại bản rõ nét.<br/><span>5 phút trước</span></div>
                <div className="notif-item"><b>Hồ sơ #HD-2026-0075 đã giải ngân</b>4.2 tỷ VNĐ đã chuyển vào tài khoản.<br/><span>Hôm qua</span></div>
                <div className="notif-item"><b>Chứng từ #0088 đối chiếu thành công</b>Không phát hiện bất thường.<br/><span>2 ngày trước</span></div>
              </div>
            </button>
            <button className="mini-btn blue" style={{padding: '9px 16px'}} onClick={() => switchPage('/sme/upload')}>+ Tạo hồ sơ mới</button>
          </div>
        </div>

        <div className="stat-grid">
          <div className="stat-card"><div className="icon-wrap" style={{background: 'var(--sky-100)', color: 'var(--blue-700)'}}><svg className="icon" width="17" height="17" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/></svg></div><div className="num">12</div><div className="lbl">Hồ sơ đang xử lý</div></div>
          <div className="stat-card"><div className="icon-wrap" style={{background: 'var(--green-100)', color: 'var(--green-600)'}}><svg className="icon" width="17" height="17" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg></div><div className="num">47</div><div className="lbl">Chứng từ đã xác minh</div><div className="trend" style={{color: 'var(--green-600)'}}>↑ 8% so với tháng trước</div></div>
          <div className="stat-card"><div className="icon-wrap" style={{background: 'var(--amber-100)', color: 'var(--amber-600)'}}><svg className="icon" width="17" height="17" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg></div><div className="num">3</div><div className="lbl">Đang chờ đối chiếu</div></div>
          <div className="stat-card"><div className="icon-wrap" style={{background: 'var(--sky-100)', color: 'var(--blue-700)'}}><svg className="icon" width="17" height="17" viewBox="0 0 24 24"><path d="M12 2v20M2 12h20"/></svg></div><div className="num">4.2 tỷ</div><div className="lbl">Tổng hạn mức đã giải ngân</div></div>
        </div>

        <div className="notice"><svg className="icon" width="18" height="18" viewBox="0 0 24 24"><path d="M12 9v4"/><path d="M12 17h.01"/><circle cx="12" cy="12" r="9"/></svg>
          <div><b>Hồ sơ #HD-2026-0091 cần bổ sung chứng từ</b><p>Hoá đơn VAT bị mờ ở góc phải, vui lòng tải lại bản scan rõ nét trước 17:00 hôm nay để không ảnh hưởng tiến độ giải ngân.</p></div>
        </div>

        <div className="card" style={{marginBottom: '18px'}}>
          <div className="card-head"><h2>Tiến trình hồ sơ #HD-2026-0091</h2><span className="pill amber"><span className="d"></span>Đang thẩm định</span></div>
          <div className="tracker">
            <div className="tstep done"><div className="node">✓</div><div className="tlabel">Nộp hồ sơ</div><div className="ttime">28/06 · 09:12</div></div>
            <div className="tstep done"><div className="node">✓</div><div className="tlabel">Quét &amp; số hoá OCR</div><div className="ttime">28/06 · 09:14</div></div>
            <div className="tstep active"><div className="node">3</div><div className="tlabel">Đối chiếu dữ liệu</div><div className="ttime">Đang xử lý</div></div>
            <div className="tstep"><div className="node">4</div><div className="tlabel">Thẩm định</div><div className="ttime">Chưa tới</div></div>
            <div className="tstep"><div className="node">5</div><div className="tlabel">Giải ngân</div><div className="ttime">Chưa tới</div></div>
          </div>
        </div>

        <div className="two-col">
          <div className="card">
            <div className="card-head"><h2>Chứng từ gần đây</h2><a className="link-blue" onClick={() => switchPage('/sme/records')}>Xem tất cả</a></div>
            <table>
              <thead><tr><th>Chứng từ</th><th>Mã hồ sơ</th><th>Trạng thái</th><th></th></tr></thead>
              <tbody>
                {documents.slice(0, 4).map((doc: any, idx: number) => (
                  <tr key={idx}>
                    <td><div className="doc-name">{doc.type}</div><div className="doc-sub">{doc.imageUrl ? 'IMG · 2.1MB' : 'PDF · 1.5MB'}</div></td>
                    <td className="mono">{doc.id}</td>
                    <td>
                      <span className={`pill ${doc.status === 'Đã duyệt' || doc.status === 'Hoàn tất' || doc.status === 'Đã xác minh' ? 'green' : doc.status === 'Đã chặn' || doc.status === 'Cần bổ sung' ? 'red' : 'amber'}`}>
                        <span className="d"></span>{doc.status}
                      </span>
                    </td>
                    <td>
                      {doc.status === 'Cần bổ sung' ? (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="mini-btn blue" onClick={(e) => { e.stopPropagation(); switchPage('/sme/upload'); }}>Tải lại</button>
                          <button className="mini-btn" onClick={() => setViewingDoc(doc)}>Xem</button>
                        </div>
                      ) : (
                        <button className="mini-btn" onClick={() => setViewingDoc(doc)}>Xem</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card">
            <div className="card-head"><h2>Tải chứng từ mới</h2></div>
            <div className="dropzone" style={{cursor: 'pointer'}} onClick={() => document.getElementById('sme-file-upload')?.click()}>
              <div className="icon-wrap"><svg className="icon" width="20" height="20" viewBox="0 0 24 24"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M4 19h16"/></svg></div>
              <h3>Kéo thả hoặc Click để tải tệp lên</h3><p>Hỗ trợ PDF, JPG, PNG — tối đa 10MB</p>
              <button className="btn-outline" onClick={(e) => { e.stopPropagation(); document.getElementById('sme-file-upload')?.click(); }}>Chọn tệp</button>
            </div>
          </div>
        </div>
      </div>

      {/* ---- biz-records ---- */}
      <div className={`page ${currentPath === '/sme/records' ? 'active' : ''}`} style={{display: currentPath === '/sme/records' ? 'block' : 'none'}}>
        <div className="topbar"><div><h1>Hồ sơ giải ngân</h1><p className="sub">Toàn bộ hồ sơ đã nộp — bấm vào một hồ sơ để xem chi tiết tiến trình.</p></div></div>
        <div className="card">
          <div className="search-row">
            <div className="search-input"><svg className="icon" width="15" height="15" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/></svg><input placeholder="Tìm theo mã hồ sơ..." value={recordsSearch} onChange={(e) => setRecordsSearch(e.target.value)} /></div>
            <div className="chip-row">
              <button className={`chip ${recordsFilter === 'Tất cả' ? 'active' : ''}`} onClick={() => setRecordsFilter('Tất cả')}>Tất cả</button>
              <button className={`chip ${recordsFilter === 'Đang xử lý' ? 'active' : ''}`} onClick={() => setRecordsFilter('Đang xử lý')}>Đang xử lý</button>
              <button className={`chip ${recordsFilter === 'Cần bổ sung' ? 'active' : ''}`} onClick={() => setRecordsFilter('Cần bổ sung')}>Cần bổ sung</button>
              <button className={`chip ${recordsFilter === 'Hoàn tất' ? 'active' : ''}`} onClick={() => setRecordsFilter('Hoàn tất')}>Hoàn tất</button>
            </div>
          </div>
          <table><thead><tr><th>Mã hồ sơ</th><th>Loại</th><th>Giá trị</th><th>Ngày nộp</th><th>Trạng thái</th><th></th></tr></thead>
            <tbody>
              {documents.filter((doc: any) => {
                  if (recordsSearch && !(doc.id && doc.id.toLowerCase().includes(recordsSearch.toLowerCase()))) return false;
                  if (recordsFilter === 'Tất cả') return true;
                  if (recordsFilter === 'Đang xử lý') return doc.status === 'Cần rà soát' || doc.status === 'Đang xử lý' || doc.status === 'Đang đối chiếu';
                  if (recordsFilter === 'Cần bổ sung') return doc.status === 'Cần bổ sung' || doc.status === 'Cảnh báo' || doc.status === 'Đã chặn';
                  if (recordsFilter === 'Hoàn tất') return doc.status === 'Đã duyệt' || doc.status === 'Hoàn tất' || doc.status === 'Thành công' || doc.status === 'Đã xác minh' || doc.status === 'Phê duyệt';
                  return true;
                }).map((doc: any, idx: number) => (
                <tr key={idx}>
                  <td className="mono">{doc.id}</td>
                  <td>{doc.type}</td>
                  <td>{doc.total_amount || 'Liên hệ ngân hàng'}</td>
                  <td>{doc.issue_date || 'Hôm nay'}</td>
                  <td>
                    <span className={`pill ${doc.status === 'Đã duyệt' || doc.status === 'Hoàn tất' || doc.status === 'Đã xác minh' ? 'green' : doc.status === 'Đã chặn' || doc.status === 'Cần bổ sung' ? 'red' : 'amber'}`}>
                      <span className="d"></span>{doc.status}
                    </span>
                  </td>
                  <td><button className="mini-btn" onClick={() => setViewingDoc(doc)}>Chi tiết</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---- biz-upload ---- */}
      <div className={`page ${currentPath === '/sme/upload' ? 'active' : ''}`} style={{display: currentPath === '/sme/upload' ? 'block' : 'none'}}>
        <div className="topbar"><div><h1>Tải chứng từ</h1><p className="sub">Kéo thả hoặc chọn tệp — hệ thống tự động quét OCR và đối chiếu ngay khi tải lên.</p></div></div>
        
        {!uploadedFile ? (
          <div className="card">
            <div className="dropzone" style={{cursor: 'pointer'}} onClick={() => document.getElementById('sme-file-upload')?.click()}>
              <div className="icon-wrap"><svg className="icon" width="20" height="20" viewBox="0 0 24 24"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M4 19h16"/></svg></div>
              <h3>Kéo thả tệp vào đây hoặc Click để tải lên</h3><p>Hỗ trợ PDF, JPG, PNG — tối đa 10MB mỗi tệp</p>
              <button className="btn-outline" onClick={(e) => { e.stopPropagation(); document.getElementById('sme-file-upload')?.click(); }}>Chọn tệp</button>
            </div>
          </div>
        ) : (
          <div className="upload-results two-col" style={{ alignItems: 'start' }}>
            <div className="card" style={{ margin: 0 }}>
              <div className="card-head">
                <h2>Bản xem trước chứng từ</h2>
                <button className="mini-btn ghost-red" onClick={() => setUploadedFile(null)}>Xoá tệp</button>
              </div>
              <div style={{ background: 'var(--slate-100)', borderRadius: '8px', overflow: 'hidden', height: 'calc(100vh - 220px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
                <img src={uploadedFile} alt="Uploaded document preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '4px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} />
              </div>
            </div>
            
            <div className="card" style={{ margin: 0 }}>
              <div className="card-head"><h2>Kết quả phân tích tự động</h2></div>
              {isAnalyzing ? (
                <div style={{ padding: '40px 0', textAlign: 'center' }}>
                  <div className="spinner" style={{ display: 'inline-block', width: '30px', height: '30px', borderTopColor: 'var(--blue-700)', borderColor: 'rgba(29, 78, 216, 0.2)', borderWidth: '3px', marginBottom: '16px' }}></div>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--blue-700)' }}>Đang quét bằng AI...</h3>
                  <p style={{ fontSize: '13px', color: 'var(--slate-500)', marginTop: '8px' }}>Hệ thống đang trích xuất dữ liệu OCR và đối chiếu danh tính</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                    <div style={{ padding: '16px', background: 'var(--sky-50)', borderRadius: '8px', border: '1px solid var(--slate-200)' }}>
                      <div style={{ fontSize: '12px', color: 'var(--slate-500)', marginBottom: '4px' }}>Tên đơn vị phát hành</div>
                      <div style={{ fontSize: '14px', fontWeight: 600 }}>CÔNG TY TNHH ABC</div>
                    </div>
                    <div style={{ padding: '16px', background: 'var(--sky-50)', borderRadius: '8px', border: '1px solid var(--slate-200)' }}>
                      <div style={{ fontSize: '12px', color: 'var(--slate-500)', marginBottom: '4px' }}>Mã số thuế</div>
                      <div style={{ fontSize: '14px', fontWeight: 600 }}>0312 456 789 <span className="pill green" style={{ marginLeft: '8px' }}><span className="d"></span>Hợp lệ</span></div>
                    </div>
                    <div style={{ padding: '16px', background: 'var(--sky-50)', borderRadius: '8px', border: '1px solid var(--slate-200)' }}>
                      <div style={{ fontSize: '12px', color: 'var(--slate-500)', marginBottom: '4px' }}>Số hoá đơn / Hợp đồng</div>
                      <div style={{ fontSize: '14px', fontWeight: 600 }}>HD-2026-0991</div>
                    </div>
                    <div style={{ padding: '16px', background: 'var(--sky-50)', borderRadius: '8px', border: '1px solid var(--slate-200)' }}>
                      <div style={{ fontSize: '12px', color: 'var(--slate-500)', marginBottom: '4px' }}>Tổng giá trị</div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--blue-700)' }}>150,000,000 VNĐ</div>
                    </div>
                  </div>
                  
                  <div style={{ background: 'var(--amber-100)', padding: '16px', borderRadius: '8px', border: '1px solid #fcd34d' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--amber-600)', marginBottom: '6px' }}>Nhận xét hệ thống</h4>
                    <p style={{ fontSize: '12.5px', color: 'var(--slate-600)', lineHeight: 1.5 }}>Chứng từ hợp lệ, số liệu khớp với thông tin đã đăng ký. Vui lòng kiểm tra lại chất lượng hình ảnh ở phần mộc đỏ nếu cần thiết.</p>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                    <button className="btn-primary" onClick={() => { 
                      if (onUploadComplete) {
                        onUploadComplete({ 
                          id: 'HD-' + Math.floor(Math.random() * 9000 + 1000), 
                          company: 'CÔNG TY TNHH ABC', 
                          type: 'Hoá đơn VAT', 
                          riskScore: '15 / 100', 
                          status: 'Cần rà soát', 
                          imageUrl: uploadedFile,
                          invoice_no: 'HD-2026-0991',
                          tax_code: '0312 456 789',
                          total_amount: '150,000,000 VNĐ',
                          comment: 'Chứng từ hợp lệ, số liệu khớp với thông tin đã đăng ký. Vui lòng kiểm tra lại chất lượng hình ảnh ở phần mộc đỏ nếu cần thiết.',
                          riskLevel: 'Thấp',
                          riskPercentage: 15
                        });
                      }
                      alert('Đã gửi chứng từ thành công! Hệ thống sẽ chuyển sang trạng thái chờ đối chiếu.'); 
                      setUploadedFile(null); 
                      navigate('/sme/records'); 
                    }} style={{ flex: 1, padding: '12px' }}>Xác nhận nộp</button>
                    <button className="btn-outline" style={{ flex: 1, padding: '12px' }} onClick={() => setUploadedFile(null)}>Tải lại ảnh</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ---- biz-history ---- */}
      <div className={`page ${currentPath === '/sme/history' ? 'active' : ''}`} style={{display: currentPath === '/sme/history' ? 'block' : 'none'}}>
        <div className="topbar"><div><h1>Lịch sử giao dịch</h1><p className="sub">Toàn bộ giao dịch giải ngân đã hoàn tất.</p></div>
          <div className="top-actions"><button className="mini-btn" onClick={exportToExcel}>Xuất Excel</button></div>
        </div>
        <div className="card">
          <div className="search-row">
            <div className="search-input"><svg className="icon" width="15" height="15" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/></svg><input placeholder="Tìm theo mã giao dịch..." value={historySearch} onChange={(e) => setHistorySearch(e.target.value)} /></div>
            <input type="date" className="chip" style={{padding: '8px 12px'}} value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            <input type="date" className="chip" style={{padding: '8px 12px'}} value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </div>
          <table><thead><tr><th>Mã giao dịch</th><th>Hồ sơ</th><th>Số tiền</th><th>Ngày giải ngân</th><th>Trạng thái</th></tr></thead>
            <tbody>
              {documents.filter((doc: any) => {
                if (!doc) return false;
                  const tId = doc.transactionId || `GD-${doc.id}`;
                  if (historySearch && !tId.toLowerCase().includes(historySearch.toLowerCase())) return false;
                const isFinished = doc.status && ['Đã duyệt', 'Hoàn tất', 'Thành công', 'Đã huỷ', 'Đã chặn'].includes(doc.status);
                if (!isFinished) return false;
                
                // Simple date filter logic (assuming doc.issue_date is DD/MM/YYYY)
                if (fromDate || toDate) {
                  const parseDate = (dStr: string) => {
                    const parts = dStr.split('/');
                    if (parts.length === 3) return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
                    return new Date();
                  };
                  const docDate = parseDate(doc.issue_date || '24/06/2026');
                  if (fromDate && docDate < new Date(fromDate)) return false;
                  if (toDate && docDate > new Date(toDate)) return false;
                }
                return true;
              }).map((doc: any, idx: number) => (
                <tr key={idx} onClick={() => setViewingDoc(doc)} style={{ cursor: 'pointer' }} className="hover-row">
                  <td className="mono">GD-{(doc.id || '').replace('HD-', '')}</td>
                  <td>{doc.id}</td>
                  <td>{doc.total_amount || 'Liên hệ ngân hàng'}</td>
                  <td>{doc.issue_date || '24/06/2026'}</td>
                  <td>
                    <span className={`pill ${['Đã duyệt', 'Hoàn tất', 'Thành công'].includes(doc.status) ? 'green' : 'slate'}`}>
                      <span className="d"></span>{doc.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---- biz-support ---- */}
      <div className={`page ${currentPath === '/sme/support' ? 'active' : ''}`} style={{display: currentPath === '/sme/support' ? 'block' : 'none'}}>
        <div className="topbar"><div><h1>Hỗ trợ</h1><p className="sub">Câu hỏi thường gặp và kênh liên hệ với bộ phận hỗ trợ doanh nghiệp.</p></div></div>
        <div className="two-col">
          <div className="card">
            <div className="card-head"><h2>Câu hỏi thường gặp</h2></div>
            <div>
              <div className="acc-item"><div className="acc-head">Chứng từ bị từ chối thì phải làm gì?</div><div className="acc-body" style={{maxHeight:'200px'}}><p>Vào mục "Tải chứng từ", tải lại bản scan rõ nét thay thế cho tệp bị đánh dấu. Hệ thống sẽ đối chiếu lại tự động trong vòng vài phút.</p></div></div>
              <div className="acc-item"><div className="acc-head">Thời gian thẩm định trung bình là bao lâu?</div><div className="acc-body" style={{maxHeight:'200px'}}><p>Từ 1–3 ngày làm việc tuỳ khối lượng chứng từ và mức độ rủi ro được hệ thống đánh giá.</p></div></div>
            </div>
          </div>
          <div className="card">
            <div className="card-head"><h2>Gửi yêu cầu hỗ trợ</h2></div>
            <form onSubmit={handleSupportSubmit}>
              <div className="form-grid">
                <div className="field"><label>Họ tên</label><input type="text" placeholder="Nguyễn Văn A" value={supportForm.name} onChange={e => setSupportForm({...supportForm, name: e.target.value})} /></div>
                <div className="field"><label>Email</label><input type="text" placeholder="ten@congty.com.vn" value={supportForm.email} onChange={e => setSupportForm({...supportForm, email: e.target.value})} /></div>
              </div>
              <div className="field"><label>Chủ đề</label><input type="text" placeholder="Vd: Không tải được chứng từ" value={supportForm.subject} onChange={e => setSupportForm({...supportForm, subject: e.target.value})} /></div>
              <div className="field"><label>Nội dung</label><textarea placeholder="Mô tả chi tiết vấn đề bạn gặp phải..." value={supportForm.message} onChange={e => setSupportForm({...supportForm, message: e.target.value})}></textarea></div>
              <button className="btn-primary" type="submit">Gửi yêu cầu</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SMEPortalView;
