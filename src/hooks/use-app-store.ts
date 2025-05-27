"use client";
import type { Product, CartItem, Order, User, OrderStatus, OrderHistoryEntry } from '@/types';
import { products as initialProducts } from '@/data/products';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useToast } from '@/hooks/use-toast';
import { generateWelcomeMessage } from '@/ai/flows/personalized-welcome-message';


const ALL_MODALS = [
  'cart', 'checkout', 'confirmation', 'tracking', 
  'productDetail', 'login', 'register'
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
  register: (username: string, password: string) => Promise<boolean>;
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
  placeOrder: (orderDetails: Omit<Order, 'id' | 'orderDate' | 'status' | 'history' | 'items' | 'totalAmount'>) => string;
  getOrderStatus: (orderId: string) => Order | null;
  updateOrderStatus: (orderId: string) => void; // Simulates status progression

  // Toast (using existing useToast hook, but can expose a simplified version)
  showAppToast: (message: string, variant?: 'default' | 'destructive') => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => {
      const { toast } = useToast(); // Get toast function from the hook

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
            const user = { username };
            set({ loggedInUser: user });
            await get().fetchPersonalizedWelcome(username);
            get().showAppToast(`أهلاً بك، ${username}! تم تسجيل الدخول بنجاح.`);
            return true;
          }
          get().showAppToast('اسم المستخدم أو كلمة المرور غير صحيحة.', 'destructive');
          return false;
        },
        register: async (username, password) => {
          const users = get().usersDB;
          if (users[username]) {
            get().showAppToast('اسم المستخدم هذا موجود بالفعل.', 'destructive');
            return false;
          }
          const newUser = { username, password };
          set((state) => ({
            usersDB: { ...state.usersDB, [username]: newUser },
            loggedInUser: { username },
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
          try {
            const result = await generateWelcomeMessage({ username });
            set({ personalizedWelcome: result.message });
          } catch (error) {
            console.error("Failed to generate welcome message:", error);
            // Set a default message or handle error appropriately
            set({ personalizedWelcome: `أهلاً بك ${username}!` });
          }
        },
        
        openModal: (type, data) => set({ openModalType: type, modalData: data }),
        closeModal: () => set({ openModalType: null, modalData: null }),

        placeOrder: (orderDetails) => {
          const orderId = 'ORD-' + Date.now().toString().substring(5) + Math.random().toString(36).substring(2, 6).toUpperCase();
          const newOrder: Order = {
            ...orderDetails,
            id: orderId,
            items: get().cart,
            totalAmount: get().cartTotal(),
            orderDate: new Date().toISOString(),
            status: 'تم تأكيد الطلب',
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
           // Before returning, simulate an update if the order exists
          const order = get().orders[orderId];
          if (order) {
            get().updateOrderStatus(orderId); // Simulate progress
            return get().orders[orderId]; // Return potentially updated order
          }
          return null;
        },
        updateOrderStatus: (orderId) => {
          set(state => {
            const order = state.orders[orderId];
            if (!order || order.status === 'تم التسليم') return {};

            const statuses: { name: OrderStatus; icon: string; description: string }[] = [
              { name: 'تم تأكيد الطلب', icon: 'ClipboardCheck', description: 'تم استلام الطلب بنجاح.' },
              { name: 'قيد التجهيز', icon: 'BoxOpen', description: 'بدأ تجهيز طلبك في المستودع وتعبئته للشحن.' },
              { name: 'تم الشحن', icon: 'Truck', description: 'تم شحن طلبك من مركز التوزيع الخاص بنا.' },
              { name: 'في طريقها للتسليم', icon: 'PackageSearch', description: 'مندوب التوصيل في طريقه إليك الآن. يرجى التأكد من توفرك.' },
              { name: 'تم التسليم', icon: 'PackageCheck', description: 'تم تسليم طلبك بنجاح. نأمل أن تستمتع بقهوتك!' }
            ];

            const currentIndex = statuses.findIndex(s => s.name === order.status);
            let newStatus = order.status;
            let newHistoryEntry: OrderHistoryEntry | null = null;

            if (currentIndex < statuses.length - 1) {
              if (Math.random() > 0.4) { // 60% chance to advance
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
                estimatedDelivery: order.estimatedDelivery || new Date(Date.now() + (Math.floor(Math.random() * 3) + 2) * 24 * 60 * 60 * 1000).toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
              };
              return { orders: { ...state.orders, [orderId]: updatedOrder } };
            }
            return {};
          });
        },
        
        showAppToast: (message, variant = 'default') => {
          toast({
            title: message,
            variant: variant,
          });
        },
      };
    },
    {
      name: 'coffee-shop-storage', // name of item in localStorage
      storage: createJSONStorage(() => localStorage), // use localStorage
      partialize: (state) => ({ // Persist only these parts of the state
        cart: state.cart,
        loggedInUser: state.loggedInUser,
        usersDB: state.usersDB,
        orders: state.orders,
        lastOrderId: state.lastOrderId,
        personalizedWelcome: state.personalizedWelcome,
      }),
    }
  )
);

// Call fetchPersonalizedWelcome on initial load if user is logged in
const initialLoggedInUser = useAppStore.getState().loggedInUser;
if (initialLoggedInUser) {
  useAppStore.getState().fetchPersonalizedWelcome(initialLoggedInUser.username);
}