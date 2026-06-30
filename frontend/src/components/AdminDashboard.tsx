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

  // If a document is active, show the Dual Panel (Master-Detail) layout inline
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
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Topbar (Bootstrap InApp Template Style) */}
      <nav className="navbar bg-white border-bottom fixed-top px-3 d-flex justify-content-between align-items-center shadow-sm">
        <div className="d-flex align-items-center gap-2">
          <div className="bg-primary text-white p-2 rounded">
            <ShieldIcon />
          </div>
          <h5 className="mb-0 fw-bold text-dark">SmartFin<span className="text-primary">Guard</span> Admin</h5>
        </div>
        
        <div className="d-flex align-items-center gap-3">
          <span className="badge bg-success-subtle text-success border border-success-subtle py-2 px-3">
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

      {/* Main Content */}
      <main className="flex-grow-1 p-4" style={{ marginTop: '70px' }}>
        <div className="container-fluid">
          
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="h4 fw-bold mb-0">Tổng quan Giao dịch</h2>
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
          <div className="row g-4 mb-4">
            <div className="col-12 col-md-4">
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body p-4 d-flex align-items-center gap-4">
                  <div className="bg-primary-subtle text-primary p-3 rounded-circle">
                    <TimelineIcon fontSize="large" />
                  </div>
                  <div>
                    <p className="text-muted mb-1 small text-uppercase fw-bold">Tổng Hồ Sơ</p>
                    <h3 className="mb-0 fw-bold">{stats.total}</h3>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-12 col-md-4">
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body p-4 d-flex align-items-center gap-4">
                  <div className="bg-success-subtle text-success p-3 rounded-circle">
                    <ShieldIcon fontSize="large" />
                  </div>
                  <div>
                    <p className="text-muted mb-1 small text-uppercase fw-bold">Đã Phê Duyệt</p>
                    <h3 className="mb-0 fw-bold">{stats.valid}</h3>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body p-4 d-flex align-items-center gap-4">
                  <div className="bg-danger-subtle text-danger p-3 rounded-circle">
                    <SmartToyIcon fontSize="large" />
                  </div>
                  <div>
                    <p className="text-muted mb-1 small text-uppercase fw-bold">Gian lận (Bị Chặn)</p>
                    <h3 className="mb-0 fw-bold">{stats.fraud}</h3>
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
    </div>
  );
};

export default AdminDashboard;
