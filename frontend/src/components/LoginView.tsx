import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ShieldIcon from '@mui/icons-material/Shield';
import FaceIcon from '@mui/icons-material/Face';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import EmailIcon from '@mui/icons-material/Email';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const LoginView = () => {
  const navigate = useNavigate();
  const [isFaceIDHovered, setIsFaceIDHovered] = useState(false);
  const [role, setRole] = useState<'admin' | 'sme'>('admin');
  const [isRegistering, setIsRegistering] = useState(false);

  return (
    <div className="min-h-screen bg-[#0b1120] flex items-center justify-center font-sans relative overflow-hidden">
      
      {/* Background ambient glowing orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-blue-600 rounded-full blur-[120px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30vw] h-[30vw] bg-indigo-600 rounded-full blur-[100px] opacity-20"></div>

      <div className="w-full max-w-5xl flex rounded-[2rem] overflow-hidden shadow-2xl relative z-10 mx-6 bg-white/5 backdrop-blur-xl border border-white/10 min-h-[600px]">
        
        {/* Left Side: Branding & Info */}
        <div className="w-1/2 bg-gradient-to-br from-blue-900 via-indigo-900 to-[#0b1120] p-12 flex flex-col justify-between relative overflow-hidden group">
          {/* Decorative geometric patterns */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-12 h-12 bg-gradient-to-tr from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <ShieldIcon sx={{ color: 'white' }} />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-wide">SmartFin<span className="text-blue-400">Guard</span></h1>
            </div>

            <h2 className="text-4xl font-extrabold text-white leading-tight mb-6">
              Bảo vệ dòng vốn <br/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">bằng Trí Tuệ Nhân Tạo</span>
            </h2>
            
            {role === 'admin' ? (
              <p className="text-blue-100/80 text-lg leading-relaxed max-w-md animate-in fade-in duration-500">
                Dành cho **Cán bộ ngân hàng**. Quản trị rủi ro, phân tích tự động bằng AI, và kiểm soát luồng giải ngân theo thời gian thực.
              </p>
            ) : (
              <p className="text-blue-100/80 text-lg leading-relaxed max-w-md animate-in fade-in duration-500">
                Dành cho **Doanh nghiệp (SME)**. Nộp hồ sơ tín dụng nhanh chóng, số hóa chứng từ tức thì, và theo dõi tiến độ duyệt vay 24/7.
              </p>
            )}
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 text-blue-200/60 text-sm">
              <div className="flex gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse mt-1.5"></span>
                <p>Hệ thống đang hoạt động ổn định</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-1/2 bg-white p-12 flex flex-col justify-center relative transition-all duration-300">
          
          <div className="max-w-sm mx-auto w-full">
            
            {/* Role Toggle */}
            <div className="flex bg-gray-100 p-1 rounded-xl mb-8 relative">
              <button 
                onClick={() => { setRole('admin'); setIsRegistering(false); }}
                className={`flex-1 py-2 text-sm font-bold flex justify-center items-center gap-2 rounded-lg transition-all z-10 ${role === 'admin' ? 'text-blue-700 shadow-sm bg-white' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <AdminPanelSettingsIcon fontSize="small" /> Ngân Hàng
              </button>
              <button 
                onClick={() => setRole('sme')}
                className={`flex-1 py-2 text-sm font-bold flex justify-center items-center gap-2 rounded-lg transition-all z-10 ${role === 'sme' ? 'text-blue-700 shadow-sm bg-white' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <BusinessCenterIcon fontSize="small" /> Doanh Nghiệp
              </button>
            </div>

            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-[#0f172a] mb-2">
                {isRegistering ? 'Tạo Tài Khoản' : 'Đăng nhập'}
              </h3>
              <p className="text-gray-500 text-sm">
                {role === 'admin' ? 'Truy cập vào hệ thống quản trị rủi ro' : (isRegistering ? 'Đăng ký hồ sơ tín dụng doanh nghiệp' : 'Cổng thông tin tín dụng cho doanh nghiệp')}
              </p>
            </div>

            <form className="space-y-5" onSubmit={(e) => { 
              e.preventDefault(); 
              navigate(role === 'admin' ? '/admin-dashboard' : '/sme-portal'); 
            }}>
              
              {/* Dynamic Inputs based on Role and Mode */}
              {role === 'admin' ? (
                // ADMIN LOGIN
                <>
                  <div className="relative group animate-in fade-in slide-in-from-bottom-2">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaceIcon className="text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Mã cán bộ (VD: CBNV-88392)"
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm font-medium text-gray-800 placeholder-gray-400"
                      required
                    />
                  </div>
                  <div className="relative group animate-in fade-in slide-in-from-bottom-2">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <LockOutlinedIcon className="text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    </div>
                    <input 
                      type="password" 
                      placeholder="Mật khẩu nội bộ"
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm font-medium text-gray-800 placeholder-gray-400"
                      required
                    />
                  </div>
                </>
              ) : (
                // SME LOGIN OR REGISTER
                <>
                  {isRegistering && (
                    <div className="relative group animate-in fade-in slide-in-from-bottom-2">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <AccountBalanceIcon className="text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                      </div>
                      <input 
                        type="text" 
                        placeholder="Tên doanh nghiệp"
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm font-medium text-gray-800 placeholder-gray-400"
                        required
                      />
                    </div>
                  )}
                  <div className="relative group animate-in fade-in slide-in-from-bottom-2">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <EmailIcon className="text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    </div>
                    <input 
                      type="email" 
                      placeholder={isRegistering ? "Email người đại diện" : "Email đăng nhập"}
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm font-medium text-gray-800 placeholder-gray-400"
                      required
                    />
                  </div>
                  <div className="relative group animate-in fade-in slide-in-from-bottom-2">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <LockOutlinedIcon className="text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    </div>
                    <input 
                      type="password" 
                      placeholder="Mật khẩu"
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm font-medium text-gray-800 placeholder-gray-400"
                      required
                    />
                  </div>
                </>
              )}

              {/* Forgot password / Remember me */}
              {!isRegistering && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer" defaultChecked />
                    <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Ghi nhớ đăng nhập</span>
                  </label>
                  <a href="#" className="text-sm text-blue-600 font-semibold hover:text-blue-800 transition-colors">Quên mật khẩu?</a>
                </div>
              )}

              {/* Primary Action Button */}
              <button 
                type="submit"
                className="w-full bg-[#0f172a] hover:bg-blue-600 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2 group mt-2"
              >
                {isRegistering ? 'Đăng ký tài khoản' : 'Đăng nhập hệ thống'}
                <ArrowRightAltIcon className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            {/* SME Toggle Register / Login */}
            {role === 'sme' && (
              <div className="mt-6 text-center text-sm">
                <span className="text-gray-500">
                  {isRegistering ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'} 
                </span>
                <button 
                  onClick={() => setIsRegistering(!isRegistering)}
                  className="ml-1 text-blue-600 font-bold hover:underline"
                >
                  {isRegistering ? 'Đăng nhập ngay' : 'Đăng ký ngay'}
                </button>
              </div>
            )}

            {/* Biometrics for both Admin and SME */}
            <div className="mt-8 relative animate-in fade-in">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">Hoặc đăng nhập bằng sinh trắc học</span>
              </div>
            </div>

            <button 
              type="button"
              onMouseEnter={() => setIsFaceIDHovered(true)}
              onMouseLeave={() => setIsFaceIDHovered(false)}
              onClick={() => navigate(role === 'admin' ? '/admin-dashboard' : '/sme-portal')}
              className="mt-6 w-full bg-white border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 text-[#0f172a] font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-3 relative overflow-hidden group animate-in fade-in"
            >
              <div className={`absolute inset-0 bg-blue-500/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left ease-out duration-300`}></div>
              <FingerprintIcon className={`z-10 ${isFaceIDHovered ? 'text-blue-600' : 'text-gray-500'} transition-colors`} />
              <span className="z-10">VNPT eKYC (Face Liveness)</span>
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
