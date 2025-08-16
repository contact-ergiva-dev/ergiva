// ========================================
// ERGIVA FRONTEND CONFIGURATION CONSTANTS
// ========================================
// NOTE: Only PUBLIC configuration values that are safe to expose in the browser

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000',
  FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000',
} as const;

// Application Configuration
export const APP_CONFIG = {
  NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Ergiva',
  DESCRIPTION: process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'Professional Physiotherapy Services at Your Home',
  VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
} as const;

// Contact Information (Public business info)
export const CONTACT_CONFIG = {
  EMAIL: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'support@ergiva.com',
  PHONE: process.env.NEXT_PUBLIC_CONTACT_PHONE || '+91-98765-43210',
  ADDRESS: process.env.NEXT_PUBLIC_CONTACT_ADDRESS || 'Delhi NCR, India',
  EMERGENCY: process.env.NEXT_PUBLIC_EMERGENCY_NUMBER || '+91-98765-43210',
} as const;

// Feature Flags (Control UI features)
export const FEATURE_FLAGS = {
  GOOGLE_LOGIN: process.env.NEXT_PUBLIC_ENABLE_GOOGLE_LOGIN === 'true',
  INSTAMOJO: process.env.NEXT_PUBLIC_ENABLE_INSTAMOJO === 'true',
  ONLINE_BOOKING: process.env.NEXT_PUBLIC_ENABLE_ONLINE_BOOKING === 'true',
  PARTNER_REGISTRATION: process.env.NEXT_PUBLIC_ENABLE_PARTNER_REGISTRATION === 'true',
} as const;

// Development Configuration (Public dev settings)
export const DEV_CONFIG = {
  DEBUG_MODE: process.env.NEXT_PUBLIC_DEBUG_MODE === 'true',
  LOG_LEVEL: process.env.NEXT_PUBLIC_LOG_LEVEL || 'info',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  AUTHENTICATION_FAILED: 'Authentication failed. Please login again.',
  AUTHORIZATION_FAILED: 'You are not authorized to perform this action.',
  VALIDATION_FAILED: 'Please check your input and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  NOT_FOUND: 'Resource not found.',
  GENERIC_ERROR: 'An unexpected error occurred.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Successfully logged in!',
  LOGOUT_SUCCESS: 'Successfully logged out!',
  REGISTRATION_SUCCESS: 'Account created successfully!',
  PROFILE_UPDATE_SUCCESS: 'Profile updated successfully!',
  ORDER_CREATED: 'Order placed successfully!',
  SESSION_BOOKED: 'Session booked successfully!',
  PARTNER_APPLIED: 'Partner application submitted successfully!',
} as const;

// Export all constants as a single object for easy access
export const CONSTANTS = {
  API_CONFIG,
  APP_CONFIG,
  CONTACT_CONFIG,
  FEATURE_FLAGS,
  DEV_CONFIG,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} as const;

export default CONSTANTS;
