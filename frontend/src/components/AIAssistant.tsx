import { useState, useRef, useEffect } from 'react';
import {
  Fab,
  Paper,
  Box,
  Typography,
  TextField,
  IconButton,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlineOutlined';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system-error';
  text: string;
}

/**
 * AIAssistant — widget trợ lý AI nổi.
 *
 * QUAN TRỌNG: Component này KHÔNG bịa câu trả lời. Mọi tin nhắn được gửi thật
 * tới backend (`POST /api/assistant/chat`), backend lại chuyển tiếp sang AI Core
 * thật (`http://ai-core:8000/assistant`). Nếu AI Core chưa triển khai endpoint
 * này hoặc không kết nối được, widget hiển thị rõ thông báo lỗi thay vì giả vờ
 * trả lời như một AI thật — tránh đánh lừa người dùng giống các module mock
 * trước đây trong dự án (eKYC giả, fraud score random...).
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

  // Ghi âm thật bằng MediaRecorder, gửi sang /api/voice/stt thật để chuyển thành
  // văn bản (không còn trả về transcript bịa cố định như bản cũ).
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

  return (
    <>
      {isOpen && (
        <Paper
          elevation={8}
          sx={{
            position: 'fixed',
            bottom: 96,
            right: 24,
            width: 340,
            height: 460,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 3,
            overflow: 'hidden',
            zIndex: 1300,
          }}
        >
          <Box
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              px: 2,
              py: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SmartToyIcon fontSize="small" />
              <Typography variant="subtitle1" fontWeight={700}>
                Trợ lý AI SmartFinGuard
              </Typography>
            </Box>
            <IconButton size="small" sx={{ color: 'white' }} onClick={() => setIsOpen(false)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box sx={{ flex: 1, overflowY: 'auto', p: 1.5, bgcolor: '#f5f7fa' }}>
            {messages.length === 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 4, px: 2 }}>
                Đặt câu hỏi về hồ sơ, quy trình thẩm định, hoặc kết quả phân tích AI.
              </Typography>
            )}
            {messages.map((m) => (
              <Box
                key={m.id}
                sx={{
                  display: 'flex',
                  justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
                  mb: 1,
                }}
              >
                {m.role === 'system-error' ? (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      bgcolor: '#fdecea',
                      color: '#c62828',
                      px: 1.5,
                      py: 1,
                      borderRadius: 2,
                      maxWidth: '90%',
                    }}
                  >
                    <ErrorOutlineIcon fontSize="small" />
                    <Typography variant="body2">{m.text}</Typography>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      bgcolor: m.role === 'user' ? 'primary.main' : 'white',
                      color: m.role === 'user' ? 'white' : 'text.primary',
                      px: 1.5,
                      py: 1,
                      borderRadius: 2,
                      maxWidth: '80%',
                      boxShadow: m.role === 'assistant' ? 1 : 0,
                    }}
                  >
                    <Typography variant="body2">{m.text}</Typography>
                  </Box>
                )}
              </Box>
            ))}
            {isSending && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
                <CircularProgress size={14} />
                <Typography variant="caption" color="text.secondary">
                  Đang chờ phản hồi từ AI Core...
                </Typography>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, p: 1, borderTop: '1px solid #eee' }}>
            <Tooltip title={isRecording ? 'Dừng ghi âm' : 'Ghi âm câu hỏi'}>
              <span>
                <IconButton
                  size="small"
                  color={isRecording ? 'error' : 'default'}
                  onClick={toggleRecording}
                  disabled={isTranscribing}
                >
                  {isTranscribing ? (
                    <CircularProgress size={18} />
                  ) : isRecording ? (
                    <StopCircleIcon />
                  ) : (
                    <MicIcon />
                  )}
                </IconButton>
              </span>
            </Tooltip>
            <TextField
              size="small"
              fullWidth
              placeholder="Nhập câu hỏi..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') sendMessage(input);
              }}
              disabled={isSending}
            />
            <IconButton color="primary" onClick={() => sendMessage(input)} disabled={isSending || !input.trim()}>
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      )}

      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1300 }}
        onClick={() => setIsOpen((v) => !v)}
      >
        {isOpen ? <CloseIcon /> : <SmartToyIcon />}
      </Fab>
    </>
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
