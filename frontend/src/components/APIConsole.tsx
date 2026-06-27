import { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Grid, Card, CardContent, Divider, Chip } from '@mui/material';
import KeyIcon from '@mui/icons-material/Key';
import CodeIcon from '@mui/icons-material/Code';

export default function APIConsole() {
  const [tokenId, setTokenId] = useState(localStorage.getItem('vnpt_token_id') || '');
  const [tokenKey, setTokenKey] = useState(localStorage.getItem('vnpt_token_key') || '');
  const [accessToken, setAccessToken] = useState(localStorage.getItem('vnpt_access_token') || '');

  const saveConfig = () => {
    localStorage.setItem('vnpt_token_id', tokenId);
    localStorage.setItem('vnpt_token_key', tokenKey);
    localStorage.setItem('vnpt_access_token', accessToken);
    alert('Cấu hình API keys VNPT thành công!');
  };

  const codeSnippet = `// Tích hợp VNPT SmartReader bằng Node.js (2 bước: Upload & OCR)
const axios = require('axios');
const fs = require('fs');

async function scanInvoice(imagePath) {
  // 1. Upload ảnh lấy File Hash
  const form = new FormData();
  form.append('file', fs.createReadStream(imagePath));
  form.append('title', 'Hashing document');
  form.append('description', 'Hashing document');

  const uploadRes = await axios.post('https://api.idg.vnpt.vn/file-service/v1/addFile', form, {
    headers: {
      'Token-id': '${tokenId || "YOUR_TOKEN_ID"}',
      'Token-key': '${tokenKey || "YOUR_TOKEN_KEY"}',
      'mac-address': 'EGOV-DIGDOC-WEB-API',
      ...form.getHeaders()
    }
  });

  const fileHash = uploadRes.data.object.hash;
  const fileType = uploadRes.data.object.fileType;

  // 2. Gọi API bóc tách Hóa đơn GTGT
  const ocrRes = await axios.post('https://api.idg.vnpt.vn/rpa-service/aidigdoc/v1/ocr/hoa-don-gtgt', {
    file_hash: fileHash,
    file_type: fileType,
    token: '8928skjhfa89298jahga1771vbvb',
    client_session: '00-14-22-01-23-45-1548211589291',
    details: true
  }, {
    headers: {
      'Token-id': '${tokenId || "YOUR_TOKEN_ID"}',
      'Token-key': '${tokenKey || "YOUR_TOKEN_KEY"}',
      'mac-address': 'mac-address',
      'Content-Type': 'application/json'
    }
  });

  console.log('Mã số thuế:', ocrRes.data.object.mst_seller);
  console.log('Tổng tiền:', ocrRes.data.object.total_payment);
}`;

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: '#0b3b60' }}>
        Trung Tâm Cấu Hình & Tích Hợp API VNPT
      </Typography>

      <Grid container spacing={4}>
        {/* Left Side: Input Keys */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper elevation={1} sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <KeyIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Nhập Credentials</Typography>
            </Box>
            <Divider />

            <TextField
              label="Token ID (Token-id)"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
              fullWidth
              variant="outlined"
              placeholder="e.g. 5496a499-8bb7-..."
            />

            <TextField
              label="Token Key (Token-key)"
              value={tokenKey}
              onChange={(e) => setTokenKey(e.target.value)}
              fullWidth
              variant="outlined"
              placeholder="e.g. MFwwDQYJKoZIhvc..."
            />

            <TextField
              label="Access Token (Bearer token)"
              type="password"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              fullWidth
              variant="outlined"
              placeholder="Dán chuỗi JWT Access token"
            />

            <Button variant="contained" color="primary" onClick={saveConfig} sx={{ bgcolor: '#0b3b60', py: 1.2 }}>
              Lưu cấu hình hệ thống
            </Button>
          </Paper>
        </Grid>

        {/* Right Side: Code Snippets & Services info */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <CodeIcon color="secondary" />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Hướng Dẫn Tích Hợp Code</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Đội thi có thể sử dụng các hàm mẫu này để gọi hệ sinh thái VNPT AI từ Backend NestJS hoặc Python FastAPI.
            </Typography>

            <Box component="pre" sx={{ bgcolor: '#1e1e1e', color: '#d4d4d4', p: 2, borderRadius: 2, overflowX: 'auto', fontSize: 13, fontFamily: 'monospace' }}>
              <code>{codeSnippet}</code>
            </Box>
          </Paper>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Card variant="outlined">
                <CardContent>
                  <Chip label="VNPT SmartReader" color="primary" size="small" sx={{ mb: 1 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Bóc tách thông tin</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Hỗ trợ quét ảnh hóa đơn VAT, chứng từ và nhận diện chính xác các trường khóa chính như Mã số thuế, Tổng tiền để đối chiếu.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Card variant="outlined">
                <CardContent>
                  <Chip label="VNPT eKYC" color="success" size="small" sx={{ mb: 1 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Định danh doanh nghiệp</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Xác thực khuôn mặt và giấy tờ tùy thân của người đại diện giải ngân, chống gian lận lấy trộm danh tính.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
