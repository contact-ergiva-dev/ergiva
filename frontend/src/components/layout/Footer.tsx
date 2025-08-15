import React from 'react';
import Link from 'next/link';
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon,
  ClockIcon 
} from '@heroicons/react/24/outline';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'Book Session', href: '/book-session' },
    { name: 'About Us', href: '/about' },
  ];

  const services = [
    { name: 'Home Physiotherapy', href: '/book-session' },
    { name: 'TENS Machines', href: '/shop?category=TENS Units' },
    { name: 'Hot/Cold Therapy', href: '/shop?category=Hot/Cold Therapy' },
    { name: 'Resistance Bands', href: '/shop?category=Resistance Bands' },
    { name: 'Ortho Supports', href: '/shop?category=Ortho Supports' },
  ];

  const support = [
    { name: 'Contact Us', href: '/contact' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Join as Partner', href: '/join-partner' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <span className="text-xl font-bold">Ergiva</span>
            </Link>
            
            <p className="text-gray-300 text-sm leading-relaxed">
              Professional physiotherapy services at your doorstep in Delhi NCR. 
              Quality rehabilitation products and personalized care for your recovery journey.
            </p>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <PhoneIcon className="h-5 w-5 text-primary-400 flex-shrink-0" />
                <div>
                  <a 
                    href="tel:+919211215116" 
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    +91 92112 15116
                  </a>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="h-5 w-5 text-primary-400 flex-shrink-0" />
                <div>
                  <a 
                    href="mailto:support@ergiva.com" 
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    support@ergiva.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <MapPinIcon className="h-5 w-5 text-primary-400 flex-shrink-0" />
                <div>
                  <span className="text-gray-300">Delhi NCR, India</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <ClockIcon className="h-5 w-5 text-primary-400 flex-shrink-0" />
                <div>
                  <span className="text-gray-300">9 AM - 9 PM (Mon-Sun)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Our Services</h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <Link 
                    href={service.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Support</h3>
            <ul className="space-y-3">
              {support.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Social Links */}
            <div className="pt-4">
              <h4 className="text-sm font-medium mb-3">Follow Us</h4>
              <div className="flex space-x-4">
                <a
                  href="https://www.facebook.com/ergiva"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                  aria-label="Facebook"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                
                <a
                  href="https://www.instagram.com/ergiva"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                  aria-label="Instagram"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.621 5.367 11.988 11.988 11.988s11.987-5.367 11.987-11.988C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.33-1.297C4.198 14.894 3.708 13.743 3.708 12.446s.49-2.448 1.297-3.33c.807-.882 1.959-1.297 3.33-1.297s2.448.49 3.33 1.297c.807.882 1.297 1.959 1.297 3.33s-.49 2.448-1.297 3.33c-.882.807-1.959 1.297-3.33 1.297z" />
                  </svg>
                </a>
                
                <a
                  href="https://www.linkedin.com/company/ergiva"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                  aria-label="LinkedIn"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} Ergiva. All rights reserved.
            </p>
            
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <Link 
                href="/privacy" 
                className="hover:text-white transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/terms" 
                className="hover:text-white transition-colors duration-200"
              >
                Terms of Service
              </Link>
              <Link 
                href="/sitemap" 
                className="hover:text-white transition-colors duration-200"
              >
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;