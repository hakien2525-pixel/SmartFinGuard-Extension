import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import TimelineIcon from '@mui/icons-material/Timeline';
import BusinessIcon from '@mui/icons-material/Business';
import AddTaskIcon from '@mui/icons-material/AddTask';
import HistoryIcon from '@mui/icons-material/History';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

const SMEPortalView = ({ documents = [], onUpload }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'upload' | 'history' | 'profile'>('upload');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0] && onUpload) {
      onUpload(e.target.files[0]);
    }
  };

  const displayDocs = documents.length > 0 ? documents : [
    { id: 'HS-2026-001', fileName: 'Hoa_don_GTGT_01.pdf', status: 'Đã duyệt', date: '30/06/2026 08:30', amount: '45,000,000 VND' },
    { id: 'HS-2026-002', fileName: 'Hop_dong_kinh_te.pdf', status: 'Chờ duyệt', date: '30/06/2026 09:15', amount: '120,000,000 VND' },
    { id: 'HS-2026-003', fileName: 'Uy_nhiem_chi_SCB.jpg', status: 'Cảnh báo', date: '30/06/2026 10:05', amount: '500,000,000 VND' },
    { id: 'HS-2026-004', fileName: 'Bao_cao_tai_chinh.pdf', status: 'Đã duyệt', date: '29/06/2026 14:20', amount: '1,500,000,000 VND' },
    { id: 'HS-2026-005', fileName: 'Giay_de_nghi_giai_ngan.pdf', status: 'Đã chặn', date: '28/06/2026 11:10', amount: '350,000,000 VND' },
  ];

  const getStatusBadge = (status) => {
    if (status === 'Đã duyệt' || status === 'Phê duyệt') return 'bg-success-subtle text-success border-success-subtle';
    if (status === 'Chờ duyệt' || status === 'Đang xử lý') return 'bg-warning-subtle text-warning border-warning-subtle';
    return 'bg-danger-subtle text-danger border-danger-subtle';
  };

  return (
    <>
      <div id="overlay" className="overlay"></div>
      
      {/* TOPBAR */}
      <nav id="topbar" className="navbar bg-white border-bottom fixed-top topbar px-3 d-flex justify-content-between shadow-sm">
        <div className="d-flex align-items-center">
          <button id="toggleBtn" className="d-none d-lg-inline-flex btn btn-light btn-icon btn-sm">
            <i className="ti ti-layout-sidebar-left-expand"></i>
          </button>
          <button id="mobileBtn" className="btn btn-light btn-icon btn-sm d-lg-none me-2">
            <i className="ti ti-layout-sidebar-left-expand"></i>
          </button>
          <span className="ms-3 fw-bold h5 mb-0 d-none d-md-block">SME<span className="text-primary">Portal</span></span>
        </div>
        
        <div className="d-flex align-items-center gap-3">
          <span className="badge bg-primary-subtle text-primary border border-primary-subtle py-2 px-3 d-none d-md-inline-block d-flex align-items-center gap-1">
            <span className="spinner-grow spinner-grow-sm text-primary" style={{width: '8px', height: '8px'}} role="status"></span>
            Đã xác minh eKYC
          </span>
          <div className="dropdown">
            <a href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false" className="d-flex align-items-center gap-2 text-decoration-none text-dark">
              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{width: '36px', height: '36px'}}>
                <BusinessIcon fontSize="small" />
              </div>
              <span className="fw-semibold small d-none d-md-block">Doanh nghiệp</span>
            </a>
            <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0">
              <li><a className="dropdown-item" href="#" onClick={() => setActiveTab('profile')}>Hồ sơ doanh nghiệp</a></li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <a className="dropdown-item text-danger d-flex align-items-center gap-2" href="#" onClick={() => navigate('/login')}>
                  <LogoutIcon fontSize="small" /> Đăng xuất
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* SIDEBAR */}
      <aside id="sidebar" className="sidebar">
        <div className="logo-area d-flex align-items-center py-3 px-4">
          <BusinessIcon className="text-primary me-2" fontSize="large" />
          <h4 className="mb-0 fw-bold">SME<span className="text-primary">Portal</span></h4>
        </div>
        <ul className="nav flex-column mt-3">
          <li className="px-4 py-2"><small className="nav-text text-muted">Dịch vụ</small></li>
          <li>
            <a className={`nav-link ${activeTab === 'upload' ? 'active' : ''}`} href="#" onClick={(e) => { e.preventDefault(); setActiveTab('upload'); }}>
              <AddTaskIcon className="me-2 text-primary" fontSize="small" />
              <span className="nav-text fw-semibold">Nộp hồ sơ & Trạng thái</span>
            </a>
          </li>
          <li>
            <a className={`nav-link ${activeTab === 'history' ? 'active' : ''}`} href="#" onClick={(e) => { e.preventDefault(); setActiveTab('history'); }}>
              <HistoryIcon className="me-2 text-primary" fontSize="small" />
              <span className="nav-text fw-semibold">Lịch sử giao dịch</span>
            </a>
          </li>
          <li>
            <a className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`} href="#" onClick={(e) => { e.preventDefault(); setActiveTab('profile'); }}>
              <AccountCircleIcon className="me-2 text-primary" fontSize="small" />
              <span className="nav-text fw-semibold">Hồ sơ doanh nghiệp</span>
            </a>
          </li>

          <li className="px-4 pt-4 pb-2"><small className="nav-text text-muted">Tài khoản</small></li>
          <li>
            <a className="nav-link text-danger" href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>
              <LogoutIcon className="me-2" fontSize="small" />
              <span className="nav-text fw-bold">Đăng xuất</span>
            </a>
          </li>
        </ul>
      </aside>

      {/* MAIN CONTENT */}
      <main id="content" className="content py-10 bg-light min-vh-100" style={{ paddingTop: '80px' }}>
        <div className="container-fluid">
          
          <div className="mb-4">
            <h1 className="fs-3 fw-bold text-dark">
              {activeTab === 'upload' && 'Quản lý Hồ sơ Giải ngân'}
              {activeTab === 'history' && 'Lịch sử Nộp chứng từ'}
              {activeTab === 'profile' && 'Thông tin Doanh nghiệp'}
            </h1>
            <p className="text-muted">Công ty Cổ phần Công nghệ SME Việt Nam</p>
          </div>

          {/* ================= TAB 1: UPLOAD & STATUS ================= */}
          {activeTab === 'upload' && (
            <div className="row g-4">
              {/* Left Column */}
              <div className="col-12 col-lg-5 d-flex flex-column gap-4">
                
                {/* Upload Widget */}
                <div className="card border-0 shadow-sm rounded-4 text-center p-5 border-primary" style={{ borderStyle: 'dashed', borderWidth: '2px', cursor: 'pointer' }} onClick={() => document.getElementById('smeUpload').click()}>
                  <input 
                    id="smeUpload"
                    type="file" 
                    className="d-none" 
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.png"
                  />
                  <div className="d-inline-flex align-items-center justify-content-center bg-primary-subtle text-primary rounded-circle mb-4" style={{ width: '80px', height: '80px' }}>
                    <CloudUploadIcon sx={{ fontSize: 40 }} />
                  </div>
                  <h4 className="fw-bold text-dark">Tải lên chứng từ mới</h4>
                  <p className="text-muted small px-3">
                    Kéo thả file hợp đồng, hóa đơn GTGT, hoặc ủy nhiệm chi vào đây. AI sẽ tự động trích xuất và đẩy thẳng lên hệ thống phê duyệt của ngân hàng.
                  </p>
                  <button className="btn btn-primary mt-2 fw-bold px-4 py-2">Chọn File Tải Lên</button>
                </div>

                {/* Limit Widget */}
                <div className="card border-0 shadow-lg rounded-4 text-white" style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a8a)' }}>
                  <div className="card-body p-4 position-relative">
                    <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                      <TimelineIcon /> Tổng hạn mức khả dụng
                    </h5>
                    <h2 className="display-5 fw-bolder text-info mb-0">4.5 Tỷ <span className="fs-5 text-light">VND</span></h2>
                    <hr className="border-light opacity-25 my-3" />
                    <div className="d-flex justify-content-between small text-light opacity-75">
                      <span>Đã giải ngân: 1.5 Tỷ</span>
                      <span>Hạn mức tối đa: 6 Tỷ</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Status */}
              <div className="col-12 col-lg-7">
                <div className="card border-0 shadow-sm rounded-4 h-100">
                  <div className="card-header bg-white border-bottom-0 pt-4 pb-0 px-4">
                    <h5 className="fw-bold text-dark mb-0">Trạng thái hồ sơ đang xử lý</h5>
                  </div>
                  <div className="card-body p-4">
                    <div className="d-flex flex-column gap-3">
                      {displayDocs.slice(0, 4).map((doc, idx) => {
                        const badgeClass = getStatusBadge(doc.status);
                        return (
                          <div key={idx} className="card border rounded-4 shadow-sm border-light">
                            <div className="card-body p-3">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <div className="d-flex align-items-center gap-3">
                                  <div className={`rounded bg-light p-2 text-primary`}>
                                    <ReceiptLongIcon />
                                  </div>
                                  <div>
                                    <h6 className="fw-bold mb-0 text-dark">{doc.fileName}</h6>
                                    <small className="text-muted">Mã GD: {doc.id}</small>
                                  </div>
                                </div>
                                <span className={`badge border px-3 py-2 ${badgeClass}`}>{doc.status}</span>
                              </div>
                              <hr className="my-2" />
                              <div className="d-flex justify-content-between align-items-center small">
                                <span className="text-muted">Giá trị: <strong className="text-dark fs-6">{doc.amount}</strong></span>
                                <span className="text-muted">{doc.date}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 2: HISTORY ================= */}
          {activeTab === 'history' && (
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-header bg-white border-bottom-0 pt-4 pb-3 px-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
                <h5 className="fw-bold mb-0">Tất cả giao dịch & Chứng từ</h5>
                <div className="d-flex gap-2">
                  <input type="text" className="form-control form-control-sm border-secondary-subtle" placeholder="Tìm kiếm mã hồ sơ..." style={{ width: '250px' }} />
                  <button className="btn btn-primary btn-sm px-3 fw-bold shadow-sm">Lọc</button>
                </div>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light text-muted small text-uppercase">
                      <tr>
                        <th className="ps-4 py-3 border-0">Mã Hồ Sơ</th>
                        <th className="py-3 border-0">Tên Chứng Từ</th>
                        <th className="py-3 border-0">Thời Gian Nộp</th>
                        <th className="py-3 border-0">Giá Trị Yêu Cầu</th>
                        <th className="pe-4 py-3 border-0">Trạng Thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayDocs.map((doc, idx) => {
                        const badgeClass = getStatusBadge(doc.status);
                        return (
                          <tr key={idx}>
                            <td className="ps-4 py-3 font-monospace text-muted">{doc.id}</td>
                            <td className="py-3 fw-bold text-dark">{doc.fileName}</td>
                            <td className="py-3 text-muted small">{doc.date}</td>
                            <td className="py-3 fw-bold text-primary">{doc.amount}</td>
                            <td className="pe-4 py-3">
                              <span className={`badge border px-2 py-1 ${badgeClass}`}>{doc.status}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 3: BUSINESS PROFILE ================= */}
          {activeTab === 'profile' && (
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-5">
                <div className="d-flex align-items-center gap-4 mb-4 pb-4 border-bottom">
                  <div className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                    <BusinessIcon sx={{ fontSize: 40 }} />
                  </div>
                  <div>
                    <h2 className="fw-bold text-dark mb-1">Công ty Cổ phần Công nghệ SME Việt Nam</h2>
                    <p className="text-muted mb-0">Trạng thái: <span className="text-success fw-bold">Đã xác minh eKYC Doanh nghiệp</span></p>
                  </div>
                </div>

                <div className="row g-5">
                  <div className="col-12 col-md-6">
                    <div className="mb-4">
                      <label className="small fw-bold text-muted text-uppercase mb-2">Mã Số Thuế</label>
                      <div className="bg-light p-3 rounded border text-dark fw-bold">0314589231</div>
                    </div>
                    <div className="mb-4">
                      <label className="small fw-bold text-muted text-uppercase mb-2">Người Đại Diện Pháp Luật</label>
                      <div className="bg-light p-3 rounded border text-dark fw-bold">Nguyễn Văn Quyết</div>
                    </div>
                    <div className="mb-4">
                      <label className="small fw-bold text-muted text-uppercase mb-2">Email Đăng Ký</label>
                      <div className="bg-light p-3 rounded border text-dark fw-bold">contact@smevietnam.vn</div>
                    </div>
                  </div>
                  
                  <div className="col-12 col-md-6">
                    <div className="mb-4">
                      <label className="small fw-bold text-muted text-uppercase mb-2">Tài Khoản Giải Ngân</label>
                      <div className="bg-primary-subtle border border-primary-subtle p-3 rounded text-primary fw-bold font-monospace">1903 5555 8888 (Techcombank)</div>
                    </div>
                    <div className="mb-4">
                      <label className="small fw-bold text-muted text-uppercase mb-2">Ngày Thành Lập</label>
                      <div className="bg-light p-3 rounded border text-dark fw-bold">15/08/2018</div>
                    </div>
                    <div className="mb-4">
                      <label className="small fw-bold text-muted text-uppercase mb-2">Địa Chỉ Trụ Sở</label>
                      <div className="bg-light p-3 rounded border text-dark fw-semibold">Tầng 12, Tòa nhà Bitexco, Quận 1, TP.HCM</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-top d-flex justify-content-end gap-3">
                  <button className="btn btn-light fw-bold px-4">Đổi Mật Khẩu</button>
                  <button className="btn btn-primary fw-bold px-4 shadow-sm">Cập Nhật Thông Tin</button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </>
  );
};

export default SMEPortalView;
