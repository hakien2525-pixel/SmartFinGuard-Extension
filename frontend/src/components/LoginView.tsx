import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const LoginView = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<'admin' | 'sme'>('admin');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isFaceIDHovered, setIsFaceIDHovered] = useState(false);

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="card shadow-lg" style={{ maxWidth: '420px', width: '100%', borderRadius: '1.5rem' }}>
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <h1 className="card-title mb-2 h4 fw-bold">SmartFin<span className="text-primary">Guard</span></h1>
            <p className="text-muted small">
              {role === 'admin' ? 'Hệ thống Quản trị Rủi ro Ngân hàng' : 'Cổng Tín dụng dành cho Doanh nghiệp'}
            </p>
          </div>

          {/* Role Toggle */}
          <div className="d-flex bg-light p-1 rounded mb-4">
            <button 
              type="button"
              onClick={() => { setRole('admin'); setIsRegistering(false); }}
              className={`btn flex-fill fw-semibold btn-sm ${role === 'admin' ? 'btn-white shadow-sm text-primary' : 'btn-light text-muted'}`}
            >
              <AdminPanelSettingsIcon fontSize="small" className="me-1" /> Admin
            </button>
            <button 
              type="button"
              onClick={() => setRole('sme')}
              className={`btn flex-fill fw-semibold btn-sm ${role === 'sme' ? 'btn-white shadow-sm text-primary' : 'btn-light text-muted'}`}
            >
              <BusinessCenterIcon fontSize="small" className="me-1" /> SME
            </button>
          </div>

          <form className="needs-validation" onSubmit={(e) => {
            e.preventDefault();
            navigate(role === 'admin' ? '/admin-dashboard' : '/sme-portal');
          }}>
            
            {role === 'sme' && isRegistering && (
              <div className="mb-3">
                <label className="form-label">Tên doanh nghiệp</label>
                <input type="text" className="form-control" placeholder="Tên công ty" required />
              </div>
            )}

            <div className="mb-3">
              <label className="form-label">
                {role === 'admin' ? 'Mã cán bộ (CBNV)' : (isRegistering ? 'Email người đại diện' : 'Email đăng nhập')}
              </label>
              <input type="text" className="form-control" placeholder={role === 'admin' ? "VD: CBNV-88392" : "name@example.com"} required />
            </div>

            <div className="mb-3">
              <label className="form-label d-flex justify-content-between">
                <span>Mật khẩu</span>
                {!isRegistering && <a href="#" className="small link-primary text-decoration-none">Quên mật khẩu?</a>}
              </label>
              <input type="password" className="form-control" placeholder="••••••••" required />
            </div>

            {!isRegistering && (
              <div className="form-check mb-4">
                <input className="form-check-input" type="checkbox" id="remember" defaultChecked />
                <label className="form-check-label small" htmlFor="remember">Ghi nhớ đăng nhập</label>
              </div>
            )}

            <button className="btn btn-primary w-100 py-2 fw-bold" type="submit">
              {isRegistering ? 'Đăng ký tài khoản' : 'Đăng nhập hệ thống'}
            </button>
          </form>

          {role === 'sme' && (
            <div className="text-center mt-3 small text-muted">
              {isRegistering ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'} 
              <button 
                type="button"
                onClick={() => setIsRegistering(!isRegistering)}
                className="btn btn-link p-0 ms-1 link-primary text-decoration-none"
              >
                {isRegistering ? 'Đăng nhập' : 'Đăng ký'}
              </button>
            </div>
          )}

          <div className="position-relative mt-4">
            <hr className="text-muted" />
            <div className="position-absolute top-50 start-50 translate-middle px-3 bg-white small text-muted">
              Hoặc
            </div>
          </div>

          <button 
            type="button"
            onMouseEnter={() => setIsFaceIDHovered(true)}
            onMouseLeave={() => setIsFaceIDHovered(false)}
            onClick={() => navigate(role === 'admin' ? '/admin-dashboard' : '/sme-portal')}
            className={`btn w-100 py-2 fw-bold mt-3 d-flex justify-content-center align-items-center gap-2 ${isFaceIDHovered ? 'btn-outline-primary' : 'btn-light border'}`}
          >
            <FingerprintIcon className={isFaceIDHovered ? 'text-primary' : 'text-muted'} />
            VNPT eKYC (Face Liveness)
          </button>

        </div>
      </div>
    </div>
  );
};

export default LoginView;
