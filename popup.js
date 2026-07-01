document.addEventListener('DOMContentLoaded', () => {
  const authBtn = document.getElementById('authBtn');
  const btnLoader = document.getElementById('btnLoader');
  const btnText = document.getElementById('btnText');
  const messageEl = document.getElementById('message');
  const faceVideo = document.getElementById('faceVideo');
  const BACKEND_URL = 'http://localhost:3000';

  // Check login state on load
  chrome.storage.local.get(['isAuthenticated'], (result) => {
    if (result.isAuthenticated) {
      setAuthenticatedUI();
    }
  });

  authBtn.addEventListener('click', async () => {
    // UI state during loading
    authBtn.disabled = true;
    btnLoader.style.display = 'block';
    btnText.textContent = 'Đang mở camera...';
    messageEl.textContent = '';
    messageEl.style.color = '#2e7d32';

    // 1. Xin quyền webcam thật
    let stream = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
    } catch (err) {
      resetButton();
      messageEl.style.color = '#c62828';
      messageEl.textContent = 'Không truy cập được webcam. Hãy cấp quyền camera cho tiện ích này.';
      return;
    }

    faceVideo.srcObject = stream;
    faceVideo.style.display = 'block';
    btnText.textContent = 'Đang quét khuôn mặt...';

    // Đợi camera ổn định 2 giây trước khi chụp
    await new Promise((r) => setTimeout(r, 2000));

    // 2. Chụp 1 khung hình thật từ video
    let base64Image = '';
    try {
      const canvas = document.createElement('canvas');
      canvas.width = faceVideo.videoWidth || 320;
      canvas.height = faceVideo.videoHeight || 240;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(faceVideo, 0, 0, canvas.width, canvas.height);
      base64Image = canvas.toDataURL('image/jpeg');
    } catch (err) {
      console.error('Failed to capture frame', err);
    }

    stream.getTracks().forEach((t) => t.stop());
    faceVideo.style.display = 'none';

    if (!base64Image) {
      resetButton();
      messageEl.style.color = '#c62828';
      messageEl.textContent = 'Không chụp được ảnh từ webcam. Vui lòng thử lại.';
      return;
    }

    // 3. Gửi ảnh thật sang backend NestJS -> VNPT eKYC AI Core thật
    btnText.textContent = 'Đang xác thực...';
    try {
      const res = await fetch(`${BACKEND_URL}/api/ekyc`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image }),
      });
      const data = await res.json();

      if (data.status === 'success') {
        chrome.storage.local.set({ isAuthenticated: true }, () => {
          setAuthenticatedUI();
        });
      } else {
        resetButton();
        messageEl.style.color = '#c62828';
        messageEl.textContent = data.message || 'Xác thực thất bại. Vui lòng thử lại.';
      }
    } catch (err) {
      resetButton();
      messageEl.style.color = '#c62828';
      messageEl.textContent = 'Không thể kết nối tới máy chủ xác thực. Hãy chắc chắn backend đang chạy.';
    }
  });

  function resetButton() {
    authBtn.disabled = false;
    btnLoader.style.display = 'none';
    btnText.textContent = 'Xác thực FaceID (VNPT eKYC)';
  }

  function setAuthenticatedUI() {
    authBtn.style.display = 'none';
    messageEl.textContent = 'Định danh thành công! Bạn có thể bắt đầu quét hóa đơn trên trình duyệt.';
    messageEl.style.color = '#2e7d32';
  }
});
