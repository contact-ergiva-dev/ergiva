import React from 'react';
import { useRouter } from 'next/router';
import Header from './Header';
import Footer from './Footer';
import AdminLayout from '../admin/AdminLayout';
import WhatsAppWidget from '../common/WhatsAppWidget';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  
  // Check if current route is an admin route
  const isAdminRoute = router.pathname.startsWith('/admin');
  
  // If it's an admin route, use AdminLayout
  if (isAdminRoute) {
    return <AdminLayout>{children}</AdminLayout>;
  }
  
  // For regular pages, use the standard layout
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <main className="flex-1">
        {children}
      </main>
      
      <Footer />
      
      {/* WhatsApp Widget - only show on non-admin pages */}
      <WhatsAppWidget />
    </div>
  );
};

export default Layout;