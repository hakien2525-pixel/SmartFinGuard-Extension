import { useState, useRef } from 'react';
import { Box, Paper, Typography, Button, Grid, Card, CardContent, CircularProgress, Alert, Stepper, Step, StepLabel } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FaceIcon from '@mui/icons-material/Face';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import SendIcon from '@mui/icons-material/Send';

interface Props {
  onScanComplete: () => void;
}

export default function SMEPortal({ onScanComplete }: Props) {
  const [activeStep, setActiveStep] = useState(0);
  const [isEkycRunning, setIsEkycRunning] = useState(false);
  const [isEkycDone, setIsEkycDone] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock eKYC Biometric Verification
  const startEkyc = () => {
    setIsEkycRunning(true);
    setTimeout(() => {
      setIsEkycRunning(false);
      setIsEkycDone(true);
      setActiveStep(1); // Go to invoice upload step
    }, 3000); // 3 seconds face scanning simulation
  };

  // Upload and scan invoice via Backend API
  const handleUploadInvoice = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setIsScanning(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result as string;
      try {
        const tokenId = localStorage.getItem('vnpt_token_id') || '';
        const tokenKey = localStorage.getItem('vnpt_token_key') || '';
        const accessToken = localStorage.getItem('vnpt_access_token') || '';
        const res = await fetch('http://localhost:3000/api/scan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            company: 'Công ty Doanh nghiệp SME Mẫu',
            image: base64Image,
            tokenId: tokenId,
            tokenKey: tokenKey,
            accessToken: accessToken
          })
        });
        const data = await res.json();
        if (data.status === 'success') {
          setScanResult(data.data);
          setActiveStep(2); // Go to Review and Submit step
          onScanComplete(); // Refresh parent document list
        } else {
          alert('Không thể bóc tách hóa đơn.');
        }
      } catch (err) {
        alert('Lỗi kết nối tới máy chủ.');
      } finally {
        setIsScanning(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setActiveStep(0);
    setIsEkycDone(false);
    setScanResult(null);
    setSelectedFile(null);
  };

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: '#0b3b60' }}>
        Cổng Thông Tin Doanh Nghiệp (SME Portal)
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        <Step completed={isEkycDone}>
          <StepLabel>Định danh eKYC</StepLabel>
        </Step>
        <Step>
          <StepLabel>Tải hóa đơn & OCR</StepLabel>
        </Step>
        <Step>
          <StepLabel>Nộp hồ sơ giải ngân</StepLabel>
        </Step>
      </Stepper>

      <Grid container spacing={4}>
        {/* Portal Workspace */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={1} sx={{ p: 4, minHeight: 400, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            
            {/* STEP 0: eKYC */}
            {activeStep === 0 && (
              <Box sx={{ textAlign: 'center' }}>
                <FaceIcon sx={{ fontSize: 80, color: '#1976d2', mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }} gutterBottom>
                  Định Danh Điện Tử Chủ Doanh Nghiệp (VNPT eKYC)
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
                  Để bảo mật và chống gian lận, vui lòng thực hiện quét khuôn mặt sinh trắc học để xác thực danh tính người nộp hồ sơ giải ngân.
                </Typography>

                {isEkycRunning ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <Box className="scanner-container" sx={{ position: 'relative', width: 200, height: 200, borderRadius: '50%', border: '4px solid #1976d2', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#e3f2fd' }}>
                      <FaceIcon sx={{ fontSize: 120, color: 'rgba(25, 118, 210, 0.4)' }} />
                      <Box className="scan-bar" sx={{ position: 'absolute', width: '100%', height: '4px', bgcolor: '#1976d2', top: 0, animation: 'scan-anim 2s infinite ease-in-out' }} />
                    </Box>
                    <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold' }}>
                      Đang phân tích Liveness (VNPT AI Core)...
                    </Typography>
                    
                    {/* Add inline style for scan animation */}
                    <style>{`
                      @keyframes scan-anim {
                        0% { top: 0%; }
                        50% { top: 100%; }
                        100% { top: 0%; }
                      }
                    `}</style>
                  </Box>
                ) : (
                  <Button variant="contained" size="large" onClick={startEkyc} sx={{ bgcolor: '#0b3b60', color: 'white', px: 4 }}>
                    Bắt đầu eKYC Khuôn mặt
                  </Button>
                )}
              </Box>
            )}

            {/* STEP 1: Invoice Upload */}
            {activeStep === 1 && (
              <Box sx={{ textAlign: 'center' }}>
                <CloudUploadIcon sx={{ fontSize: 80, color: '#2e7d32', mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }} gutterBottom>
                  Tải Lên Chứng Từ / Hóa Đơn Giải Ngân
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                  Hệ thống tự động sử dụng **VNPT SmartReader** để bóc tách thông tin hóa đơn tức thì.
                </Typography>

                <input
                  type="file"
                  accept="image/*,application/pdf"
                  style={{ display: 'none' }}
                  ref={fileInputRef}
                  onChange={handleUploadInvoice}
                />

                {isScanning ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <CircularProgress size={50} color="success" />
                    <Typography variant="body2" color="success.main" sx={{ fontWeight: 'bold' }}>
                      Đang xử lý OCR & Phân tích tính toàn vẹn ảnh...
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    <Button variant="contained" color="success" size="large" onClick={() => fileInputRef.current?.click()} sx={{ px: 4, mb: 1 }}>
                      Tải ảnh hóa đơn lên
                    </Button>
                    {selectedFile && (
                      <Typography variant="caption" sx={{ display: 'block' }} color="text.secondary">
                        Tệp đã chọn: {selectedFile.name}
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
            )}

            {/* STEP 2: Review and Submit */}
            {activeStep === 2 && scanResult && (
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                  <CheckCircleIcon color="success" sx={{ fontSize: 32 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Kết quả Phân Tích & Đối Chiếu Hóa Đơn
                  </Typography>
                </Box>

                <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="caption" color="text.secondary">MÃ SỐ THUẾ TRÍCH XUẤT</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{scanResult.taxCode}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="caption" color="text.secondary">TỔNG TIỀN THANH TOÁN</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>{scanResult.amount}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {/* Risk Alerts */}
                {scanResult.status === 'Cảnh báo' ? (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    <strong>CẢNH BÁO RỦI RO LỚN:</strong> {scanResult.details}
                  </Alert>
                ) : (
                  <Alert severity="success" sx={{ mb: 3 }}>
                    <strong>HỒ SƠ HỢP LỆ:</strong> {scanResult.details || 'Không phát hiện bất thường về cấu trúc hoặc trùng lặp dữ liệu.'}
                  </Alert>
                )}

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    size="large" 
                    startIcon={<SendIcon />}
                    onClick={() => {
                      alert('Hồ sơ đã được gửi thành công lên hệ thống xét duyệt của Ngân hàng!');
                      resetForm();
                    }}
                    sx={{ bgcolor: '#0b3b60' }}
                  >
                    Gửi Hồ sơ giải ngân
                  </Button>
                  <Button variant="outlined" size="large" onClick={resetForm}>
                    Quét lại hóa đơn khác
                  </Button>
                </Box>
              </Box>
            )}

          </Paper>
        </Grid>

        {/* Informative Side Bar */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card variant="outlined" sx={{ bgcolor: 'aliceblue', borderLeft: '4px solid #1976d2' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#0b3b60', display: 'flex', alignItems: 'center', gap: 1 }}>
                <ReceiptLongIcon /> Quy trình SME
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Hệ thống <strong>SmartFin-Guard</strong> giúp doanh nghiệp tự đối soát hồ sơ trước khi gửi lên ngân hàng, giảm thiểu thời gian chờ thẩm định từ vài ngày xuống còn vài phút.
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Các dịch vụ VNPT AI tích hợp:</Typography>
              <ul>
                <li><strong>VNPT eKYC:</strong> Xác thực danh tính sinh trắc học của đại diện doanh nghiệp.</li>
                <li><strong>VNPT SmartReader:</strong> Trích xuất dữ liệu hóa đơn chính xác không cần nhập tay.</li>
                <li><strong>Mô hình AI kiểm tra ảnh:</strong> Phát hiện các hành vi tẩy xóa chữ số hoặc làm giả con dấu trên hóa đơn.</li>
              </ul>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
