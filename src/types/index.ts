
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  fullDescription: string;
  additionalImages: string[];
  category?: string; // Optional: e.g., 'Arabic', 'Espresso'
  dataAiHint?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  customerPhone: string;
  paymentMethod?: 'credit_card' | 'cash_on_delivery'; // Added paymentMethod
  items: CartItem[];
  totalAmount: number;
  orderDate: string;
  status: OrderStatus;
  estimatedDelivery?: string;
  history: OrderHistoryEntry[];
}

export type OrderStatus =
  | 'تم تأكيد الطلب'
  | 'قيد التجهيز'
  | 'تم الشحن'
  | 'في طريقها للتسليم'
  | 'تم التسليم';

export interface OrderHistoryEntry {
  date: string;
  description: string;
  icon: string; // Icon name string (e.g., 'ClipboardCheck')
}

export interface User {
  username: string;
  // In a real app, password would be hashed and not stored directly
  password?: string; // Only for client-side simulation
}

export interface Testimonial {
  quote: string;
  author: string;
  location: string;
}
