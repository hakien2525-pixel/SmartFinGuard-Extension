import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginView = () => {
  const [method, setMethod] = useState<'pass' | 'ekyc'>('pass');
  const [role, setRole] = useState<'business' | 'admin'>('business');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/sme/dashboard');
      }
    }, 1000);
  };

  const startEkyc = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/sme/dashboard');
      }
    }, 3000);
  };

  return (
    <div className="login-wrap">
      <div className="login-brand">
        <svg className="chain-motif" viewBox="0 0 500 700" xmlns="http://www.w3.org/2000/svg">
          <g stroke="white" strokeWidth="1" fill="none" opacity="0.5">
            <path d="M-20 120 L520 220" /><path d="M-20 340 L520 260" /><path d="M-20 520 L520 460" /><path d="M-20 620 L520 640" />
            <circle cx="80" cy="150" r="3" fill="white" stroke="none"/><circle cx="260" cy="200" r="3" fill="white" stroke="none"/>
            <circle cx="420" cy="240" r="3" fill="white" stroke="none"/><circle cx="120" cy="380" r="3" fill="white" stroke="none"/>
            <circle cx="340" cy="300" r="3" fill="white" stroke="none"/><circle cx="200" cy="540" r="3" fill="white" stroke="none"/>
            <circle cx="440" cy="480" r="3" fill="white" stroke="none"/>
          </g>
        </svg>
        <div className="brand-top">
          <div className="brand-mark">
            <svg className="icon" width="20" height="20" viewBox="0 0 24 24">
              <path d="M12 2 20 5.5v6c0 5-3.4 8.6-8 10-4.6-1.4-8-5-8-10v-6L12 2Z"/>
              <path d="m9 12 2 2 4-4"/>
            </svg>
          </div>
          <div className="brand-name">SmartFin-Guard<small>Digital Banking Security Layer</small></div>
        </div>
        <div className="brand-mid">
          <h1>Một cổng đăng nhập.<br/>Ba vai trò. Một chuỗi<br/>xác thực chứng từ.</h1>
          <p>Hệ thống tự động hoá thẩm định và chống gian lận chứng từ giải ngân, tích hợp trực tiếp trong luồng ngân hàng số — bảo vệ mọi giao dịch từ khâu nộp hồ sơ đến khi giải ngân.</p>
          <div className="pipeline">
            <div className="step"><div className="dot"></div><div className="label">Xác thực danh tính (Email / eKYC)</div></div>
            <div className="line"></div>
            <div className="step"><div className="dot"></div><div className="label">Phân luồng theo vai trò người dùng</div></div>
            <div className="line"></div>
            <div className="step"><div className="dot"></div><div className="label">Điều hướng vào không gian làm việc</div></div>
          </div>
        </div>
        <div className="brand-bottom">
          <div className="brand-stat"><b>99.8%</b><span>Uptime hệ thống</span></div>
          <div className="brand-stat"><b>256-bit</b><span>Mã hoá đầu-cuối</span></div>
          <div className="brand-stat"><b>&lt;3s</b><span>Thời gian xác thực</span></div>
        </div>
      </div>

      <div className="login-form-panel">
        <div className="login-card">
          <h2>Đăng nhập hệ thống</h2>
          <p className="sub">Nhập thông tin xác thực để tiếp tục. Vai trò của bạn sẽ được hệ thống tự động nhận diện.</p>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <div 
              onClick={() => setRole('business')} 
              style={{ 
                flex: 1, 
                padding: '16px', 
                border: role === 'business' ? '2px solid var(--blue-600)' : '1px solid var(--slate-200)', 
                borderRadius: '12px', 
                cursor: 'pointer',
                backgroundColor: role === 'business' ? 'var(--blue-50)' : '#fff',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ fontWeight: 600, color: role === 'business' ? 'var(--blue-700)' : 'var(--slate-800)', marginBottom: '4px' }}>Doanh nghiệp</div>
              <div style={{ fontSize: '13px', color: 'var(--slate-500)' }}>Dành cho khách hàng SME</div>
            </div>
            <div 
              onClick={() => setRole('admin')} 
              style={{ 
                flex: 1, 
                padding: '16px', 
                border: role === 'admin' ? '2px solid var(--blue-600)' : '1px solid var(--slate-200)', 
                borderRadius: '12px', 
                cursor: 'pointer',
                backgroundColor: role === 'admin' ? 'var(--blue-50)' : '#fff',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ fontWeight: 600, color: role === 'admin' ? 'var(--blue-700)' : 'var(--slate-800)', marginBottom: '4px' }}>Nhân viên Ngân hàng</div>
              <div style={{ fontSize: '13px', color: 'var(--slate-500)' }}>Dành cho chuyên viên thẩm định</div>
            </div>
          </div>

          <div className="method-toggle">
            <button className={method === 'pass' ? 'active' : ''} onClick={() => setMethod('pass')}>Email &amp; Mật khẩu</button>
            <button className={method === 'ekyc' ? 'active' : ''} onClick={() => setMethod('ekyc')}>Sinh trắc học (eKYC)</button>
          </div>

          {method === 'pass' && (
            <div>
              <form onSubmit={handleLogin} noValidate>
                <div className="field">
                  <label>
                    {role === 'business' ? 'Mã số doanh nghiệp (MST) hoặc Email' : 'Mã nhân viên hoặc Email'}
                  </label>
                  <input 
                    type="text" 
                    placeholder={role === 'business' ? 'MST hoặc ten@congty.com.vn' : 'NV0123 hoặc nv.ten@smartfin.vn'} 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                  />
                </div>
                <div className="field">
                  <label>Mật khẩu</label>
                  <input type="password" placeholder="••••••••••" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <div className="row-between">
                  <label className="checkbox-row"><input type="checkbox" /> Ghi nhớ đăng nhập</label>
                  <span className="link-blue" onClick={() => alert('Đã gửi liên kết đặt lại mật khẩu tới email.')}>Quên mật khẩu?</span>
                </div>
                <button className="btn-primary" type="submit" disabled={loading}>
                  <span className="spinner" style={{ display: loading ? 'block' : 'none' }}></span>
                  <span>{loading ? 'Đang xác thực...' : 'Đăng nhập'}</span>
                </button>
              </form>
              <div className="divider">hoặc</div>
              <button className="btn-outline" style={{ width: '100%' }} onClick={() => setMethod('ekyc')}>
                Xác thực bằng khuôn mặt (eKYC)
              </button>
            </div>
          )}

          {method === 'ekyc' && (
            <div>
              <div className="ekyc-box">
                <div className={`ekyc-frame ${isScanning ? 'scanning' : ''}`}>
                  <svg className="icon" width="30" height="30" viewBox="0 0 24 24">
                    <path d="M4 8V5a1 1 0 0 1 1-1h3"/>
                    <path d="M20 8V5a1 1 0 0 0-1-1h-3"/>
                    <path d="M4 16v3a1 1 0 0 0 1 1h3"/>
                    <path d="M20 16v3a1 1 0 0 0-1 1h-3"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                </div>
                <h3>{isScanning ? 'Đang phân tích khuôn mặt...' : 'Quét khuôn mặt để xác thực'}</h3>
                <p>{isScanning ? 'Vui lòng giữ nguyên khuôn mặt trong khung hình...' : 'Đưa khuôn mặt vào khung hình. Hệ thống đối chiếu với dữ liệu eKYC đã đăng ký để xác nhận danh tính.'}</p>
                <button className="btn-outline" onClick={startEkyc} disabled={isScanning}>
                  {isScanning ? 'Đang quét...' : 'Bắt đầu quét'}
                </button>
              </div>
            </div>
          )}

          <p className="foot-note" style={{ marginTop: '24px' }}>Bằng việc đăng nhập, bạn đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của SmartFin-Guard.<br/>Cần hỗ trợ? Liên hệ tổng đài <strong>1900 8888</strong></p>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
