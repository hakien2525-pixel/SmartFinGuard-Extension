import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import LockIcon from '@mui/icons-material/Lock';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SecurityIcon from '@mui/icons-material/Security';

const LoginView = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<'admin' | 'sme'>('admin');

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
              
              <div className="w-[280px] h-[280px] rounded-full bg-gradient-to-b from-[#d0dcf2] to-[#b8caeb] border-[6px] border-white shadow-[0_12px_30px_rgba(0,0,0,0.08)] flex flex-col items-center justify-center relative z-10">
                <CameraAltIcon sx={{ fontSize: 48 }} className="text-white/60 mb-3" />
                <span className="text-[15px] font-medium text-[#7a95c4]">Chờ quét sinh trắc học...</span>
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
    </div>
  );
};

export default LoginView;
