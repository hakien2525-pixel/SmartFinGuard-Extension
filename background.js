chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'scanInvoice') {
    // Simulate an API call taking 2 seconds
    setTimeout(() => {
      // Generate random mock data
      const randomTaxCode = '0' + Math.floor(100000000 + Math.random() * 900000000).toString();
      const randomFraudScore = parseFloat((Math.random()).toFixed(2));
      const amountFormatted = (Math.floor(Math.random() * 900) + 100) + ',000,000 VND';

      const mockResponse = {
        status: 'success',
        taxCode: randomTaxCode,
        totalAmount: amountFormatted,
        fraudScore: randomFraudScore
      };

      // Send the response back
      sendResponse(mockResponse);
    }, 2000);

    // Return true indicates that we wish to send a response asynchronously
    return true;
  }
});
