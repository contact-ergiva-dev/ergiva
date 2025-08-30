import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { HeartIcon, ShieldCheckIcon, UserGroupIcon, ClockIcon } from '@heroicons/react/24/outline';

const AboutPage: React.FC = () => {
  const team = [
    {
      name: 'Dr. Rajesh Kumar',
      role: 'Chief Physiotherapist',
      experience: '15+ years',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
      specialization: 'Sports Injury & Rehabilitation'
    },
    {
      name: 'Dr. Priya Sharma',
      role: 'Senior Physiotherapist',
      experience: '12+ years',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
      specialization: 'Orthopedic & Post-Surgery Care'
    },
    {
      name: 'Dr. Amit Singh',
      role: 'Neurological Specialist',
      experience: '10+ years',
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400',
      specialization: 'Neurological Rehabilitation'
    }
  ];

  const values = [
    {
      icon: HeartIcon,
      title: 'Patient-Centered Care',
      description: 'Every treatment plan is tailored to individual needs and conditions, ensuring the best possible outcomes.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Quality Assurance',
      description: 'All our physiotherapists are certified and regularly undergo training to maintain the highest standards.'
    },
    {
      icon: UserGroupIcon,
      title: 'Experienced Team',
      description: 'Our team consists of highly qualified professionals with years of experience in various specializations.'
    },
    {
      icon: ClockIcon,
      title: 'Convenient Scheduling',
      description: 'Flexible appointment times from 9 AM to 9 PM, 7 days a week, to fit your busy lifestyle.'
    }
  ];

  const milestones = [
    { year: '2019', event: 'Ergiva founded with a mission to make physiotherapy accessible' },
    { year: '2020', event: 'Launched home physiotherapy services in Delhi NCR' },
    { year: '2021', event: 'Expanded to 50+ certified physiotherapists' },
    { year: '2022', event: 'Introduced online product store with quality equipment' },
    { year: '2023', event: 'Served 200+ patients across Delhi NCR' },
    { year: '2024', event: 'Expanded services with 500+ partner physiotherapists' }
  ];

  return (
    <>
      <Head>
        <title>About Us - Ergiva | Leading Home Physiotherapy Services</title>
        <meta name="description" content="Learn about Ergiva's mission to provide quality physiotherapy services at home. Meet our expert team and discover our commitment to patient care." />
      </Head>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-8">
        <div className="container-custom">
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              About Ergiva
            </h1>
            <p className="text-base opacity-90">
              Revolutionizing physiotherapy care by bringing expert treatment to your doorstep
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-8 bg-white">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              At Ergiva, we bridge the gap between patients and physiotherapy services by 
              providing professional, convenient, and effective treatment at home. We are committed 
              to improving quality of life through personalized care and evidence-based treatments.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Our Story
            </h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              Founded in 2019, Ergiva started with a simple idea: make quality physiotherapy 
              accessible to everyone in their comfort zone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-soft">
                <div className="text-2xl font-bold text-primary-600 mb-2">{milestone.year}</div>
                <p className="text-gray-700">{milestone.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-8 bg-white">
        <div className="container-custom">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Our Values
            </h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              These core values guide everything we do and help us deliver exceptional care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <value.icon className="w-6 h-6 text-primary-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      {/* <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Meet Our Expert Team
            </h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              Our certified physiotherapists bring experience and specialized knowledge for the best care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-soft overflow-hidden">
                <div className="relative h-64">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-primary-600 font-medium mb-2">{member.role}</p>
                  <p className="text-gray-600 text-sm mb-2">{member.experience} Experience</p>
                  <p className="text-gray-700">{member.specialization}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Statistics */}
      <section className="py-8 bg-primary-600 text-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">200+</div>
              <div className="text-lg opacity-90">Happy Patients</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">10+</div>
              <div className="text-lg opacity-90">Expert Physiotherapists</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">5+</div>
              <div className="text-lg opacity-90">Years Experience</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">50K+</div>
              <div className="text-lg opacity-90">Sessions Completed</div>
            </div>
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-8 bg-gradient-to-r from-secondary-600 to-primary-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Ready to Start Your Recovery Journey?
          </h2>
          <p className="text-base mb-6 opacity-90">
            Book your first session today and experience professional home physiotherapy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/book-session"
              className="inline-flex items-center px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              Book a Session
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-600 transition-colors duration-200"
            >
              Shop Products
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;