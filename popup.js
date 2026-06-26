document.addEventListener('DOMContentLoaded', () => {
  const authBtn = document.getElementById('authBtn');
  const btnLoader = document.getElementById('btnLoader');
  const btnText = document.getElementById('btnText');
  const messageEl = document.getElementById('message');

  // Check login state on load
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    chrome.storage.local.get(['isAuthenticated'], (result) => {
      if (result.isAuthenticated) {
        setAuthenticatedUI();
      }
    });
  } else {
    // Fallback for testing directly in browser
    if (localStorage.getItem('isAuthenticated') === 'true') {
      setAuthenticatedUI();
    }
  }

  authBtn.addEventListener('click', () => {
    // UI state during loading
    authBtn.disabled = true;
    btnLoader.style.display = 'inline-block';
    btnText.textContent = 'Đang xác thực...';
    messageEl.textContent = '';

    // Simulate eKYC process taking 1.5 seconds
    setTimeout(() => {
      // Save state
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ isAuthenticated: true }, () => {
          setAuthenticatedUI();
        });
      } else {
        localStorage.setItem('isAuthenticated', 'true');
        setAuthenticatedUI();
      }
    }, 1500);
  });

  function setAuthenticatedUI() {
    authBtn.style.display = 'none';
    messageEl.textContent = 'Định danh thành công! Đang chuyển hướng đến hệ thống...';
    messageEl.style.color = '#2e7d32'; // Success green
    
    // Auto redirect after 1 second
    setTimeout(() => {
      if (typeof chrome !== 'undefined' && chrome.tabs) {
        chrome.tabs.create({ url: 'http://localhost:5173' });
      } else {
        window.location.href = 'http://localhost:5173';
      }
    }, 1000);
  }
});
