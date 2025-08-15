import React from 'react';
import Link from 'next/link';

const CTASection: React.FC = () => {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="text-center space-y-8">
          <h2 className="text-responsive-lg font-bold text-gray-900">
            Ready to Start Your{' '}
            <span className="text-gradient-primary">Recovery Journey?</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Book your first session today and experience professional physiotherapy 
            care in the comfort of your home.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/book-session"
              className="btn-primary btn-lg"
            >
              Book Session Now
            </Link>
            <Link 
              href="/contact"
              className="btn-outline btn-lg"
            >
              Contact Us
            </Link>
          </div>
          
          <div className="text-center text-gray-500">
            <p>Available 9 AM - 9 PM | Same Day Booking | All Areas in Delhi NCR</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;