import React, { useState } from 'react';
import Head from 'next/head';
import { CalendarIcon, ClockIcon, MapPinIcon, UserIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { API_CONFIG } from '@/config/constants';

interface BookingForm {
  name: string;
  age: string;
  phone: string;
  email: string;
  address: string;
  condition: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
}

const BookSessionPage: React.FC = () => {
  const [formData, setFormData] = useState<BookingForm>({
    name: '',
    age: '',
    phone: '',
    email: '',
    address: '',
    condition: '',
    preferredDate: '',
    preferredTime: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Map frontend form data to backend API format
      const sessionData = {
        name: formData.name,
        age: parseInt(formData.age),
        contact: formData.phone,
        email: formData.email,
        address: formData.address,
        condition_description: formData.condition,
        preferred_time: `${formData.preferredDate} ${formData.preferredTime}`,
        session_type: 'home_visit', // Default to home visit
        notes: formData.notes
      };

      const response = await fetch(`${API_CONFIG.BASE_URL}/sessions/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionData),
      });

      if (response.ok) {
        toast.success('Session booked successfully! We will contact you shortly.');
        setFormData({
          name: '',
          age: '',
          phone: '',
          email: '',
          address: '',
          condition: '',
          preferredDate: '',
          preferredTime: '',
          notes: ''
        });
      } else {
        throw new Error('Failed to book session');
      }
    } catch (error) {
      console.error('Error booking session:', error);
      toast.error('Failed to book session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
    '6:00 PM', '7:00 PM', '8:00 PM'
  ];

  const conditions = [
    'Back Pain',
    'Neck Pain',
    'Knee Pain',
    'Shoulder Pain',
    'Sports Injury',
    'Post-Surgery Rehabilitation',
    'Arthritis',
    'Muscle Strain',
    'Joint Stiffness',
    'Other'
  ];

  return (
    <>
      <Head>
        <title>Book Session - Ergiva | Home Physiotherapy Services</title>
        <meta name="description" content="Book a professional physiotherapy session at your home in Delhi NCR. Expert therapists available 7 days a week." />
      </Head>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-8">
        <div className="container-custom">
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Book Your Home Session
            </h1>
            <p className="text-base opacity-90">
              Professional physiotherapy services delivered to your doorstep
            </p>
          </div>
        </div>
      </section>

      <div className="py-10 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-soft p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Book Your Session</h2>
                
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
                          Age *
                        </label>
                        <input
                          type="number"
                          name="age"
                          required
                          min="1"
                          max="120"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Your age"
                          value={formData.age}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Complete Address *
                    </label>
                    <div className="relative">
                      <MapPinIcon className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                      <textarea
                        name="address"
                        required
                        rows={3}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter your complete address with landmarks"
                        value={formData.address}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {/* Medical Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Information</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Condition/Problem *
                      </label>
                      <select
                        name="condition"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        value={formData.condition}
                        onChange={handleInputChange}
                      >
                        <option value="">Select your condition</option>
                        {conditions.map((condition) => (
                          <option key={condition} value={condition}>
                            {condition}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Preferred Schedule */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferred Schedule</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Preferred Date *
                        </label>
                        <div className="relative">
                          <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="date"
                            name="preferredDate"
                            required
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            value={formData.preferredDate}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Preferred Time *
                        </label>
                        <div className="relative">
                          <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <select
                            name="preferredTime"
                            required
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            value={formData.preferredTime}
                            onChange={handleInputChange}
                          >
                            <option value="">Select time slot</option>
                            {timeSlots.map((time) => (
                              <option key={time} value={time}>
                                {time}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>



                  {/* Additional Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      name="notes"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Any additional information about your condition or special requirements"
                      value={formData.notes}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200"
                  >
                    {loading ? 'Booking Session...' : 'Book Session'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
    </>
  );
};

export default BookSessionPage;