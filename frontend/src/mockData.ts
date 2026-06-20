export interface DocumentRecord {
  id: string;
  company: string;
  time: string;
  riskScore: number;
  status: 'Phê duyệt' | 'Cảnh báo' | 'Kiểm tra thêm';
  amount: string;
  taxCode: string;
  aiHeatmap: boolean;
  details?: string;
  imageUrl?: string;
}

export const mockDocuments: DocumentRecord[] = [
  { id: 'DOC001', company: 'Công ty Cổ phần Alpha', time: '10:05', riskScore: 0.15, status: 'Phê duyệt', amount: '500,000,000 VND', taxCode: '0101234567', aiHeatmap: false },
  { id: 'DOC002', company: 'Công ty TNHH Beta', time: '10:15', riskScore: 0.88, status: 'Cảnh báo', amount: '1,200,000,000 VND', taxCode: '0309876543', aiHeatmap: true },
  { id: 'DOC003', company: 'Doanh nghiệp Gamma', time: '10:30', riskScore: 0.45, status: 'Kiểm tra thêm', amount: '350,000,000 VND', taxCode: '0105678910', aiHeatmap: false },
  { id: 'DOC004', company: 'Tập đoàn Delta', time: '11:00', riskScore: 0.05, status: 'Phê duyệt', amount: '8,500,000,000 VND', taxCode: '0311122233', aiHeatmap: false },
  { id: 'DOC005', company: 'Công ty Dịch vụ Epsilon', time: '11:15', riskScore: 0.75, status: 'Cảnh báo', amount: '450,000,000 VND', taxCode: '0109998887', aiHeatmap: true },
];

export const mockStats = {
  total: 125,
  processing: 5,
  valid: 108,
  fraud: 12,
  successRate: 86.4
};
