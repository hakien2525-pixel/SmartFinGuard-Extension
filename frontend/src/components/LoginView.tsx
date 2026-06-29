import React from 'react';

const LoginView = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Trang Đăng Nhập</h1>
        <p className="text-gray-500 mb-6">Mô phỏng Giao diện 1: eKYC Face Liveness</p>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg" onClick={() => window.location.href='/admin-dashboard'}>Đăng nhập (Admin)</button>
      </div>
    </div>
  );
};

export default LoginView;
