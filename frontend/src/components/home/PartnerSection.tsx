import React from 'react';
import Link from 'next/link';

const PartnerSection: React.FC = () => {
  return (
    <section className="py-8 md:py-10 bg-gray-50">
      <div className="container-custom">
        <div className="bg-gradient-to-r from-secondary-600 to-primary-600 rounded-xl p-6 text-white text-center max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Join Our Expert Team
          </h2>
          <p className="text-lg mb-4 opacity-90">
            Be part of Delhi NCR's leading physiotherapy service. Flexible schedules and competitive pay.
          </p>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-xl font-bold mb-1">10+</div>
              <div className="text-sm opacity-90">Partners</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold mb-1">Flexible</div>
              <div className="text-sm opacity-90">Hours</div>
            </div>
          </div>
          
          <Link 
            href="/join-partner"
            className="inline-flex items-center px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            Apply Now
            <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PartnerSection;