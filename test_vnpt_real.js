/**
 * Script kiểm thử nhanh kết nối API VNPT SmartReader thật từ dòng lệnh.
 * 
 * Cách chạy:
 * 1. Thay thế các thông tin TOKEN_ID, TOKEN_KEY, ACCESS_TOKEN bằng thông tin thật của bạn ở dưới.
 * 2. Chạy lệnh: node test_vnpt_real.js
 */

const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

// ==========================================
// 🛠️ ĐIỀN THÔNG TIN CREDENTIALS THẬT CỦA BẠN VÀO ĐÂY:
const TOKEN_ID = '5496a499-8bb7-47...'; // <-- Copy Token id trên Web VNPT dán vào đây
const TOKEN_KEY = 'MFwwDQYJKoZIhvc...'; // <-- Copy Token key trên Web VNPT dán vào đây
const ACCESS_TOKEN = 'Bearer ...';     // <-- Copy Access token trên Web VNPT dán vào đây
// ==========================================

// Chọn một ảnh mẫu có sẵn trong dự án để test upload
const TEST_FILE_PATH = path.join(__dirname, 'frontend', 'src', 'assets', 'hero.png');

async function runTest() {
  console.log('🏁 Bắt đầu kiểm thử kết nối API VNPT SmartReader...');

  if (!fs.existsSync(TEST_FILE_PATH)) {
    console.error(`❌ Không tìm thấy tệp ảnh mẫu tại: ${TEST_FILE_PATH}`);
    return;
  }

  try {
    // ----------------------------------------
    // BƯỚC 1: UPLOAD FILE LÊN SERVER MEDIA VNPT
    // ----------------------------------------
    console.log('\nStep 1: Đang upload ảnh lên VNPT file-service...');
    
    const form = new FormData();
    form.append('file', fs.createReadStream(TEST_FILE_PATH));
    form.append('title', 'Test upload hackathon');
    form.append('description', 'Test upload hackathon');

    const uploadHeaders = {
      'Token-id': TOKEN_ID,
      'Token-key': TOKEN_KEY,
      'mac-address': 'EGOV-DIGDOC-WEB-API',
      ...form.getHeaders()
    };

    if (ACCESS_TOKEN && ACCESS_TOKEN.trim() !== 'Bearer ...') {
      uploadHeaders['Authorization'] = ACCESS_TOKEN;
    }

    const uploadRes = await axios.post('https://api.idg.vnpt.vn/file-service/v1/addFile', form, {
      headers: uploadHeaders
    });

    if (uploadRes.status !== 200 || !uploadRes.data.object) {
      console.error('❌ Upload thất bại. Phản hồi từ VNPT:', uploadRes.data);
      return;
    }

    const fileHash = uploadRes.data.object.hash;
    const fileType = uploadRes.data.object.fileType;
    console.log(`✅ Upload thành công!`);
    console.log(`   - File Hash nhận được: ${fileHash}`);
    console.log(`   - File Type: ${fileType}`);

    // ----------------------------------------
    // BƯỚC 2: GỌI API OCR BÓC TÁCH HOÁ ĐƠN GTGT
    // ----------------------------------------
    console.log('\nStep 2: Đang gửi file hash sang API ocr/hoa-don-gtgt...');

    const ocrHeaders = {
      'Token-id': TOKEN_ID,
      'Token-key': TOKEN_KEY,
      'mac-address': 'mac-address',
      'Content-Type': 'application/json'
    };

    if (ACCESS_TOKEN && ACCESS_TOKEN.trim() !== 'Bearer ...') {
      ocrHeaders['Authorization'] = ACCESS_TOKEN;
    }

    const ocrPayload = {
      file_hash: fileHash,
      file_type: fileType,
      token: '8928skjhfa89298jahga1771vbvb',
      client_session: '00-14-22-01-23-45-1548211589291',
      details: true
    };

    const ocrRes = await axios.post('https://api.idg.vnpt.vn/rpa-service/aidigdoc/v1/ocr/hoa-don-gtgt', ocrPayload, {
      headers: ocrHeaders
    });

    console.log('✅ API OCR phản hồi thành công!');
    console.log('\n📊 KẾT QUẢ TRẢ VỀ TỪ VNPT SMARTREADER:');
    console.log(JSON.stringify(ocrRes.data, null, 2));

  } catch (error) {
    console.error('\n❌ KIỂM THỬ THẤT BẠI. Lỗi kết nối hoặc API VNPT trả về lỗi:');
    if (error.response) {
      console.error(`- Status Code: ${error.response.status}`);
      console.error('- Message:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(`- Error: ${error.message}`);
    }
  }
}

runTest();
