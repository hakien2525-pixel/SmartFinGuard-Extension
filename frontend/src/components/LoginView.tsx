import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import LockIcon from '@mui/icons-material/Lock';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SecurityIcon from '@mui/icons-material/Security';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';

const LoginView = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<'admin' | 'sme'>('admin');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'success' | 'failed'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);

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

    // Capture photo after 3s
    setTimeout(async () => {
      let base64Image = "";
      if (activeStream && videoRef.current) {
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

      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
      setStream(null);

      if (!base64Image) {
        setScanStatus('failed');
        setErrorMessage('Không chụp được ảnh từ webcam.');
        return;
      }

      // Call Backend API
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
    <div className="min-h-screen flex items-center justify-center bg-[#eef2fc] p-4 font-sans text-gray-800">
      <div className="flex bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full max-w-[1000px] overflow-hidden min-h-[640px]">
        
        {/* LEFT SIDE: LOGIN FORM */}
        <div className="w-1/2 p-12 flex flex-col justify-center">
          
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-[#0d2a63] rounded-md flex items-center justify-center text-white">
              <SecurityIcon fontSize="small" />
            </div>
            <h1 className="font-bold text-xl text-[#0d2a63]">SmartFinGuard</h1>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">Đăng nhập</h2>
          <p className="text-[15px] text-gray-500 mb-8">Truy cập hệ thống ngân hàng số thông minh</p>

          <form onSubmit={(e) => {
            e.preventDefault();
            navigate(role === 'admin' ? '/admin/dashboard' : '/sme/portal');
          }}>
            
            {/* Role Selection */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Vai trò của bạn</label>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`flex flex-col items-center justify-center py-4 rounded-[7px] border-2 transition-all ${
                    role === 'admin' 
                      ? 'border-[#4a72a8] bg-[#f8fbff] text-[#4a72a8]' 
                      : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200'
                  }`}
                >
                  <PersonIcon className="mb-1" />
                  <span className="text-[15px] font-semibold">Nhân Viên</span>
                </button>

                <button 
                  type="button"
                  onClick={() => setRole('sme')}
                  className={`flex flex-col items-center justify-center py-4 rounded-[7px] border-2 transition-all ${
                    role === 'sme' 
                      ? 'border-[#4a72a8] bg-[#f8fbff] text-[#4a72a8]' 
                      : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200'
                  }`}
                >
                  <BusinessCenterIcon className="mb-1" />
                  <span className="text-[15px] font-semibold">Doanh Nghiệp SME</span>
                </button>
              </div>
            </div>

            {/* Inputs */}
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Tên đăng nhập / Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <PersonIcon fontSize="small" />
                </div>
                <input 
                  type="text" 
                  className="w-full pl-10 pr-4 py-3 bg-[#f8fafc] border border-gray-200 rounded-xl text-[15px] focus:outline-none focus:border-[#4a72a8] focus:bg-white transition-colors"
                  placeholder="Nhập tên đăng nhập..."
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Mật khẩu</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <LockIcon fontSize="small" />
                </div>
                <input 
                  type="password" 
                  className="w-full pl-10 pr-4 py-3 bg-[#f8fafc] border border-gray-200 rounded-xl text-[15px] focus:outline-none focus:border-[#4a72a8] focus:bg-white transition-colors"
                  placeholder="Nhập mật khẩu..."
                  required
                />
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between mb-8">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#4a72a8] focus:ring-[#4a72a8]" defaultChecked />
                <span className="text-[15px] text-gray-600 font-medium">Ghi nhớ đăng nhập</span>
              </label>
              <a href="#" className="text-[15px] font-bold text-[#4a72a8] hover:underline">Quên mật khẩu?</a>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              className="w-full bg-[#4a72a8] text-white rounded-xl py-3.5 font-bold flex items-center justify-center gap-2 hover:bg-[#3d6091] transition-colors shadow-[0_4px_14px_rgba(74,114,168,0.3)]"
            >
              Đăng nhập <ArrowForwardIcon fontSize="small" />
            </button>

          </form>
        </div>

        {/* RIGHT SIDE: eKYC */}
        <div className="w-1/2 bg-[#f0f4fa] p-12 flex flex-col items-center relative overflow-hidden">
          
          <div className="mt-8 flex flex-col items-center z-10">
            {/* VNPT eKYC Badge */}
            <div className="bg-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-blue-50 text-[#0d2a63] font-bold text-xs uppercase tracking-wider mb-8">
              <VerifiedUserIcon sx={{ fontSize: 14 }} className="text-blue-500" />
              VNPT EKYC
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">Xác Thực Khuôn Mặt</h3>
            <p className="text-[15px] text-gray-500 text-center max-w-[280px] leading-relaxed">
              Đảm bảo ánh sáng tốt và nhìn thẳng vào camera để đăng nhập an toàn.
            </p>

            {/* Camera Circle */}
            <div className="mt-12 relative">
              {/* Outer decorative ring */}
              <div className="absolute inset-0 bg-[#d0dcf2] rounded-full scale-110 opacity-50"></div>
              
              <div 
                className="w-[280px] h-[280px] rounded-full bg-gradient-to-b from-[#d0dcf2] to-[#b8caeb] border-[6px] border-white shadow-[0_12px_30px_rgba(0,0,0,0.08)] flex flex-col items-center justify-center relative z-10 overflow-hidden cursor-pointer"
                onClick={scanStatus === 'idle' || scanStatus === 'failed' ? startFaceScan : undefined}
                style={{ borderRadius: '50%' }}
              >
                {stream ? (
                  <video 
                    ref={videoRef}
                    autoPlay 
                    playsInline 
                    className="w-full h-full object-cover transform -scale-x-100"
                  />
                ) : scanStatus === 'scanning' ? (
                  <div className="flex flex-col items-center justify-center p-4">
                    <AutorenewIcon className="animate-spin text-white mb-2" fontSize="large" />
                    <span className="text-[15px] font-medium text-white">Đang quét khuôn mặt...</span>
                  </div>
                ) : scanStatus === 'success' ? (
                  <div className="flex flex-col items-center justify-center p-4">
                    <CheckCircleIcon className="text-green-500 mb-2" style={{ fontSize: 48 }} />
                    <span className="text-[15px] font-bold text-white">Thành Công!</span>
                  </div>
                ) : scanStatus === 'failed' ? (
                  <div className="flex flex-col items-center justify-center p-4 text-center">
                    <WarningIcon className="text-red-500 mb-2" style={{ fontSize: 48 }} />
                    <span className="text-[14px] font-bold text-white leading-tight mb-1">Thất bại</span>
                    <span className="text-[12px] text-white/80">{errorMessage}</span>
                    <span className="text-[11px] text-white/60 mt-2 hover:underline">Click để thử lại</span>
                  </div>
                ) : (
                  <>
                    <CameraAltIcon sx={{ fontSize: 48 }} className="text-white/60 mb-3" />
                    <span className="text-[15px] font-medium text-[#7a95c4]">Click để quét khuôn mặt</span>
                  </>
                )}
                
                {scanStatus === 'scanning' && (
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#4a72a8] to-transparent top-0 animate-[scan_2s_infinite_ease-in-out]"></div>
                )}
              </div>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="absolute bottom-12 bg-white px-4 py-2 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-center gap-2 z-10">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-sm font-bold text-gray-700">Hệ thống sẵn sàng</span>
          </div>

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
