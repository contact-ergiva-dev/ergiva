import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeftIcon, EyeIcon, PhoneIcon, CalendarIcon, XMarkIcon, UserIcon, MapPinIcon, ClockIcon, HeartIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { API_CONFIG } from '@/config/constants';

interface Session {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  age: number;
  condition: string;
  address: string;
  preferredDate: string;
  preferredTime: string;
  notes?: string;
  createdAt: string;
}

const AdminSessions: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingSession, setViewingSession] = useState<Session | null>(null);

  useEffect(() => {
    // Check admin authentication
    const adminToken = localStorage.getItem('admin_token');
    if (!adminToken) {
      window.location.href = '/admin';
      return;
    }
    
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/sessions`);
      const data = await response.json();
      
      if (response.ok && data.success) {
        setSessions(data.sessions || []);
      } else {
        throw new Error('Failed to fetch sessions');
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast.error('Failed to load sessions');
      // Fallback to empty array instead of mock data
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Sessions - Admin | Ergiva</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-gradient-to-r from-primary-600 to-secondary-600 shadow-lg">
          <div className="px-6">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-4">
                <Link 
                  href="/admin" 
                  className="text-white/80 hover:text-white transition-colors duration-200 p-2 hover:bg-white/10 rounded-lg"
                >
                  <ArrowLeftIcon className="h-6 w-6" />
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-white">Booked Sessions</h1>
                  <p className="text-primary-100 text-sm">Manage physiotherapy appointments</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="py-6 px-6">
          <div>
            <div className="bg-white shadow-lg overflow-hidden rounded-xl border border-gray-100">
              <div className="px-6 py-5 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      All Sessions ({sessions.length})
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Manage physiotherapy sessions and appointments
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <CalendarIcon className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Session ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Patient
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Condition
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Schedule
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Address
                        </th>

                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {sessions.map((session) => (
                        <tr key={session.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{session.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{session.patientName}</div>
                              <div className="text-sm text-gray-500">Age: {session.age}</div>
                              <div className="flex items-center text-sm text-gray-500">
                                <PhoneIcon className="h-3 w-3 mr-1" />
                                {session.patientPhone}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{session.condition}</div>
                            {session.notes && (
                              <div className="text-sm text-gray-500 max-w-xs truncate" title={session.notes}>
                                {session.notes}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {session.preferredDate ? new Date(session.preferredDate).toLocaleDateString() : 'Date TBD'}
                            </div>
                            <div className="text-sm text-gray-500">{session.preferredTime || 'Time TBD'}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 max-w-xs">
                              {session.address}
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                                                          <button
                              onClick={() => setViewingSession(session)}
                              className="text-indigo-600 hover:text-indigo-900"
                              title="View Details"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </button>
                              <button
                                onClick={() => window.open(`tel:${session.patientPhone}`)}
                                className="text-green-600 hover:text-green-900"
                                title="Call Patient"
                              >
                                <PhoneIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Session View Modal */}
        {viewingSession && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <CalendarIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Session Details</h3>
                      <p className="text-green-100 text-sm">Session ID: {viewingSession.id.substring(0, 8)}...</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setViewingSession(null)}
                    className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg p-2 transition-all duration-200"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Patient Information */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <UserIcon className="h-5 w-5 text-white" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">Patient Information</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Name</label>
                      <p className="text-gray-900 font-medium">{viewingSession.patientName}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Age</label>
                      <p className="text-gray-900">{viewingSession.age} years</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Email</label>
                      <p className="text-gray-900">{viewingSession.patientEmail}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Phone</label>
                      <div className="flex items-center space-x-2">
                        <p className="text-gray-900">{viewingSession.patientPhone}</p>
                        <button
                          onClick={() => window.open(`tel:${viewingSession.patientPhone}`)}
                          className="text-green-600 hover:text-green-700"
                          title="Call Patient"
                        >
                          <PhoneIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Session Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Medical Information */}
                  <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-5 border border-red-100">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                        <HeartIcon className="h-5 w-5 text-white" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900">Medical Details</h4>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Condition</label>
                        <p className="text-gray-900 font-medium">{viewingSession.condition}</p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Preferred Time</label>
                        <p className="text-gray-900">{viewingSession.preferredTime}</p>
                      </div>
                    </div>
                  </div>

                  {/* Session Information */}
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-5 border border-purple-100">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                        <ClockIcon className="h-5 w-5 text-white" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900">Session Information</h4>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Preferred Date</label>
                        <p className="text-gray-900">
                          {viewingSession.preferredDate ? new Date(viewingSession.preferredDate).toLocaleDateString() : 'Date TBD'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Booked On</label>
                        <p className="text-gray-900">{new Date(viewingSession.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-5 border border-emerald-100">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                      <MapPinIcon className="h-5 w-5 text-white" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">Session Address</h4>
                  </div>
                  <p className="text-gray-900">{viewingSession.address}</p>
                  <button 
                    onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(viewingSession.address)}`)}
                    className="mt-3 text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                  >
                    View on Google Maps →
                  </button>
                </div>

                {/* Notes (if available) */}
                {viewingSession.notes && (
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-5 border border-yellow-100">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Additional Notes</h4>
                    <p className="text-gray-700">{viewingSession.notes}</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 rounded-b-2xl flex justify-between">
                <div className="flex space-x-3">
                  <button
                    onClick={() => window.open(`tel:${viewingSession.patientPhone}`)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium flex items-center space-x-2"
                  >
                    <PhoneIcon className="h-4 w-4" />
                    <span>Call Patient</span>
                  </button>
                  <button
                    onClick={() => window.open(`mailto:${viewingSession.patientEmail}`)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                  >
                    Send Email
                  </button>
                </div>
                <button
                  onClick={() => setViewingSession(null)}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminSessions;