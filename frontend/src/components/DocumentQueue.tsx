import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Chip, Box } from '@mui/material';
import type { DocumentRecord } from '../mockData';

interface Props {
  documents: DocumentRecord[];
  onSelect: (doc: DocumentRecord) => void;
  selectedId: string | null;
}

export default function DocumentQueue({ documents, onSelect, selectedId }: Props) {
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
    <Box sx={{ height: '100%' }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Danh sách hồ sơ chờ duyệt</Typography>
      <TableContainer component={Paper} elevation={1}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell><strong>Mã HS</strong></TableCell>
              <TableCell><strong>Doanh nghiệp</strong></TableCell>
              <TableCell><strong>Độ tin cậy</strong></TableCell>
              <TableCell><strong>Trạng thái</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documents.map((row) => (
              <TableRow 
                key={row.id} 
                hover 
                onClick={() => onSelect(row)}
                sx={{ 
                  cursor: 'pointer',
                  backgroundColor: selectedId === row.id ? 'rgba(25, 118, 210, 0.08)' : 'inherit'
                }}
              >
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.company}</TableCell>
                <TableCell sx={{ color: getPercentageColor(row.status), fontWeight: 'bold' }}>
                  {(row.riskScore * 100).toFixed(0)}%
                </TableCell>
                <TableCell>
                  <Chip label={row.status} color={getStatusColor(row.status)} size="small" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
