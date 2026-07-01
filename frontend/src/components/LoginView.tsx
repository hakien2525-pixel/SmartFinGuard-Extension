import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

const LoginView = () => {
  const [method, setMethod] = useState<'pass' | 'ekyc'>('pass');
  const [role, setRole] = useState<'business' | 'admin'>('business');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // eKYC States & Camera References
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'success' | 'failed'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/sme/portal'); // Redirect to real /sme/portal
      }
    }, 1000);
  };

  const startFaceScan = async () => {
    setScanStatus('scanning');
    setErrorMessage('');
    
    let activeStream: MediaStream | null = null;
    try {
      activeStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(activeStream);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = activeStream;
        }
      }, 100);
    } catch (err) {
      setScanStatus('failed');
      setErrorMessage('Không truy cập được webcam. Vui lòng cấp quyền camera.');
      return;
    }

    // Capture photo after 3 seconds of scanning animation
    setTimeout(async () => {
      let base64Image = "";
      if (videoRef.current) {
        try {
          const video = videoRef.current;
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth || 640;
          canvas.height = video.videoHeight || 480;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            base64Image = canvas.toDataURL('image/jpeg');
          }
        } catch (captureErr) {
          console.error("Failed to capture video frame", captureErr);
        }
      }

      // Stop webcam stream immediately
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
      setStream(null);

      if (!base64Image) {
        setScanStatus('failed');
        setErrorMessage('Không chụp được ảnh từ webcam.');
        return;
      }

      // Send to real backend endpoint
      try {
        const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const res = await fetch(`${baseURL}/api/ekyc`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64Image })
        });
        const data = await res.json();
        
        if (data.status === 'success') {
          setScanStatus('success');
          setTimeout(() => {
            navigate(role === 'admin' ? '/admin/dashboard' : '/sme/portal');
          }, 1500);
        } else {
          setScanStatus('failed');
          setErrorMessage(data.message || 'Xác thực sinh trắc học thất bại.');
        }
      } catch (apiErr) {
        setScanStatus('failed');
        setErrorMessage('Lỗi kết nối tới máy chủ.');
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
              <div className="ekyc-box" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '24px 0' }}>
                <div 
                  className={`ekyc-frame ${scanStatus === 'scanning' ? 'scanning' : ''}`}
                  style={{
                    width: '220px',
                    height: '220px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    position: 'relative',
                    backgroundColor: '#0b172a',
                    border: '4px solid #6345ed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    marginBottom: '16px',
                    boxShadow: '0 10px 25px rgba(99, 69, 237, 0.2)'
                  }}
                  onClick={scanStatus === 'idle' || scanStatus === 'failed' ? startFaceScan : undefined}
                >
                  {stream ? (
                    <video 
                      ref={videoRef}
                      autoPlay 
                      playsInline 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
                    />
                  ) : scanStatus === 'scanning' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#a78bfa' }}>
                      <CircularProgress size={28} style={{ color: '#a78bfa', marginBottom: '10px' }} />
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'white' }}>Đang phân tích FaceID...</span>
                    </div>
                  ) : scanStatus === 'success' ? (
                    <div style={{ color: '#4ade80', fontSize: '14px', fontWeight: 700, textAlign: 'center' }}>
                      ✔ XÁC THỰC THÀNH CÔNG
                    </div>
                  ) : scanStatus === 'failed' ? (
                    <div style={{ color: '#ef4444', padding: '12px', fontSize: '12px', textAlign: 'center' }}>
                      ✘ THẤT BẠI
                      <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#9ca3af' }}>{errorMessage}</p>
                      <p style={{ margin: '8px 0 0', fontSize: '10px', color: '#6345ed', textDecoration: 'underline' }}>Thử lại</p>
                    </div>
                  ) : (
                    <div style={{ color: '#a78bfa', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.8">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                        <circle cx="12" cy="13" r="4"/>
                      </svg>
                      <span style={{ fontSize: '12px', marginTop: '8px', fontWeight: 500, color: 'white' }}>Nhấp để bật camera</span>
                    </div>
                  )}
                  {scanStatus === 'scanning' && (
                    <div 
                      className="scan-line"
                      style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        height: '2px',
                        backgroundColor: '#6345ed',
                        top: 0,
                        animation: 'scan 2s infinite ease-in-out'
                      }}
                    />
                  )}
                </div>
                <h3>{scanStatus === 'scanning' ? 'Đang phân tích...' : 'Sinh trắc học khuôn mặt'}</h3>
                <p style={{ fontSize: '13px', color: 'var(--slate-500)', maxWidth: '300px', margin: '8px 0 16px' }}>
                  {scanStatus === 'scanning' 
                    ? 'Vui lòng giữ nguyên khuôn mặt trước camera...' 
                    : 'Nhấp vào vòng tròn camera để đối sánh FaceID sinh trắc học thực tế với AI Core.'}
                </p>
                {!(scanStatus === 'scanning' || scanStatus === 'success') && (
                  <button 
                    className="btn-outline" 
                    style={{ width: '100%' }}
                    onClick={startFaceScan}
                  >
                    Bắt đầu quét eKYC
                  </button>
                )}
              </div>
            </div>
          )}

          <p className="foot-note" style={{ marginTop: '24px' }}>Bằng việc đăng nhập, bạn đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của SmartFin-Guard.<br/>Cần hỗ trợ? Liên hệ tổng đài <strong>1900 8888</strong></p>
        </div>
      </div>
      
      <style>{`
        @keyframes scan {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
      `}</style>
    </div>
  );
};

export default LoginView;
