import React from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="side-brand">
          <div className="brand-mark">
            <svg className="icon" width="16" height="16" viewBox="0 0 24 24" stroke="#0B2545">
              <path d="M12 2 20 5.5v6c0 5-3.4 8.6-8 10-4.6-1.4-8-5-8-10v-6L12 2Z"/>
            </svg>
          </div>
          <b>SmartFin-Guard</b>
        </div>
        <div className="side-role">Không gian Nhân viên Ngân hàng</div>
        <div className="nav-group">
          <a className={`nav-item ${currentPath === '/admin/dashboard' || currentPath === '/admin/overview' ? 'active' : ''}`} onClick={() => navigate('/admin/dashboard')}>
            <svg className="icon" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
            Tổng quan
          </a>
          <a className={`nav-item ${currentPath === '/admin/queue' ? 'active' : ''}`} onClick={() => navigate('/admin/queue')}>
            <svg className="icon" viewBox="0 0 24 24"><path d="M9 11H3v9h6z"/><path d="M21 4h-6v16h6z"/><path d="M15 8h-6v3h6z"/></svg>
            Hàng đợi thẩm định
            <span className="badge-count">9</span>
          </a>
          <a className={`nav-item ${currentPath === '/admin/alerts' ? 'active' : ''}`} onClick={() => navigate('/admin/alerts')}>
            <svg className="icon" viewBox="0 0 24 24"><path d="M10.3 3.9 2.6 18a1.7 1.7 0 0 0 1.5 2.6h15.8a1.7 1.7 0 0 0 1.5-2.6L13.7 3.9a1.7 1.7 0 0 0-3.4 0Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
            Cảnh báo gian lận
            <span className="badge-count">3</span>
          </a>
          <a className={`nav-item ${currentPath === '/admin/directory' ? 'active' : ''}`} onClick={() => navigate('/admin/directory')}>
            <svg className="icon" viewBox="0 0 24 24"><path d="M3 21V8l9-5 9 5v13"/><path d="M9 21v-8h6v8"/></svg>
            Danh sách doanh nghiệp
          </a>
          <a className={`nav-item ${currentPath === '/admin/reports' ? 'active' : ''}`} onClick={() => navigate('/admin/reports')}>
            <svg className="icon" viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-4 4"/></svg>
            Báo cáo &amp; thống kê
          </a>
        </div>
        <div className="side-spacer"></div>
        <a className="nav-item" onClick={() => navigate('/')}>
          <svg className="icon" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>
          Đăng xuất
        </a>
        <div className="side-user">
          <div className="avatar">NV</div>
          <div className="who">
            <b>Nguyễn Văn Hùng</b>
            <span>Chuyên viên thẩm định</span>
          </div>
        </div>
      </aside>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
