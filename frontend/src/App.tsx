import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
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

// Wrapper to get selected document from route parameter
const AuditScreenWrapper = ({ documents }: { documents: DocumentRecord[] }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const doc = documents.find(d => d.id === id);
  if (!doc) return <Navigate to="/admin/dashboard" replace />;
  return <DualPanelAuditScreen document={doc} onClose={() => navigate('/admin/dashboard')} />;
};

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const showAIAssistant = location.pathname !== '/login' && location.pathname !== '/';

  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<DocumentRecord | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [toast, setToast] = useState<{open: boolean, message: string, severity: 'success' | 'error' | 'info'}>({open: false, message: '', severity: 'info'});
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const fetchDocuments = useCallback(async () => {
    try {
      const res = await fetch(`${baseURL}/api/documents`);
      const data = await res.json();
      if (data.status === 'success') {
        setDocuments(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch documents", err);
    }
  }, [baseURL]);

  useEffect(() => {
    fetchDocuments();
    const interval = setInterval(fetchDocuments, 10000);
    return () => clearInterval(interval);
  }, [fetchDocuments]);

  const handleUpload = async (file: File) => {
    setIsScanning(true);
    setToast({ open: true, message: 'Đang đẩy ảnh qua Lõi AI VNPT để phân tích...', severity: 'info' });
    
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result as string;
      try {
        const res = await fetch(`${baseURL}/api/scan`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64Image, fileName: file.name })
        });
        const data = await res.json();
        if (data.status === 'success') {
          setToast({ open: true, message: 'Quét AI hoàn tất!', severity: 'success' });
          fetchDocuments();
        } else {
          setToast({ open: true, message: 'Phân tích thất bại: ' + (data.message || 'Lỗi'), severity: 'error' });
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
    navigate('/audit-screen/' + doc.id);
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginView />} />
        
        {/* SME Portal Area */}
        <Route path="/sme" element={<SMELayout />}>
          <Route path="portal" element={<SMEPortalView documents={documents} onUpload={handleUpload} />} />
          <Route path="dashboard" element={<SMEPortalView documents={documents} onUpload={handleUpload} />} />
          <Route path="records" element={<SMEPortalView documents={documents} onUpload={handleUpload} />} />
          <Route path="upload" element={<SMEPortalView documents={documents} onUpload={handleUpload} />} />
          <Route path="history" element={<HistoryPage documents={documents} />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        
        {/* Admin Dashboard Area */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={
            <AdminDashboard 
              stats={stats} 
              documents={documents} 
              onUpload={handleUpload}
              isScanning={isScanning}
              onSelectDoc={handleSelectDoc} 
            />
          } />
          <Route path="overview" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="queue" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="alerts" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="directory" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="reports" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="history" element={<HistoryPage documents={documents} />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="users" element={<UserManagementPage />} />
          <Route path="emergency-lock" element={<EmergencyLockPage />} />
          <Route path="help" element={<HelpPage />} />
        </Route>
        
        {/* Audit Screen Route with dynamic ID parameter */}
        <Route path="/audit-screen/:id" element={<AuditScreenWrapper documents={documents} />} />
        <Route path="/audit-screen" element={<Navigate to="/admin/dashboard" replace />} />

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
