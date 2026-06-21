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
      <TableContainer component={Paper} elevation={1} className="overflow-x-hidden">
        <Table stickyHeader sx={{ tableLayout: 'fixed' }}>
          <TableHead>
            <TableRow>
              <TableCell className="w-[15%]"><strong>Mã HS</strong></TableCell>
              <TableCell className="w-[45%]"><strong>Doanh nghiệp</strong></TableCell>
              <TableCell className="w-[15%]"><strong>Độ tin cậy</strong></TableCell>
              <TableCell className="w-[25%] min-w-max"><strong>Trạng thái</strong></TableCell>
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
                <TableCell className="w-[15%]">{row.id}</TableCell>
                <TableCell className="w-[45%] truncate max-w-0" title={row.company} sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.company}</TableCell>
                <TableCell className="w-[15%]" sx={{ color: getPercentageColor(row.status), fontWeight: 'bold' }}>
                  {(row.riskScore * 100).toFixed(0)}%
                </TableCell>
                <TableCell className="w-[25%] min-w-max">
                  <Chip label={row.status} color={getStatusColor(row.status)} className="whitespace-nowrap w-fit px-3 py-1 text-center" size="small" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
