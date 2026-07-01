// SmartFinGuard background service worker
// Gọi backend NestJS thật để quét hóa đơn — KHÔNG còn random/mock dữ liệu.

const BACKEND_URL = 'http://localhost:3000'; // đổi sang domain thật khi deploy

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'scanInvoice') {
    handleScanInvoice(request)
      .then(sendResponse)
      .catch((error) => {
        console.error('SmartFinGuard scanInvoice error:', error);
        sendResponse({
          status: 'error',
          message: 'Không thể kết nối tới backend SmartFinGuard. Vui lòng kiểm tra server đã chạy chưa.',
        });
      });

    // Return true để báo Chrome rằng response sẽ được gửi bất đồng bộ
    return true;
  }
});

async function handleScanInvoice(request) {
  if (!request.imageBase64) {
    return {
      status: 'error',
      message: 'Không có dữ liệu ảnh hóa đơn để quét. Hãy chọn/chụp ảnh hóa đơn trước khi bấm Quét.',
    };
  }

  const response = await fetch(`${BACKEND_URL}/api/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      image: request.imageBase64,
      fileName: request.fileName || 'invoice_from_extension.jpg',
      company: request.company || '',
    }),
  });

  if (!response.ok) {
    throw new Error(`Backend trả về HTTP ${response.status}`);
  }

  const result = await response.json();
  if (result.status !== 'success' || !result.data) {
    return {
      status: 'error',
      message: result.message || 'Backend không trả về kết quả hợp lệ.',
    };
  }

  const doc = result.data;
  return {
    status: 'success',
    taxCode: doc.taxCode,
    totalAmount: doc.amount,
    fraudScore: doc.riskScore != null ? (1 - doc.riskScore) : (doc.aiHeatmap ? 0.85 : 0.05),
    isTampered: !!doc.aiHeatmap,
    tamperedBoxes: doc.tampered_boxes || [],
    ketLuan: doc.ket_luan,
    khuyenNghi: doc.khuyen_nghi,
  };
}
