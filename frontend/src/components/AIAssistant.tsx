import React, { useState } from 'react';
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
        style={{ borderRadius: '50%', position: 'fixed', bottom: '32px', right: '32px', width: '64px', height: '64px', zIndex: 9999, backgroundColor: '#6345ed', color: 'white', border: '2px solid white', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', cursor: 'pointer' }}
      >
        <SupportAgentIcon sx={{ fontSize: 32 }} />
        {/* Unread indicator */}
        <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-white rounded-full" style={{ position: 'absolute', top: 0, right: 0, width: '16px', height: '16px', backgroundColor: '#ef4444', border: '2px solid white', borderRadius: '50%' }}></span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-8 right-8 bg-white rounded-lg shadow-2xl border border-gray-100 overflow-hidden z-[9999] flex flex-col animate-in slide-in-from-bottom-5 fade-in duration-300"
         style={{ position: 'fixed', bottom: '32px', right: '32px', width: '350px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid #f3f4f6', overflow: 'hidden', zIndex: 9999, display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <div className="bg-[#6345ed] text-white p-4 flex justify-between items-center shadow-sm"
           style={{ backgroundColor: '#6345ed', color: 'white', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
        <div className="flex items-center gap-3" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
               style={{ width: '32px', height: '32px', backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
            <SupportAgentIcon fontSize="small" />
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-wide" style={{ margin: 0, fontWeight: 700, fontSize: '14px', letterSpacing: '0.025em' }}>VNPT Smartbot</h3>
            <p className="text-[10px] text-blue-100 flex items-center gap-1" style={{ margin: 0, fontSize: '11px', color: '#dbeafe', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" style={{ width: '6px', height: '6px', backgroundColor: '#4ade80', borderRadius: '50%' }}></span>
              Đang hoạt động
            </p>
          </div>
        </div>
        <IconButton onClick={() => setIsOpen(false)} size="small" sx={{ color: 'white' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>
      
      {/* Chat Body */}
      <div className="p-4 h-[320px] bg-[#f8fafc] overflow-y-auto flex flex-col gap-4 text-sm custom-scrollbar"
           style={{ padding: '16px', height: '320px', backgroundColor: '#f8fafc', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14px' }}>
        
        {/* System Message */}
        <div className="text-center text-xs text-gray-400 my-2" style={{ textAlign: 'center', fontSize: '12px', color: '#9ca3af', margin: '8px 0' }}>Hôm nay, 10:30 AM</div>
        
        {/* Bot Message */}
        <div className="flex items-start gap-2 max-w-[85%]" style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', maxWidth: '85%' }}>
          <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-[#6345ed] flex-shrink-0 mt-1"
               style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#f3e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6345ed', flexShrink: 0, marginTop: '4px' }}>
            <SupportAgentIcon sx={{ fontSize: 16 }} />
          </div>
          <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-sm text-gray-700 shadow-sm leading-relaxed"
               style={{ backgroundColor: 'white', border: '1px solid #f3f4f6', padding: '12px 16px', borderRadius: '16px', borderTopLeftRadius: '2px', color: '#374151', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', lineHeight: 1.625 }}>
            Xin chào! Tôi là Trợ lý Hệ thống từ VNPT. Bạn cần hỗ trợ gì về việc thẩm định hồ sơ hay cấu hình tham số rủi ro không?
          </div>
        </div>
        
      </div>
      
      {/* Input Area */}
      <div className="p-3 bg-white border-t border-gray-100 flex gap-2 items-center"
           style={{ padding: '12px', backgroundColor: 'white', borderTop: '1px solid #f3f4f6', display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input 
          type="text" 
          placeholder="Hỏi trợ lý về hồ sơ hiện tại..." 
          className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-sm outline-none focus:border-blue-300 transition-colors"
          style={{ flex: 1, backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '9999px', padding: '10px 16px', fontSize: '14px', outline: 'none', width: '100%' }}
        />
        <button className="w-10 h-10 bg-[#6345ed] text-white rounded-full flex items-center justify-center shadow-md hover:bg-purple-700 transition-colors flex-shrink-0"
                style={{ width: '40px', height: '40px', backgroundColor: '#6345ed', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', flexShrink: 0, cursor: 'pointer', border: 'none' }}>
          <SendIcon sx={{ fontSize: 18, marginLeft: '2px' }} />
        </button>
      </div>
    </div>
  );
};

export default AIAssistant;
