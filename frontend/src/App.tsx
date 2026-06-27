import { useState, useEffect } from 'react';
import { Box, CssBaseline, AppBar, Toolbar, Typography, ThemeProvider, createTheme, Snackbar, Alert, Tabs, Tab, Grid } from '@mui/material';
import ShieldIcon from '@mui/icons-material/Shield';
import OverviewPanel from './components/OverviewPanel';
import DocumentQueue from './components/DocumentQueue';
import AnalysisPanel from './components/AnalysisPanel';
import HistoryPage from './components/HistoryPage';
import SMEPortal from './components/SMEPortal';
import APIConsole from './components/APIConsole';
import type { DocumentRecord } from './mockData';

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
  const [activeTab, setActiveTab] = useState(0);
  const [toast, setToast] = useState<{open: boolean, message: string, severity: 'success' | 'error'}>({open: false, message: '', severity: 'success'});

  const fetchDocuments = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/documents');
      const data = await res.json();
      if (data.status === 'success') {
        setDocuments(data.data);
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
    const interval = setInterval(fetchDocuments, 8000);
    return () => clearInterval(interval);
  }, []);

  const stats = {
    total: documents.length,
    processing: documents.filter(d => ['Chờ xử lý', 'Kiểm tra thêm'].includes(d.status)).length,
    valid: documents.filter(d => ['Phê duyệt', 'Đã duyệt'].includes(d.status)).length,
    fraud: documents.filter(d => ['Cảnh báo', 'Đã chặn'].includes(d.status)).length,
  };

  const handleAction = async (action: 'approve' | 'block' | 'review') => {
    if (!selectedDoc) return;
    try {
      const res = await fetch(`http://localhost:3000/api/documents/${selectedDoc.id}/action`, {
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
        <AppBar position="static" elevation={0} sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
          <Toolbar>
            <ShieldIcon sx={{ mr: 2, fontSize: 32 }} />
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mr: 4 }}>
              SmartFin-Guard
            </Typography>
            <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} textColor="inherit" indicatorColor="secondary" sx={{ flexGrow: 1 }}>
              <Tab label="Cổng SME (Doanh nghiệp)" />
              <Tab label="Dashboard Thẩm Định (Ngân hàng)" />
              <Tab label="Lịch sử Hồ sơ" />
              <Tab label="Cấu hình API VNPT" />
            </Tabs>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 4, flexGrow: 1, width: '100%' }}>
          {activeTab === 0 && (
            <SMEPortal onScanComplete={fetchDocuments} />
          )}

          {activeTab === 1 && (
            <Box>
              <OverviewPanel stats={stats} />
              <Grid container spacing={4} sx={{ alignItems: 'flex-start' }}>
                <Grid size={{ xs: 12, md: 5, lg: 4 }}>
                  <DocumentQueue 
                    documents={documents}
                    onSelect={(doc) => setSelectedDoc(doc)} 
                    selectedId={selectedDoc?.id || null} 
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 7, lg: 8 }}>
                  <AnalysisPanel document={selectedDoc} onAction={handleAction} />
                </Grid>
              </Grid>
            </Box>
          )}

          {activeTab === 2 && (
            <HistoryPage documents={documents} />
          )}

          {activeTab === 3 && (
            <APIConsole />
          )}
        </Box>
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
