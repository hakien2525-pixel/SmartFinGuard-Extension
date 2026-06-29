import { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, IconButton, Avatar, InputBase,
  List, ListItemText, Chip, Button
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Dashboard as DashboardIcon,
  Description as DescriptionIcon,
  Settings as SettingsIcon,
  NotificationsNone as NotificationsIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  WarningAmber as WarningIcon,
  Error as ErrorIcon,
  ArrowForwardIos as ArrowForwardIosIcon,
  Security as ShieldIcon
} from '@mui/icons-material';
import { createClient } from '@supabase/supabase-js';

// Khởi tạo Supabase Client sử dụng biến môi trường Vite (Cung cấp URL mặc định để tránh crash nếu chưa cài .env)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder_key';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- GLASSMORPHISM STYLES ---
const glassStyle = {
  background: 'rgba(255, 255, 255, 0.4)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  borderRadius: '24px',
  border: '1px solid rgba(255, 255, 255, 0.5)',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
};

const glassCardStyle = {
  ...glassStyle,
  background: 'rgba(255, 255, 255, 0.7)',
  p: 3,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between'
};

export default function AdminDashboard({ onSelectDoc }: { onSelectDoc?: (id: string) => void }) {
  const [queue, setQueue] = useState<any[]>([]);

  useEffect(() => {
    // Hàm fetch dữ liệu lịch sử khi vừa tải trang
    const fetchInitialData = async () => {
      const { data, error } = await supabase
        .from('scanned_invoices')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50); // Giới hạn 50 hồ sơ gần nhất
      
      if (error) {
        console.error('Error fetching initial data:', error);
      } else if (data) {
        setQueue(data);
      }
    };

    fetchInitialData();

    // Lắng nghe sự kiện Realtime (INSERT) bằng cú pháp Supabase v2
    const subscription = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'scanned_invoices' },
        (payload) => {
          console.log('New invoice received realtime:', payload);
          // Cập nhật hồ sơ mới vào đầu danh sách
          setQueue((prevQueue) => [payload.new, ...prevQueue]);
        }
      )
      .subscribe((status) => {
        console.log("Realtime status:", status);
      });

    // Cleanup subscription khi component unmount
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      width: '100vw',
      background: 'linear-gradient(135deg, #e0f2fe 0%, #bfdbfe 50%, #93c5fd 100%)',
      p: 2,
      display: 'flex',
      gap: 3,
      boxSizing: 'border-box'
    }}>
      
      {/* SIDEBAR */}
      <Box sx={{ width: 100, ...glassStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4, gap: 4 }}>
        <Avatar sx={{ bgcolor: '#0A58CA', width: 48, height: 48, mb: 4 }}>
          <ShieldIcon />
        </Avatar>
        <IconButton sx={{ color: '#0A58CA', bgcolor: 'white', boxShadow: 2 }}><DashboardIcon /></IconButton>
        <IconButton sx={{ color: '#64748b' }}><DescriptionIcon /></IconButton>
        <IconButton sx={{ color: '#64748b' }}><SettingsIcon /></IconButton>
      </Box>

      {/* MAIN CONTENT */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
        
        {/* TOP BAR */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2 }}>
          <Box sx={{ textAlign: 'left' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a' }}>SmartFin-Guard Dashboard</Typography>
            <Typography variant="subtitle1" sx={{ color: '#475569' }}>Chào mừng trở lại, Cán bộ tín dụng!</Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Paper sx={{ p: '2px 16px', display: 'flex', alignItems: 'center', width: 300, borderRadius: '50px', background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.5)', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)' }}>
              <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Tìm kiếm mã hồ sơ..." />
              <IconButton type="button" sx={{ p: '10px' }}><SearchIcon /></IconButton>
            </Paper>
            <IconButton sx={{ bgcolor: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(10px)' }}>
              <NotificationsIcon color="action" />
            </IconButton>
            <Avatar src="https://i.pravatar.cc/150?img=68" />
          </Box>
        </Box>

        {/* METRICS ROW */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 3 }}>
          <Box sx={{ ...glassCardStyle, background: 'linear-gradient(135deg, #0A58CA 0%, #3b82f6 100%)', color: 'white' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Tổng Hồ Sơ</Typography>
              <TrendingUpIcon />
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>{queue.length > 0 ? queue.length : '...'}</Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, mt: 1, textAlign: 'left' }}>Dữ liệu Real-time (WebSocket)</Typography>
          </Box>
          
          <Box sx={glassCardStyle}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ color: '#10b981', fontWeight: 'bold' }}>Hồ Sơ Xanh</Typography>
              <CheckCircleIcon sx={{ color: '#10b981' }} />
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#0f172a' }}>{queue.filter(q => q.status === 'green').length}</Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mt: 1, textAlign: 'left' }}>Tỷ lệ Auto-approve cao</Typography>
          </Box>

          <Box sx={glassCardStyle}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ color: '#f59e0b', fontWeight: 'bold' }}>Hồ Sơ Vàng</Typography>
              <WarningIcon sx={{ color: '#f59e0b' }} />
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#0f172a' }}>{queue.filter(q => q.status === 'yellow').length}</Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mt: 1, textAlign: 'left' }}>Cần chuyên viên rà soát</Typography>
          </Box>

          <Box sx={glassCardStyle}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ color: '#ef4444', fontWeight: 'bold' }}>Hồ Sơ Đỏ</Typography>
              <ErrorIcon sx={{ color: '#ef4444' }} />
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#0f172a' }}>{queue.filter(q => q.status === 'red').length}</Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mt: 1, textAlign: 'left' }}>Chặn gian lận thành công</Typography>
          </Box>
        </Box>

        {/* BOTTOM SECTION: TRAFFIC LIGHT QUEUE & ACTIVITY */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '8fr 4fr' }, gap: 3, flex: 1 }}>
          <Box sx={{ ...glassStyle, background: 'rgba(255, 255, 255, 0.65)', height: '100%', p: 3, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#0f172a', mb: 3, textAlign: 'left' }}>Hàng Đợi Ưu Tiên (Traffic Light Queue)</Typography>
            
            {queue.length === 0 ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <Typography variant="h6" color="textSecondary">Đang tải dữ liệu Real-time từ Supabase...</Typography>
              </Box>
            ) : (
              <List sx={{ width: '100%', flex: 1, overflow: 'auto', p: 0 }}>
                {queue.map((doc, idx) => (
                  <Paper key={idx} sx={{ 
                    mb: 2, p: 2, borderRadius: '16px', 
                    display: 'flex', alignItems: 'center', 
                    background: 'rgba(255,255,255,0.8)',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'scale(1.01)', cursor: 'pointer', boxShadow: 3 }
                  }} onClick={() => onSelectDoc && onSelectDoc(doc.id)}>
                    <Box sx={{ 
                      width: 12, height: 60, borderRadius: 8, mr: 3,
                      background: doc.status === 'red' ? '#ef4444' : doc.status === 'yellow' ? '#f59e0b' : '#10b981' 
                    }} />
                    
                    <ListItemText 
                      primary={<Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1e293b', textAlign: 'left' }}>{doc.company || 'Doanh Nghiệp Chưa Rõ'}</Typography>}
                      secondary={<Typography variant="body2" sx={{ color: '#64748b', textAlign: 'left' }}>Mã HS: {doc.id} • {new Date(doc.created_at).toLocaleString('vi-VN')}</Typography>}
                    />
                    
                    <Box sx={{ textAlign: 'right', mr: 4 }}>
                      <Typography variant="h6" sx={{ color: '#0A58CA', fontWeight: 'bold' }}>{doc.amount || '0'} VND</Typography>
                      <Chip 
                        size="small" 
                        label={`Risk Score: ${doc.score || 0}%`} 
                        color={doc.status === 'red' ? 'error' : doc.status === 'yellow' ? 'warning' : 'success'} 
                        sx={{ fontWeight: 'bold', mt: 0.5 }}
                      />
                    </Box>
                    
                    <IconButton size="small"><ArrowForwardIosIcon /></IconButton>
                  </Paper>
                ))}
              </List>
            )}
          </Box>

          {/* AI ASSISTANT WIDGET */}
          <Box sx={{ ...glassCardStyle, background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(240,249,255,0.9) 100%)', height: '100%' }}>
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#0f172a', mb: 1 }}>VNPT SmartUX Metrics</Typography>
              <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>Thống kê hiệu suất tự động hóa</Typography>
              
              <Box sx={{ p: 2, borderRadius: '16px', background: 'rgba(255,255,255,0.7)', mb: 2 }}>
                <Typography variant="body2" sx={{ color: '#64748b' }}>Trạng thái kết nối WebSocket</Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#10b981' }}>Đang theo dõi Real-time</Typography>
              </Box>
              
              <Box sx={{ p: 2, borderRadius: '16px', background: 'rgba(255,255,255,0.7)' }}>
                <Typography variant="body2" sx={{ color: '#64748b' }}>Độ chính xác SmartReader OCR</Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#0A58CA' }}>99.8%</Typography>
              </Box>
            </Box>

            <Button 
              variant="contained" 
              fullWidth 
              sx={{ 
                background: 'linear-gradient(90deg, #aa3bff 0%, #0A58CA 100%)', 
                borderRadius: '12px', py: 1.5,
                fontWeight: 'bold', textTransform: 'none', fontSize: 16
              }}
            >
              Gọi Trợ lý VNPT Smartbot
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
