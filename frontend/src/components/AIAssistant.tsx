import React, { useState } from 'react';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import SendIcon from '@mui/icons-material/Send';
import IconButton from '@mui/material/IconButton';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-[#6345ed] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-[9999] border-2 border-white"
        style={{ borderRadius: '50%' }}
      >
        <SupportAgentIcon sx={{ fontSize: 32 }} />
        {/* Unread indicator */}
        <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-white rounded-full"></span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-8 right-8 w-[350px] bg-white rounded-lg shadow-2xl border border-gray-100 overflow-hidden z-[9999] flex flex-col animate-in slide-in-from-bottom-5 fade-in duration-300">
      
      {/* Header */}
      <div className="bg-[#6345ed] text-white p-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <SupportAgentIcon fontSize="small" />
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-wide">VNPT Smartbot</h3>
            <p className="text-[10px] text-blue-100 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
              Đang hoạt động
            </p>
          </div>
        </div>
        <IconButton onClick={() => setIsOpen(false)} size="small" sx={{ color: 'white' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>
      
      {/* Chat Body */}
      <div className="p-4 h-[320px] bg-[#f8fafc] overflow-y-auto flex flex-col gap-4 text-sm custom-scrollbar">
        
        {/* System Message */}
        <div className="text-center text-xs text-gray-400 my-2">Hôm nay, 10:30 AM</div>
        
        {/* Bot Message */}
        <div className="flex items-start gap-2 max-w-[85%]">
          <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-[#6345ed] flex-shrink-0 mt-1">
            <SupportAgentIcon sx={{ fontSize: 14 }} />
          </div>
          <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-sm text-gray-700 shadow-sm leading-relaxed">
            Xin chào! Tôi là Trợ lý Hệ thống từ VNPT. Bạn cần hỗ trợ gì về việc thẩm định hồ sơ hay cấu hình tham số rủi ro không?
          </div>
        </div>
        
      </div>
      
      {/* Input Area */}
      <div className="p-3 bg-white border-t border-gray-100 flex gap-2 items-center">
        <input 
          type="text" 
          placeholder="Hỏi trợ lý về hồ sơ hiện tại..." 
          className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-sm outline-none focus:border-blue-300 transition-colors"
        />
        <button className="w-10 h-10 bg-[#6345ed] text-white rounded-full flex items-center justify-center shadow-md hover:bg-purple-700 transition-colors flex-shrink-0">
          <SendIcon sx={{ fontSize: 18 }} />
        </button>
      </div>
    </div>
  );
};

export default AIAssistant;
