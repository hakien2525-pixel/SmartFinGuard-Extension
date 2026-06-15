document.addEventListener('DOMContentLoaded', () => {
  const authBtn = document.getElementById('authBtn');
  const btnLoader = document.getElementById('btnLoader');
  const btnText = document.getElementById('btnText');
  const messageEl = document.getElementById('message');

  // Check login state on load
  chrome.storage.local.get(['isAuthenticated'], (result) => {
    if (result.isAuthenticated) {
      setAuthenticatedUI();
    }
  });

  authBtn.addEventListener('click', () => {
    // UI state during loading
    authBtn.disabled = true;
    btnLoader.style.display = 'block';
    btnText.textContent = 'Đang xác thực...';
    messageEl.textContent = '';

    // Simulate eKYC process taking 1.5 seconds
    setTimeout(() => {
      // Save state
      chrome.storage.local.set({ isAuthenticated: true }, () => {
        setAuthenticatedUI();
      });
    }, 1500);
  });

  function setAuthenticatedUI() {
    authBtn.style.display = 'none';
    messageEl.textContent = 'Định danh thành công! Bạn có thể bắt đầu quét hóa đơn trên trình duyệt.';
    messageEl.style.color = '#2e7d32'; // Success green
  }
});
