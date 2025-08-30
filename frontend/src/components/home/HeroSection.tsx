import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRightIcon, PlayIcon, PauseIcon } from '@heroicons/react/24/outline';
import { useInView } from 'react-intersection-observer';

const HeroSection: React.FC = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const toggleVideoPlayback = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
        setIsVideoPlaying(false);
      } else {
        videoRef.current.play();
        setIsVideoPlaying(true);
      }
    }
  };

  const handleVideoEnded = () => {
    setIsVideoPlaying(false);
  };

  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-8 md:py-12">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-secondary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-accent-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      <div className="container-custom relative z-10">
        <div 
          ref={ref}
          className={`grid lg:grid-cols-2 gap-8 items-center ${
            inView ? 'animate-fade-in-up' : 'opacity-0'
          }`}
        >
          {/* Content */}
          <div className="space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-primary-500 rounded-full mr-2 animate-pulse" />
              Trusted by 200+ families in Delhi NCR
            </div>

            {/* Heading */}
            <div className="space-y-3">
              <h1 className="text-responsive-xl font-bold text-gray-900 leading-tight">
                Professional{' '}
                <span className="text-gradient-primary">Physiotherapy</span>
                <br />
                at Your Doorstep
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                Expert physiotherapists and quality rehabilitation products 
                delivered to your home in Delhi NCR. Start your recovery journey today.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-2">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-success-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-700 font-medium">Certified Physiotherapists</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-success-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-700 font-medium">Same Day Service</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-success-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-700 font-medium">Quality Equipment</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/book-session"
                className="btn-primary btn-lg group"
              >
                Book a Session
                <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              
              <Link 
                href="/shop"
                className="btn-outline btn-lg group"
              >
                Shop Products
                <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">200+</div>
                <div className="text-sm text-gray-600">Happy Patients</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">10+</div>
                <div className="text-sm text-gray-600">Expert Physiotherapists</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">24/7</div>
                <div className="text-sm text-gray-600">Support Available</div>
              </div>
            </div>
          </div>

                      {/* Hero Video */}
          <div className="relative">
            <div className="relative w-full h-80 lg:h-[400px] rounded-2xl overflow-hidden shadow-2xl bg-gray-900">
                                                           <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  poster="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop&crop=center"
                  onEnded={handleVideoEnded}
                  onError={() => {
                    // Fallback to image if video fails to load
                    const videoElement = videoRef.current;
                    if (videoElement) {
                      videoElement.style.display = 'none';
                    }
                  }}
                  preload="metadata"
                  loop
                  playsInline
                >
                 <source src="https://res.cloudinary.com/dyzg8kuzh/video/upload/v1755770946/vijay_bhutani_yeddll.mp4" type="video/mp4" />
                 {/* Fallback image if video is not supported */}
                 <Image
                   src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop&crop=center"
                   alt="Professional physiotherapist providing treatment at home"
                   fill
                   className="object-cover"
                   priority
                 />
               </video>
              
              {/* Video Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              
              {/* Play/Pause Button */}
              <button 
                onClick={toggleVideoPlayback}
                className="absolute inset-0 flex items-center justify-center group"
                aria-label={isVideoPlaying ? 'Pause video' : 'Play video'}
              >
                <div className="w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {isVideoPlaying ? (
                    <PauseIcon className="h-8 w-8 text-primary-600" />
                  ) : (
                    <PlayIcon className="h-8 w-8 text-primary-600 ml-1" />
                  )}
                </div>
                
                                 {/* Video Status Indicator */}
                 <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1">
                   <span className="text-white text-xs font-medium">
                     {isVideoPlaying ? 'PLAYING' : 'VIDEO'}
                   </span>
                 </div>
                 
                 {/* Audio Indicator */}
                 <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1">
                   <div className="flex items-center space-x-1">
                     <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                       <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657z" clipRule="evenodd" />
                       <path fillRule="evenodd" d="M11.828 5.172a1 1 0 011.414 0A5.983 5.983 0 0115 10a5.983 5.983 0 01-1.758 4.242 1 1 0 01-1.414-1.414A3.987 3.987 0 0013 10c0-1.105-.447-2.105-1.172-2.828z" clipRule="evenodd" />
                     </svg>
                     <span className="text-white text-xs font-medium">AUDIO</span>
                   </div>
                 </div>
              </button>
            </div>

            {/* Floating Cards */}
            <div className="absolute -top-6 -left-6 bg-white rounded-lg shadow-lg p-4 animate-float">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Certified Care</div>
                  <div className="text-sm text-gray-600">Licensed professionals</div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -right-6 bg-white rounded-lg shadow-lg p-4 animate-float animation-delay-2000">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Quick Response</div>
                  <div className="text-sm text-gray-600">Same day booking</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;