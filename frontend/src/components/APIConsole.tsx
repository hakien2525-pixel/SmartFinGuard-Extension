import { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Grid, Card, CardContent, Divider, Chip } from '@mui/material';
import KeyIcon from '@mui/icons-material/Key';
import CodeIcon from '@mui/icons-material/Code';

export default function APIConsole() {
  const [apiKey, setApiKey] = useState(localStorage.getItem('vnpt_api_key') || '');
  const [clientId, setClientId] = useState(localStorage.getItem('vnpt_client_id') || '');
  const [clientSecret, setClientSecret] = useState(localStorage.getItem('vnpt_client_secret') || '');

  const saveConfig = () => {
    localStorage.setItem('vnpt_api_key', apiKey);
    localStorage.setItem('vnpt_client_id', clientId);
    localStorage.setItem('vnpt_client_secret', clientSecret);
    alert('Cấu hình API keys thành công!');
  };

  const codeSnippet = `// Ví dụ tích hợp VNPT SmartReader Invoice OCR bằng Node.js (NestJS / Axios)
const axios = require('axios');
const fs = require('fs');

async function scanInvoice(imagePath) {
  const base64Image = fs.readFileSync(imagePath, { encoding: 'base64' });
  const url = 'https://api.vnpt.ai/ocr/v1/invoice';

  try {
    const response = await axios.post(url, {
      image: base64Image
    }, {
      headers: {
        'x-api-key': '${apiKey || "YOUR_API_KEY"}',
        'Content-Type': 'application/json'
      }
    });

    if (response.data.status === 'success') {
      console.log('Mã số thuế:', response.data.data.seller_tax_code);
      console.log('Tổng tiền:', response.data.data.total_amount);
    }
  } catch (error) {
    console.error('OCR Error:', error.message);
  }
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
              label="VNPT API Key (x-api-key)"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              fullWidth
              variant="outlined"
              placeholder="e.g. vnpt_ai_key_xxxxxxxxxxxxx"
            />

            <TextField
              label="VNPT Client ID"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              fullWidth
              variant="outlined"
              placeholder="Nhập Client ID dự án"
            />

            <TextField
              label="VNPT Client Secret"
              type="password"
              value={clientSecret}
              onChange={(e) => setClientSecret(e.target.value)}
              fullWidth
              variant="outlined"
              placeholder="Nhập Client Secret dự án"
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
