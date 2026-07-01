import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const AdminDashboard = ({ stats, documents, onSelectDoc, onUpload, isScanning }: any) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [notifOpen, setNotifOpen] = useState(false);
  const [chartMounted, setChartMounted] = useState(false);
  const [hoveredChartIdx, setHoveredChartIdx] = useState<number | null>(null);
  const [hoveredLineIdx, setHoveredLineIdx] = useState<number | null>(null);
  const [queueFilter, setQueueFilter] = useState('Tất cả');
  const [alertsFilter, setAlertsFilter] = useState('Tất cả');
  const [directorySearch, setDirectorySearch] = useState('');
  const [directoryFilter, setDirectoryFilter] = useState('Tất cả');
  const [actionedDoc, setActionedDoc] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  const handleExport = (timeframe: string) => {
    const headers = ["Mã hồ sơ", "Doanh nghiệp", "Loại chứng từ", "Điểm rủi ro", "Trạng thái"];
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + headers.join(",") + "\n" + `(Dữ liệu tổng hợp ${timeframe})`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `bao_cao_${timeframe.replace(/ /g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    setExportOpen(false);
  };

  React.useEffect(() => {
    // Trigger animation shortly after mount
    setTimeout(() => setChartMounted(true), 100);
  }, []);

  const chartData = [
    { label: 'T1', approved: 70, rejected: 14, total: 84 },
    { label: 'T2', approved: 85, rejected: 10, total: 95 },
    { label: 'T3', approved: 60, rejected: 22, total: 82 },
    { label: 'T4', approved: 95, rejected: 8, total: 103 },
    { label: 'T5', approved: 78, rejected: 16, total: 94 },
  ];
  const maxVal = 120; // for scaling

  return (
    <>
      {/* ---- admin-overview ---- */}
      <div className={`page ${currentPath === '/admin/dashboard' || currentPath === '/admin/overview' ? 'active' : ''}`} style={{display: (currentPath === '/admin/dashboard' || currentPath === '/admin/overview') ? 'block' : 'none'}}>
        <div className="topbar"><div><h1>Tổng quan hoạt động</h1><p className="sub">Số liệu thẩm định và phân bổ rủi ro toàn hệ thống.</p></div></div>
        <div className="stat-grid">
          <div className="stat-card"><div className="icon-wrap" style={{background: 'var(--sky-100)', color: 'var(--blue-700)'}}><svg className="icon" width="17" height="17" viewBox="0 0 24 24"><path d="M9 11H3v9h6z"/><path d="M21 4h-6v16h6z"/></svg></div><div className="num">9</div><div className="lbl">Hồ sơ chờ xử lý</div></div>
          <div className="stat-card"><div className="icon-wrap" style={{background: 'var(--red-100)', color: 'var(--red-600)'}}><svg className="icon" width="17" height="17" viewBox="0 0 24 24"><path d="M10.3 3.9 2.6 18a1.7 1.7 0 0 0 1.5 2.6h15.8a1.7 1.7 0 0 0 1.5-2.6L13.7 3.9a1.7 1.7 0 0 0-3.4 0Z"/></svg></div><div className="num">3</div><div className="lbl">Rủi ro cao — cần rà soát gấp</div></div>
          <div className="stat-card"><div className="icon-wrap" style={{background: 'var(--green-100)', color: 'var(--green-600)'}}><svg className="icon" width="17" height="17" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg></div><div className="num">128</div><div className="lbl">Đã duyệt trong tháng</div></div>
          <div className="stat-card"><div className="icon-wrap" style={{background: 'var(--sky-100)', color: 'var(--blue-700)'}}><svg className="icon" width="17" height="17" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg></div><div className="num">6.4 phút</div><div className="lbl">Thời gian xử lý TB / hồ sơ</div></div>
        </div>
        <div className="two-col">
          <div className="card">
            <div className="card-head"><h2>Hồ sơ duyệt theo tuần</h2></div>
            <div className="bar-chart" style={{ position: 'relative', height: '220px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', paddingBottom: '30px', paddingTop: '20px', paddingLeft: '40px' }}>
              
              {/* Y-Axis Labels */}
              <div style={{ position: 'absolute', top: '20px', bottom: '30px', left: '0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: 'var(--slate-400)', fontSize: '11px', textAlign: 'right', width: '25px' }}>
                <span>120</span>
                <span>90</span>
                <span>60</span>
                <span>30</span>
                <span>0</span>
              </div>

              {/* Grid Lines */}
              <div style={{ position: 'absolute', top: '20px', bottom: '30px', left: '40px', right: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', pointerEvents: 'none', zIndex: 0 }}>
                {[0,1,2,3,4].map(i => <div key={i} style={{ width: '100%', height: '1px', background: 'var(--slate-100)' }}></div>)}
              </div>

              {/* SVG Line Chart Overlay */}
                                          <svg style={{ position: 'absolute', top: '20px', left: '40px', width: 'calc(100% - 50px)', height: 'calc(100% - 50px)', overflow: 'visible', zIndex: 1 }}>
                {(() => {
                  const data = [84, 95, 82, 103, 94];
                  const maxVal = 120;
                  return data.map((d, i) => {
                    if (i === data.length - 1) return null;
                    const next = data[i + 1];
                    const x1 = `${(i + 0.5) * (100 / data.length)}%`;
                    const y1 = `${100 - ((d / maxVal) * 100)}%`;
                    const x2 = `${(i + 1.5) * (100 / data.length)}%`;
                    const y2 = `${100 - ((next / maxVal) * 100)}%`;
                    return <line key={`l-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--blue-600)" strokeWidth="2.5" strokeLinecap="round" />;
                  });
                })()}
                {(() => {
                  const data = [84, 95, 82, 103, 94];
                  const maxVal = 120;
                  return data.map((d, i) => {
                    const cx = `${(i + 0.5) * (100 / data.length)}%`;
                    const cy = `${100 - ((d / maxVal) * 100)}%`;
                    const isHovered = hoveredLineIdx === i;
                    return <circle key={`c-${i}`} cx={cx} cy={cy} r={isHovered ? "6" : "4"} fill="#fff" stroke="var(--blue-600)" strokeWidth={isHovered ? "3" : "2"} style={{ transition: 'all 0.2s' }} />;
                  });
                })()}
              </svg>
              {/* Full column hover zones */}
              <div style={{ position: 'absolute', top: '20px', left: '40px', width: 'calc(100% - 50px)', height: 'calc(100% - 50px)', zIndex: 10, display: 'flex' }}>
                {(() => {
                  const data = [84, 95, 82, 103, 94];
                  return data.map((d, i) => {
                    const isHovered = hoveredLineIdx === i;
                    const cy = `${100 - ((d / 500) * 100)}%`;
                    return (
                      <div key={`hz-${i}`} style={{ flex: 1, height: '100%', position: 'relative', cursor: 'pointer' }}
                           onMouseEnter={() => setHoveredLineIdx(i)} onMouseLeave={() => setHoveredLineIdx(null)} onClick={() => setHoveredLineIdx(i === hoveredLineIdx ? null : i)}>
                        <div style={{
                          position: 'absolute', top: cy, left: '50%', transform: 'translate(-50%, -100%)', marginTop: '-12px',
                          background: '#1e293b', color: '#fff', padding: '6px 10px', borderRadius: '6px',
                          fontSize: '12px', whiteSpace: 'nowrap', pointerEvents: 'none',
                          opacity: isHovered ? 1 : 0, visibility: isHovered ? 'visible' : 'hidden',
                          transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                        }}>
                          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Tháng {i + 1}</div>
                          <div style={{ color: '#60a5fa' }}>Tổng: {d} hồ sơ</div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>

              {/* Bars and Tooltips */}
              {chartData.map((data, idx) => (
                <div key={idx} className="bar-col" style={{ position: 'relative', width: '40px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', cursor: 'pointer', zIndex: 2 }}
                     onMouseEnter={() => setHoveredChartIdx(idx)} onMouseLeave={() => setHoveredChartIdx(null)}>
                  
                  {/* Tooltip */}
                  <div style={{
                    position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)',
                    background: '#1e293b', color: '#fff', padding: '8px 12px', borderRadius: '6px',
                    fontSize: '12px', whiteSpace: 'nowrap', zIndex: 10,
                    opacity: hoveredChartIdx === idx ? 1 : 0, visibility: hoveredChartIdx === idx ? 'visible' : 'hidden',
                    transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                  }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Tuần {idx + 1}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#60a5fa' }}>Đã duyệt: {data.approved}</span>
                      <span style={{ color: '#f87171' }}>Từ chối: {data.rejected}</span>
                    </div>
                    <div style={{ color: '#fbbf24', marginTop: '2px', fontWeight: 600 }}>Tổng: {data.total}</div>
                  </div>

                  <div className="bar-pair" style={{ height: '100%', display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
                    <div className="bar" style={{ 
                      height: chartMounted ? `${(data.approved / maxVal) * 100}%` : '0%', 
                      transition: 'height 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)' 
                    }}></div>
                    <div className="bar rej" style={{ 
                      height: chartMounted ? `${(data.rejected / maxVal) * 100}%` : '0%', 
                      transition: 'height 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.1s' 
                    }}></div>
                  </div>
                  <div className="lbl" style={{ position: 'absolute', bottom: '-25px', width: '100%', textAlign: 'center', fontSize: '13px', color: 'var(--slate-500)', fontWeight: hoveredChartIdx === idx ? 600 : 400 }}>{data.label}</div>
                </div>
              ))}
            </div>
            <div className="legend" style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '16px' }}>
              <span><span className="sw" style={{background: 'var(--blue-600)'}}></span>Đã duyệt</span>
              <span><span className="sw" style={{background: 'var(--red-100)'}}></span>Từ chối</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg width="14" height="4" style={{ display: 'block' }}><rect width="14" height="4" fill="var(--amber-500)" rx="2" /></svg>Tổng hồ sơ
              </span>
            </div>
          </div>
          <div className="card">
            <div className="card-head"><h2>Phân bổ mức rủi ro</h2></div>
            <div className="risk-ring" style={{marginBottom: '14px'}}>
              <div className="ring" style={{background: 'conic-gradient(var(--red-600) 0% 18%, var(--amber-600) 18% 42%, var(--green-600) 42% 100%)'}}><div style={{width: '48px', height: '48px', borderRadius: '50%', background: 'var(--white)'}}></div></div>
              <div style={{fontSize: '12.5px', color: 'var(--slate-600)', lineHeight: '1.7'}}>
                <div><span className="pill red" style={{padding: 0}}><span className="d"></span></span> Cao — 18%</div>
                <div><span className="pill amber" style={{padding: 0}}><span className="d"></span></span> Trung bình — 24%</div>
                <div><span className="pill green" style={{padding: 0}}><span className="d"></span></span> Thấp — 58%</div>
              </div>
            </div>
            <div className="notice" style={{margin: 0}}><svg className="icon" width="16" height="16" viewBox="0 0 24 24"><path d="M12 9v4"/><path d="M12 17h.01"/><circle cx="12" cy="12" r="9"/></svg><div><b>3 hồ sơ rủi ro cao cần rà soát trong hôm nay</b><p>Xem chi tiết tại mục Cảnh báo gian lận.</p></div></div>
          </div>
        </div>
      </div>

      {/* ---- admin-queue ---- */}
      <div className={`page ${currentPath === '/admin/queue' ? 'active' : ''}`} style={{display: currentPath === '/admin/queue' ? 'block' : 'none'}}>
        <div className="topbar">
          <div><h1>Hàng đợi thẩm định chứng từ</h1><p className="sub">Xếp hạng theo mức độ rủi ro — ưu tiên xử lý hồ sơ có cảnh báo cao trước.</p></div>
          <div className="top-actions" style={{ position: 'relative' }}>
            <button className="icon-btn" onClick={() => setNotifOpen(!notifOpen)}>
              <svg className="icon" width="17" height="17" viewBox="0 0 24 24"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>
              {documents && documents.length > 0 && <span className="dot-alert"></span>}
              <div className={`notif-panel ${notifOpen ? 'show' : ''}`} id="notif-admin">
                <div className="nh">Thông báo mới</div>
                {documents && documents.length > 0 ? documents.map((doc: any, i: number) => (
                  <div key={i} className="notif-item">
                    <b>Doanh nghiệp {doc.company}</b> vừa tải lên hồ sơ {doc.id}.<br/>
                    <span style={{ color: 'var(--blue-600)' }}>Loại chứng từ: {doc.type || 'Hoá đơn VAT'}</span><br/>
                    <span>Vừa xong</span>
                  </div>
                )) : (
                  <div className="notif-item" style={{ textAlign: 'center', color: 'var(--slate-400)' }}>Không có hồ sơ tải lên mới</div>
                )}
              </div>
            </button>
            <div style={{ position: 'relative' }}>
              <button className="mini-btn" style={{padding: '9px 16px'}} onClick={() => setExportOpen(!exportOpen)}>Xuất báo cáo</button>
              {exportOpen && (
                <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', background: 'var(--white)', border: '1px solid var(--slate-200)', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', zIndex: 50, width: '160px', overflow: 'hidden' }}>
                  <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--slate-100)', cursor: 'pointer', fontSize: '13px' }} onClick={() => handleExport('trong ngày')} className="hover-bg">Trong ngày</div>
                  <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--slate-100)', cursor: 'pointer', fontSize: '13px' }} onClick={() => handleExport('trong tuần')} className="hover-bg">Trong tuần</div>
                  <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--slate-100)', cursor: 'pointer', fontSize: '13px' }} onClick={() => handleExport('trong tháng')} className="hover-bg">Trong tháng</div>
                  <div style={{ padding: '10px 14px', cursor: 'pointer', fontSize: '13px' }} onClick={() => handleExport('trong năm')} className="hover-bg">Trong năm</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="stat-grid">
          <div className="stat-card"><div className="icon-wrap" style={{background: 'var(--sky-100)', color: 'var(--blue-700)'}}><svg className="icon" width="17" height="17" viewBox="0 0 24 24"><path d="M9 11H3v9h6z"/><path d="M21 4h-6v16h6z"/></svg></div><div className="num">9</div><div className="lbl">Hồ sơ chờ xử lý</div></div>
          <div className="stat-card"><div className="icon-wrap" style={{background: 'var(--red-100)', color: 'var(--red-600)'}}><svg className="icon" width="17" height="17" viewBox="0 0 24 24"><path d="M10.3 3.9 2.6 18a1.7 1.7 0 0 0 1.5 2.6h15.8a1.7 1.7 0 0 0 1.5-2.6L13.7 3.9a1.7 1.7 0 0 0-3.4 0Z"/></svg></div><div className="num">3</div><div className="lbl">Rủi ro cao — cần rà soát gấp</div></div>
          <div className="stat-card"><div className="icon-wrap" style={{background: 'var(--green-100)', color: 'var(--green-600)'}}><svg className="icon" width="17" height="17" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg></div><div className="num">128</div><div className="lbl">Đã duyệt trong tháng</div></div>
          <div className="stat-card"><div className="icon-wrap" style={{background: 'var(--sky-100)', color: 'var(--blue-700)'}}><svg className="icon" width="17" height="17" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg></div><div className="num">6.4 phút</div><div className="lbl">Thời gian xử lý TB / hồ sơ</div></div>
        </div>

        <div className="two-col" style={{gridTemplateColumns: '1fr 1.3fr'}}>
          <div className="card">
            <div className="card-head"><h2>Hồ sơ #HD-2026-0091</h2><span className="pill red"><span className="d"></span>Rủi ro cao</span></div>
            <div className="risk-ring">
              <div className="ring" style={{background: 'conic-gradient(var(--red-600) 0% 78%, var(--slate-100) 78% 100%)'}}>
                <div style={{width: '48px', height: '48px', borderRadius: '50%', background: 'var(--white)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}><b style={{color: 'var(--red-600)'}}>78</b><span style={{color: 'var(--slate-400)'}}>/100</span></div>
              </div>
              <div><div style={{fontSize: '13px', fontWeight: 600}}>Điểm rủi ro tổng hợp</div><div style={{fontSize: '12px', color: 'var(--slate-600)', marginTop: '2px'}}>Dựa trên đối chiếu chữ ký, con dấu và dữ liệu liên ngân hàng</div></div>
            </div>
            <div className="flag-list">
              <div className="flag-item"><svg className="icon" width="16" height="16" viewBox="0 0 24 24"><path d="M10.3 3.9 2.6 18a1.7 1.7 0 0 0 1.5 2.6h15.8a1.7 1.7 0 0 0 1.5-2.6L13.7 3.9a1.7 1.7 0 0 0-3.4 0Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg><div><b>Con dấu không khớp mẫu lưu</b><p>Con dấu trên hoá đơn #1187 lệch 6% so với mẫu đăng ký của doanh nghiệp.</p></div></div>
              <div className="flag-item"><svg className="icon" width="16" height="16" viewBox="0 0 24 24"><path d="M10.3 3.9 2.6 18a1.7 1.7 0 0 0 1.5 2.6h15.8a1.7 1.7 0 0 0 1.5-2.6L13.7 3.9a1.7 1.7 0 0 0-3.4 0Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg><div><b>Trùng số hoá đơn với hồ sơ khác</b><p>Số hoá đơn VAT-1187 đã xuất hiện trong hồ sơ HD-2026-0044 nộp trước đó 14 ngày.</p></div></div>
              <div className="flag-item ok"><svg className="icon" width="16" height="16" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg><div><b>Thông tin doanh nghiệp hợp lệ</b><p>Mã số thuế và giấy phép kinh doanh khớp với cơ sở dữ liệu quốc gia.</p></div></div>
            </div>
            <div className="row-actions" style={{marginTop: '18px'}}>
              <button className="mini-btn blue" style={{flex: 1, padding: '10px'}} onClick={() => { alert('Hồ sơ đã được phê duyệt thành công!'); setActionedDoc(true); }}>Duyệt hồ sơ</button>
              <button className="mini-btn ghost-red" style={{flex: 1, padding: '10px'}} onClick={() => { alert('Hồ sơ đã bị từ chối.'); setActionedDoc(true); }}>Từ chối</button>
              <button className="mini-btn" style={{flex: 1, padding: '10px'}} onClick={() => alert('Đã gửi yêu cầu bổ sung chứng từ đến doanh nghiệp.')}>Yêu cầu bổ sung</button>
            </div>
          </div>
          <div className="card">
            <div className="card-head"><h2>Xem chứng từ — Hoá đơn VAT #1187</h2><div className="row-actions"><button className="mini-btn">Phóng to</button><button className="mini-btn">Bản gốc</button></div></div>
            <div className="doc-viewer"><svg className="icon" width="34" height="34" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/></svg><span style={{fontSize: '12.5px'}}>Xem trước tài liệu — invoice_1187_scan.pdf</span></div>
          </div>
        </div>

        <div className="card" style={{marginTop: '18px'}}>
          <div className="card-head">
            <h2>Danh sách hồ sơ trong hàng đợi</h2>
            <div className="chip-row">
              {['Tất cả', 'Rủi ro cao', 'Trung bình', 'Thấp'].map(f => (
                <button key={f} className={`chip ${queueFilter === f ? 'active' : ''}`} onClick={() => setQueueFilter(f)}>{f}</button>
              ))}
            </div>
          </div>
          <table><thead><tr><th>Mã hồ sơ</th><th>Doanh nghiệp</th><th>Loại chứng từ</th><th>Điểm rủi ro</th><th>Trạng thái</th><th></th></tr></thead>
            <tbody>
              {(() => {
                const staticDocs = [
                  ...(actionedDoc ? [] : [{ id: 'HD-2026-0091', company: 'Công ty TNHH Phúc An', type: 'Hoá đơn VAT', riskScore: 78, status: 'Cần rà soát' }]),
                  { id: 'HD-2026-0088', company: 'Công ty CP Đại Phát', type: 'Biên bản giao hàng', riskScore: 44, status: 'Đang đối chiếu' },
                  { id: 'HD-2026-0079', company: 'Công ty TNHH Minh Khang', type: 'Hợp đồng mua bán', riskScore: 12, status: 'Sẵn sàng duyệt' },
                  { id: 'HD-2026-0075', company: 'Công ty CP Sông Hồng', type: 'Sao kê tài khoản', riskScore: 8, status: 'Đã duyệt' },
                ];
                const allDocs = [...(documents || []).map((d: any) => ({ ...d, riskScore: d.riskScore || 85, type: d.type || 'Hoá đơn VAT' })), ...staticDocs];
                
                return allDocs.filter(doc => {
                  if (queueFilter === 'Tất cả') return true;
                  const score = doc.riskScore || 0;
                  if (queueFilter === 'Rủi ro cao') return score >= 70;
                  if (queueFilter === 'Trung bình') return score >= 30 && score < 70;
                  if (queueFilter === 'Thấp') return score < 30;
                  return true;
                }).map((doc: any, i: number) => {
                  const isHigh = doc.riskScore >= 70;
                  const isMed = doc.riskScore >= 30 && doc.riskScore < 70;
                  const pillColor = isHigh ? 'red' : (isMed ? 'amber' : 'green');
                  return (
                    <tr key={i} style={doc.company !== 'Công ty TNHH Phúc An' && !doc.company?.includes('Đại Phát') && !doc.company?.includes('Minh Khang') && !doc.company?.includes('Sông Hồng') ? { background: 'var(--amber-50)' } : {}}>
                      <td className="mono">{doc.id}</td>
                      <td>{doc.company}</td>
                      <td>{doc.type}</td>
                      <td><span className={`pill ${pillColor}`}><span className="d"></span>{doc.riskScore} / 100</span></td>
                      <td><span className={`pill ${doc.status === 'Đã duyệt' ? 'slate' : pillColor}`}>{doc.status || 'Cần rà soát'}</span></td>
                      <td><button className={`mini-btn ${isHigh ? 'blue' : ''}`} onClick={() => { if(onSelectDoc) onSelectDoc(doc) }}>{doc.status === 'Đã duyệt' ? 'Xem' : 'Mở'}</button></td>
                    </tr>
                  );
                });
              })()}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---- admin-alerts ---- */}
      <div className={`page ${currentPath === '/admin/alerts' ? 'active' : ''}`} style={{display: currentPath === '/admin/alerts' ? 'block' : 'none'}}>
        <div className="topbar"><div><h1>Cảnh báo gian lận</h1><p className="sub">Toàn bộ bất thường được phát hiện trên các hồ sơ đang xử lý.</p></div></div>
        <div className="card">
          <div className="search-row">
            <div className="search-input"><svg className="icon" width="15" height="15" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/></svg><input placeholder="Tìm theo mã hồ sơ hoặc doanh nghiệp..." /></div>
            <div className="chip-row">
              {['Tất cả', 'Cao', 'Trung bình'].map(f => (
                <button key={f} className={`chip ${alertsFilter === f ? 'active' : ''}`} onClick={() => setAlertsFilter(f)}>{f}</button>
              ))}
            </div>
          </div>
          <table><thead><tr><th>Mã hồ sơ</th><th>Doanh nghiệp</th><th>Loại cảnh báo</th><th>Mức độ</th><th></th></tr></thead>
            <tbody>
              {(() => {
                const staticAlerts = [
                  { id: 'HD-2026-0091', company: 'Công ty TNHH Phúc An', warning: 'Con dấu không khớp mẫu lưu', level: 'Cao', doc: documents?.[0] || { id: 'HD-2026-0091', company: 'Công ty TNHH Phúc An', riskScore: 78 } },
                  { id: 'HD-2026-0091', company: 'Công ty TNHH Phúc An', warning: 'Trùng số hoá đơn', level: 'Cao', doc: documents?.[0] || { id: 'HD-2026-0091', company: 'Công ty TNHH Phúc An', riskScore: 78 } },
                  { id: 'HD-2026-0088', company: 'Công ty CP Đại Phát', warning: 'Chữ ký nghiêng bất thường', level: 'Trung bình', doc: { id: 'HD-2026-0088', company: 'Công ty CP Đại Phát', riskScore: 44 } },
                ];
                
                const dynamicAlerts = (documents || []).filter((d: any) => d.riskScore >= 30).map((d: any) => ({
                  id: d.id, company: d.company, warning: 'Rủi ro AI phát hiện bất thường', level: d.riskScore >= 70 ? 'Cao' : 'Trung bình', doc: d
                }));
                
                const allAlerts = [...dynamicAlerts, ...staticAlerts];
                
                return allAlerts.filter(a => alertsFilter === 'Tất cả' || a.level === alertsFilter).map((a, i) => (
                  <tr key={i} onClick={() => { if(onSelectDoc) onSelectDoc(a.doc) }} style={{ cursor: 'pointer' }} className="hover-row">
                    <td className="mono">{a.id}</td>
                    <td>{a.company}</td>
                    <td>{a.warning}</td>
                    <td><span className={`pill ${a.level === 'Cao' ? 'red' : 'amber'}`}><span className="d"></span>{a.level}</span></td>
                    <td><button className="mini-btn">Xem</button></td>
                  </tr>
                ));
              })()}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---- admin-directory ---- */}
      <div className={`page ${currentPath === '/admin/directory' ? 'active' : ''}`} style={{display: currentPath === '/admin/directory' ? 'block' : 'none'}}>
          <div className="topbar"><div><h1>Danh sách doanh nghiệp</h1><p className="sub">Hồ sơ pháp lý và lịch sử tín dụng của các doanh nghiệp đang giao dịch.</p></div></div>
          <div className="card">
            <div className="search-row" style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px' }}>
              <div className="search-input" style={{ flex: 1 }}>
                <svg className="icon" width="15" height="15" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/></svg>
                <input placeholder="Tìm theo tên doanh nghiệp hoặc MST..." value={directorySearch} onChange={(e) => setDirectorySearch(e.target.value)} />
              </div>
              <div className="filter-chips">
                {['Tất cả', 'Cao', 'Trung bình', 'Thấp'].map(f => (
                  <button key={f} className={`chip ${directoryFilter === f ? 'active' : ''}`} onClick={() => setDirectoryFilter(f)}>{f}</button>
                ))}
              </div>
            </div>
            <table><thead><tr><th>Doanh nghiệp</th><th>Mã số thuế</th><th>Số hồ sơ</th><th>Điểm rủi ro TB</th><th></th></tr></thead>
              <tbody>
                {(() => {
                  const data = [
                    { name: "Công ty TNHH Phúc An", mst: "0312 456 789", docs: 7, risk: "Cao", color: "red" },
                    { name: "Công ty CP Đại Phát", mst: "0301 998 221", docs: 4, risk: "Trung bình", color: "amber" },
                    { name: "Công ty TNHH Minh Khang", mst: "0309 112 004", docs: 11, risk: "Thấp", color: "green" },
                    { name: "Công ty CP Sông Hồng", mst: "0318 774 552", docs: 15, risk: "Thấp", color: "green" }
                  ];
                  return data.filter(item => {
                    const matchSearch = item.name.toLowerCase().includes(directorySearch.toLowerCase()) || item.mst.includes(directorySearch);
                    const matchFilter = directoryFilter === 'Tất cả' || item.risk === directoryFilter;
                    return matchSearch && matchFilter;
                  }).map((item, idx) => (
                    <tr key={idx}>
                      <td className="doc-name">{item.name}</td>
                      <td className="mono">{item.mst}</td>
                      <td>{item.docs}</td>
                      <td><span className={`pill ${item.color}`}><span className="d"></span>{item.risk}</span></td>
                      <td><button className="mini-btn">Hồ sơ</button></td>
                    </tr>
                  ));
                })()}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* ---- admin-reports ---- */}
      <div className={`page ${currentPath === '/admin/reports' ? 'active' : ''}`} style={{display: currentPath === '/admin/reports' ? 'block' : 'none'}}>
        <div className="topbar"><div><h1>Báo cáo &amp; thống kê</h1><p className="sub">Tổng hợp hiệu suất thẩm định trong quý hiện tại.</p></div>
          <div className="top-actions" style={{ position: 'relative' }}>
              <button className="mini-btn blue" style={{padding: '9px 16px'}} onClick={() => setExportOpen(!exportOpen)}>Tạo báo cáo PDF</button>
              {exportOpen && (
                <div style={{ position: 'absolute', top: '100%', right: '0', marginTop: '8px', background: '#fff', border: '1px solid var(--slate-200)', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', zIndex: 50, overflow: 'hidden', width: '200px' }}>
                  {['trong ngày', 'trong tuần', 'trong tháng', 'trong năm'].map((t, idx) => (
                    <div key={idx} style={{ padding: '10px 16px', fontSize: '13.5px', cursor: 'pointer', borderBottom: idx < 3 ? '1px solid var(--slate-100)' : 'none', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--slate-700)' }}
                         onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--slate-50)')}
                         onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
                         onClick={() => { setExportOpen(false); alert('Đã tạo và tải xuống báo cáo PDF ' + t + ' thành công!'); }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                      Xuất báo cáo {t}
                    </div>
                  ))}
                </div>
              )}
            </div>
        </div>
        <div className="stat-grid">
          <div className="stat-card"><div className="num">312</div><div className="lbl">Tổng hồ sơ đã xử lý (quý)</div></div>
          <div className="stat-card"><div className="num">27</div><div className="lbl">Hồ sơ gian lận bị chặn</div></div>
          <div className="stat-card"><div className="num">92%</div><div className="lbl">Tỷ lệ duyệt đúng hạn</div></div>
          <div className="stat-card"><div className="num">18.6 tỷ</div><div className="lbl">Giá trị rủi ro đã ngăn chặn</div></div>
        </div>
        <div className="card">
          <div className="card-head"><h2>Xu hướng hồ sơ theo tháng</h2></div>
                      <div className="line-chart-wrapper" style={{ position: 'relative', height: '260px', paddingLeft: '40px', paddingBottom: '30px', paddingTop: '20px' }}>
              <div style={{ position: 'absolute', top: '20px', bottom: '30px', left: '0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: 'var(--slate-400)', fontSize: '11px', textAlign: 'right', width: '25px' }}>
                <span>500</span><span>400</span><span>300</span><span>200</span><span>100</span><span>0</span>
              </div>
              <div style={{ position: 'absolute', top: '20px', bottom: '30px', left: '40px', right: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', pointerEvents: 'none', zIndex: 0 }}>
                {[0,1,2,3,4,5].map(i => <div key={i} style={{ width: '100%', height: '1px', background: 'var(--slate-100)' }}></div>)}
              </div>
              <div style={{ position: 'absolute', bottom: '0', left: '40px', right: '10px', display: 'flex', justifyContent: 'space-between', color: 'var(--slate-400)', fontSize: '11px' }}>
                {['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(m => <span key={m} style={{flex: 1, textAlign: 'center'}}>{m}</span>)}
              </div>
              <svg style={{ position: 'absolute', top: '20px', left: '40px', width: 'calc(100% - 50px)', height: 'calc(100% - 50px)', overflow: 'visible', zIndex: 1, pointerEvents: 'none' }}>
                {(() => {
                  const data = [100, 200, 180, 350, 250, 420, 380];
                  const maxVal = 500;
                  return data.map((d, i) => {
                    if (i === data.length - 1) return null;
                    const next = data[i + 1];
                    const x1 = `${(i + 0.5) * (100 / data.length)}%`;
                    const y1 = `${100 - ((d / maxVal) * 100)}%`;
                    const x2 = `${(i + 1.5) * (100 / data.length)}%`;
                    const y2 = `${100 - ((next / maxVal) * 100)}%`;
                    return <line key={`l-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--blue-600)" strokeWidth="2.5" strokeLinecap="round" />;
                  });
                })()}
                {(() => {
                  const data = [100, 200, 180, 350, 250, 420, 380];
                  const maxVal = 500;
                  return data.map((d, i) => {
                    const cx = `${(i + 0.5) * (100 / data.length)}%`;
                    const cy = `${100 - ((d / maxVal) * 100)}%`;
                    const isHovered = hoveredLineIdx === i;
                    return <circle key={`c-${i}`} cx={cx} cy={cy} r={isHovered ? "6" : "4"} fill="#fff" stroke="var(--blue-600)" strokeWidth={isHovered ? "3" : "2"} style={{ transition: 'all 0.2s' }} />;
                  });
                })()}
              </svg>
              <div style={{ position: 'absolute', top: '20px', left: '40px', width: 'calc(100% - 50px)', height: 'calc(100% - 50px)', zIndex: 10, display: 'flex' }}>
                {(() => {
                  const data = [100, 200, 180, 350, 250, 420, 380];
                  return data.map((d, i) => {
                    const isHovered = hoveredLineIdx === i;
                    const cy = `${100 - ((d / 500) * 100)}%`;
                    return (
                      <div key={`hz-${i}`} style={{ flex: 1, height: '100%', position: 'relative', cursor: 'pointer' }}
                           onMouseEnter={() => setHoveredLineIdx(i)} onMouseLeave={() => setHoveredLineIdx(null)} onClick={() => setHoveredLineIdx(i === hoveredLineIdx ? null : i)}>
                        <div style={{
                          position: 'absolute', top: cy, left: '50%', transform: 'translate(-50%, -100%)', marginTop: '-12px',
                          background: '#1e293b', color: '#fff', padding: '6px 10px', borderRadius: '6px',
                          fontSize: '12px', whiteSpace: 'nowrap', pointerEvents: 'none',
                          opacity: isHovered ? 1 : 0, transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                        }}>
                          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Tháng {i + 1}</div>
                          <div style={{ color: '#60a5fa' }}>Đã duyệt: {d} hồ sơ</div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
            <div className="legend"><span><span className="sw" style={{background: 'var(--blue-600)'}}></span>Số hồ sơ duyệt thành công theo tháng</span></div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
