import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

import LoginView from './components/LoginView';
import SMEPortalView from './components/SMEPortalView';
import AdminDashboard from './components/AdminDashboard';
import DualPanelAuditScreen from './components/DualPanelAuditScreen';
import AIAssistant from './components/AIAssistant';
import HistoryPage from './components/HistoryPage';
import SettingsPage from './components/SettingsPage';
import type { DocumentRecord } from './mockData';
import { Snackbar, Alert } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: { main: '#0b3b60' },
    background: { default: '#f5f7fa' },
  },
  typography: { fontFamily: '"Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif' },
});

// App wrapper to use hooks like useLocation inside BrowserRouter
const AppContent = () => {
  const location = useLocation();
  const showAIAssistant = location.pathname === '/admin-dashboard' || location.pathname === '/audit-screen';

  // Mock data fetching for AdminDashboard
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [toast, setToast] = useState<{open: boolean, message: string, severity: 'success' | 'error' | 'info'}>({open: false, message: '', severity: 'info'});
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await fetch(`${baseURL}/api/documents`);
        const data = await res.json();
        if (data.status === 'success') {
          setDocuments(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch documents", err);
      }
    };
    fetchDocuments();
    const interval = setInterval(fetchDocuments, 10000);
    return () => clearInterval(interval);
  }, [baseURL]);

  const handleUpload = (file: File) => {
    setIsScanning(true);
    setToast({ open: true, message: 'Đang đẩy ảnh qua Lõi AI VNPT để phân tích...', severity: 'info' });
    
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result as string;
      try {
        const res = await fetch(`${baseURL}/api/scan`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64Image })
        });
        const data = await res.json();
        if (data.status === 'success') {
          setToast({ open: true, message: 'Quét AI hoàn tất!', severity: 'success' });
          // Fetch will happen automatically via interval or we can trigger it here:
          const docRes = await fetch(`${baseURL}/api/documents`);
          const docData = await docRes.json();
          if (docData.status === 'success') setDocuments(docData.data);
        } else {
          setToast({ open: true, message: 'Phân tích thất bại!', severity: 'error' });
        }
      } catch (err) {
        setToast({ open: true, message: 'Lỗi kết nối tới Backend', severity: 'error' });
      } finally {
        setIsScanning(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const stats = {
    total: documents.length,
    processing: 0,
    valid: documents.filter(d => ['Phê duyệt', 'Đã duyệt'].includes(d.status)).length,
    fraud: documents.filter(d => ['Cảnh báo', 'Đã chặn'].includes(d.status)).length,
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginView />} />
        <Route path="/sme-portal" element={<SMEPortalView />} />
        
        {/* Pass necessary props to AdminDashboard */}
        <Route path="/admin-dashboard" element={
          <AdminDashboard 
            stats={stats} 
            documents={documents} 
            onUpload={handleUpload}
            isScanning={isScanning}
            onSelectDoc={(doc) => {
              // Redirect to audit screen (Simulated functionality)
              window.location.href = '/audit-screen';
            }} 
          />
        } />
        
        {/* Audit Screen (Alias for DualPanelAuditScreen) */}
        <Route path="/audit-screen" element={
          <DualPanelAuditScreen 
            document={documents[0] || {}} 
            onClose={() => window.location.href = '/admin-dashboard'} 
          />
        } />

        {/* History Log Screen */}
        <Route path="/history" element={
          <HistoryPage documents={documents} />
        } />

        {/* Settings Screen */}
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
      
      {/* Global AI Assistant Overlay for specific routes */}
      {showAIAssistant && <AIAssistant />}

      <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast({...toast, open: false})}>
        <Alert severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
