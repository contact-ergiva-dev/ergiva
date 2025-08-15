import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { 
  ChartBarIcon, 
  ShoppingBagIcon, 
  CalendarIcon, 
  UserGroupIcon,
  StarIcon,
  DocumentTextIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface AdminStats {
  totalOrders: number;
  totalSessions: number;
  totalPartners: number;
  totalProducts: number;
  totalTestimonials: number;
  recentOrders: any[];
  recentSessions: any[];
}

const AdminDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if admin is already logged in
    const adminToken = localStorage.getItem('admin_token');
    if (adminToken) {
      setIsAuthenticated(true);
      fetchDashboardStats();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginForm.email,
          password: loginForm.password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('admin_user', JSON.stringify(data.user));
        setIsAuthenticated(true);
        fetchDashboardStats();
        toast.success('Welcome to Ergiva Admin Dashboard!');
      } else {
        toast.error(data.error || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      // Mock data for demonstration
      setStats({
        totalOrders: 145,
        totalSessions: 230,
        totalPartners: 25,
        totalProducts: 13,
        totalTestimonials: 10,
        recentOrders: [
          { id: '1', customer: 'John Doe', amount: 1299, status: 'completed' },
          { id: '2', customer: 'Jane Smith', amount: 2499, status: 'pending' },
          { id: '3', customer: 'Mike Johnson', amount: 899, status: 'shipped' }
        ],
        recentSessions: [
          { id: '1', patient: 'Sarah Wilson', condition: 'Back Pain', date: '2024-01-15', status: 'completed' },
          { id: '2', patient: 'Tom Brown', condition: 'Knee Injury', date: '2024-01-16', status: 'scheduled' },
          { id: '3', patient: 'Lisa Garcia', condition: 'Shoulder Pain', date: '2024-01-17', status: 'pending' }
        ]
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    setStats(null);
    toast.success('Logged out successfully');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value
    });
  };

  if (!isAuthenticated) {
    return (
      <>
        <Head>
          <title>Admin Login - Ergiva</title>
          <meta name="description" content="Admin login for Ergiva dashboard" />
          <meta name="robots" content="noindex, nofollow" />
        </Head>

        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex flex-col justify-center py-8 px-2 relative overflow-hidden admin-page">
          {/* Background decoration */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
            <div className="absolute top-40 right-10 w-72 h-72 bg-secondary-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" />
            <div className="absolute bottom-20 left-20 w-72 h-72 bg-accent-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000" />
          </div>

          <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
            <div className="text-center">
              {/* Company Logo */}
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                <span className="text-white text-4xl font-bold">E</span>
              </div>
              
              <div className="space-y-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  Ergiva
                </h1>
                <p className="text-lg font-medium text-gray-700">Admin Dashboard</p>
                <p className="text-sm text-gray-500">
                  Healthcare Management System
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
            <div className="bg-white/80 backdrop-blur-sm py-10 px-6 shadow-2xl rounded-2xl border border-white/20">
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
                <p className="mt-2 text-sm text-gray-600">
                  Sign in to access your admin panel
                </p>
              </div>

              <form className="space-y-6" onSubmit={handleLogin}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                      placeholder="Enter your email"
                      value={loginForm.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                      placeholder="Enter your password"
                      value={loginForm.password}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-all duration-200 transform hover:scale-105"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Signing in...
                      </div>
                    ) : (
                      'Sign In to Dashboard'
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Demo Credentials</span>
                  </div>
                </div>
                
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <div className="text-xs">
                      <div className="font-medium text-gray-700">Email:</div>
                      <div className="font-mono text-primary-600">admin@ergiva.com</div>
                      <div className="font-medium text-gray-700 mt-1">Password:</div>
                      <div className="font-mono text-primary-600">admin123</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center relative z-10">
            <p className="text-sm text-gray-500">
              © 2024 Ergiva Healthcare. All rights reserved.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard - Ergiva</title>
        <meta name="description" content="Ergiva admin dashboard" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gray-50 admin-page">
        {/* Header */}
        <header className="bg-gradient-to-r from-primary-600 to-secondary-600 shadow-lg">
          <div className="px-6">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">E</span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">Ergiva Admin</h1>
                    <p className="text-primary-100 text-sm">Healthcare Management Dashboard</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-4">
                  <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-3 py-2">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">A</span>
                    </div>
                    <div className="text-white">
                      <p className="text-sm font-medium">Welcome, Admin</p>
                      <p className="text-xs text-primary-100">Super Administrator</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 backdrop-blur-sm border border-white/20"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="py-6 px-6">
          {/* Stats Overview */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              {/* Orders Card */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden shadow-lg rounded-xl border border-blue-200/50 hover:shadow-xl transition-all duration-300">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600 mb-1">Total Orders</p>
                      <p className="text-3xl font-bold text-blue-900">{stats?.totalOrders}</p>
                      <p className="text-xs text-blue-500 mt-1">+12% this month</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                      <ShoppingBagIcon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sessions Card */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 overflow-hidden shadow-lg rounded-xl border border-green-200/50 hover:shadow-xl transition-all duration-300">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600 mb-1">Total Sessions</p>
                      <p className="text-3xl font-bold text-green-900">{stats?.totalSessions}</p>
                      <p className="text-xs text-green-500 mt-1">+8% this month</p>
                    </div>
                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                      <CalendarIcon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Partners Card */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 overflow-hidden shadow-lg rounded-xl border border-purple-200/50 hover:shadow-xl transition-all duration-300">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600 mb-1">Partners</p>
                      <p className="text-3xl font-bold text-purple-900">{stats?.totalPartners}</p>
                      <p className="text-xs text-purple-500 mt-1">+3 new this week</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                      <UserGroupIcon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Products Card */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 overflow-hidden shadow-lg rounded-xl border border-orange-200/50 hover:shadow-xl transition-all duration-300">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-600 mb-1">Products</p>
                      <p className="text-3xl font-bold text-orange-900">{stats?.totalProducts}</p>
                      <p className="text-xs text-orange-500 mt-1">All categories</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                      <DocumentTextIcon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonials Card */}
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 overflow-hidden shadow-lg rounded-xl border border-yellow-200/50 hover:shadow-xl transition-all duration-300">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-yellow-600 mb-1">Testimonials</p>
                      <p className="text-3xl font-bold text-yellow-900">{stats?.totalTestimonials}</p>
                      <p className="text-xs text-yellow-500 mt-1">4.8★ avg rating</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                      <StarIcon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <button
                  onClick={() => router.push('/admin/products')}
                  className="group bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-center border border-gray-100 hover:border-primary-200 hover:-translate-y-1"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <DocumentTextIcon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Manage Products</h3>
                  <p className="text-sm text-gray-500">Add, edit, or remove products from your catalog</p>
                  <div className="mt-4 flex items-center justify-center text-primary-600 text-sm font-medium">
                    <span>Manage now</span>
                    <ArrowRightIcon className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </button>

                <button
                  onClick={() => router.push('/admin/orders')}
                  className="group bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-center border border-gray-100 hover:border-blue-200 hover:-translate-y-1"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <ShoppingBagIcon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">View Orders</h3>
                  <p className="text-sm text-gray-500">Track and manage customer orders</p>
                  <div className="mt-4 flex items-center justify-center text-blue-600 text-sm font-medium">
                    <span>View orders</span>
                    <ArrowRightIcon className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </button>

                <button
                  onClick={() => router.push('/admin/sessions')}
                  className="group bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-center border border-gray-100 hover:border-green-200 hover:-translate-y-1"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <CalendarIcon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Booked Sessions</h3>
                  <p className="text-sm text-gray-500">Manage physiotherapy appointments</p>
                  <div className="mt-4 flex items-center justify-center text-green-600 text-sm font-medium">
                    <span>Manage sessions</span>
                    <ArrowRightIcon className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </button>

                <button
                  onClick={() => router.push('/admin/testimonials')}
                  className="group bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-center border border-gray-100 hover:border-yellow-200 hover:-translate-y-1"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <StarIcon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Testimonials</h3>
                  <p className="text-sm text-gray-500">Manage customer reviews and feedback</p>
                  <div className="mt-4 flex items-center justify-center text-yellow-600 text-sm font-medium">
                    <span>Manage reviews</span>
                    <ArrowRightIcon className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Orders */}
                <div className="bg-white shadow-lg rounded-xl border border-gray-100">
                  <div className="px-6 py-5 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <ShoppingBagIcon className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flow-root">
                      <ul className="-my-3 divide-y divide-gray-100">
                        {stats?.recentOrders.map((order) => (
                          <li key={order.id} className="py-4 hover:bg-gray-50 rounded-lg px-3 -mx-3 transition-colors duration-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                                  <span className="text-blue-700 font-medium text-sm">
                                    {order.customer.charAt(0)}
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {order.customer}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    ₹{order.amount.toLocaleString()}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                  order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-blue-100 text-blue-800'
                                }`}>
                                  {order.status}
                                </span>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => router.push('/admin/orders')}
                        className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200"
                      >
                        View all orders →
                      </button>
                    </div>
                  </div>
                </div>

                {/* Recent Sessions */}
                <div className="bg-white shadow-lg rounded-xl border border-gray-100">
                  <div className="px-6 py-5 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Recent Sessions</h3>
                      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                        <CalendarIcon className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flow-root">
                      <ul className="-my-3 divide-y divide-gray-100">
                        {stats?.recentSessions.map((session) => (
                          <li key={session.id} className="py-4 hover:bg-gray-50 rounded-lg px-3 -mx-3 transition-colors duration-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                                  <span className="text-green-700 font-medium text-sm">
                                    {session.patient.charAt(0)}
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {session.patient}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {session.condition} • {session.date}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                  session.status === 'completed' ? 'bg-green-100 text-green-800' :
                                  session.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {session.status}
                                </span>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => router.push('/admin/sessions')}
                        className="w-full text-center text-sm font-medium text-green-600 hover:text-green-700 transition-colors duration-200"
                      >
                        View all sessions →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;