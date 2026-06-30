import React from 'react';
import AnalyticsIcon from '@mui/icons-material/Analytics';

const DataAnalyticsView = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col p-10 font-sans">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
          <AnalyticsIcon sx={{ fontSize: 32 }} />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800">Trung Tâm Xử Lý Dữ Liệu (Data Hub)</h1>
          <p className="text-gray-500">Môi trường làm việc dành riêng cho Data Engineer & AI Researcher</p>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-8 flex-1">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
          <h2 className="text-xl font-bold text-gray-700 mb-2">Quản lý Mock Data</h2>
          <p className="text-gray-500 text-sm">Chỉnh sửa và giả lập các kịch bản dữ liệu kiểm thử cho hệ thống</p>
        </div>
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
          <h2 className="text-xl font-bold text-gray-700 mb-2">Đào tạo AI (Fine-tuning)</h2>
          <p className="text-gray-500 text-sm">Pipeline đẩy dữ liệu chứng từ gian lận để huấn luyện thêm Llama 3</p>
        </div>
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
          <h2 className="text-xl font-bold text-gray-700 mb-2">Báo Cáo Phân Tích</h2>
          <p className="text-gray-500 text-sm">Thống kê tỷ lệ sai sót của mô hình AI Forensics</p>
        </div>
      </div>
    </div>
  );
};

export default DataAnalyticsView;
