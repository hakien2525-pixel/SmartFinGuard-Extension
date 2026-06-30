import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DualPanelAuditScreen from './DualPanelAuditScreen';
import LogoutIcon from '@mui/icons-material/Logout';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import TimelineIcon from '@mui/icons-material/Timeline';
import ShieldIcon from '@mui/icons-material/Shield';

const AdminDashboard = ({ stats, documents, onSelectDoc, onUpload, isScanning }) => {
  const navigate = useNavigate();
  const [activeDoc, setActiveDoc] = useState(null);

  if (activeDoc) {
    return (
      <div className="d-flex min-vh-100 bg-light">
        <DualPanelAuditScreen 
          document={activeDoc} 
          onClose={() => setActiveDoc(null)} 
          inline={true}
        />
      </div>
    );
  }

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
            <a className="nav-link active" href="#" onClick={(e) => e.preventDefault()}>
              <i className="ti ti-home"></i>
              <span className="nav-text">Tổng quan hồ sơ</span>
            </a>
          </li>
          <li>
            <a className="nav-link" href="#" onClick={(e) => { e.preventDefault(); /* Could trigger focus on table */ }}>
              <i className="ti ti-box-seam"></i>
              <span className="nav-text">Rà soát chi tiết</span>
            </a>
          </li>
          <li>
            <a className="nav-link" href="#" onClick={(e) => { e.preventDefault(); navigate('/history'); }}>
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
          
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="fs-3 mb-1 fw-bold">Tổng quan Giao dịch</h1>
            <button className="btn btn-primary shadow-sm" onClick={() => document.getElementById('uploadInput').click()}>
              + Tải hồ sơ mới
            </button>
            <input 
              id="uploadInput"
              type="file" 
              className="d-none" 
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) onUpload(e.target.files[0]);
              }}
              accept=".pdf,.jpg,.png"
            />
          </div>

          {isScanning && (
            <div className="alert alert-info d-flex align-items-center gap-3 shadow-sm border-0" role="alert">
              <div className="spinner-border spinner-border-sm text-info" role="status"></div>
              <strong>Lõi AI đang phân tích dữ liệu...</strong> Xin vui lòng chờ trong giây lát.
            </div>
          )}

          {/* Stats Cards */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-lg-4">
              <div className="card p-4 bg-primary bg-opacity-10 border border-primary border-opacity-25 rounded-3 h-100">
                <div className="d-flex gap-3 align-items-center">
                  <div className="icon-shape icon-md bg-primary text-white rounded-2 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                    <TimelineIcon />
                  </div>
                  <div>
                    <h2 className="mb-1 fs-6 text-muted fw-semibold">Tổng Hồ Sơ</h2>
                    <h3 className="fw-bold mb-0">{stats.total}</h3>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-12 col-lg-4">
              <div className="card p-4 bg-success bg-opacity-10 border border-success border-opacity-25 rounded-3 h-100">
                <div className="d-flex gap-3 align-items-center">
                  <div className="icon-shape icon-md bg-success text-white rounded-2 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                    <ShieldIcon />
                  </div>
                  <div>
                    <h2 className="mb-1 fs-6 text-muted fw-semibold">Đã Phê Duyệt</h2>
                    <h3 className="fw-bold mb-0">{stats.valid}</h3>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-4">
              <div className="card p-4 bg-danger bg-opacity-10 border border-danger border-opacity-25 rounded-3 h-100">
                <div className="d-flex gap-3 align-items-center">
                  <div className="icon-shape icon-md bg-danger text-white rounded-2 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                    <SmartToyIcon />
                  </div>
                  <div>
                    <h2 className="mb-1 fs-6 text-muted fw-semibold">Gian lận (Bị Chặn)</h2>
                    <h3 className="fw-bold mb-0">{stats.fraud}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Document Table */}
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-header bg-white border-bottom-0 pt-4 pb-0 px-4">
              <h5 className="fw-bold mb-0">Hàng đợi Hồ sơ (Thời gian thực)</h5>
            </div>
            <div className="card-body p-0 mt-3">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light text-muted small text-uppercase">
                    <tr>
                      <th className="ps-4 py-3 border-0">Mã Hồ Sơ</th>
                      <th className="py-3 border-0">Loại Chứng Từ</th>
                      <th className="py-3 border-0">AI Phát Hiện</th>
                      <th className="py-3 border-0">Thời Gian</th>
                      <th className="pe-4 py-3 border-0 text-end">Hành Động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((doc, idx) => {
                      let badgeClass = 'bg-secondary';
                      if (doc.status === 'Đã duyệt' || doc.status === 'Phê duyệt') badgeClass = 'bg-success-subtle text-success border border-success-subtle';
                      if (doc.status === 'Cảnh báo') badgeClass = 'bg-warning-subtle text-warning border border-warning-subtle';
                      if (doc.status === 'Đã chặn') badgeClass = 'bg-danger-subtle text-danger border border-danger-subtle';

                      return (
                        <tr key={idx} style={{ cursor: 'pointer' }} onClick={() => setActiveDoc(doc)}>
                          <td className="ps-4 py-3">
                            <span className="fw-semibold font-monospace">{doc.id}</span>
                          </td>
                          <td className="py-3 fw-medium">
                            {doc.fileName || 'Chưa xác định'}
                          </td>
                          <td className="py-3">
                            <span className={`badge ${badgeClass} px-2 py-1`}>{doc.status}</span>
                          </td>
                          <td className="py-3 text-muted small">
                            {doc.timestamp || doc.date || 'Hôm nay'}
                          </td>
                          <td className="pe-4 py-3 text-end">
                            <button className="btn btn-sm btn-light border fw-semibold text-primary" onClick={(e) => { e.stopPropagation(); setActiveDoc(doc); }}>
                              Rà soát chi tiết &rarr;
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </main>
    </>
  );
};

export default AdminDashboard;
