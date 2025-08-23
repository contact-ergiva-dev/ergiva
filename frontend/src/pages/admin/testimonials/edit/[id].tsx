import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowLeftIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
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

const EditTestimonial: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    content: '',
    rating: 5,
    image_url: '',
    video_url: '',
    is_featured: false,
    is_active: true
  });

  useEffect(() => {
    // Check admin authentication
    const adminToken = localStorage.getItem('admin_token');
    if (!adminToken) {
      router.push('/admin');
      return;
    }

    if (id) {
      fetchTestimonial();
    }
  }, [id, router]);

  const fetchTestimonial = async () => {
    try {
      const data = await testimonialsAPI.getByIdAdmin(id as string);
      
      if (data.testimonial) {
        const testimonial = data.testimonial;
        setFormData({
          name: testimonial.name || '',
          content: testimonial.content || '',
          rating: testimonial.rating || 5,
          image_url: testimonial.image_url || '',
          video_url: testimonial.video_url || '',
          is_featured: testimonial.is_featured || false,
          is_active: testimonial.is_active !== undefined ? testimonial.is_active : true
        });
      } else {
        toast.error('Failed to load testimonial');
        router.push('/admin/testimonials');
      }
    } catch (error) {
      console.error('Error fetching testimonial:', error);
      toast.error('Failed to load testimonial');
      router.push('/admin/testimonials');
    } finally {
      setFetching(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleRatingClick = (rating: number) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await testimonialsAPI.update(id as string, formData);

      if (data.success) {
        toast.success('Testimonial updated successfully!');
        router.push('/admin/testimonials');
      } else {
        throw new Error(data.error || 'Failed to update testimonial');
      }
    } catch (error) {
      console.error('Error updating testimonial:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update testimonial');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Edit Testimonial - Admin | Ergiva</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-gradient-to-r from-primary-600 to-secondary-600 shadow-lg">
          <div className="px-4">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-4">
                <Link 
                  href="/admin/testimonials" 
                  className="text-white/80 hover:text-white transition-colors duration-200 p-2 hover:bg-white/10 rounded-lg"
                >
                  <ArrowLeftIcon className="h-6 w-6" />
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-white">Edit Testimonial</h1>
                  <p className="text-primary-100 text-sm">Update testimonial information and settings</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
              <div className="px-6 py-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Customer Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      placeholder="Enter customer name"
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                      Testimonial Content *
                    </label>
                    <textarea
                      id="content"
                      name="content"
                      required
                      rows={4}
                      value={formData.content}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                      placeholder="Enter testimonial content"
                    />
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating *
                    </label>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleRatingClick(star)}
                          className="text-2xl text-gray-300 hover:text-yellow-400 transition-colors"
                        >
                          {star <= formData.rating ? (
                            <StarIconSolid className="text-yellow-400" />
                          ) : (
                            <StarIcon />
                          )}
                        </button>
                      ))}
                      <span className="ml-3 text-sm text-gray-600">
                        {formData.rating} out of 5
                      </span>
                    </div>
                  </div>

                                     {/* Image URL */}
                   <div>
                     <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-2">
                       Profile Image URL
                     </label>
                     <input
                       type="url"
                       id="image_url"
                       name="image_url"
                       value={formData.image_url}
                       onChange={handleInputChange}
                       className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                       placeholder="https://drive.google.com/file/d/YOUR_FILE_ID/view"
                     />
                     <p className="mt-1 text-sm text-gray-500">
                       Optional: URL to customer's profile picture (Google Drive URLs will be automatically converted)
                     </p>
                     

                   </div>

                  {/* Video URL */}
                  <div>
                    <label htmlFor="video_url" className="block text-sm font-medium text-gray-700 mb-2">
                      Video URL
                    </label>
                    <input
                      type="url"
                      id="video_url"
                      name="video_url"
                      value={formData.video_url}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      placeholder="https://youtube.com/watch?v=..."
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Optional: URL to video testimonial (YouTube, Vimeo, etc.)
                    </p>
                  </div>

                  {/* Settings */}
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="is_featured"
                        name="is_featured"
                        checked={formData.is_featured}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-700">
                        Featured Testimonial
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="is_active"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                        Active (visible to customers)
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end space-x-4 pt-6">
                    <Link
                      href="/admin/testimonials"
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-8 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-xl hover:from-primary-700 hover:to-secondary-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Updating...</span>
                        </>
                      ) : (
                        <span>Update Testimonial</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default EditTestimonial;
