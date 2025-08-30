import React from 'react';

const AboutSection: React.FC = () => {
  return (
    <section className="py-8 md:py-10 bg-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            About{' '}
            <span className="text-gradient-primary">Ergiva</span>
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            We're revolutionizing physiotherapy care in Delhi NCR by bringing 
            professional treatment directly to your home. Quality healthcare made accessible, 
            convenient, and effective for everyone.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600 mb-2">200+</div>
              <div className="text-sm text-gray-600">Happy Patients</div>
            </div>
            <div className="text-center">
                <div className="text-2xl font-bold text-primary-600 mb-2">10+</div>
              <div className="text-sm text-gray-600">Expert Physiotherapists</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600 mb-2">5+</div>
              <div className="text-sm text-gray-600">Years Experience</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;