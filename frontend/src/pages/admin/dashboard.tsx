import { useEffect } from 'react';
import { useRouter } from 'next/router';

const AdminDashboardRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to main admin page
    router.replace('/admin');
  }, [router]);

  return null;
};

export default AdminDashboardRedirect;