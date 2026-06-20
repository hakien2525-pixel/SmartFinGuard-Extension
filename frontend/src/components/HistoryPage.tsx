import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import type { DocumentRecord } from '../mockData';

interface Props {
  documents: DocumentRecord[];
}

export default function HistoryPage({ documents }: Props) {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Phê duyệt': 
      case 'Đã duyệt': return 'success';
      case 'Cảnh báo': 
      case 'Đã chặn': return 'error';
      case 'Chờ xử lý': 
      case 'Kiểm tra thêm': return 'warning';
      default: return 'default';
    }
  };

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

  return (
    <Box sx={{ p: 4, width: '100%' }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>Lịch sử toàn bộ Hồ sơ</Typography>
      
      <TableContainer component={Paper} elevation={1}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell><strong>Mã Hồ sơ</strong></TableCell>
              <TableCell><strong>Thời gian</strong></TableCell>
              <TableCell><strong>Doanh nghiệp</strong></TableCell>
              <TableCell><strong>Mã số thuế</strong></TableCell>
              <TableCell><strong>Tổng tiền</strong></TableCell>
              <TableCell><strong>Độ tin cậy</strong></TableCell>
              <TableCell><strong>Trạng thái</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documents.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.time}</TableCell>
                <TableCell>{row.company}</TableCell>
                <TableCell>{row.taxCode}</TableCell>
                <TableCell>{row.amount}</TableCell>
                <TableCell sx={{ color: getPercentageColor(row.status), fontWeight: 'bold' }}>
                  {(row.riskScore * 100).toFixed(0)}%
                </TableCell>
                <TableCell>
                  <Chip label={row.status} color={getStatusColor(row.status)} size="small" />
                </TableCell>
              </TableRow>
            ))}
            {documents.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  Chưa có hồ sơ nào trong hệ thống.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
