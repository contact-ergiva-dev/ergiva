import React from 'react';
import Head from 'next/head';
import HeroSection from '@/components/home/HeroSection';
import AboutSection from '@/components/home/AboutSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import ServicesSection from '@/components/home/ServicesSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import PartnerSection from '@/components/home/PartnerSection';
import CTASection from '@/components/home/CTASection';

const HomePage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Ergiva - Home Physiotherapy Services & Products in Delhi NCR</title>
        <meta 
          name="description" 
          content="Professional physiotherapy services at your home in Delhi NCR. Quality rehabilitation products including TENS machines, hot/cold packs, and ortho supports. Book your session today!" 
        />
        <meta name="keywords" content="physiotherapy Delhi NCR, home physiotherapy, TENS machine, rehabilitation products, pain relief, mobility aids" />
        
        {/* Open Graph tags */}
        <meta property="og:title" content="Ergiva - Home Physiotherapy Services & Products in Delhi NCR" />
        <meta property="og:description" content="Professional physiotherapy services at your home in Delhi NCR. Quality rehabilitation products and personalized care." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ergiva.com" />
        <meta property="og:image" content="/images/og-home.jpg" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Ergiva - Home Physiotherapy Services & Products" />
        <meta name="twitter:description" content="Professional physiotherapy services at your home in Delhi NCR" />
        <meta name="twitter:image" content="/images/twitter-home.jpg" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Ergiva",
              "description": "Professional physiotherapy services at your home in Delhi NCR",
              "url": "https://ergiva.com",
              "logo": "https://ergiva.com/images/logo.png",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91-92112-15116",
                "contactType": "customer service",
                "availableLanguage": ["en", "hi"]
              },
              "address": {
                "@type": "PostalAddress",
                "addressRegion": "Delhi NCR",
                "addressCountry": "IN"
              },
              "sameAs": [
                "https://www.facebook.com/ergiva",
                "https://www.instagram.com/ergiva",
                "https://www.linkedin.com/company/ergiva"
              ],
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Physiotherapy Services and Products",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Home Physiotherapy Sessions",
                      "description": "Professional physiotherapy treatment at your home"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Product",
                      "name": "TENS Machines",
                      "description": "Pain relief devices for home use"
                    }
                  }
                ]
              }
            }),
          }}
        />
      </Head>

      {/* Hero Section */}
      <HeroSection />

      {/* About Section */}
      <AboutSection />

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Partner Section */}
      <PartnerSection />
    </>
  );
};

export default HomePage;