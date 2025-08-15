import React, { useState } from 'react';
import Head from 'next/head';
import { UserIcon, PhoneIcon, EnvelopeIcon, AcademicCapIcon, BriefcaseIcon, MapPinIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface PartnerForm {
  name: string;
  phone: string;
  email: string;
  qualification: string;
  experience: string;
  specialization: string;
  location: string;
  availability: string;
  expectedSalary: string;
  resume: File | null;
  about: string;
}

const JoinPartnerPage: React.FC = () => {
  const [formData, setFormData] = useState<PartnerForm>({
    name: '',
    phone: '',
    email: '',
    qualification: '',
    experience: '',
    specialization: '',
    location: '',
    availability: '',
    expectedSalary: '',
    resume: null,
    about: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      resume: file
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'resume' && value) {
          formDataToSend.append(key, value);
        } else if (key !== 'resume') {
          formDataToSend.append(key, value as string);
        }
      });

      const response = await fetch('http://localhost:5000/api/partners', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        toast.success('Application submitted successfully! We will contact you within 2-3 business days.');
        setFormData({
          name: '',
          phone: '',
          email: '',
          qualification: '',
          experience: '',
          specialization: '',
          location: '',
          availability: '',
          expectedSalary: '',
          resume: null,
          about: ''
        });
      } else {
        throw new Error('Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const qualifications = [
    'BPT (Bachelor of Physiotherapy)',
    'MPT (Master of Physiotherapy)',
    'DPT (Doctor of Physiotherapy)',
    'Other Medical Degree'
  ];

  const specializations = [
    'Orthopedic Physiotherapy',
    'Neurological Physiotherapy',
    'Sports Physiotherapy',
    'Pediatric Physiotherapy',
    'Cardiopulmonary Physiotherapy',
    'Geriatric Physiotherapy',
    'Women\'s Health Physiotherapy',
    'General Physiotherapy'
  ];

  const areas = [
    'Gurgaon', 'Noida', 'Faridabad', 'Ghaziabad', 'Delhi Central',
    'Delhi North', 'Delhi South', 'Delhi East', 'Delhi West'
  ];

  const benefits = [
    {
      icon: '💰',
      title: 'Competitive Earnings',
      description: 'Earn ₹40,000 - ₹80,000 per month based on sessions and experience'
    },
    {
      icon: '⏰',
      title: 'Flexible Schedule',
      description: 'Choose your working hours and manage your own schedule'
    },
    {
      icon: '🏠',
      title: 'Work from Anywhere',
      description: 'Provide services at patient locations across Delhi NCR'
    },
    {
      icon: '📈',
      title: 'Career Growth',
      description: 'Opportunities for professional development and specialization'
    },
    {
      icon: '🤝',
      title: 'Support System',
      description: 'Complete administrative and technical support from our team'
    },
    {
      icon: '🎯',
      title: 'Steady Patients',
      description: 'Regular patient referrals and guaranteed minimum sessions'
    }
  ];

  return (
    <>
      <Head>
        <title>Join as Partner - Ergiva | Physiotherapy Career Opportunities</title>
        <meta name="description" content="Join Ergiva's network of physiotherapy professionals. Flexible work, competitive pay, and professional growth opportunities in Delhi NCR." />
      </Head>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-8">
        <div className="container-custom">
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Join Our Expert Team
            </h1>
            <p className="text-base opacity-90">
              Be part of Delhi NCR's leading physiotherapy service and make a difference in patients' lives
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Partner with Ergiva?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join our network of professional physiotherapists and enjoy the benefits of flexible work with steady income.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded-xl shadow-soft p-6 text-center">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Apply Now
              </h2>
              <p className="text-xl text-gray-600">
                Fill out the application form below and we'll get back to you within 2-3 business days.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-soft p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          name="name"
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="+91 98765 43210"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Location *
                      </label>
                      <div className="relative">
                        <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <select
                          name="location"
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          value={formData.location}
                          onChange={handleInputChange}
                        >
                          <option value="">Select preferred area</option>
                          {areas.map((area) => (
                            <option key={area} value={area}>
                              {area}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Qualification *
                      </label>
                      <div className="relative">
                        <AcademicCapIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <select
                          name="qualification"
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          value={formData.qualification}
                          onChange={handleInputChange}
                        >
                          <option value="">Select your qualification</option>
                          {qualifications.map((qualification) => (
                            <option key={qualification} value={qualification}>
                              {qualification}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Years of Experience *
                      </label>
                      <div className="relative">
                        <BriefcaseIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <select
                          name="experience"
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          value={formData.experience}
                          onChange={handleInputChange}
                        >
                          <option value="">Select experience</option>
                          <option value="0-1">0-1 years</option>
                          <option value="1-3">1-3 years</option>
                          <option value="3-5">3-5 years</option>
                          <option value="5-10">5-10 years</option>
                          <option value="10+">10+ years</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Specialization */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specialization *
                  </label>
                  <select
                    name="specialization"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={formData.specialization}
                    onChange={handleInputChange}
                  >
                    <option value="">Select your specialization</option>
                    {specializations.map((specialization) => (
                      <option key={specialization} value={specialization}>
                        {specialization}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Availability & Salary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Availability *
                    </label>
                    <select
                      name="availability"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      value={formData.availability}
                      onChange={handleInputChange}
                    >
                      <option value="">Select availability</option>
                      <option value="full-time">Full Time (6 days/week)</option>
                      <option value="part-time">Part Time (3-4 days/week)</option>
                      <option value="weekends">Weekends Only</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expected Monthly Salary *
                    </label>
                    <select
                      name="expectedSalary"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      value={formData.expectedSalary}
                      onChange={handleInputChange}
                    >
                      <option value="">Select salary range</option>
                      <option value="30-40k">₹30,000 - ₹40,000</option>
                      <option value="40-50k">₹40,000 - ₹50,000</option>
                      <option value="50-60k">₹50,000 - ₹60,000</option>
                      <option value="60-80k">₹60,000 - ₹80,000</option>
                      <option value="80k+">₹80,000+</option>
                    </select>
                  </div>
                </div>

                {/* Resume Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resume/CV *
                  </label>
                  <input
                    type="file"
                    name="resume"
                    accept=".pdf,.doc,.docx"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    onChange={handleFileChange}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Upload your resume in PDF, DOC, or DOCX format (max 5MB)
                  </p>
                </div>

                {/* About Yourself */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tell us about yourself
                  </label>
                  <textarea
                    name="about"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Tell us about your experience, motivation, and why you want to join Ergiva..."
                    value={formData.about}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200"
                >
                  {loading ? 'Submitting Application...' : 'Submit Application'}
                </button>

                <p className="text-sm text-gray-500 text-center">
                  We will review your application and get back to you within 2-3 business days.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Requirements & Eligibility
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-soft p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Educational Requirements</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Bachelor's or Master's degree in Physiotherapy
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Valid license to practice physiotherapy
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Registration with state physiotherapy council
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Continuous education certificates (preferred)
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl shadow-soft p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Experience & Skills</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Minimum 1 year of clinical experience
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Experience in home-based treatments (preferred)
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Excellent communication skills
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Compassionate and patient-focused approach
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default JoinPartnerPage;