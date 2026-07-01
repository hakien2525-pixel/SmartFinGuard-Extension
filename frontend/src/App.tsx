import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

import LoginView from './components/LoginView';
import SMEPortalView from './components/SMEPortalView';
import AdminDashboard from './components/AdminDashboard';
import DualPanelAuditScreen from './components/DualPanelAuditScreen';
import AIAssistant from './components/AIAssistant';
import HistoryPage from './components/HistoryPage';
import SettingsPage from './components/SettingsPage';
import UserManagementPage from './components/UserManagementPage';
import EmergencyLockPage from './components/EmergencyLockPage';
import HelpPage from './components/HelpPage';
import DataAnalyticsView from './components/DataAnalyticsView';
import AdminLayout from './components/AdminLayout';
import SMELayout from './components/SMELayout';
import SMEAnalyticsPage from './components/SMEAnalyticsPage';
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
  const navigate = useNavigate();
  const showAIAssistant = location.pathname !== '/login' && location.pathname !== '/';

  // Mock data fetching for AdminDashboard
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<DocumentRecord | null>(null);
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

  const handleSelectDoc = (doc: any) => {
    setSelectedDoc(doc);
    navigate('/audit-screen');
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginView />} />
        
        {/* SME Portal Area */}
        <Route path="/sme" element={<SMELayout />}>
          <Route path="portal" element={<SMEPortalView documents={documents} onUploadComplete={(doc: any) => setDocuments(prev => [doc, ...prev])} />} />
          <Route path="dashboard" element={<SMEPortalView documents={documents} onUploadComplete={(doc: any) => setDocuments(prev => [doc, ...prev])} />} />
          <Route path="records" element={<SMEPortalView documents={documents} onUploadComplete={(doc: any) => setDocuments(prev => [doc, ...prev])} />} />
          <Route path="upload" element={<SMEPortalView documents={documents} onUploadComplete={(doc: any) => setDocuments(prev => [doc, ...prev])} />} />
          <Route path="history" element={<SMEPortalView documents={documents} />} />
          <Route path="support" element={<SMEPortalView documents={documents} />} />
        </Route>
        
        {/* Admin Dashboard Area */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard documents={documents} onSelectDoc={handleSelectDoc} />} />
          <Route path="overview" element={<AdminDashboard documents={documents} onSelectDoc={handleSelectDoc} />} />
          <Route path="queue" element={<AdminDashboard documents={documents} onSelectDoc={handleSelectDoc} />} />
          <Route path="alerts" element={<AdminDashboard documents={documents} onSelectDoc={handleSelectDoc} />} />
          <Route path="directory" element={<AdminDashboard documents={documents} onSelectDoc={handleSelectDoc} />} />
          <Route path="reports" element={<AdminDashboard documents={documents} onSelectDoc={handleSelectDoc} />} />
        </Route>
        
        {/* Audit Screen (Alias for DualPanelAuditScreen) */}
        <Route path="/audit-screen" element={
          <DualPanelAuditScreen 
            document={selectedDoc || documents[0] || {}} 
            onClose={() => navigate('/admin/queue')} 
          />
        } />

        {/* Data Analytics Screen */}
        <Route path="/data" element={<DataAnalyticsView />} />
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
