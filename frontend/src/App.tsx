import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import AdminDashboard from './components/AdminDashboard';
import DualPanelAuditScreen from './components/DualPanelAuditScreen';

const theme = createTheme({
  palette: {
    primary: { main: '#0A58CA' },
    background: { default: '#f5f7fa' },
  },
  typography: { fontFamily: '"Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif' },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AdminDashboard />
    </ThemeProvider>
  );
}

export default App;
