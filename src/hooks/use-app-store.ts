
"use client";
import type { Product, CartItem, Order, User, OrderStatus, OrderHistoryEntry } from '@/types';
import { products as initialProducts } from '@/data/products';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { toast } from '@/hooks/use-toast'; 
import { generateWelcomeMessage } from '@/ai/flows/personalized-welcome-message';


const ALL_MODALS = [
  'cart', 'checkout', 'confirmation', 'tracking', 
  'productDetail', 'login', 'register', 'payment' // Added 'payment' modal type
] as const;

type ModalType = typeof ALL_MODALS[number];

interface AppState {
  // Products
  products: Product[];

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: () => number;
  cartItemCount: () => number;

  // Auth
  loggedInUser: User | null;
  usersDB: Record<string, User>; // Simplified in-memory/localStorage DB
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string, email?: string, phone?: string) => Promise<boolean>; // Added email and phone
  logout: () => void;
  personalizedWelcome: string | null;
  fetchPersonalizedWelcome: (username: string) => Promise<void>;


  // Modals
  openModalType: ModalType | null;
  openModal: (type: ModalType, data?: any) => void;
  closeModal: () => void;
  modalData: any; // To pass data to modals, e.g. product for ProductDetailModal

  // Orders
  orders: Record<string, Order>; // Store orders by ID
  lastOrderId: string | null;
  placeOrder: (orderDetails: Omit<Order, 'id' | 'orderDate' | 'status' | 'history' | 'items' | 'totalAmount'> & { paymentMethod: 'credit_card' | 'cash_on_delivery' }) => string;
  getOrderStatus: (orderId: string) => Order | null;
  updateOrderStatus: (orderId: string) => void; // Simulates status progression

  // Toast (using existing useToast hook, but can expose a simplified version)
  showAppToast: (message: string, variant?: 'default' | 'destructive') => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => {
      return {
        products: initialProducts,
        cart: [],
        loggedInUser: null,
        usersDB: {},
        orders: {},
        lastOrderId: null,
        openModalType: null,
        modalData: null,
        personalizedWelcome: null,

        addToCart: (product, quantity = 1) => {
          set((state) => {
            const existingItem = state.cart.find(item => item.id === product.id);
            let newCart;
            if (existingItem) {
              newCart = state.cart.map(item =>
                item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
              );
            } else {
              newCart = [...state.cart, { ...product, quantity }];
            }
            return { cart: newCart };
          });
          get().showAppToast(`${quantity}x ${product.name} تم إضافته إلى السلة.`);
        },
        removeFromCart: (productId) => {
          set((state) => ({
            cart: state.cart.filter(item => item.id !== productId)
          }));
        },
        updateCartItemQuantity: (productId, quantity) => {
          set((state) => ({
            cart: state.cart.map(item =>
              item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
            ).filter(item => item.quantity > 0) // Remove if quantity is 0 or less
          }));
        },
        clearCart: () => set({ cart: [] }),
        cartTotal: () => get().cart.reduce((total, item) => total + item.price * item.quantity, 0),
        cartItemCount: () => get().cart.reduce((count, item) => count + item.quantity, 0),
        
        login: async (username, password) => {
          const users = get().usersDB;
          if (users[username] && users[username].password === password) {
            const user = users[username]; // Get the full user object
            set({ loggedInUser: user });
            await get().fetchPersonalizedWelcome(username);
            get().showAppToast(`أهلاً بك، ${username}! تم تسجيل الدخول بنجاح.`);
            return true;
          }
          get().showAppToast('اسم المستخدم أو كلمة المرور غير صحيحة.', 'destructive');
          return false;
        },
        register: async (username, password, email, phone) => {
          const users = get().usersDB;
          if (users[username]) {
            get().showAppToast('اسم المستخدم هذا موجود بالفعل.', 'destructive');
            return false;
          }
          const newUser: User = { username, password, email, phone }; // In a real app, hash password here
          set((state) => ({
            usersDB: { ...state.usersDB, [username]: newUser },
            loggedInUser: newUser, // Automatically log in with the full user object
          }));
          await get().fetchPersonalizedWelcome(username);
          get().showAppToast(`مرحباً بك، ${username}! تم إنشاء الحساب وتسجيل الدخول بنجاح.`);
          return true;
        },
        logout: () => {
          set({ loggedInUser: null, personalizedWelcome: null });
          get().showAppToast('تم تسجيل الخروج بنجاح.');
        },
        fetchPersonalizedWelcome: async (username) => {
          if (!username) return;
          set({ personalizedWelcome: null }); // Clear previous or show loading
          try {
            const result = await generateWelcomeMessage({ username });
            set({ personalizedWelcome: result.message });
          } catch (error) {
            console.error("Failed to generate welcome message:", error);
            // Fallback message if the LLM fails or returns an empty message
            const fallbackMessage = `أهلاً وسهلاً بك، ${username}! نتمنى لك يوماً سعيداً.`;
            set({ personalizedWelcome: fallbackMessage }); 
          }
        },
        
        openModal: (type, data) => set({ openModalType: type, modalData: data }),
        closeModal: () => set({ openModalType: null, modalData: null }),

        placeOrder: (orderDetails) => {
          const orderId = 'ORD-' + Date.now().toString().substring(5) + Math.random().toString(36).substring(2, 6).toUpperCase();
          const newOrder: Order = {
            id: orderId,
            customerName: orderDetails.customerName,
            customerEmail: orderDetails.customerEmail,
            customerAddress: orderDetails.customerAddress,
            customerPhone: orderDetails.customerPhone,
            paymentMethod: orderDetails.paymentMethod, // Store payment method
            items: get().cart,
            totalAmount: get().cartTotal(),
            orderDate: new Date().toISOString(),
            status: 'تم تأكيد الطلب',
             estimatedDelivery: new Date(Date.now() + (Math.floor(Math.random() * 3) + 2) * 24 * 60 * 60 * 1000).toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
            history: [
              { date: new Date().toLocaleString('ar-SA'), description: 'تم استلام الطلب بنجاح.', icon: 'ClipboardCheck' }
            ]
          };
          set((state) => ({
            orders: { ...state.orders, [orderId]: newOrder },
            lastOrderId: orderId,
          }));
          get().clearCart();
          return orderId;
        },
        getOrderStatus: (orderId) => {
          const order = get().orders[orderId];
          if (order) {
            get().updateOrderStatus(orderId); 
            return get().orders[orderId]; 
          }
          return null;
        },
        updateOrderStatus: (orderId) => {
          set(state => {
            const order = state.orders[orderId];
            if (!order || order.status === 'تم التسليم') return {};

            const statuses: { name: OrderStatus; icon: string; description: string }[] = [
              { name: 'تم تأكيد الطلب', icon: 'ClipboardCheck', description: 'تم استلام الطلب بنجاح.' },
              { name: 'قيد التجهيز', icon: 'PackageOpen', description: 'بدأ تجهيز طلبك في المستودع وتعبئته للشحن.' },
              { name: 'تم الشحن', icon: 'Truck', description: 'تم شحن طلبك من مركز التوزيع الخاص بنا.' },
              { name: 'في طريقها للتسليم', icon: 'PackageSearch', description: 'مندوب التوصيل في طريقه إليك الآن. يرجى التأكد من توفرك.' },
              { name: 'تم التسليم', icon: 'PackageCheck', description: 'تم تسليم طلبك بنجاح. نأمل أن تستمتع بقهوتك!' }
            ];

            const currentIndex = statuses.findIndex(s => s.name === order.status);
            let newStatus = order.status;
            let newHistoryEntry: OrderHistoryEntry | null = null;

            // Simulate progression: 60% chance to advance if not already delivered
            if (currentIndex < statuses.length - 1) {
              if (Math.random() > 0.4) { 
                const nextStatusInfo = statuses[currentIndex + 1];
                newStatus = nextStatusInfo.name;
                newHistoryEntry = {
                  date: new Date().toLocaleString('ar-SA'),
                  description: nextStatusInfo.description,
                  icon: nextStatusInfo.icon
                };
              }
            }

            if (newStatus !== order.status && newHistoryEntry) {
              const updatedOrder = {
                ...order,
                status: newStatus,
                history: [...order.history, newHistoryEntry],
              };
              return { orders: { ...state.orders, [orderId]: updatedOrder } };
            }
            return {}; // No change
          });
        },
        
        showAppToast: (message, variant = 'default') => {
          toast({ 
            title: message, 
            description: '', // Keep description empty or pass specific content if needed
            variant: variant,
            dir: 'rtl', // Ensure toast direction is RTL
          });
        },
      };
    },
    {
      name: 'coffee-shop-storage', 
      storage: createJSONStorage(() => localStorage), 
      partialize: (state) => ({ 
        cart: state.cart,
        loggedInUser: state.loggedInUser,
        usersDB: state.usersDB,
        orders: state.orders,
        lastOrderId: state.lastOrderId,
        personalizedWelcome: state.personalizedWelcome, // Ensure personalizedWelcome is persisted
      }),
    }
  )
);
