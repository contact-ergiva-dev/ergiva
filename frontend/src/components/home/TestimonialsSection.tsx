import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { StarIcon, PlayIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import { API_CONFIG } from '@/config/constants';

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

const TestimonialsSection: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/testimonials/featured`);
      const data = await response.json();
      setTestimonials(data.testimonials || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <StarIcon
        key={index}
        className={`h-5 w-5 ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -400,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 400,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <section className="py-8 md:py-10 bg-gray-50">
        <div className="container-custom">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading testimonials...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-10 bg-gray-50">
      <div className="container-custom">
        <div className="text-center space-y-3 mb-8">
          <h2 className="text-responsive-lg font-bold text-gray-900">
            What Our{' '}
            <span className="text-gradient-primary">Patients Say</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real stories from patients who experienced exceptional care with Ergiva.
          </p>
        </div>

        {/* Scrollable Testimonials Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors duration-200 hidden md:flex items-center justify-center"
            aria-label="Scroll left"
          >
            <ChevronLeftIcon className="h-6 w-6 text-gray-600" />
          </button>
          
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors duration-200 hidden md:flex items-center justify-center"
            aria-label="Scroll right"
          >
            <ChevronRightIcon className="h-6 w-6 text-gray-600" />
          </button>

          {/* Scrollable Container */}
          <div 
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 px-4 md:px-8"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {testimonials.map((testimonial) => (
              <div 
                key={testimonial.id}
                className="bg-white rounded-xl shadow-soft hover:shadow-medium transition-all duration-300 p-6 relative flex-none w-80 md:w-96"
                style={{ scrollSnapAlign: 'start' }}
              >
              {/* Video Indicator */}
              {testimonial.video_url && (
                <button
                  onClick={() => setSelectedVideo(testimonial.video_url!)}
                  className="absolute top-4 right-4 bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 transition-colors duration-200"
                >
                  <PlayIcon className="h-4 w-4" />
                </button>
              )}

              {/* Rating */}
              <div className="flex items-center space-x-1 mb-4">
                {renderStars(testimonial.rating)}
              </div>

              {/* Content */}
              <blockquote className="text-gray-700 mb-6 italic">
                "{testimonial.content}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center space-x-4">
                <div className="relative w-12 h-12 overflow-hidden rounded-full">
                  <Image
                    src={testimonial.image_url || '/images/default-avatar.jpg'}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">Verified Patient</div>
                </div>
              </div>

              {/* Date */}
              <div className="mt-4 text-xs text-gray-500">
                {new Date(testimonial.created_at).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              </div>
            ))}
          </div>
        </div>

        {/* Overall Rating Summary */}
        <div className="mt-10 text-center">
          <div className="bg-white rounded-xl p-6 shadow-soft max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="flex items-center space-x-1">
                {renderStars(5)}
              </div>
              <span className="text-2xl font-bold text-gray-900">4.9</span>
            </div>
            <p className="text-gray-600 mb-2">
              Based on 2,500+ reviews from verified patients
            </p>
            <p className="text-sm text-gray-500">
              "Consistently rated as Delhi NCR's best home physiotherapy service"
            </p>
          </div>
        </div>

        {/* Video Modal */}
        {selectedVideo && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="relative bg-white rounded-lg overflow-hidden max-w-4xl w-full">
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-all duration-200 z-10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <video
                controls
                autoPlay
                className="w-full h-auto max-h-96"
                src={selectedVideo}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;