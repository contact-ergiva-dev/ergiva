import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { StarIcon, PlayIcon, ChevronLeftIcon, ChevronRightIcon, UserCircleIcon, PauseIcon } from '@heroicons/react/24/solid';
import { ChatBubbleLeftRightIcon as QuoteIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
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
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [playingVideos, setPlayingVideos] = useState<Set<string>>(new Set());
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  useEffect(() => {
    fetchTestimonials();
    
    // Fallback: Set visible after a short delay in case intersection observer fails
    const visibilityFallback = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    
    // Intersection Observer for animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            clearTimeout(visibilityFallback); // Clear fallback if observer works
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      clearTimeout(visibilityFallback);
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Auto-scroll effect for testimonials
  useEffect(() => {
    if (testimonials.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      }, 5000); // Change every 5 seconds

      return () => clearInterval(interval);
    }
  }, [testimonials.length]);

  const fetchTestimonials = async () => {
    try {
      setError(null); // Clear any previous errors
      const apiUrl = `${API_CONFIG.BASE_URL}/testimonials/featured`;
      console.log('Fetching testimonials from:', apiUrl);
      console.log('Component mounted, loading state:', loading);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add cache control to prevent stale data
        cache: 'no-cache'
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Testimonials data received:', data);
      console.log('Number of testimonials:', data.testimonials?.length || 0);
      
      if (data.testimonials && Array.isArray(data.testimonials)) {
        setTestimonials(data.testimonials);
        console.log('Testimonials set successfully:', data.testimonials.length);
      } else {
        console.warn('Invalid testimonials data structure:', data);
        setTestimonials([]);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      setError(error instanceof Error ? error.message : 'Failed to load testimonials');
      toast.error('Failed to load testimonials');
      setTestimonials([]); // Ensure we set an empty array on error
    } finally {
      setLoading(false);
      console.log('Loading finished, setting loading to false');
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <StarIcon
        key={index}
        className={`h-5 w-5 transition-all duration-300 ${
          index < rating ? 'text-yellow-400 scale-110' : 'text-gray-300'
        }`}
      />
    ));
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget;
    img.style.display = 'none';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
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

  const toggleExpanded = (testimonialId: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(testimonialId)) {
        newSet.delete(testimonialId);
      } else {
        newSet.add(testimonialId);
      }
      return newSet;
    });
  };

  const toggleVideoPlayback = (testimonialId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRefs.current[testimonialId];
    if (video) {
      if (playingVideos.has(testimonialId)) {
        video.pause();
        setPlayingVideos(prev => {
          const newSet = new Set(prev);
          newSet.delete(testimonialId);
          return newSet;
        });
      } else {
        // Pause all other videos first
        Object.keys(videoRefs.current).forEach(id => {
          if (id !== testimonialId && videoRefs.current[id]) {
            videoRefs.current[id]!.pause();
          }
        });
        setPlayingVideos(new Set([testimonialId]));
        video.play();
      }
    }
  };

  const handleVideoEnded = (testimonialId: string) => {
    setPlayingVideos(prev => {
      const newSet = new Set(prev);
      newSet.delete(testimonialId);
      return newSet;
    });
  };

  const truncateText = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  // Add debugging logs for render state
  console.log('Render state - Loading:', loading, 'Testimonials count:', testimonials.length, 'Error:', error);

  if (loading) {
    return (
      <section className="py-8 md:py-10 bg-gray-50">
        <div className="container-custom">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading testimonials...</p>
            <p className="mt-2 text-xs text-gray-400">API: {API_CONFIG.BASE_URL}/testimonials/featured</p>
          </div>
        </div>
      </section>
    );
  }

  // Show error state if there's an error
  if (error) {
    return (
      <section className="py-8 md:py-10 bg-gray-50">
        <div className="container-custom">
          <div className="text-center">
            <div className="bg-red-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Testimonials</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={fetchTestimonials}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="py-8 md:py-10 bg-gray-50">
      <div className="container-custom">
        <div className={`text-center space-y-3 mb-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-responsive-lg font-bold text-gray-900">
            What Our{' '}
            <span className="text-gradient-primary">Patients Say</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real stories from patients who experienced exceptional care with Ergiva
          </p>
          <div className="flex items-center justify-center space-x-2 mt-6">
            <div className="flex items-center space-x-1">
              {renderStars(5)}
            </div>
            <span className="text-lg font-semibold text-gray-900 ml-2">4.9/5</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-600">100+ reviews</span>
          </div>
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
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-8 px-4 md:px-8"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {testimonials.length === 0 ? (
              <div className="w-full text-center py-12">
                <div className="max-w-md mx-auto">
                  <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                    <QuoteIcon className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Testimonials Available</h3>
                  <p className="text-gray-600 mb-2">We're collecting patient testimonials. Check back soon!</p>
                  <p className="text-xs text-gray-400">Debug: Loading={loading.toString()}, Count={testimonials.length}</p>
                  <button 
                    onClick={fetchTestimonials}
                    className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                  >
                    Retry Loading
                  </button>
                </div>
              </div>
            ) : (
              testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id}
                className={`relative flex-none w-64 md:w-72 group ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ 
                  scrollSnapAlign: 'start',
                  animationDelay: `${index * 200}ms`
                }}
              >
                {/* New Testimonial Card Design */}
                <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 overflow-hidden border border-gray-100 max-w-full">
                  
                  {/* Video Section */}
                  {testimonial.video_url && (
                    <div className="relative w-full h-48 bg-gray-900 rounded-t-2xl overflow-hidden">
                      <video
                        ref={(el) => {
                          if (el) videoRefs.current[testimonial.id] = el;
                        }}
                        className="absolute inset-0 w-full h-full object-contain"
                        src={testimonial.video_url}
                        poster={testimonial.image_url || undefined}
                        onEnded={() => handleVideoEnded(testimonial.id)}
                        preload="metadata"
                        style={{ maxWidth: '100%', maxHeight: '100%' }}
                      >
                        Your browser does not support the video tag.
                      </video>
                      
                      {/* Video Control Overlay - Corner Positioned */}
                      <div className="absolute top-3 left-3 transition-all duration-300">
                        <button
                          onClick={(e) => toggleVideoPlayback(testimonial.id, e)}
                          className="bg-black/70 backdrop-blur-sm rounded-full p-1.5 shadow-lg transform transition-all duration-300 hover:scale-110 hover:bg-black/90 opacity-90 hover:opacity-100"
                        >
                          {playingVideos.has(testimonial.id) ? (
                            <PauseIcon className="h-4 w-4 text-white" />
                          ) : (
                            <PlayIcon className="h-4 w-4 text-white ml-0.5" />
                          )}
                        </button>
                      </div>

                      {/* Video Badge */}
                      <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1">
                        <span className="text-white text-xs font-medium">VIDEO</span>
                      </div>
                    </div>
                  )}

                  {/* Image Section for non-video testimonials */}
                  {!testimonial.video_url && testimonial.image_url && (
                    <div className="relative w-full h-48 bg-gray-100 rounded-t-2xl overflow-hidden">
                      <Image
                        src={testimonial.image_url}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                        onError={handleImageError}
                      />
                      <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1">
                        <span className="text-white text-xs font-medium">PHOTO</span>
                      </div>
                    </div>
                  )}

                  {/* Content Section */}
                  <div className="p-4">
                    {/* Profile Section */}
                    <div className="flex items-start space-x-3 mb-3">
                      {/* Circle Avatar */}
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg ring-2 ring-white">
                          {testimonial.image_url ? (
                            <Image
                              src={testimonial.image_url}
                              alt={testimonial.name}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                              onError={handleImageError}
                            />
                          ) : (
                            <span className="text-white text-sm font-bold">
                              {getInitials(testimonial.name)}
                            </span>
                          )}
                      </div>
                      
                      {/* Verification Badge */}
                        <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1.5 ring-2 ring-white">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>

                      <div className="flex-1 min-w-0">
                        {/* Name and Title */}
                        <h3 className="font-bold text-gray-900 truncate">{testimonial.name}</h3>
                        <p className="text-sm text-gray-600 mb-1">Verified Patient</p>
                        
                        {/* Rating Stars */}
                        <div className="flex items-center space-x-1">
                          {renderStars(testimonial.rating)}
                        </div>
                    </div>

                    {/* Date */}
                      <div className="text-xs text-gray-400">
                        {new Date(testimonial.created_at).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </div>

                    {/* Testimonial Content */}
                    <div className="space-y-2">
                      <blockquote className="text-gray-600 text-sm leading-relaxed">
                        "{expandedCards.has(testimonial.id) 
                          ? testimonial.content 
                          : truncateText(testimonial.content)}"
                      </blockquote>

                      {/* Show More/Less Button */}
                      {testimonial.content.length > 120 && (
                        <button
                          onClick={() => toggleExpanded(testimonial.id)}
                          className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 transition-colors duration-200 text-xs font-medium group"
                        >
                          <span>
                            {expandedCards.has(testimonial.id) ? 'Show less' : 'Show more'}
                          </span>
                          {expandedCards.has(testimonial.id) ? (
                            <ChevronUpIcon className="h-3 w-3 transform transition-transform duration-200 group-hover:-translate-y-0.5" />
                          ) : (
                            <ChevronDownIcon className="h-3 w-3 transform transition-transform duration-200 group-hover:translate-y-0.5" />
                          )}
                        </button>
                      )}
                  </div>

                    {/* Footer */}

                  </div>
                </div>
              </div>
              ))
            )}
          </div>
        </div>

        {/* Enhanced Video Modal */}
        {selectedVideo && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden max-w-5xl w-full shadow-2xl transform animate-in zoom-in-95 duration-300">
              {/* Modal Header */}
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 to-transparent p-6 z-20">
                <div className="flex items-center justify-between">
                  <div className="text-white">
                    <h3 className="text-lg font-semibold">Patient Testimonial Video</h3>
                    <p className="text-sm text-gray-300">Real experience from our verified patient</p>
                  </div>
                  <button
                    onClick={() => setSelectedVideo(null)}
                    className="text-white bg-white/10 backdrop-blur-sm rounded-full p-3 hover:bg-white/20 transition-all duration-300 transform hover:scale-110 hover:rotate-90"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Video Container */}
              <div className="relative">
                <video
                  controls
                  autoPlay
                  className="w-full h-auto max-h-[70vh] bg-black"
                  src={selectedVideo}
                  poster="/images/video-placeholder.jpg"
                >
                  Your browser does not support the video tag.
                </video>
                
                {/* Video Overlay for Loading */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-secondary-600/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="text-white text-center">
                    <PlayIcon className="w-16 h-16 mx-auto mb-2 opacity-80" />
                    <p className="text-sm">Patient Testimonial</p>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-gradient-to-r from-gray-900 to-black p-6 border-t border-gray-700">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      {renderStars(5)}
                    </div>
                    <span className="text-sm text-gray-300">Verified Patient Experience</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Authentic Review</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;