// User types
export interface User {
  id: string;
  email: string;
  name: string;
  profile_picture?: string;
  phone?: string;
  address?: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

// Auth types
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

// Product types
export interface Category {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  product_count?: number;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  category_name?: string;
  image_urls: string[];
  stock_quantity: number;
  features: string[];
  specifications: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Order types
export interface OrderItem {
  id: string;
  product_id: string;
  product_name?: string;
  product_image?: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  user_id: string;
  user_name?: string;
  user_email?: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  payment_method: 'instamojo' | 'pay_on_visit';
  payment_status: 'pending' | 'completed' | 'failed';
  instamojo_payment_request_id?: string;
  instamojo_payment_id?: string;
  shipping_address: ShippingAddress;
  order_notes?: string;
  items?: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface ShippingAddress {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
}

// Session types
export interface Session {
  id: string;
  user_id?: string;
  user_name?: string;
  name: string;
  age?: number;
  contact: string;
  email: string;
  address: string;
  condition_description?: string;
  preferred_time: string;
  session_type: 'home_visit' | 'online_consultation';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  payment_method: 'instamojo' | 'pay_on_visit';
  payment_status: 'pending' | 'completed' | 'failed';
  amount?: number;
  instamojo_payment_request_id?: string;
  instamojo_payment_id?: string;
  assigned_physio_id?: string;
  session_notes?: string;
  created_at: string;
  updated_at: string;
}

// Partner types
export interface PartnerApplication {
  id: string;
  name: string;
  mobile: string;
  email: string;
  qualification: string;
  years_experience: number;
  preferred_area?: string;
  additional_info?: string;
  resume_url?: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by?: string;
  reviewed_by_name?: string;
  review_notes?: string;
  created_at: string;
  updated_at: string;
}

// Testimonial types
export interface Testimonial {
  id: string;
  name: string;
  content: string;
  rating: number;
  image_url?: string;
  video_url?: string;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Cart types
export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  getItemQuantity: (productId: string) => number;
}

// API types
export interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationInfo {
  total: number;
  limit: number;
  offset: number;
  hasMore?: boolean;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T> {
  pagination: PaginationInfo;
}

// Payment types
export interface InstaMojoPaymentRequest {
  amount: number;
  purpose: string;
  buyer_name?: string;
  buyer_email?: string;
  buyer_phone?: string;
  redirect_url?: string;
  webhook_url?: string;
  allow_repeated_payments?: boolean;
}

export interface InstaMojoPaymentResponse {
  payment_request: {
    id: string;
    payment_id?: string;
    longurl: string;
    shorturl: string;
    status: string;
    amount: string;
    purpose: string;
    buyer_name?: string;
    buyer_email?: string;
    buyer_phone?: string;
    created_at: string;
    modified_at: string;
  };
}

export interface InstaMojoWebhookPayload {
  payment_id: string;
  payment_request_id: string;
  payment_status: string;
  amount: string;
  buyer_name: string;
  buyer_email: string;
  buyer_phone: string;
  currency: string;
  fees: string;
  mac: string;
}

// Legacy Razorpay types (keeping for compatibility)
export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

// Form types
export interface BookingFormData {
  name: string;
  age?: number;
  contact: string;
  email: string;
  address: string;
  condition_description?: string;
  preferred_time: string;
  session_type: 'home_visit' | 'online_consultation';
  payment_method: 'instamojo' | 'pay_on_visit';
}

export interface PartnerFormData {
  name: string;
  mobile: string;
  email: string;
  qualification: string;
  years_experience: number;
  preferred_area?: string;
  additional_info?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

// Admin types
export interface AdminStats {
  overview: {
    total_users: number;
    total_products: number;
    total_orders: number;
    total_sessions: number;
    total_partner_applications: number;
    total_testimonials: number;
    total_revenue: number;
    session_revenue: number;
    new_users_30d: number;
    new_orders_30d: number;
    new_sessions_30d: number;
    new_applications_30d: number;
  };
  order_status_distribution: Array<{ status: string; count: number }>;
  session_status_distribution: Array<{ status: string; count: number }>;
  monthly_revenue: Array<{ 
    month: string; 
    order_revenue: number; 
    order_count: number; 
  }>;
  monthly_session_revenue: Array<{ 
    month: string; 
    session_revenue: number; 
    session_count: number; 
  }>;
  top_products: Array<{
    name: string;
    id: string;
    total_sold: number;
    total_revenue: number;
  }>;
}

export interface AdminActivity {
  type: 'order' | 'session' | 'partner_application' | 'user';
  id: string;
  amount?: number;
  status: string;
  created_at: string;
  user_name: string;
  user_email: string;
}

// Error types
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// Utility types
export type Status = 'idle' | 'loading' | 'success' | 'error';

export interface LoadingState {
  status: Status;
  error?: string | null;
}

// Component prop types
export interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

// Environment variables
export interface EnvironmentConfig {
  API_URL: string;
  GOOGLE_CLIENT_ID: string;
  RAZORPAY_KEY_ID: string;
  WHATSAPP_NUMBER: string;
  TAWK_TO_ID?: string;
}