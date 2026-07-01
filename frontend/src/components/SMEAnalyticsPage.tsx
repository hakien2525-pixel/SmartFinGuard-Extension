import React from 'react';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import GppBadIcon from '@mui/icons-material/GppBad';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import DonutSmallIcon from '@mui/icons-material/DonutSmall';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

const SMEAnalyticsPage = () => {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#f8fafc]">
      
      {/* HEADER */}
      <header className="h-[72px] bg-white border-b border-gray-100 flex items-center justify-between px-4 shrink-0 shadow-sm">
        <h2 className="text-xl font-bold text-[#0d2a63]">Phân Tích & Báo Cáo Chuyên Sâu</h2>
        
        <div className="flex items-center gap-4">
          <button 
            className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 shadow-sm relative"
            style={{ borderRadius: '50%' }}
          >
            <NotificationsNoneIcon fontSize="small" />
            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white"></span>
          </button>
          <div 
            className="w-10 h-10 rounded-full bg-[#0d2a63] text-white flex items-center justify-center font-bold shadow-sm cursor-pointer ml-2 border-2 border-white"
            style={{ borderRadius: '50%' }}
          >
            JW
          </div>
        </div>
      </header>

      {/* SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-auto px-6 py-8 custom-scrollbar">
        <div className="max-w-6xl w-full mx-auto">

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          
          {/* Card 1: STP */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 bg-[#0b57d0] shadow-md text-white">
              <TrendingUpIcon />
            </div>
            <div className="flex flex-col mt-1">
              <p className="text-[14px] text-gray-500 font-medium mb-1">Tỉ lệ Tự Động Duyệt (STP)</p>
              <h3 className="text-[32px] font-extrabold text-gray-900 leading-none mb-2">78.5%</h3>
              <p className="text-[13px] font-medium text-green-600 flex items-center gap-1">
                ↑ 2.4% so với tuần trước
              </p>
            </div>
          </div>

          {/* Card 2: Fraud Detection */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 bg-[#ffefef] text-red-500">
              <GppBadIcon />
            </div>
            <div className="flex flex-col mt-1">
              <p className="text-[14px] text-gray-500 font-medium mb-1">Tỉ lệ Phát hiện Gian Lận</p>
              <h3 className="text-[32px] font-extrabold text-gray-900 leading-none mb-2">4.2%</h3>
              <p className="text-[13px] font-medium text-red-500 flex items-center gap-1">
                ↑ 0.8% (Mô hình AI mới)
              </p>
            </div>
          </div>

          {/* Card 3: Processing Time */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 bg-[#f3e8ff] text-[#8b5cf6]">
              <FlashOnIcon />
            </div>
            <div className="flex flex-col mt-1">
              <p className="text-[14px] text-gray-500 font-medium mb-1">Thời gian xử lý trung bình</p>
              <h3 className="text-[32px] font-extrabold text-gray-900 leading-none mb-2">1.2s</h3>
              <p className="text-[13px] font-medium text-green-600 flex items-center gap-1">
                ↓ 0.3s (Tối ưu hóa GPU)
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* Line Chart Panel */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] h-[380px] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[16px] font-bold text-gray-800 flex items-center gap-2">
                <ShowChartIcon fontSize="small" className="text-[#6345ed]" /> Xu hướng Khối lượng Hồ sơ
              </h3>
              <button className="flex items-center gap-1 text-[13px] font-medium text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                7 Ngày qua <KeyboardArrowDownIcon fontSize="small" />
              </button>
            </div>
            
            <div className="flex-1 w-full relative flex flex-col justify-end">
              {/* Fake Line Chart SVG */}
              <div className="absolute inset-0 flex items-center justify-center px-4">
                <svg width="100%" height="80%" viewBox="0 0 500 200" preserveAspectRatio="none" className="overflow-visible">
                  {/* Grid lines */}
                  <line x1="0" y1="50" x2="500" y2="50" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="0" y1="100" x2="500" y2="100" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="0" y1="150" x2="500" y2="150" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                  
                  {/* Line */}
                  <path 
                    d="M 0 160 C 50 160, 80 120, 100 90 C 130 50, 170 140, 200 110 C 230 80, 280 40, 310 60 C 350 90, 400 130, 430 100 C 460 70, 480 30, 500 40" 
                    fill="none" 
                    stroke="#0b57d0" 
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  {/* Dots */}
                  <circle cx="100" cy="90" r="4" fill="#fff" stroke="#0b57d0" strokeWidth="2" />
                  <circle cx="200" cy="110" r="4" fill="#fff" stroke="#0b57d0" strokeWidth="2" />
                  <circle cx="310" cy="60" r="4" fill="#fff" stroke="#0b57d0" strokeWidth="2" />
                  <circle cx="430" cy="100" r="4" fill="#fff" stroke="#0b57d0" strokeWidth="2" />
                </svg>
              </div>

              {/* X Axis Labels */}
              <div className="flex justify-between text-[12px] text-gray-400 font-medium px-4 mt-auto mb-2 relative z-10 w-full pl-8 pr-12">
                <span>T2</span>
                <span>T3</span>
                <span>T4</span>
                <span>T5</span>
                <span>T6</span>
                <span>T7</span>
                <span>CN</span>
              </div>
            </div>
          </div>

          {/* Donut Chart Panel */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] h-[380px] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[16px] font-bold text-gray-800 flex items-center gap-2">
                <DonutSmallIcon fontSize="small" className="text-[#6345ed]" /> Phân bổ Rủi Ro (AI Scoring)
              </h3>
            </div>
            
            <div className="flex-1 flex items-center justify-center gap-12">
              {/* Donut Graphic */}
              <div className="relative w-48 h-48">
                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                  {/* Background Circle */}
                  <path
                    className="text-gray-100"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                  />
                  {/* High Risk (Red) - 7% */}
                  <path
                    className="text-red-500"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeDasharray="7, 100"
                  />
                  {/* Medium Risk (Yellow) - 15% (starts after red) */}
                  <path
                    className="text-yellow-400"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeDasharray="15, 100"
                    strokeDashoffset="-7"
                  />
                  {/* Low Risk (Green) - 78% (starts after yellow) */}
                  <path
                    className="text-green-500"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeDasharray="78, 100"
                    strokeDashoffset="-22"
                  />
                </svg>
                
                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[28px] font-extrabold text-gray-900 leading-none mb-1">3.4k</span>
                  <span className="text-[12px] font-medium text-gray-500">Tổng hồ sơ</span>
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-[14px] font-bold text-gray-700">Rủi ro thấp (78%)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <span className="text-[14px] font-bold text-gray-700">Rủi ro vừa (15%)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-[14px] font-bold text-gray-700">Rủi ro cao (7%)</span>
                </div>
              </div>

            </div>
          </div>

        </div>
        
        </div>
      </div>
    </div>
  );
};

export default SMEAnalyticsPage;
