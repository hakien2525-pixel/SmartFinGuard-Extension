import React, { useState } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';

const SMELayout = () => {
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
        <div className="side-role">Không gian Doanh nghiệp</div>
        <div className="nav-group">
          <a className={`nav-item ${currentPath === '/sme/dashboard' ? 'active' : ''}`} onClick={() => navigate('/sme/dashboard')}>
            <svg className="icon" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
            Tổng quan
          </a>
          <a className={`nav-item ${currentPath === '/sme/records' ? 'active' : ''}`} onClick={() => navigate('/sme/records')}>
            <svg className="icon" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/></svg>
            Hồ sơ giải ngân
          </a>
          <a className={`nav-item ${currentPath === '/sme/upload' ? 'active' : ''}`} onClick={() => navigate('/sme/upload')}>
            <svg className="icon" viewBox="0 0 24 24"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M4 19h16"/></svg>
            Tải chứng từ
            <span className="badge-count" style={{display: 'none'}}>0</span>
          </a>
          <a className={`nav-item ${currentPath === '/sme/history' ? 'active' : ''}`} onClick={() => navigate('/sme/history')}>
            <svg className="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
            Lịch sử giao dịch
          </a>
          <a className={`nav-item ${currentPath === '/sme/support' ? 'active' : ''}`} onClick={() => navigate('/sme/support')}>
            <svg className="icon" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            Hỗ trợ
          </a>
        </div>
        <div className="side-spacer"></div>
        <a className="nav-item" onClick={() => navigate('/')}>
          <svg className="icon" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>
          Đăng xuất
        </a>
        <div className="side-user">
          <div className="avatar">CT</div>
          <div className="who">
            <b>Công ty TNHH Phúc An</b>
            <span>MST 0312 456 789</span>
          </div>
        </div>
      </aside>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
};

export default SMELayout;
