import { useState, useEffect, useRef } from 'react';
import { Box, CssBaseline, AppBar, Toolbar, Typography, Grid, ThemeProvider, createTheme, Button, CircularProgress, Snackbar, Alert, Tabs, Tab } from '@mui/material';
import ShieldIcon from '@mui/icons-material/Shield';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import OverviewPanel from './components/OverviewPanel';
import DocumentQueue from './components/DocumentQueue';
import AnalysisPanel from './components/AnalysisPanel';
import HistoryPage from './components/HistoryPage';
import type { DocumentRecord } from './mockData';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const theme = createTheme({
  palette: {
    primary: { main: '#0b3b60' },
    background: { default: '#f5f7fa' },
  },
  typography: { fontFamily: '"Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif' },
});

function App() {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<DocumentRecord | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [toast, setToast] = useState<{open: boolean, message: string, severity: 'success' | 'error'}>({open: false, message: '', severity: 'success'});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchDocuments = async () => {
    try {
      const res = await fetch(`${baseURL}/api/documents`);
      const data = await res.json();
      if (data.status === 'success') {
        setDocuments(data.data);
        // If a document is currently selected, update its state from the fetched list
        setSelectedDoc((prev) => {
          if (!prev) return null;
          const updatedDoc = data.data.find((d: DocumentRecord) => d.id === prev.id);
          return updatedDoc || prev;
        });
      }
    } catch (err) {
      console.error("Failed to fetch documents", err);
    }
  };

  useEffect(() => {
    fetchDocuments();
    const interval = setInterval(fetchDocuments, 10000);
    return () => clearInterval(interval);
  }, []);

  const stats = {
    total: documents.length,
    processing: isScanning ? 1 : 0,
    valid: documents.filter(d => ['Phê duyệt', 'Đã duyệt'].includes(d.status)).length,
    fraud: documents.filter(d => ['Cảnh báo', 'Đã chặn'].includes(d.status)).length,
  };

  const handleScanInvoice = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setToast({ open: true, message: 'Đang đẩy ảnh qua Lõi AI VNPT để phân tích...', severity: 'success' });
    
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result as string;
      try {
        const res = await fetch(`${baseURL}/api/scan`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: base64Image
          })
        });
        const data = await res.json();
        if (data.status === 'success') {
          setToast({ open: true, message: 'Quét hoàn tất!', severity: 'success' });
          await fetchDocuments();
          setSelectedDoc(data.data); 
        } else {
          setToast({ open: true, message: 'Phân tích thất bại', severity: 'error' });
        }
      } catch (err) {
        setToast({ open: true, message: 'Lỗi kết nối tới Backend', severity: 'error' });
      } finally {
        setIsScanning(false);
      }
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const handleAction = async (action: 'approve' | 'block' | 'review') => {
    if (!selectedDoc) return;
    try {
      const res = await fetch(`${baseURL}/api/documents/${selectedDoc.id}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setToast({ open: true, message: 'Cập nhật trạng thái thành công!', severity: 'success' });
        await fetchDocuments();
      } else {
        setToast({ open: true, message: 'Không thể cập nhật trạng thái', severity: 'error' });
      }
    } catch (err) {
      setToast({ open: true, message: 'Lỗi khi cập nhật trạng thái', severity: 'error' });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="static" elevation={0}>
          <Toolbar>
            <ShieldIcon sx={{ mr: 2, fontSize: 32 }} />
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mr: 4 }}>
              SmartFin-Guard
            </Typography>
            <Tabs value={activeTab} onChange={(_e, v) => setActiveTab(v)} textColor="inherit" indicatorColor="secondary" sx={{ flexGrow: 1 }}>
              <Tab label="Dashboard Quyết định" />
              <Tab label="Lịch sử Hồ sơ" />
            </Tabs>
            <input
              type="file"
              accept="image/*,application/pdf"
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleScanInvoice}
            />
            <Button 
              variant="contained" 
              color="secondary" 
              sx={{ bgcolor: 'white', color: 'primary.main', fontWeight: 'bold', '&:hover': { bgcolor: '#e0e0e0' } }}
              startIcon={isScanning ? <CircularProgress size={20} /> : <CloudUploadIcon />}
              onClick={() => fileInputRef.current?.click()}
              disabled={isScanning}
            >
              {isScanning ? 'Đang phân tích AI...' : 'Tải lên Hóa đơn (Scan)'}
            </Button>
          </Toolbar>
        </AppBar>

        {/* Removed maxWidth="xl" to let it span naturally, added padding */}
        {activeTab === 0 ? (
          <Box sx={{ p: 4, flexGrow: 1, width: '100%' }}>
            <OverviewPanel stats={stats} />
            
            <Grid container spacing={4} sx={{ alignItems: 'flex-start' }}>
              <Grid size={{ xs: 12, md: 5, lg: 5 }}>
                <DocumentQueue 
                  documents={documents}
                  onSelect={(doc) => setSelectedDoc(doc)} 
                  selectedId={selectedDoc?.id || null} 
                />
              </Grid>
              <Grid size={{ xs: 12, md: 7, lg: 7 }}>
                <AnalysisPanel document={selectedDoc} onAction={handleAction} />
              </Grid>
            </Grid>
          </Box>
        ) : (
          <HistoryPage documents={documents} />
        )}
      </Box>

      <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast({...toast, open: false})}>
        <Alert severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;
