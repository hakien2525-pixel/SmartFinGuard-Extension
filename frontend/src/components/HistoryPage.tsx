import React from 'react';
import { useNavigate } from 'react-router-dom';
import ShieldIcon from '@mui/icons-material/Shield';
import LogoutIcon from '@mui/icons-material/Logout';
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
    <>
      <div id="overlay" className="overlay"></div>
      
      {/* TOPBAR */}
      <nav id="topbar" className="navbar bg-white border-bottom fixed-top topbar px-3 d-flex justify-content-between">
        <div className="d-flex align-items-center">
          <button id="toggleBtn" className="d-none d-lg-inline-flex btn btn-light btn-icon btn-sm">
            <i className="ti ti-layout-sidebar-left-expand"></i>
          </button>
          <button id="mobileBtn" className="btn btn-light btn-icon btn-sm d-lg-none me-2">
            <i className="ti ti-layout-sidebar-left-expand"></i>
          </button>
          <span className="ms-3 fw-bold h5 mb-0 d-none d-md-block">SmartFin<span className="text-primary">Guard</span> Admin</span>
        </div>
        
        <div className="d-flex align-items-center gap-3">
          <span className="badge bg-success-subtle text-success border border-success-subtle py-2 px-3 d-none d-md-inline-block">
            Hệ thống Ổn định
          </span>
          <div className="dropdown">
            <a href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false" className="d-flex align-items-center gap-2 text-decoration-none text-dark">
              <img src="./assets_inapp/images/avatar/avatar-1.jpg" alt="" className="rounded-circle border" width="36" height="36" />
              <span className="fw-semibold small d-none d-md-block">Admin (CBNV)</span>
            </a>
            <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0">
              <li><a className="dropdown-item" href="#" onClick={() => navigate('/settings')}>Cài đặt</a></li>
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
          <ShieldIcon className="text-primary me-2" fontSize="large" />
          <h4 className="mb-0 fw-bold">Fin<span className="text-primary">Guard</span></h4>
        </div>
        <ul className="nav flex-column">
          <li className="px-4 py-2"><small className="nav-text text-muted">Main</small></li>
          <li>
            <a className="nav-link" href="#" onClick={(e) => { e.preventDefault(); navigate('/admin-dashboard'); }}>
              <i className="ti ti-home"></i>
              <span className="nav-text">Tổng quan hồ sơ</span>
            </a>
          </li>
          <li>
            <a className="nav-link" href="#" onClick={(e) => { e.preventDefault(); navigate('/admin-dashboard'); }}>
              <i className="ti ti-box-seam"></i>
              <span className="nav-text">Rà soát chi tiết</span>
            </a>
          </li>
          <li>
            <a className="nav-link active" href="#" onClick={(e) => e.preventDefault()}>
              <i className="ti ti-receipt"></i>
              <span className="nav-text">Nhật kí hệ thống</span>
            </a>
          </li>

          <li className="px-4 pt-4 pb-2"><small className="nav-text text-muted">Account</small></li>
          <li>
            <a className="nav-link text-danger" href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>
              <i className="ti ti-logout"></i>
              <span className="nav-text">Đăng xuất</span>
            </a>
          </li>
        </ul>
      </aside>

      {/* MAIN CONTENT */}
      <main id="content" className="content py-10 bg-light min-vh-100" style={{ paddingTop: '80px' }}>
        <div className="container-fluid">
          
          {/* Header */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
            <div>
              <h1 className="fs-3 mb-1 fw-bold">Nhật ký hệ thống</h1>
              <p className="text-muted mb-0">Lịch sử thẩm định & truy vết hồ sơ theo thời gian thực</p>
            </div>
            <div className="d-flex gap-2">
              <div className="input-group" style={{ maxWidth: '300px' }}>
                <span className="input-group-text bg-white border-end-0"><i className="ti ti-search text-muted"></i></span>
                <input type="text" className="form-control border-start-0 ps-0" placeholder="Tìm mã hồ sơ..." />
              </div>
              <button className="btn btn-outline-secondary d-flex align-items-center gap-2">
                <i className="ti ti-filter"></i> Lọc
              </button>
              <button className="btn btn-primary d-flex align-items-center gap-2">
                <i className="ti ti-download"></i> Xuất File
              </button>
            </div>
          </div>

          {/* Data Table */}
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light text-muted small text-uppercase">
                    <tr>
                      <th className="ps-4 py-3 border-0">Mã Hồ Sơ</th>
                      <th className="py-3 border-0">Doanh nghiệp</th>
                      <th className="py-3 border-0">Ngày & Giờ (Timestamp)</th>
                      <th className="py-3 border-0 text-end">Tổng tiền (VND)</th>
                      <th className="py-3 border-0 text-center">Tỷ lệ rủi ro</th>
                      <th className="pe-4 py-3 border-0">Trạng thái AI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayDocs.map((doc, idx) => {
                      let badgeClass = 'bg-secondary';
                      let riskColor = 'text-dark';
                      const riskPercent = Math.round((doc.riskScore || doc.risk || 0) * (doc.riskScore <= 1 ? 100 : 1));

                      if (doc.status === 'Đã duyệt' || doc.status === 'Phê duyệt') {
                        badgeClass = 'bg-success-subtle text-success border border-success-subtle';
                        riskColor = 'text-success';
                      }
                      if (doc.status === 'Cảnh báo' || doc.status === 'Chờ xử lý' || doc.status === 'Kiểm tra thêm') {
                        badgeClass = 'bg-warning-subtle text-warning border border-warning-subtle';
                        riskColor = 'text-warning';
                      }
                      if (doc.status === 'Đã chặn') {
                        badgeClass = 'bg-danger-subtle text-danger border border-danger-subtle';
                        riskColor = 'text-danger';
                      }

                      return (
                        <tr key={idx}>
                          <td className="ps-4 py-3">
                            <span className="fw-semibold font-monospace text-primary">{doc.id}</span>
                          </td>
                          <td className="py-3 fw-medium">
                            {doc.company || doc.fileName || 'Không xác định'}
                          </td>
                          <td className="py-3 text-muted small">
                            {doc.timestamp || doc.time}
                          </td>
                          <td className="py-3 text-end fw-bold">
                            {doc.amount}
                          </td>
                          <td className={`py-3 text-center fw-bold ${riskColor}`}>
                            {riskPercent}%
                          </td>
                          <td className="pe-4 py-3">
                            <span className={`badge ${badgeClass} px-2 py-1`}>{doc.status}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Pagination Mock */}
            <div className="card-footer bg-white border-top py-3 d-flex justify-content-between align-items-center rounded-bottom-4">
              <span className="text-muted small">Hiển thị {displayDocs.length} kết quả</span>
              <ul className="pagination pagination-sm mb-0">
                <li className="page-item disabled"><a className="page-link" href="#">Trang trước</a></li>
                <li className="page-item active"><a className="page-link" href="#">1</a></li>
                <li className="page-item"><a className="page-link" href="#">2</a></li>
                <li className="page-item"><a className="page-link" href="#">Trang sau</a></li>
              </ul>
            </div>
          </div>

        </div>
      </main>
    </>
  );
};

export default HistoryPage;
