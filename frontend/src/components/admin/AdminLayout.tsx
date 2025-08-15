import React from 'react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* <div className="p-8"> */}
        <div className="bg-white rounded-lg shadow">
          {/* <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Panel</h1>
          <p className="text-gray-600">Admin layout and functionality will be implemented here</p> */}
          {children}
        </div>
      {/* </div> */}
    </div>
  );
};

export default AdminLayout;