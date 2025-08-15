import React, { useState, useEffect } from 'react';
import { ChatBubbleLeftRightIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { generateWhatsAppURL } from '@/lib/utils';

const WhatsAppWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('Hi Ergiva, I need help with...');
  const [showWidget, setShowWidget] = useState(false);

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+919211215116';

  // Show widget after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWidget(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = () => {
    const url = generateWhatsAppURL(whatsappNumber, message);
    window.open(url, '_blank');
    setIsOpen(false);
  };

  const quickMessages = [
    'I want to book a physiotherapy session',
    'I need information about your products',
    'I want to check my order status',
    'I need help with payment',
    'I want to become a partner physiotherapist',
  ];

  if (!showWidget) return null;

  return (
    <>
      {/* Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Chat Bubble */}
        {isOpen && (
          <div className="mb-4 bg-white rounded-lg shadow-xl border border-gray-200 w-80 sm:w-96">
            {/* Header */}
            <div className="bg-green-500 text-white p-4 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <span className="text-green-500 font-bold text-lg">E</span>
                </div>
                <div>
                  <h3 className="font-semibold">Ergiva Support</h3>
                  <p className="text-green-100 text-sm">Typically replies instantly</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-green-200 transition-colors duration-200"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              <div className="bg-gray-100 rounded-lg p-3">
                <p className="text-sm text-gray-700">
                  👋 Hi there! How can we help you today?
                </p>
              </div>

              {/* Quick Message Buttons */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Quick messages:</p>
                <div className="space-y-2">
                  {quickMessages.map((msg, index) => (
                    <button
                      key={index}
                      onClick={() => setMessage(msg)}
                      className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 border border-gray-200"
                    >
                      {msg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Message */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Or type your message:
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-sm"
                />
              </div>

              {/* Send Button */}
              <button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
              >
                Send Message on WhatsApp
              </button>

              {/* Contact Info */}
              <div className="text-center pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  You'll be redirected to WhatsApp
                </p>
                <p className="text-xs text-gray-500">
                  Available: 9 AM - 9 PM (Mon-Sun)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Float Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 group"
          aria-label="Open WhatsApp Chat"
        >
          {isOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <>
              <ChatBubbleLeftRightIcon className="h-6 w-6" />
              {/* Notification Dot */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              
              {/* Ripple Effect */}
              <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20 group-hover:opacity-30" />
            </>
          )}
        </button>

        {/* Tooltip */}
        {!isOpen && (
          <div className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            Need help? Chat with us!
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-900" />
          </div>
        )}
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-40 sm:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default WhatsAppWidget;