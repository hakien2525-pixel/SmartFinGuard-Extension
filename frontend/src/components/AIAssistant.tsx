import React, { useState, useRef, useEffect } from 'react';
import { IconButton, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlineOutlined';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system-error';
  text: string;
}

/**
 * AIAssistant — widget trợ lý AI nổi kết hợp thiết kế UI mới và kết nối API thật.
 */
export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsSending(true);

    try {
      const tokenId = localStorage.getItem('vnpt_token_id') || '';
      const tokenKey = localStorage.getItem('vnpt_token_key') || '';
      const accessToken = localStorage.getItem('vnpt_access_token') || '';

      const res = await fetch(`${baseURL}/api/assistant/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, tokenId, tokenKey, accessToken }),
      });
      const data = await res.json();

      if (data.status === 'success' && data.reply) {
        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), role: 'assistant', text: data.reply },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: 'system-error',
            text: data.message || 'Trợ lý AI chưa phản hồi được. Vui lòng thử lại sau.',
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'system-error',
          text: 'Không thể kết nối tới backend. Hãy kiểm tra server đã chạy chưa.',
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const toggleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        setIsTranscribing(true);
        try {
          const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const base64Audio = await blobToBase64(blob);

          const res = await fetch(`${baseURL}/api/voice/stt`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ audio_base64: base64Audio }),
          });
          const data = await res.json();

          if (data.status === 'success' && data.text) {
            setInput(data.text);
          } else {
            setMessages((prev) => [
              ...prev,
              {
                id: crypto.randomUUID(),
                role: 'system-error',
                text: data.message || 'Không chuyển được giọng nói thành văn bản.',
              },
            ]);
          }
        } catch {
          setMessages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              role: 'system-error',
              text: 'Lỗi khi gửi âm thanh tới dịch vụ nhận dạng giọng nói.',
            },
          ]);
        } finally {
          setIsTranscribing(false);
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'system-error',
          text: 'Không truy cập được microphone. Vui lòng cấp quyền micro cho trình duyệt.',
        },
      ]);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-[#6345ed] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-[9999] border-2 border-white cursor-pointer"
        style={{ borderRadius: '50%', width: '64px', height: '64px' }}
      >
        <SupportAgentIcon sx={{ fontSize: 32 }} />
        <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-white rounded-full"></span>
      </button>
    );
  }

  return (
    <div 
      className="fixed bottom-8 right-8 bg-white rounded-lg shadow-2xl border border-gray-100 overflow-hidden z-[9999] flex flex-col animate-in slide-in-from-bottom-5 fade-in duration-300"
      style={{ width: '360px', borderRadius: '16px' }}
    >
      {/* Header */}
      <div 
        className="bg-[#6345ed] text-white p-4 flex justify-between items-center shadow-sm"
        style={{ backgroundColor: '#6345ed' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <SupportAgentIcon fontSize="small" />
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-wide m-0" style={{ fontSize: '14px' }}>VNPT Smartbot</h3>
            <p className="text-[10px] text-blue-100 flex items-center gap-1 m-0 mt-0.5">
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
      <div className="p-4 h-[350px] bg-[#f8fafc] overflow-y-auto flex flex-col gap-4 text-sm custom-scrollbar">
        {messages.length === 0 ? (
          <>
            <div className="text-center text-xs text-gray-400 my-2">Hôm nay</div>
            <div className="flex items-start gap-2 max-w-[85%]">
              <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-[#6345ed] flex-shrink-0 mt-1">
                <SupportAgentIcon sx={{ fontSize: 16 }} />
              </div>
              <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-sm text-gray-700 shadow-sm leading-relaxed">
                Xin chào! Tôi là Trợ lý Hệ thống từ VNPT. Bạn cần hỗ trợ gì về việc thẩm định hồ sơ hay cấu hình tham số rủi ro không?
              </div>
            </div>
          </>
        ) : (
          messages.map((m) => (
            <div 
              key={m.id} 
              className={`flex items-start gap-2 max-w-[85%] ${m.role === 'user' ? 'self-end flex-row-reverse' : ''}`}
            >
              {m.role !== 'user' && (
                <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-[#6345ed] flex-shrink-0 mt-1">
                  <SupportAgentIcon sx={{ fontSize: 16 }} />
                </div>
              )}
              {m.role === 'system-error' ? (
                <div className="bg-red-50 border border-red-100 p-3 rounded-2xl rounded-tl-sm text-red-700 shadow-sm flex items-center gap-1.5">
                  <ErrorOutlineIcon fontSize="small" />
                  <span>{m.text}</span>
                </div>
              ) : (
                <div 
                  className={`p-3 rounded-2xl shadow-sm leading-relaxed ${m.role === 'user' ? 'bg-[#6345ed] text-white rounded-tr-sm' : 'bg-white border border-gray-100 text-gray-700 rounded-tl-sm'}`}
                >
                  {m.text}
                </div>
              )}
            </div>
          ))
        )}
        {isSending && (
          <div className="flex items-center gap-2 ml-9">
            <CircularProgress size={14} />
            <span className="text-xs text-gray-400">Đang chờ phản hồi từ AI Core...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-gray-100 flex gap-2 items-center">
        <IconButton
          size="small"
          color={isRecording ? 'error' : 'default'}
          onClick={toggleRecording}
          disabled={isTranscribing}
          style={{ width: '36px', height: '36px' }}
        >
          {isTranscribing ? (
            <CircularProgress size={18} />
          ) : isRecording ? (
            <StopCircleIcon />
          ) : (
            <MicIcon />
          )}
        </IconButton>
        <input 
          type="text" 
          placeholder="Hỏi trợ lý về hồ sơ hiện tại..." 
          className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm outline-none focus:border-purple-300 transition-colors"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') sendMessage(input);
          }}
          disabled={isSending}
        />
        <button 
          onClick={() => sendMessage(input)}
          disabled={isSending || !input.trim()}
          className="w-9 h-9 bg-[#6345ed] text-white rounded-full flex items-center justify-center shadow-md hover:bg-purple-700 transition-colors flex-shrink-0 cursor-pointer disabled:opacity-50"
          style={{ border: 'none' }}
        >
          <SendIcon sx={{ fontSize: 16, marginLeft: '2px' }} />
        </button>
      </div>
    </div>
  );
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1] || '');
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
