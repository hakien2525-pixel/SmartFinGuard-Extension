import { Paper, Typography, Box, Grid, Chip, Button, LinearProgress } from '@mui/material';
import type { DocumentRecord } from '../mockData';
import PolicyIcon from '@mui/icons-material/Policy';
import FindInPageIcon from '@mui/icons-material/FindInPage';

interface Props {
  document: DocumentRecord | null;
  onAction?: (action: 'approve' | 'block' | 'review') => void;
}

export default function AnalysisPanel({ document, onAction }: Props) {
  if (!document) {
    return (
      <Paper elevation={1} sx={{ p: 4, minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="text.secondary">Chọn một hồ sơ bên trái để xem chi tiết phân tích AI</Typography>
      </Paper>
    );
  }

  // Determine fraud layout based entirely on the status to guarantee UI color consistency
  const isFraud = !['Phê duyệt', 'Đã duyệt'].includes(document.status);

  const getPercentageColor = (status: string) => {
    switch(status) {
      case 'Phê duyệt': 
      case 'Đã duyệt': return 'success.main';
      case 'Cảnh báo': 
      case 'Đã chặn': return 'error.main';
      case 'Chờ xử lý': 
      case 'Kiểm tra thêm': return 'warning.main';
      default: return 'text.primary';
    }
  };

  const getProgressColor = (status: string) => {
    switch(status) {
      case 'Phê duyệt': 
      case 'Đã duyệt': return 'success';
      case 'Cảnh báo': 
      case 'Đã chặn': return 'error';
      case 'Chờ xử lý': 
      case 'Kiểm tra thêm': return 'warning';
      default: return 'primary';
    }
  };

  return (
    <Paper elevation={1} sx={{ display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <Box sx={{ p: 3, pb: 2, borderBottom: '1px solid #eeeeee' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Khung phân tích AI OCR: {document.id}</Typography>
        <Typography variant="body2" color="text.secondary">Doanh nghiệp: {document.company}</Typography>
      </Box>

      {/* Main Content */}
      <Box sx={{ p: 3 }}>
        <Grid container spacing={4} sx={{ alignItems: 'flex-start' }}>
          
          {/* Image Section */}
          <Grid size={{ xs: 12 }}>
            <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 2, p: 2, minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', bgcolor: '#fdfdfd' }}>
              {document.imageUrl ? (
                <img src={document.imageUrl} alt="Invoice" style={{ maxWidth: '100%', maxHeight: 500, objectFit: 'contain' }} />
              ) : (
                <Typography color="text.secondary">[Hóa đơn chưa có hình ảnh]</Typography>
              )}
              
              {document.aiHeatmap && document.imageUrl && (
                <Box sx={{ position: 'absolute', top: 16, right: 16, border: '2px solid red', backgroundColor: 'rgba(255,0,0,0.1)', px: 2, py: 0.5, borderRadius: 1 }}>
                  <Typography variant="caption" sx={{ color: 'red', fontWeight: 'bold' }}>⚠️ Chỉnh sửa</Typography>
                </Box>
              )}
            </Box>
          </Grid>

          {/* Analysis Section */}
          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', mb: 3, gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Thông tin OCR Bóc tách</Typography>
                {document.invoiceType && (
                  <Typography variant="body1" sx={{ mb: 0.5 }}><strong>Loại hóa đơn:</strong> <Chip label={document.invoiceType} size="small" variant="outlined" color="primary" sx={{ height: 20 }} /></Typography>
                )}
                <Typography variant="body1" sx={{ mb: 0.5 }}>
                  <strong>Mã số thuế:</strong>{' '}
                  {document.taxCode === 'Không tìm thấy' && document.invoiceType === 'Hóa đơn bán hàng' ? (
                    <span className="text-gray-500">Hóa đơn bán lẻ (Không yêu cầu)</span>
                  ) : (
                    <span style={{ color: document.taxCode === 'Không tìm thấy' ? '#d32f2f' : 'inherit' }}>{document.taxCode}</span>
                  )}
                </Typography>
                <Typography variant="body1"><strong>Tổng tiền:</strong> {document.amount}</Typography>
              </Box>
              
              <Box sx={{ minWidth: 200 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Trust Score (Độ tin cậy)</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h4" color={getPercentageColor(document.status)} sx={{ fontWeight: 'bold' }}>
                    {(document.riskScore * 100).toFixed(0)}%
                  </Typography>
                  <Chip label={document.status.toUpperCase()} color={getProgressColor(document.status) as any} size="small" />
                </Box>
              </Box>
            </Box>

            <LinearProgress variant="determinate" value={document.riskScore * 100} color={getProgressColor(document.status) as any} sx={{ height: 8, borderRadius: 4, mb: 2 }} />
            
            <Box sx={{ p: 2, bgcolor: isFraud ? '#fff5f5' : '#f5fff5', borderRadius: 2, border: `1px solid ${isFraud ? '#ffcdd2' : '#c8e6c9'}`, borderLeft: `6px solid ${isFraud ? '#d32f2f' : '#2e7d32'}` }}>
              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, color: isFraud ? 'error.dark' : 'success.dark' }}>
                <FindInPageIcon color={isFraud ? "error" : "success"} sx={{ mt: 0.2 }} />
                <span><strong>Kết luận AI:</strong> {document.details || (document.aiHeatmap ? 'Phát hiện dấu hiệu can thiệp điểm ảnh (Photoshop).' : 'Hình ảnh gốc, không có dấu hiệu chỉnh sửa.')}</span>
              </Typography>
            </Box>
          </Grid>

        </Grid>
      </Box>

      {/* Action Footer */}
      <Box sx={{ p: 3, bgcolor: isFraud ? 'rgba(211, 47, 47, 0.08)' : 'rgba(46, 125, 50, 0.08)', borderTop: `2px solid ${isFraud ? '#d32f2f' : '#2e7d32'}` }}>
        <Typography variant="subtitle1" color={isFraud ? 'error.main' : 'success.main'} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold' }}>
          <PolicyIcon /> Đề xuất & Quyết định:
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {isFraud ? (
            <>
              <Button size="large" variant="contained" color="error" onClick={() => onAction && onAction('block')} disabled={['Đã chặn', 'Đã duyệt'].includes(document.status)}>Chặn giải ngân ngay</Button>
              <Button size="large" variant="outlined" color="error" onClick={() => onAction && onAction('review')} disabled={['Chờ xử lý', 'Đã duyệt', 'Đã chặn'].includes(document.status)}>Chuyển bộ phận Review</Button>
            </>
          ) : (
            <Button size="large" variant="contained" color="success" onClick={() => onAction && onAction('approve')} disabled={['Đã duyệt', 'Đã chặn'].includes(document.status)}>Phê duyệt tự động</Button>
          )}
        </Box>
      </Box>

    </Paper>
  );
}
