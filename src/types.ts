export interface VariantOption {
  id: string;
  name: string;
  priceModifier: number;
}

export interface Variant {
  id: string;
  name: string;
  options: VariantOption[];
}

export interface Extra {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
  variants: Variant[];
  extras: Extra[];
  inventory: number;
  available: boolean;
  isPopular?: boolean;
}

export interface Category {
  id: string;
  name: string;
  isActive: boolean;
}

export interface CartItem {
  id: string; // unique for this cart combination
  menuItem: MenuItem;
  selectedVariant?: {
    name: string;
    option: VariantOption;
  };
  selectedExtras: Extra[];
  quantity: number;
  specialInstructions?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: {
    name: string;
    quantity: number;
    price: number;
    variantName?: string;
    variantOptionName?: string;
    extrasNames?: string[];
  }[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  type: 'delivery' | 'pickup';
  timestamp: string;
  address?: string;
  deliveryFee?: number;
  paymentMethod: 'cash' | 'card' | 'online';
  rating?: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  ordersCount: number;
  totalSpent: number;
  segment: 'VIP' | 'Loyal' | 'Regular' | 'New' | 'At Risk';
  lastOrderDate: string;
  notes?: string;
  loyaltyPoints: number;
  avatar?: string;
}

export interface Reservation {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  guests: number;
  date: string;
  time: string;
  tableId: string;
  status: 'pending' | 'approved' | 'declined';
  notes?: string;
}

export interface Campaign {
  id: string;
  title: string;
  type: 'coupon' | 'discount' | 'loyalty' | 'referral';
  code?: string;
  value: number; // e.g. 15 for 15% off, or $5 off
  discountType: 'percentage' | 'fixed';
  minOrderValue?: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'scheduled' | 'ended';
  usageCount: number;
  targetSegment?: string;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Kitchen' | 'Staff';
  permissions: string[];
  avatar?: string;
}

export interface RestaurantLocation {
  id: string;
  name: string;
  address: string;
  phone: string;
  isActive: boolean;
}

export interface BusinessHour {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export interface DeliveryZone {
  id: string;
  name: string;
  minOrder: number;
  deliveryFee: number;
  estimatedTime: string;
  color: string; // hex color for rendering boundary simulation
}

export interface WebpageComponent {
  id: string;
  type: 'hero' | 'gallery' | 'about' | 'contact' | 'menu_preview' | 'reviews';
  title: string;
  subtitle?: string;
  content?: string;
  buttonText?: string;
  buttonLink?: string;
  imageUrl?: string;
  items?: string[]; // list of ids or names
}

export interface WebsiteSettings {
  themeColor: string;
  fontFamily: string;
  logoUrl?: string;
  headerTitle: string;
  footerText: string;
  heroImage: string;
  showReviews: boolean;
  components: WebpageComponent[];
}
