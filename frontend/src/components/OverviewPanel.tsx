import { Grid, Paper, Typography, Box } from '@mui/material';
import { mockStats } from '../mockData';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import AssessmentIcon from '@mui/icons-material/Assessment';

const StatCard = ({ title, value, icon, color }: { title: string, value: string | number, icon: JSX.Element, color: string }) => (
  <Paper elevation={1} sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderLeft: `4px solid ${color}` }}>
    <Box>
      <Typography variant="body2" color="text.secondary">{title}</Typography>
      <Typography variant="h5" fontWeight="bold">{value}</Typography>
    </Box>
    <Box sx={{ color: color }}>
      {icon}
    </Box>
  </Paper>
);

export default function OverviewPanel({ stats }: { stats: { total: number, processing: number, valid: number, fraud: number } }) {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Tổng quan hệ thống</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Tổng hồ sơ nhận" value={stats.total} icon={<AssessmentIcon fontSize="large" />} color="#1976d2" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Đang xử lý" value={stats.processing} icon={<HourglassEmptyIcon fontSize="large" />} color="#ed6c02" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Hợp lệ (Auto-Approve)" value={stats.valid} icon={<CheckCircleIcon fontSize="large" />} color="#2e7d32" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Cảnh báo gian lận" value={stats.fraud} icon={<WarningIcon fontSize="large" />} color="#d32f2f" />
        </Grid>
      </Grid>
    </Box>
  );
}
