import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeftIcon, PlusIcon, PencilIcon, TrashIcon, EyeIcon, PlayIcon, StarIcon as StarIconOutline, XMarkIcon, UserIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import { testimonialsAPI } from '@/lib/api';

interface Testimonial {
  id: string;
  name: string;
  content: string;
  rating: number;
  image_url?: string;
  video_url?: string;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
}

const AdminTestimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingTestimonial, setViewingTestimonial] = useState<Testimonial | null>(null);

  useEffect(() => {
    // Check admin authentication
    const adminToken = localStorage.getItem('admin_token');
    if (!adminToken) {
      window.location.href = '/admin';
      return;
    }
    
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const data = await testimonialsAPI.getAllAdmin();
      setTestimonials(data.testimonials || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFeatured = async (testimonialId: string, isFeatured: boolean) => {
    try {
      const data = await testimonialsAPI.toggleFeatured(testimonialId, !isFeatured);

      if (data.success) {
        const updatedTestimonials = testimonials.map(testimonial =>
          testimonial.id === testimonialId ? { ...testimonial, is_featured: !isFeatured } : testimonial
        );
        setTestimonials(updatedTestimonials);
        toast.success(`Testimonial ${!isFeatured ? 'featured' : 'unfeatured'} successfully`);
      } else {
        toast.error(data.error || 'Failed to update testimonial');
      }
    } catch (error) {
      console.error('Error updating testimonial:', error);
      toast.error('Failed to update testimonial');
    }
  };

  const handleToggleActive = async (testimonialId: string, isActive: boolean) => {
    try {
      const data = await testimonialsAPI.toggleActive(testimonialId, !isActive);

      if (data.success) {
        const updatedTestimonials = testimonials.map(testimonial =>
          testimonial.id === testimonialId ? { ...testimonial, is_active: !isActive } : testimonial
        );
        setTestimonials(updatedTestimonials);
        toast.success(`Testimonial ${!isActive ? 'activated' : 'deactivated'} successfully`);
      } else {
        toast.error(data.error || 'Failed to update testimonial');
      }
    } catch (error) {
      console.error('Error updating testimonial:', error);
      toast.error('Failed to update testimonial');
    }
  };

  const handleDelete = async (testimonialId: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) {
      return;
    }

    try {
      const data = await testimonialsAPI.delete(testimonialId);

      if (data.success) {
        const updatedTestimonials = testimonials.filter(testimonial => testimonial.id !== testimonialId);
        setTestimonials(updatedTestimonials);
        toast.success('Testimonial deleted successfully');
      } else {
        toast.error(data.error || 'Failed to delete testimonial');
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast.error('Failed to delete testimonial');
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <StarIcon
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
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
        <title>Testimonials - Admin | Ergiva</title>
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
                  <h1 className="text-2xl font-bold text-white">Manage Testimonials</h1>
                  <p className="text-primary-100 text-sm">Manage customer reviews and feedback</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  href="/admin/testimonials/add"
                  className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg text-sm font-medium flex items-center space-x-2 transition-all duration-200 backdrop-blur-sm border border-white/20 hover:scale-105"
                >
                  <PlusIcon className="h-4 w-4" />
                  <span>Add Testimonial</span>
                </Link>
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
                      All Testimonials ({testimonials.length})
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Manage customer testimonials and reviews
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
                    <StarIconOutline className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Review
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rating
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Featured
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {testimonials.map((testimonial) => (
                        <tr key={testimonial.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                {testimonial.image_url ? (
                                  <img
                                    className="h-10 w-10 rounded-full object-cover"
                                    src={testimonial.image_url}
                                    alt={testimonial.name}
                                    onError={(e) => {
                                      const img = e.currentTarget;
                                      img.style.display = 'none';
                                      img.nextElementSibling?.classList.remove('hidden');
                                    }}
                                  />
                                ) : null}
                                <div className={`h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center ${testimonial.image_url ? 'hidden' : ''}`}>
                                  <span className="text-sm font-medium text-gray-700">
                                    {testimonial.name.charAt(0)}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{testimonial.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 max-w-xs">
                              <p className="line-clamp-2">{testimonial.content}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {renderStars(testimonial.rating)}
                              <span className="ml-2 text-sm text-gray-600">({testimonial.rating})</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              {testimonial.video_url && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  <PlayIcon className="h-3 w-3 mr-1" />
                                  Video
                                </span>
                              )}
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Text
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleToggleFeatured(testimonial.id, testimonial.is_featured)}
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                testimonial.is_featured
                                  ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                              }`}
                            >
                              {testimonial.is_featured ? '⭐ Featured' : 'Not Featured'}
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleToggleActive(testimonial.id, testimonial.is_active)}
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                testimonial.is_active
                                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                  : 'bg-red-100 text-red-800 hover:bg-red-200'
                              }`}
                            >
                              {testimonial.is_active ? 'Active' : 'Inactive'}
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(testimonial.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => setViewingTestimonial(testimonial)}
                                className="text-indigo-600 hover:text-indigo-900"
                                title="View"
                              >
                                <EyeIcon className="h-4 w-4" />
                              </button>
                              <Link
                                href={`/admin/testimonials/edit/${testimonial.id}`}
                                className="text-green-600 hover:text-green-900"
                                title="Edit"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </Link>
                              <button
                                onClick={() => handleDelete(testimonial.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Delete"
                              >
                                <TrashIcon className="h-4 w-4" />
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

        {/* Testimonial View Modal */}
        {viewingTestimonial && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-4 rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <StarIconOutline className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Testimonial Details</h3>
                      <p className="text-yellow-100 text-sm">Customer Feedback</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setViewingTestimonial(null)}
                    className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg p-2 transition-all duration-200"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Customer Information */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <UserIcon className="h-5 w-5 text-white" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">Customer Information</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Name</label>
                      <p className="text-gray-900 font-medium">{viewingTestimonial.name}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Date</label>
                      <p className="text-gray-900">{new Date(viewingTestimonial.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</p>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-5 border border-yellow-100">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                      <StarIcon className="h-5 w-5 text-white" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">Rating</h4>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon
                          key={star}
                          className={`h-6 w-6 ${
                            star <= viewingTestimonial.rating
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-2xl font-bold text-gray-900">{viewingTestimonial.rating}/5</span>
                  </div>
                </div>

                {/* Testimonial Content */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Testimonial</h4>
                  <div className="relative">
                    <div className="absolute top-0 left-0 text-6xl text-gray-200 font-serif">"</div>
                    <p className="text-gray-700 leading-relaxed pl-8 pt-4">{viewingTestimonial.content}</p>
                    <div className="absolute bottom-0 right-0 text-6xl text-gray-200 font-serif transform rotate-180">"</div>
                  </div>
                </div>

                {/* Video Preview (if available) */}
                {viewingTestimonial.video_url && (
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Video Testimonial</h4>
                    <div className="relative bg-gray-900 rounded-lg overflow-hidden">
                                             <video 
                         controls 
                         className="w-full h-64 object-cover"
                         poster={viewingTestimonial.image_url || 'https://via.placeholder.com/400x300?text=Video+Testimonial'}
                       >
                        <source src={viewingTestimonial.video_url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>
                )}

                {/* Image (if available and no video) */}
                {viewingTestimonial.image_url && !viewingTestimonial.video_url && (
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Customer Photo</h4>
                                         <img 
                       src={viewingTestimonial.image_url} 
                       alt={viewingTestimonial.name}
                       className="w-full h-64 object-cover rounded-lg"
                       onError={(e) => {
                         e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Customer+Photo';
                       }}
                     />
                  </div>
                )}

                {/* Status Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-100">
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Featured Status</label>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      viewingTestimonial.is_featured 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {viewingTestimonial.is_featured ? 'Featured' : 'Not Featured'}
                    </span>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Active Status</label>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      viewingTestimonial.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {viewingTestimonial.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 rounded-b-2xl flex justify-end space-x-3">
                <button
                  onClick={() => setViewingTestimonial(null)}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium"
                >
                  Close
                </button>
                {viewingTestimonial.video_url && (
                  <button 
                    onClick={() => window.open(viewingTestimonial.video_url, '_blank')}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium flex items-center space-x-2"
                  >
                    <PlayIcon className="h-4 w-4" />
                    <span>Open Video</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminTestimonials;