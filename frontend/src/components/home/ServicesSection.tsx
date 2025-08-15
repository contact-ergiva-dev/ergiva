import React from 'react';
import Link from 'next/link';
import { HomeIcon, ComputerDesktopIcon, TruckIcon, ClockIcon } from '@heroicons/react/24/outline';

const ServicesSection: React.FC = () => {
  const services = [
    {
      icon: HomeIcon,
      title: 'Home Physiotherapy',
      description: 'Professional physiotherapy treatment in the comfort of your home.',
      features: ['Personalized treatment plans', 'Latest equipment', 'Experienced therapists'],
      price: 'Starting from ₹1,500',
      href: '/book-session',
      popular: true,
    },
    {
      icon: ComputerDesktopIcon,
      title: 'Online Consultation',
      description: 'Expert guidance and follow-up sessions through video calls.',
      features: ['Video consultations', 'Exercise guidance', 'Progress monitoring'],
      price: 'Starting from ₹800',
      href: '/book-session?type=online',
      popular: false,
    },
    {
      icon: TruckIcon,
      title: 'Equipment Delivery',
      description: 'Quality physiotherapy products delivered to your doorstep.',
      features: ['Same-day delivery', 'Quality assured', 'Easy returns'],
      price: 'Free delivery above ₹999',
      href: '/shop',
      popular: false,
    },
    {
      icon: ClockIcon,
      title: 'Emergency Care',
      description: '24/7 emergency physiotherapy support for acute conditions.',
      features: ['24/7 availability', 'Rapid response', 'Acute care specialists'],
      price: 'Starting from ₹2,500',
      href: '/book-session?emergency=true',
      popular: false,
    },
  ];

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-responsive-lg font-bold text-gray-900">
            Our{' '}
            <span className="text-gradient-primary">Services</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive physiotherapy solutions designed to help you recover 
            faster and maintain optimal health from the comfort of your home.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="relative bg-white rounded-2xl p-8 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-2 group"
            >
              {/* Popular Badge */}
              {service.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                </div>
              )}

              {/* Icon */}
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-200 transition-colors duration-300">
                <service.icon className="h-8 w-8 text-primary-600" />
              </div>

              {/* Content */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>

                {/* Features */}
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-2 text-sm">
                      <div className="w-4 h-4 bg-success-100 rounded-full flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-success-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Price */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="text-lg font-bold text-primary-600">{service.price}</div>
                </div>

                {/* CTA Button */}
                <Link 
                  href={service.href}
                  className="w-full btn-primary group"
                >
                  Get Started
                  <svg className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Need a Custom Treatment Plan?
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Our experts will assess your condition and create a personalized therapy program.
            </p>
            <Link 
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-white text-primary-600 font-medium rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              Contact Our Experts
              <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;