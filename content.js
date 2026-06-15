(function() {
  // Prevent multiple injections
  if (document.getElementById('smartfin-guard-container')) return;

  // 1. Inject the floating Action Button and Dashboard Overlay
  const container = document.createElement('div');
  container.id = 'smartfin-guard-container';
  
  // HTML Template
  container.innerHTML = `
    <!-- Styles for the floating UI -->
    <style>
      #smartfin-fab {
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: linear-gradient(135deg, #0b3b60, #1e5a8c);
        color: white;
        border: none;
        border-radius: 50px;
        padding: 14px 24px;
        font-size: 16px;
        font-weight: 600;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        box-shadow: 0 8px 20px rgba(11, 59, 96, 0.4);
        cursor: pointer;
        z-index: 999999;
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        display: flex;
        align-items: center;
        gap: 8px;
      }
      #smartfin-fab:hover {
        transform: translateY(-3px) scale(1.02);
        box-shadow: 0 12px 24px rgba(11, 59, 96, 0.5);
      }
      #smartfin-fab:active {
        transform: translateY(0) scale(0.98);
      }

      /* Dashboard Panel with Glassmorphism */
      #smartfin-dashboard {
        position: fixed;
        bottom: 90px;
        right: 30px;
        width: 340px;
        background: rgba(255, 255, 255, 0.85);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(255, 255, 255, 0.5);
        border-radius: 16px;
        box-shadow: 0 15px 35px rgba(0,0,0,0.15);
        z-index: 999998;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        padding: 24px;
        box-sizing: border-box;
        opacity: 0;
        visibility: hidden;
        transform: translateY(20px);
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }

      #smartfin-dashboard.show {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }

      /* Inner UI Elements */
      #sfg-header {
        font-size: 18px;
        font-weight: 700;
        color: #333;
        margin: 0 0 15px 0;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      #sfg-body {
        font-size: 14px;
        color: #555;
        line-height: 1.5;
        margin-bottom: 20px;
      }

      /* Loader */
      .sfg-loader-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px 0;
      }
      .sfg-spinner {
        border: 4px solid rgba(11, 59, 96, 0.1);
        border-left-color: #0b3b60;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        animation: sfg-spin 1s linear infinite;
        margin-bottom: 15px;
      }
      @keyframes sfg-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      /* Dynamic Themes */
      .sfg-theme-red #sfg-header { color: #d32f2f; }
      .sfg-theme-green #sfg-header { color: #2e7d32; }

      .sfg-btn {
        width: 100%;
        padding: 12px;
        border: none;
        border-radius: 8px;
        font-size: 15px;
        font-weight: bold;
        color: white;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      .sfg-btn-red {
        background: linear-gradient(135deg, #d32f2f, #b71c1c);
        box-shadow: 0 4px 10px rgba(211, 47, 47, 0.3);
      }
      .sfg-btn-red:hover { box-shadow: 0 6px 14px rgba(211, 47, 47, 0.4); transform: translateY(-2px); }
      
      .sfg-btn-green {
        background: linear-gradient(135deg, #2e7d32, #1b5e20);
        box-shadow: 0 4px 10px rgba(46, 125, 50, 0.3);
      }
      .sfg-btn-green:hover { box-shadow: 0 6px 14px rgba(46, 125, 50, 0.4); transform: translateY(-2px); }

      .sfg-close {
        position: absolute;
        top: 15px;
        right: 15px;
        cursor: pointer;
        color: #999;
        font-size: 20px;
        line-height: 1;
        transition: color 0.2s;
      }
      .sfg-close:hover { color: #333; }
    </style>

    <!-- FAB -->
    <button id="smartfin-fab">🔍 Quét Gian Lận (SmartFin)</button>

    <!-- Dashboard Overlay -->
    <div id="smartfin-dashboard">
      <div class="sfg-close" id="sfg-close-btn">&times;</div>
      <div id="sfg-content">
        <!-- Content injected dynamically -->
      </div>
    </div>
  `;

  document.body.appendChild(container);

  // 2. Logic & Interaction
  const fab = document.getElementById('smartfin-fab');
  const dashboard = document.getElementById('smartfin-dashboard');
  const closeBtn = document.getElementById('sfg-close-btn');
  const contentArea = document.getElementById('sfg-content');

  // Open Dashboard & trigger scan
  fab.addEventListener('click', () => {
    // Show panel
    dashboard.classList.add('show');
    dashboard.className = 'show'; // reset themes

    // Set Loading state
    contentArea.innerHTML = `
      <div class="sfg-loader-container">
        <div class="sfg-spinner"></div>
        <div id="sfg-body" style="text-align:center;">⏳ Đang đẩy dữ liệu qua lõi AI VNPT...</div>
      </div>
    `;

    // Send message to background script
    chrome.runtime.sendMessage({ action: 'scanInvoice' }, (response) => {
      if (chrome.runtime.lastError) {
        contentArea.innerHTML = `
          <div id="sfg-header">❌ Lỗi Kết Nối</div>
          <div id="sfg-body">Không thể kết nối đến Lõi AI. Vui lòng tải lại trang.</div>
        `;
        return;
      }

      if (response && response.status === 'success') {
        renderResult(response);
      }
    });
  });

  // Close Dashboard
  closeBtn.addEventListener('click', () => {
    dashboard.classList.remove('show');
  });

  // Render Logic based on Fraud Score
  function renderResult(data) {
    const isFraud = data.fraudScore > 0.3;

    if (isFraud) {
      dashboard.classList.add('sfg-theme-red');
      contentArea.innerHTML = `
        <div id="sfg-header">🔴 CẢNH BÁO RỦI RO</div>
        <div id="sfg-body">
          Phát hiện dấu hiệu chỉnh sửa Photoshop (Độ rủi ro: ${Math.round(data.fraudScore * 100)}%).<br><br>
          <strong>Mã số thuế:</strong> ${data.taxCode}<br>
          <strong>Tổng tiền OCR:</strong> ${data.totalAmount}
        </div>
        <button class="sfg-btn sfg-btn-red" id="sfg-action-btn">Chặn Giải Ngân</button>
      `;
    } else {
      dashboard.classList.add('sfg-theme-green');
      contentArea.innerHTML = `
        <div id="sfg-header">🟢 HỢP LỆ</div>
        <div id="sfg-body">
          Hóa đơn sạch, không có dấu hiệu chỉnh sửa hay trùng lặp (Độ rủi ro: ${Math.round(data.fraudScore * 100)}%).<br><br>
          <strong>Mã số thuế:</strong> ${data.taxCode}<br>
          <strong>Tổng tiền OCR:</strong> ${data.totalAmount}
        </div>
        <button class="sfg-btn sfg-btn-green" id="sfg-action-btn">Duyệt Nhanh</button>
      `;
    }

    // Action button logic
    document.getElementById('sfg-action-btn').addEventListener('click', () => {
      alert(isFraud ? 'Đã lưu lịch sử cảnh báo vào hệ thống.' : 'Đã duyệt chứng từ thành công.');
      dashboard.classList.remove('show');
    });
  }
})();
