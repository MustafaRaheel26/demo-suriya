import React, { useState, useEffect } from 'react';
import { 
  MenuItem, Order, Customer, Reservation, Campaign, Staff, RestaurantLocation, BusinessHour, DeliveryZone, WebsiteSettings 
} from '../types';
import { 
  LayoutDashboard, ShoppingBag, Globe, Menu, Calendar, Sparkles, Megaphone, 
  Users, Settings, LogOut, Search, Bell, ChevronDown, Plus, Edit, Trash, 
  MapPin, Check, X, ArrowUpRight, DollarSign, TrendingUp, ShoppingCart, UserCheck, Clock, ShieldAlert,
  Sliders, Send, RefreshCw, BarChart2, Eye, Laptop, Smartphone, Tablet
} from 'lucide-react';
import SuperAdminDashboard from './SuperAdminDashboard';
import StaffDashboard from './StaffDashboard';
import CustomerDashboard from './CustomerDashboard';

interface DashboardProps {
  userEmail: string;
  userRole?: 'super_admin' | 'restaurant_owner' | 'staff' | 'customer';
  onLogout: () => void;
  orders: Order[];
  onUpdateOrders: (orders: Order[]) => void;
  onOpenStorefront: () => void;
}

export default function Dashboard({ userEmail, userRole, onLogout, orders, onUpdateOrders, onOpenStorefront }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [notificationsCount, setNotificationsCount] = useState(3);
  const [showNotifications, setShowNotifications] = useState(false);
  const [restaurantName, setRestaurantName] = useState('Urban Kitchen Bistro');
  const [isOnline, setIsOnline] = useState(true);
  const [supportTicketId, setSupportTicketId] = useState<string | null>(null);
  const [reportDownloadFinished, setReportDownloadFinished] = useState(false);
  const [ownerProfile, setOwnerProfile] = useState({
    name: 'Jane Miller',
    role: 'Restaurant Owner',
    email: userEmail,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80'
  });

  // ----------------------------------------------------
  // INITIAL DATA SEEDS
  // ----------------------------------------------------
  const [categories, setCategories] = useState<string[]>(['Pizza', 'Burgers', 'Pasta', 'Salads', 'Dessert', 'Drinks']);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: 'item-1',
      name: 'Margherita Stone Pizza',
      description: 'Thin wood-fired sourdough crust topped with fresh Bufala mozzarella, hand-crushed tomatoes, organic basil, and virgin olive oil.',
      category: 'Pizza',
      price: 18.99,
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=300&q=80',
      variants: [
        {
          id: 'v-1',
          name: 'Size',
          options: [
            { id: 'opt-1', name: 'Medium 12"', priceModifier: 0 },
            { id: 'opt-2', name: 'Large 16"', priceModifier: 4.50 }
          ]
        }
      ],
      extras: [
        { id: 'e-1', name: 'Extra Bufala Mozzarella', price: 2.50 },
        { id: 'e-2', name: 'Spicy Pepperoni Cup', price: 3.00 },
        { id: 'e-3', name: 'Hot Honey Drizzle', price: 1.50 }
      ],
      inventory: 45,
      available: true,
      isPopular: true
    },
    {
      id: 'item-2',
      name: 'Truffle Bacon Burger',
      description: 'Double custom wagyu patties, melted white cheddar, house-smoked bacon, black truffle aioli, on a butter-toasted brioche bun.',
      category: 'Burgers',
      price: 16.50,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80',
      variants: [],
      extras: [
        { id: 'e-4', name: 'Add Fried Egg', price: 2.00 },
        { id: 'e-5', name: 'Double Bacon Slice', price: 2.50 }
      ],
      inventory: 28,
      available: true,
      isPopular: true
    },
    {
      id: 'item-3',
      name: 'Pasta Alfredo Carbonara',
      description: 'Homemade fresh tagliatelle tossed in dry-cured guanciale, raw farm egg yolks, and heaps of Pecorino Romano cheese.',
      category: 'Pasta',
      price: 19.50,
      image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=300&q=80',
      variants: [],
      extras: [
        { id: 'e-6', name: 'Grilled Shrimp Tenders', price: 5.00 }
      ],
      inventory: 35,
      available: true
    },
    {
      id: 'item-4',
      name: 'Artisanal Burrata & Heirloom',
      description: 'Fresh burrata cheese accompanied by ripe heirloom cherry tomatoes, cold-pressed olive oil, basil microgreens, and organic balsamic pearls.',
      category: 'Salads',
      price: 15.00,
      image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=300&q=80',
      variants: [],
      extras: [],
      inventory: 50,
      available: true
    }
  ]);

  const [customers, setCustomers] = useState<Customer[]>([
    { id: 'c-1', name: 'John Carter', email: 'john.carter@gmail.com', phone: '+1 (555) 890-2345', ordersCount: 14, totalSpent: 342.50, segment: 'VIP', lastOrderDate: '2026-07-04', notes: 'Prefers gluten-free pizza options.', loyaltyPoints: 240, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80' },
    { id: 'c-2', name: 'Emma Wilson', email: 'emma.w@yahoo.com', phone: '+1 (555) 345-6789', ordersCount: 8, totalSpent: 184.00, segment: 'Loyal', lastOrderDate: '2026-07-03', notes: 'Prefers outdoor seating when dining in.', loyaltyPoints: 120, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&h=120&q=80' },
    { id: 'c-3', name: 'David Smith', email: 'dsmith@outlook.com', phone: '+1 (555) 234-5678', ordersCount: 2, totalSpent: 45.50, segment: 'New', lastOrderDate: '2026-07-05', notes: '', loyaltyPoints: 30, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80' },
    { id: 'c-4', name: 'Sophia Brown', email: 'sophia.brown@gmail.com', phone: '+1 (555) 678-9012', ordersCount: 12, totalSpent: 268.00, segment: 'Loyal', lastOrderDate: '2026-06-28', notes: 'Allergic to shellfish.', loyaltyPoints: 180, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80' }
  ]);

  const [reservations, setReservations] = useState<Reservation[]>([
    { id: 'res-1', customerName: 'David Smith', customerPhone: '+1 (555) 234-5678', customerEmail: 'dsmith@outlook.com', guests: 4, date: '2026-07-05', time: '19:30', tableId: 'Table 4', status: 'approved', notes: 'Celebrating wedding anniversary.' },
    { id: 'res-2', customerName: 'Alice Johnson', customerPhone: '+1 (555) 456-7890', customerEmail: 'alice@gmail.com', guests: 2, date: '2026-07-05', time: '20:00', tableId: 'Table 2', status: 'pending', notes: 'Window view requested.' },
    { id: 'res-3', customerName: 'Marcus Aurelius', customerPhone: '+1 (555) 999-8888', customerEmail: 'philosopher@rome.com', guests: 6, date: '2026-07-06', time: '18:00', tableId: 'Table 10 (Large)', status: 'approved' }
  ]);

  const [campaigns, setCampaigns] = useState<Campaign[]>([
    { id: 'cmp-1', title: 'Summer Sizzler Discount', type: 'coupon', code: 'SUMMER20', value: 20, discountType: 'percentage', minOrderValue: 30, startDate: '2026-07-01', endDate: '2026-08-31', status: 'active', usageCount: 142, targetSegment: 'All Customers' },
    { id: 'cmp-2', title: 'Wagyu Burger Launch', type: 'discount', value: 5, discountType: 'fixed', startDate: '2026-07-04', endDate: '2026-07-15', status: 'active', usageCount: 48 },
    { id: 'cmp-3', title: 'Reactivation Special', type: 'coupon', code: 'COMEBACK', value: 15, discountType: 'percentage', minOrderValue: 25, startDate: '2026-07-05', endDate: '2026-07-20', status: 'scheduled', usageCount: 0, targetSegment: 'At Risk' }
  ]);

  const [locations, setLocations] = useState<RestaurantLocation[]>([
    { id: 'loc-1', name: 'Downtown Bistro (HQ)', address: '240 S Grand Ave, Los Angeles, CA 90012', phone: '+1 (555) 890-2345', isActive: true },
    { id: 'loc-2', name: 'Santa Monica Express', address: '1315 Third Street Promenade, Santa Monica, CA 90401', phone: '+1 (555) 345-6789', isActive: true }
  ]);

  const [activeLocation, setActiveLocation] = useState<string>('loc-1');

  const [businessHours, setBusinessHours] = useState<BusinessHour[]>([
    { day: 'Monday', isOpen: true, openTime: '11:00', closeTime: '22:00' },
    { day: 'Tuesday', isOpen: true, openTime: '11:00', closeTime: '22:00' },
    { day: 'Wednesday', isOpen: true, openTime: '11:00', closeTime: '22:00' },
    { day: 'Thursday', isOpen: true, openTime: '11:00', closeTime: '23:00' },
    { day: 'Friday', isOpen: true, openTime: '11:00', closeTime: '23:59' },
    { day: 'Saturday', isOpen: true, openTime: '10:00', closeTime: '23:59' },
    { day: 'Sunday', isOpen: true, openTime: '10:00', closeTime: '22:00' }
  ]);

  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>([
    { id: 'zone-1', name: 'Downtown Core (Radius A)', minOrder: 15.00, deliveryFee: 2.00, estimatedTime: '15-25m', color: '#f97316' },
    { id: 'zone-2', name: 'Midtown & Financial (Radius B)', minOrder: 25.00, deliveryFee: 4.50, estimatedTime: '25-40m', color: '#10b981' },
    { id: 'zone-3', name: 'Outer Ring (Radius C)', minOrder: 40.00, deliveryFee: 7.00, estimatedTime: '40-55m', color: '#3b82f6' }
  ]);

  const [websiteSettings, setWebsiteSettings] = useState<WebsiteSettings>({
    themeColor: '#ea580c', // Orange-600
    fontFamily: 'Inter',
    headerTitle: 'Urban Kitchen',
    footerText: '© 2026 Urban Kitchen. Powered securely by GloBite Platform.',
    heroImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    showReviews: true,
    components: [
      { id: 'wc-1', type: 'hero', title: 'Sensational Culinary Creations Direct To You', subtitle: 'Order sourdough wood-fired stone pizzas and fresh artisan salads commission-free.', buttonText: 'Explore Menu', buttonLink: '#menu' },
      { id: 'wc-2', type: 'about', title: 'Our Culinary Mission', subtitle: 'Crafting quality with local organic herbs and traditional values.', content: 'Founded in Los Angeles, we source flour from third-generation millers, hand-stretch every dough, and bake inside premium stones.' }
    ]
  });

  const [staff, setStaff] = useState<Staff[]>([
    { id: 'st-1', name: 'Chef Mario', email: 'mario@urbanbistro.com', role: 'Kitchen', permissions: ['View Orders', 'Update Stock'], avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=120&h=120&q=80' },
    { id: 'st-2', name: 'Jane Miller', email: 'jane.manager@urbanbistro.com', role: 'Manager', permissions: ['All Permissions'], avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&h=120&q=80' }
  ]);

  // ----------------------------------------------------
  // INTERACTIVE WORKFLOW STATES
  // ----------------------------------------------------
  const [activePresetCuisine, setActivePresetCuisine] = useState('Italian');
  const [aiMenuGenerating, setAiMenuGenerating] = useState(false);
  const [aiMenuCount, setAiMenuCount] = useState(3);
  const [descNameInput, setDescNameInput] = useState('Spicy Sausage Flatbread');
  const [descIngredients, setDescIngredients] = useState('Salami, jalapeños, chili honey');
  const [descStyle, setDescStyle] = useState('appetizing');
  const [generatedDescText, setGeneratedDescText] = useState('');
  const [descGenerating, setDescGenerating] = useState(false);

  // Custom visual builder preview state
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // AI Chat Bot simulation
  const [aiBotType, setAiBotType] = useState<'whatsapp' | 'voice'>('whatsapp');
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: '👋 Hello! I am BiteBot, your AI Assistant. Try asking me for the "menu" or ask me to "order a pizza" to simulate the automated order capturing!' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Marketing campaign generator state
  const [campaignGoal, setCampaignGoal] = useState('Drive weekend repeat sales');
  const [campaignTheme, setCampaignTheme] = useState('Wood-Fired Pizza Feast');
  const [campaignPlatform, setCampaignPlatform] = useState('Email');
  const [campaignLoading, setCampaignLoading] = useState(false);
  const [generatedCampaign, setGeneratedCampaign] = useState<any | null>(null);

  // AI review Analysis state
  const [reviewAnalysisLoading, setReviewAnalysisLoading] = useState(false);
  const [reviewAnalysis, setReviewAnalysis] = useState<any | null>(null);

  // AI demand forecast data
  const [forecastLoading, setForecastLoading] = useState(false);
  const [forecastData, setForecastData] = useState<any | null>(null);

  // ----------------------------------------------------
  // EVENT TRIGGER HANDLERS
  // ----------------------------------------------------
  const handleUpdateOrderStatus = (orderId: string, nextStatus: 'preparing' | 'ready' | 'delivered' | 'cancelled') => {
    const updated = orders.map(ord => {
      if (ord.id === orderId) {
        return { ...ord, status: nextStatus };
      }
      return ord;
    });
    onUpdateOrders(updated);
  };

  const handleCreateMenuItem = (newItem: MenuItem) => {
    setMenuItems(prev => [...prev, newItem]);
  };

  const handleDeleteMenuItem = (itemId: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleUpdateStock = (itemId: string, newStock: number) => {
    setMenuItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return { ...item, inventory: newStock };
      }
      return item;
    }));
  };

  // ----------------------------------------------------
  // GEMINI SERVER-SIDE CALLS
  // ----------------------------------------------------
  const generateAiMenu = async () => {
    setAiMenuGenerating(true);
    try {
      const res = await fetch("/api/gemini/generate-menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cuisine: activePresetCuisine, count: aiMenuCount })
      });
      const data = await res.json();
      if (data.success && data.items) {
        const mappedItems: MenuItem[] = data.items.map((it: any, idx: number) => ({
          id: `ai-item-${Date.now()}-${idx}`,
          name: it.name,
          description: it.description,
          category: activePresetCuisine,
          price: it.price || 14.99,
          image: activePresetCuisine.toLowerCase() === 'italian' 
            ? 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=300&q=80'
            : 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80',
          variants: [
            {
              id: `v-${idx}`,
              name: 'Size',
              options: it.variants?.map((v: any, optIdx: number) => ({
                id: `opt-${idx}-${optIdx}`,
                name: v.name,
                priceModifier: v.priceModifier || 0
              })) || [{ id: `opt-${idx}-1`, name: 'Regular', priceModifier: 0 }]
            }
          ],
          extras: it.extras?.map((e: string, eIdx: number) => ({
            id: `e-${idx}-${eIdx}`,
            name: e,
            price: 1.50
          })) || [],
          inventory: 50,
          available: true
        }));

        setMenuItems(prev => [...prev, ...mappedItems]);
        setNotificationsCount(n => n + 1);
        alert(`Successfully injected ${mappedItems.length} professional chef dishes into your ${activePresetCuisine} category!`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiMenuGenerating(false);
    }
  };

  const generateAiDescription = async () => {
    setDescGenerating(true);
    try {
      const res = await fetch("/api/gemini/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: descNameInput, ingredients: descIngredients, style: descStyle })
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedDescText(data.description);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDescGenerating(false);
    }
  };

  const submitChatMsg = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatLoading(true);

    try {
      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...chatMessages, { role: 'user', content: userMsg }], agentType: aiBotType })
      });
      const data = await res.json();
      if (data.success) {
        setChatMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
        
        // Simulating the user ordering something on chat -> inserts mock order
        if (userMsg.toLowerCase().includes("checkout") || data.reply.toLowerCase().includes("checkout")) {
          const mockAiOrder: Order = {
            id: `ORD-AI-${Math.floor(1000 + Math.random() * 9000)}`,
            customerName: 'WhatsApp Automated Guest',
            customerEmail: 'whatsapp@visitor.com',
            customerPhone: '+1 (555) 444-2211',
            items: [{ name: 'Margherita Stone Pizza', quantity: 1, price: 18.99 }],
            total: 22.49,
            status: 'pending',
            type: 'delivery',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            address: '742 Evergreen Terrace',
            deliveryFee: 3.50,
            paymentMethod: 'online'
          };
          onUpdateOrders([mockAiOrder, ...orders]);
          setNotificationsCount(n => n + 1);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setChatLoading(false);
    }
  };

  const generateMarketingCampaign = async () => {
    setCampaignLoading(true);
    try {
      const res = await fetch("/api/gemini/marketing-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal: campaignGoal, theme: campaignTheme, platform: campaignPlatform })
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedCampaign(data.campaign);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCampaignLoading(false);
    }
  };

  const fetchReviewAnalysis = async () => {
    setReviewAnalysisLoading(true);
    try {
      const res = await fetch("/api/gemini/review-analysis", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setReviewAnalysis(data.insights);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setReviewAnalysisLoading(false);
    }
  };

  const fetchSalesForecast = async () => {
    setForecastLoading(true);
    try {
      const res = await fetch("/api/gemini/forecast");
      const data = await res.json();
      if (data.success) {
        setForecastData(data.forecast);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setForecastLoading(false);
    }
  };

  // Fetch forecast data and review data automatically on mount for widgets
  useEffect(() => {
    fetchSalesForecast();
    fetchReviewAnalysis();
  }, []);

  // ----------------------------------------------------
  // TOTALS AND ANALYTICS METRICS CALCULATORS
  // ----------------------------------------------------
  const calculatedTotalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((acc, curr) => acc + curr.total, 0);

  const calculateOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;

  // ----------------------------------------------------
  // ROLE-BASED CONDITIONAL DELEGATION
  // ----------------------------------------------------
  if (userRole === 'super_admin') {
    return <SuperAdminDashboard userEmail={userEmail} onLogout={onLogout} />;
  }
  if (userRole === 'staff') {
    return (
      <StaffDashboard 
        userEmail={userEmail} 
        orders={orders} 
        onUpdateOrders={onUpdateOrders} 
        onLogout={onLogout} 
      />
    );
  }
  if (userRole === 'customer') {
    return (
      <CustomerDashboard 
        userEmail={userEmail} 
        menuItems={menuItems} 
        orders={orders} 
        onUpdateOrders={onUpdateOrders} 
        onLogout={onLogout} 
      />
    );
  }

  return (
    <div className="bg-slate-100 min-h-screen font-sans flex text-left relative overflow-hidden">
      
      {/* Sidebar navigation */}
      <aside id="dashboard-sidebar" className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between border-r border-slate-800 shrink-0 select-none z-20">
        <div>
          {/* Brand header */}
          <div className="p-5 border-b border-slate-800/60 flex items-center gap-3">
            <div className="bg-emerald-600 text-white p-2 rounded-xl shadow-md">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-white text-base tracking-tight block">GloBite</span>
              <span className="text-[9px] font-mono block text-emerald-400 font-bold tracking-widest leading-none">RESTAURANT PORTAL</span>
            </div>
          </div>

          {/* User profile capsule in sidebar */}
          <div className="p-4 mx-3 my-4 bg-slate-800/40 border border-slate-800/50 rounded-xl flex items-center gap-3">
            {ownerProfile.avatar ? (
              <img src={ownerProfile.avatar} alt={ownerProfile.name} className="w-9 h-9 rounded-full object-cover border border-slate-700 shadow-sm shrink-0" referrerPolicy="no-referrer" />
            ) : (
              <div className="bg-emerald-50 text-emerald-800 font-extrabold text-xs w-9 h-9 rounded-full flex items-center justify-center border border-emerald-200 shrink-0">
                {ownerProfile.name.charAt(0)}
              </div>
            )}
            <div className="overflow-hidden">
              <span className="font-extrabold text-white text-xs block truncate">{ownerProfile.name}</span>
              <span className="text-[10px] text-slate-400 block truncate">{ownerProfile.role}</span>
              <span className="text-[9px] text-slate-500 block truncate">{restaurantName}</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1">
            <button 
              id="tab-overview"
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'overview' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/10' : 'hover:bg-slate-800/55 text-slate-400'}`}
            >
              <LayoutDashboard className="w-4.5 h-4.5" /> Restaurant Dashboard
            </button>

            <button 
              id="tab-orders"
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'orders' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/10' : 'hover:bg-slate-800/55 text-slate-400'}`}
            >
              <span className="flex items-center gap-3">
                <ShoppingCart className="w-4.5 h-4.5" /> Orders
              </span>
              {pendingOrdersCount > 0 && (
                <span className="bg-red-500 text-white text-[9px] px-2 py-0.5 rounded-full font-extrabold">{pendingOrdersCount} NEW</span>
              )}
            </button>

            <button 
              id="tab-menu"
              onClick={() => setActiveTab('menu')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'menu' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/10' : 'hover:bg-slate-800/55 text-slate-400'}`}
            >
              <Menu className="w-4.5 h-4.5" /> Menu
            </button>

            <button 
              id="tab-customers"
              onClick={() => setActiveTab('customers')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'customers' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/10' : 'hover:bg-slate-800/55 text-slate-400'}`}
            >
              <Users className="w-4.5 h-4.5" /> Customers
            </button>

            <button 
              id="tab-reservations"
              onClick={() => setActiveTab('reservations')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'reservations' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/10' : 'hover:bg-slate-800/55 text-slate-400'}`}
            >
              <Calendar className="w-4.5 h-4.5" /> Reservations
            </button>

            <button 
              id="tab-website"
              onClick={() => setActiveTab('website')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'website' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/10' : 'hover:bg-slate-800/55 text-slate-400'}`}
            >
              <Globe className="w-4.5 h-4.5" /> Website Designer
            </button>

            <button 
              id="tab-promotions"
              onClick={() => setActiveTab('promotions')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'promotions' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/10' : 'hover:bg-slate-800/55 text-slate-400'}`}
            >
              <Megaphone className="w-4.5 h-4.5" /> Marketing
            </button>

            <button 
              id="tab-reports"
              onClick={() => setActiveTab('reports')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'reports' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/10' : 'hover:bg-slate-800/55 text-slate-400'}`}
            >
              <BarChart2 className="w-4.5 h-4.5" /> Reports
            </button>

            <button 
              id="tab-ai"
              onClick={() => setActiveTab('ai')}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'ai' ? 'bg-slate-800 border border-emerald-500/30 text-emerald-400 shadow-md shadow-emerald-500/5' : 'hover:bg-slate-800/55 text-slate-400'}`}
            >
              <span className="flex items-center gap-3">
                <Sparkles className="w-4.5 h-4.5 text-emerald-500 animate-pulse" /> AI Assistant
              </span>
              <span className="bg-emerald-500/10 text-emerald-400 text-[8px] px-1.5 py-0.5 rounded-full border border-emerald-500/20 font-extrabold">GEMINI 3.5</span>
            </button>

            <button 
              id="tab-settings"
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'settings' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/10' : 'hover:bg-slate-800/55 text-slate-400'}`}
            >
              <Settings className="w-4.5 h-4.5" /> Restaurant Settings
            </button>

            <button 
              id="tab-help"
              onClick={() => setActiveTab('help')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'help' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/10' : 'hover:bg-slate-800/55 text-slate-400'}`}
            >
              <Sliders className="w-4.5 h-4.5" /> Help Support
            </button>
          </nav>
        </div>

        {/* Sidebar Footer Logout button */}
        <div className="p-4 border-t border-slate-800/80 space-y-3">
          <button 
            id="merchant-view-storefront-sidebar-btn"
            onClick={onOpenStorefront}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-md shadow-emerald-600/10"
          >
            <Eye className="w-4 h-4" /> Simulate Storefront
          </button>
          <button 
            id="sidebar-logout-btn"
            onClick={onLogout}
            className="w-full text-left px-4 py-2 text-xs font-bold text-slate-500 hover:text-white hover:bg-slate-800/60 rounded-xl flex items-center gap-3 transition-colors"
          >
            <LogOut className="w-4.5 h-4.5 text-slate-500 group-hover:text-white" /> Exit Portal
          </button>
        </div>
      </aside>

      {/* Main Panel Content Wrap */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto relative">
        
        {/* Top Navbar */}
        <header className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-start">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-slate-400">You are managing:</span>
                <strong className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  {restaurantName}
                </strong>
                <span className="bg-emerald-50 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-black border border-emerald-100">Growth Plan</span>
              </div>
              
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <span>Restaurant Workspace</span>
                <span>/</span>
                <span className="text-emerald-600 capitalize">{activeTab === 'overview' ? 'Restaurant Dashboard' : activeTab.replace('_', ' ')}</span>
              </div>
            </div>

            <div className="hidden md:flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              {locations.map(loc => (
                <button 
                  id={`loc-selector-${loc.id}`}
                  key={loc.id}
                  onClick={() => setActiveLocation(loc.id)}
                  className={`text-[10px] font-bold px-3 py-1.5 rounded-md transition-colors ${activeLocation === loc.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  {loc.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Search box placeholder */}
            <div className="relative hidden lg:block">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
              <input 
                id="search-input-header"
                type="text"
                placeholder="Search metrics, orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-100 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-xs font-semibold placeholder:text-slate-400 text-slate-800 focus:outline-none focus:border-slate-400 transition-colors w-64"
              />
            </div>

            {/* Notifications Capsule */}
            <div className="relative">
              <button 
                id="bell-btn-header"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  if (notificationsCount > 0) setNotificationsCount(0);
                }}
                className="p-2 bg-slate-100 rounded-xl border border-slate-200 hover:bg-slate-200 text-slate-600 transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                {notificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-emerald-600 text-white font-bold text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white">
                    {notificationsCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 bg-white border border-slate-200 rounded-2xl w-80 p-4 shadow-xl z-50 text-left space-y-3">
                  <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">Merchant Notifications</h4>
                  <div className="space-y-2.5 text-xs text-slate-600">
                    <div className="p-2 bg-emerald-50/50 border border-emerald-100 rounded-lg">
                      <strong className="text-slate-900 font-bold block">🚨 New Live Order Placed</strong>
                      <span className="text-[10px] text-slate-500">A customer submitted an order of Stone Pizza via the mock storefront.</span>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <strong className="text-slate-900 font-bold block">✨ AI Insights Complete</strong>
                      <span className="text-[10px] text-slate-500">Sales forecast prediction models are loaded and ready in the AI Hub.</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Live Interactive Status Switcher */}
            <div className="flex items-center gap-1.5">
              <button
                id="merchant-status-toggle"
                onClick={() => {
                  setIsOnline(!isOnline);
                }}
                className={`text-[10px] font-black uppercase px-2.5 py-2.5 rounded-xl border transition-all flex items-center gap-1.5 ${
                  isOnline 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                {isOnline ? 'Accepting Orders' : 'Offline'}
              </button>
            </div>

            {/* Live simulation launcher button in header */}
            <button 
              id="header-simulate-orders-btn"
              onClick={onOpenStorefront}
              className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl border border-slate-700 shadow-md flex items-center gap-1.5 transition-all"
            >
              <ShoppingCart className="w-4 h-4 text-emerald-500" /> Place Simulated Order
            </button>
          </div>
        </header>

        {/* Unified Tab render container */}
        <main className="p-6 flex-1">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Top Analytical KPI widgets */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Revenue widget */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 font-bold text-xs uppercase tracking-wider block">Gross Sales Revenue</span>
                    <span className="text-2xl font-extrabold text-slate-900 block mt-1">${calculatedTotalRevenue.toFixed(2)}</span>
                    <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1 mt-1">
                      <ArrowUpRight className="w-3.5 h-3.5" /> +14.2% Growth (this week)
                    </span>
                  </div>
                  <div className="bg-orange-50 text-orange-600 p-4 rounded-xl border border-orange-100">
                    <DollarSign className="w-6 h-6" />
                  </div>
                </div>

                {/* Orders count widget */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 font-bold text-xs uppercase tracking-wider block">Total Food Orders</span>
                    <span className="text-2xl font-extrabold text-slate-900 block mt-1">{calculateOrdersCount}</span>
                    <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1 mt-1">
                      <Clock className="w-3.5 h-3.5 text-orange-500" /> Avg Ticket: ${(calculatedTotalRevenue / (calculateOrdersCount || 1)).toFixed(2)}
                    </span>
                  </div>
                  <div className="bg-blue-50 text-blue-600 p-4 rounded-xl border border-blue-100">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                </div>

                {/* Total Segmented Customers */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 font-bold text-xs uppercase tracking-wider block">Active Guest CRM</span>
                    <span className="text-2xl font-extrabold text-slate-900 block mt-1">{customers.length} Guests</span>
                    <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1 mt-1">
                      <UserCheck className="w-3.5 h-3.5" /> 100% Retained Segments
                    </span>
                  </div>
                  <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl border border-emerald-100">
                    <Users className="w-6 h-6" />
                  </div>
                </div>

                {/* AI Predicted Demand Widget */}
                <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-5 shadow-sm flex items-center justify-between relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.1),transparent_50%)]" />
                  <div className="relative z-10">
                    <span className="text-orange-400 font-extrabold text-[9px] uppercase tracking-wider block">AI GOOGLE GEMINI FORECAST</span>
                    <span className="text-2xl font-extrabold block mt-1">
                      {forecastData ? `$${forecastData.predictedRevenueNextWeek}` : "Analyzing..."}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 block mt-1">
                      {forecastData ? `${forecastData.peakDayPrediction} is peak prediction` : "Computing demand trends..."}
                    </span>
                  </div>
                  <div className="bg-orange-600/20 text-orange-400 p-4 rounded-xl border border-orange-500/10 shrink-0">
                    <Sparkles className="w-6 h-6 animate-pulse" />
                  </div>
                </div>

              </div>

              {/* Analytics Forecast and Popular item grid charts */}
              <div className="grid lg:grid-cols-12 gap-6 items-stretch">
                
                {/* Demand Prediction Chart (Custom SVG visual grid) */}
                <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between text-left">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-base leading-snug">Gemini Sales Demand Forecasting</h3>
                        <span className="text-xs text-slate-400">Weekly prediction vectors plotted against historical transaction volume</span>
                      </div>
                      <button 
                        id="refresh-forecast-btn"
                        onClick={fetchSalesForecast}
                        className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-800 transition-colors"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Chart mock visualization using SVG */}
                    <div className="relative h-48 w-full mt-6 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-end p-4">
                      {/* Bar charts or line simulation */}
                      <div className="flex items-end justify-between h-32 px-4">
                        {(forecastData?.chartData || [
                          { day: "Mon", actual: 12, predicted: 15 },
                          { day: "Tue", actual: 18, predicted: 16 },
                          { day: "Wed", actual: 15, predicted: 18 },
                          { day: "Thu", actual: 20, predicted: 22 },
                          { day: "Fri", actual: 32, predicted: 34 },
                          { day: "Sat", actual: 38, predicted: 39 },
                          { day: "Sun", actual: 24, predicted: 26 }
                        ]).map((pt: any, i: number) => {
                          const max = 4000;
                          const actPct = Math.min(100, (pt.actual / max) * 100);
                          const predPct = Math.min(100, (pt.predicted / max) * 100);

                          return (
                            <div key={i} className="flex flex-col items-center gap-1.5 h-full justify-end">
                              <div className="flex gap-1.5 items-end h-full w-8">
                                {/* Actual Bar */}
                                <div 
                                  style={{ height: `${actPct || 40}%` }} 
                                  className="w-3 bg-slate-300 rounded-t-sm"
                                  title={`Actual: $${pt.actual}`}
                                />
                                {/* Predicted Bar */}
                                <div 
                                  style={{ height: `${predPct || 45}%` }} 
                                  className="w-3 bg-orange-600 rounded-t-sm"
                                  title={`Predicted: $${pt.predicted}`}
                                />
                              </div>
                              <span className="text-[10px] text-slate-500 font-bold">{pt.day}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Legend */}
                      <div className="flex gap-4 justify-center mt-4 border-t border-slate-100 pt-3 text-[10px] text-slate-500 font-semibold">
                        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-slate-300 rounded-xs block" /> Actual Historical Revenue</span>
                        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-orange-600 rounded-xs block" /> Gemini Predictive Volume</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50/50 border border-orange-100/80 rounded-xl p-4 flex gap-3 text-orange-950 text-xs mt-6">
                    <Sparkles className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold">Gemini Staffing & Inventory Action:</strong>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        {forecastData?.peakDayReason || "High demand is forecasted for Friday evening due to cool weather. Preparing a surplus sourdough dough buffer is advised."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Popular dishes and live system warnings */}
                <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-left flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base mb-4">Chef's Popular Items</h3>
                    <div className="space-y-3">
                      {menuItems.slice(0, 3).map(item => (
                        <div key={item.id} className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                          <div className="flex items-center gap-3">
                            <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg shadow-sm" referrerPolicy="no-referrer" />
                            <div>
                              <span className="font-bold text-slate-900 text-xs block">{item.name}</span>
                              <span className="text-[10px] text-slate-500">{item.category} • ${item.price}</span>
                            </div>
                          </div>
                          <span className="bg-amber-100 text-amber-800 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded">
                            ★ 4.9
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-4 mt-6">
                    <h4 className="font-extrabold text-slate-950 text-xs uppercase tracking-wider mb-2">Live Order Status Summary</h4>
                    <div className="grid grid-cols-2 gap-2 text-center text-xs">
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span className="block text-slate-400 font-bold uppercase text-[9px] tracking-wide">Pending Queue</span>
                        <span className="block font-extrabold text-lg text-slate-900 mt-1">
                          {orders.filter(o => o.status === 'pending').length}
                        </span>
                      </div>
                      <div className="bg-orange-50/50 p-2.5 rounded-xl border border-orange-100">
                        <span className="block text-orange-600 font-bold uppercase text-[9px] tracking-wide">In Kitchen</span>
                        <span className="block font-extrabold text-lg text-orange-950 mt-1">
                          {orders.filter(o => o.status === 'preparing').length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Recent Transactions Queue table list */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-left">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base leading-snug">Recent Orders Timeline</h3>
                    <span className="text-xs text-slate-400">Syncs directly with customers ordering on the mock website storefront</span>
                  </div>
                  <button 
                    id="goto-all-orders-lnk"
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline flex items-center gap-1"
                  >
                    Manage Full Queue <ChevronDown className="w-4 h-4 -rotate-90" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                        <th className="pb-3">Order ID</th>
                        <th className="pb-3">Customer</th>
                        <th className="pb-3">Time</th>
                        <th className="pb-3">Type</th>
                        <th className="pb-3">Dishes Ordered</th>
                        <th className="pb-3">Total amount</th>
                        <th className="pb-3">Payment</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="text-center py-8 text-slate-400">
                            No active orders in the queue. Click "Place Simulated Order" above to place a mock customer request!
                          </td>
                        </tr>
                      ) : (
                        orders.slice(0, 5).map(ord => (
                          <tr key={ord.id} className="hover:bg-slate-50/55 transition-colors">
                            <td className="py-3 font-bold text-slate-900">{ord.id}</td>
                            <td className="py-3">
                              <span className="font-semibold text-slate-800 block">{ord.customerName}</span>
                              <span className="text-[10px] text-slate-400">{ord.customerPhone}</span>
                            </td>
                            <td className="py-3">{ord.timestamp}</td>
                            <td className="py-3 capitalize font-bold text-slate-900">{ord.type}</td>
                            <td className="py-3 font-semibold text-slate-800">
                              {ord.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                            </td>
                            <td className="py-3 font-extrabold text-slate-950">${ord.total.toFixed(2)}</td>
                            <td className="py-3 capitalize text-[10px] font-bold">
                              <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                                {ord.paymentMethod}
                              </span>
                            </td>
                            <td className="py-3">
                              <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                                ord.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                                ord.status === 'preparing' ? 'bg-blue-100 text-blue-800' :
                                ord.status === 'ready' ? 'bg-amber-100 text-amber-800' :
                                ord.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {ord.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: LIVE ORDERS QUEUE */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              
              <div className="flex justify-between items-center bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                <span className="text-xs text-slate-500 font-semibold">Monitor, prepare, and deliver active food orders. Stream updates live to the customer.</span>
                <button 
                  id="tab-orders-place-simulated-btn"
                  onClick={onOpenStorefront}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-4 py-2 rounded-lg"
                >
                  Launch Storefront Simulator
                </button>
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                
                {/* 1. Pending Column */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm text-left">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                    <span className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" /> Pending Requests ({orders.filter(o => o.status === 'pending').length})
                    </span>
                  </div>

                  <div className="space-y-3.5 max-h-[600px] overflow-y-auto pr-1">
                    {orders.filter(o => o.status === 'pending').length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-8">No pending orders. Use the storefront simulator to order dishes!</p>
                    ) : (
                      orders.filter(o => o.status === 'pending').map(ord => (
                        <div key={ord.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <strong className="text-slate-900 block font-bold">{ord.id}</strong>
                              <span className="text-[10px] text-slate-400 capitalize">{ord.type} • {ord.timestamp}</span>
                            </div>
                            <span className="bg-orange-100 text-orange-800 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded">NEW</span>
                          </div>

                          <div className="border-t border-slate-200/50 pt-2 text-slate-700 space-y-1 font-semibold">
                            {ord.items.map((it, i) => (
                              <div key={i} className="flex justify-between">
                                <span>{it.quantity}x {it.name} {it.variantOptionName ? `(${it.variantOptionName})` : ''}</span>
                                <span className="text-slate-500">${(it.price * it.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>

                          <div className="border-t border-slate-200/50 pt-2 flex justify-between items-center">
                            <span className="font-extrabold text-slate-950">Total: ${ord.total.toFixed(2)}</span>
                            <span className="text-[10px] text-slate-400">Pay: {ord.paymentMethod}</span>
                          </div>

                          <div className="flex gap-2 pt-2">
                            <button 
                              id={`cancel-order-${ord.id}`}
                              onClick={() => handleUpdateOrderStatus(ord.id, 'cancelled')}
                              className="flex-1 bg-white hover:bg-slate-100 text-slate-500 border border-slate-200 font-bold py-2 rounded-lg text-center"
                            >
                              Decline
                            </button>
                            <button 
                              id={`approve-order-${ord.id}`}
                              onClick={() => handleUpdateOrderStatus(ord.id, 'preparing')}
                              className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-lg text-center shadow"
                            >
                              Accept Order
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* 2. Kitchen Column */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm text-left">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                    <span className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" /> Preparing Kitchen ({orders.filter(o => o.status === 'preparing').length})
                    </span>
                  </div>

                  <div className="space-y-3.5 max-h-[600px] overflow-y-auto pr-1">
                    {orders.filter(o => o.status === 'preparing').length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-8">Kitchen queue is clean.</p>
                    ) : (
                      orders.filter(o => o.status === 'preparing').map(ord => (
                        <div key={ord.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <strong className="text-slate-900 block font-bold">{ord.id}</strong>
                              <span className="text-[10px] text-slate-400 capitalize">{ord.type} • {ord.timestamp}</span>
                            </div>
                            <span className="bg-blue-100 text-blue-800 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded">BAKING</span>
                          </div>

                          <div className="border-t border-slate-200/50 pt-2 text-slate-700 space-y-1 font-semibold">
                            {ord.items.map((it, i) => (
                              <div key={i} className="flex justify-between">
                                <span>{it.quantity}x {it.name} {it.variantOptionName ? `(${it.variantOptionName})` : ''}</span>
                              </div>
                            ))}
                          </div>

                          <button 
                            id={`ready-order-${ord.id}`}
                            onClick={() => handleUpdateOrderStatus(ord.id, 'ready')}
                            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 rounded-lg text-center shadow-md shadow-orange-600/10"
                          >
                            Mark Ready / Baked
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* 3. Dispatched Column */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm text-left">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                    <span className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Dispatched / Ready ({orders.filter(o => o.status === 'ready' || o.status === 'delivered').length})
                    </span>
                  </div>

                  <div className="space-y-3.5 max-h-[600px] overflow-y-auto pr-1">
                    {orders.filter(o => o.status === 'ready' || o.status === 'delivered').length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-8">No dispatched orders yet.</p>
                    ) : (
                      orders.filter(o => o.status === 'ready' || o.status === 'delivered').map(ord => (
                        <div key={ord.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <strong className="text-slate-900 block font-bold">{ord.id}</strong>
                              <span className="text-[10px] text-slate-400">{ord.customerName}</span>
                            </div>
                            <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${ord.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                              {ord.status}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-500">{ord.address || 'Dining Room Seating'}</p>

                          {ord.status === 'ready' && (
                            <button 
                              id={`delivered-order-${ord.id}`}
                              onClick={() => handleUpdateOrderStatus(ord.id, 'delivered')}
                              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-lg text-center shadow"
                            >
                              Confirm Handover / Delivery
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 3: MENU MANAGER */}
          {activeTab === 'menu' && (
            <div className="space-y-6">
              
              {/* AI Menu generator trigger top block */}
              <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden text-left">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.1),transparent_50%)]" />
                <div className="relative z-10 max-w-3xl">
                  <span className="bg-orange-600 text-white font-extrabold text-[10px] tracking-widest uppercase px-3 py-1 rounded-full">
                    ⚡ GOOGLE GEMINI INSTANT SEEDER
                  </span>
                  <h3 className="text-2xl font-extrabold tracking-tight text-white mt-3">AI Menu & Chef Dish Generator</h3>
                  <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                    Instantly draft professional, sensory-rich dishes containing variants and extra configurations directly linked to your SaaS platform. Perfect for pitching different cuisines to your clients!
                  </p>

                  <div className="flex flex-wrap gap-4 mt-6 items-center">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Target Cuisine Style</label>
                      <select 
                        id="select-ai-cuisine"
                        value={activePresetCuisine} 
                        onChange={(e) => setActivePresetCuisine(e.target.value)}
                        className="bg-slate-800 border border-slate-700 text-white text-xs font-bold rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                      >
                        <option value="Italian">Italian (Pizzas, Burratas)</option>
                        <option value="Mexican">Mexican (Birria Tacos, Tostadas)</option>
                        <option value="Asian">Asian (Miso Ramen, Dragons)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Items To Inject</label>
                      <input 
                        id="input-ai-count"
                        type="number"
                        min={1}
                        max={6}
                        value={aiMenuCount}
                        onChange={(e) => setAiMenuCount(parseInt(e.target.value) || 3)}
                        className="bg-slate-800 border border-slate-700 text-white text-xs font-bold rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500 w-24"
                      />
                    </div>

                    <button 
                      id="btn-trigger-ai-menu-gen"
                      onClick={generateAiMenu}
                      disabled={aiMenuGenerating}
                      className="bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-md mt-4 sm:mt-0 transition-transform active:scale-95 disabled:opacity-50"
                    >
                      {aiMenuGenerating ? 'Cooking Chef Dishes...' : 'Inject Chef Dishes with AI'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Main Food list area */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-left">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">Active Restaurant Menu ({menuItems.length} items)</h3>
                    <span className="text-xs text-slate-400">Highlight chef recommendations, update stock levels, and customize categories.</span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                        <th className="pb-3">Image</th>
                        <th className="pb-3">Dish Name</th>
                        <th className="pb-3">Category</th>
                        <th className="pb-3">Price</th>
                        <th className="pb-3">Custom Variants</th>
                        <th className="pb-3">Stock Count</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                      {menuItems.map(item => (
                        <tr key={item.id} className="hover:bg-slate-50/55 transition-colors">
                          <td className="py-3">
                            <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg shadow-sm" referrerPolicy="no-referrer" />
                          </td>
                          <td className="py-3 font-semibold text-slate-800">
                            <span className="block">{item.name}</span>
                            <span className="text-[10px] text-slate-400 line-clamp-1 max-w-sm">{item.description}</span>
                          </td>
                          <td className="py-3 font-bold text-slate-900">{item.category}</td>
                          <td className="py-3 font-extrabold text-slate-950">${item.price.toFixed(2)}</td>
                          <td className="py-3">
                            {item.variants.length > 0 ? (
                              <span className="bg-orange-50 text-orange-800 font-bold px-2 py-0.5 rounded text-[10px]">
                                {item.variants[0].options.map(o => o.name).join(', ')}
                              </span>
                            ) : (
                              <span className="text-slate-400">Single Variant</span>
                            )}
                          </td>
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <input 
                                id={`input-stock-${item.id}`}
                                type="number"
                                value={item.inventory}
                                onChange={(e) => handleUpdateStock(item.id, parseInt(e.target.value) || 0)}
                                className="w-16 bg-slate-100 border border-slate-200 rounded p-1 text-center font-bold text-slate-800"
                              />
                            </div>
                          </td>
                          <td className="py-3 text-right">
                            <button 
                              id={`delete-dish-${item.id}`}
                              onClick={() => handleDeleteMenuItem(item.id)}
                              className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash className="w-4.5 h-4.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: WEBSITE BUILDER */}
          {activeTab === 'website' && (
            <div className="grid lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Left sidebar: visual parameters controls */}
              <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-left flex flex-col justify-between">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base leading-snug">Website Customizer</h3>
                    <span className="text-xs text-slate-400">Update themes, titles, typography, and sections live</span>
                  </div>

                  {/* Header Title Editor */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Restaurant Site Brand Title</label>
                    <input 
                      id="input-website-header-title"
                      type="text"
                      value={websiteSettings.headerTitle}
                      onChange={(e) => setWebsiteSettings({ ...websiteSettings, headerTitle: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-800"
                    />
                  </div>

                  {/* Brand Theme Accent color */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Accent Theme Color</label>
                    <div className="flex gap-2">
                      {['#ea580c', '#10b981', '#3b82f6', '#ec4899', '#1e293b'].map(col => (
                        <button 
                          id={`theme-col-btn-${col}`}
                          key={col}
                          onClick={() => setWebsiteSettings({ ...websiteSettings, themeColor: col })}
                          style={{ backgroundColor: col }}
                          className={`w-8 h-8 rounded-full border-2 ${websiteSettings.themeColor === col ? 'border-slate-950 scale-110' : 'border-transparent'}`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Font Choice Selector */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Primary Font Pairing</label>
                    <select 
                      id="select-website-font"
                      value={websiteSettings.fontFamily}
                      onChange={(e) => setWebsiteSettings({ ...websiteSettings, fontFamily: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-800 focus:outline-none"
                    >
                      <option value="Inter">Inter (SaaS Minimal)</option>
                      <option value="Playfair Display">Playfair Display (Rustic Elegant)</option>
                      <option value="Space Grotesk">Space Grotesk (Modern Tech)</option>
                    </select>
                  </div>

                  {/* Hero Title visual editor */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Hero Section Heading</label>
                    <textarea 
                      id="textarea-hero-title-edit"
                      rows={2}
                      value={websiteSettings.components[0].title}
                      onChange={(e) => {
                        const comps = [...websiteSettings.components];
                        comps[0].title = e.target.value;
                        setWebsiteSettings({ ...websiteSettings, components: comps });
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-800"
                    />
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 mt-6">
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider mb-2">Live Preview Simulation Device</span>
                  <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
                    <button 
                      id="preview-device-desktop"
                      onClick={() => setPreviewDevice('desktop')}
                      className={`flex-1 text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${previewDevice === 'desktop' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
                    >
                      <Laptop className="w-3.5 h-3.5" /> Laptop
                    </button>
                    <button 
                      id="preview-device-tablet"
                      onClick={() => setPreviewDevice('tablet')}
                      className={`flex-1 text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${previewDevice === 'tablet' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
                    >
                      <Tablet className="w-3.5 h-3.5" /> Tablet
                    </button>
                    <button 
                      id="preview-device-mobile"
                      onClick={() => setPreviewDevice('mobile')}
                      className={`flex-1 text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${previewDevice === 'mobile' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
                    >
                      <Smartphone className="w-3.5 h-3.5" /> Mobile
                    </button>
                  </div>
                </div>
              </div>

              {/* Right panel: Gorgeous live preview simulator inside screen window */}
              <div className="lg:col-span-8 bg-slate-200 border border-slate-300 rounded-2xl p-4 flex justify-center items-center shadow-inner overflow-hidden relative">
                <div className="absolute top-2 left-4 text-[10px] text-slate-500 font-mono tracking-wider">LIVE VISUAL RENDERING</div>
                
                {/* Dynamic device wrappers based on state */}
                <div 
                  style={{ 
                    width: previewDevice === 'mobile' ? '375px' : previewDevice === 'tablet' ? '600px' : '100%',
                    fontFamily: websiteSettings.fontFamily === 'Space Grotesk' ? 'Space Grotesk, sans-serif' : websiteSettings.fontFamily === 'Playfair Display' ? 'Playfair Display, serif' : 'Inter, sans-serif'
                  }}
                  className="bg-white border border-slate-300 rounded-xl shadow-2xl transition-all duration-500 overflow-hidden flex flex-col max-h-[500px]"
                >
                  {/* Browser Mock header */}
                  <div className="bg-slate-50 border-b border-slate-100 py-2.5 px-4 flex items-center justify-between">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-red-400" />
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span className="w-2 h-2 rounded-full bg-green-400" />
                    </div>
                    <span className="text-[9px] text-slate-400 font-mono">my-bistro.globite.app</span>
                    <span className="w-4 h-4" />
                  </div>

                  {/* Rendered content */}
                  <div className="flex-1 overflow-y-auto">
                    {/* Navigation inside simulated site */}
                    <div className="px-6 py-4 flex justify-between items-center bg-white border-b border-slate-100">
                      <span className="font-extrabold text-sm text-slate-900">{websiteSettings.headerTitle}</span>
                      <button 
                        style={{ backgroundColor: websiteSettings.themeColor }} 
                        className="text-[10px] text-white font-extrabold px-3 py-1.5 rounded-lg"
                      >
                        Order Direct
                      </button>
                    </div>

                    {/* Hero area inside simulated site */}
                    <div className="relative py-16 px-6 text-center text-white bg-slate-950">
                      <img 
                        src={websiteSettings.heroImage} 
                        alt="Hero background" 
                        className="absolute inset-0 w-full h-full object-cover opacity-35" 
                        referrerPolicy="no-referrer"
                      />
                      <div className="relative z-10 max-w-lg mx-auto">
                        <h4 className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: websiteSettings.themeColor }}>
                          ORGANIC & COMMISSION-FREE
                        </h4>
                        <h1 className="text-xl sm:text-2xl font-extrabold leading-snug">{websiteSettings.components[0].title}</h1>
                        <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">{websiteSettings.components[0].subtitle}</p>
                        <button 
                          style={{ backgroundColor: websiteSettings.themeColor }} 
                          className="mt-5 text-[10px] font-bold px-4 py-2 rounded-lg"
                        >
                          {websiteSettings.components[0].buttonText}
                        </button>
                      </div>
                    </div>

                    {/* About section inside simulated site */}
                    <div className="py-8 px-6 text-left bg-slate-50 border-t border-slate-100">
                      <h3 className="font-extrabold text-sm text-slate-900">{websiteSettings.components[1].title}</h3>
                      <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">{websiteSettings.components[1].content}</p>
                    </div>

                    {/* Simulated reviews */}
                    <div className="bg-white py-6 px-6 text-center border-t border-slate-100">
                      <span className="text-[10px] font-semibold text-slate-400 block mb-2">GUESTS EXPERIENCES</span>
                      <p className="text-xs italic text-slate-600">"This is hands-down the cleanest sourdough pizza crust in Southern California!"</p>
                      <span className="text-[10px] font-bold text-slate-800 block mt-2">Emma Wilson ★★★★★</span>
                    </div>

                    {/* Footer inside simulated site */}
                    <div className="py-4 px-6 text-center bg-slate-900 text-slate-500 text-[9px]">
                      {websiteSettings.footerText}
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 5: RESERVATIONS / TABLE BOOKINGS */}
          {activeTab === 'reservations' && (
            <div className="space-y-6">
              
              {/* Dynamic Seating Chart Simulation */}
              <div className="grid lg:grid-cols-12 gap-6 items-stretch">
                
                {/* Tables Grid Layout */}
                <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-left">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base">Digital Dining Seating Layout</h3>
                      <span className="text-xs text-slate-400">Manage real-time seating statuses, capacities, and customer mappings</span>
                    </div>
                  </div>

                  {/* Grid layout of simulated tables */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    {[
                      { id: 'Table 1', seats: 2, status: 'occupied', guest: 'John Carter' },
                      { id: 'Table 2', seats: 2, status: 'reserved', guest: 'Alice Johnson' },
                      { id: 'Table 3', seats: 4, status: 'free', guest: '' },
                      { id: 'Table 4', seats: 4, status: 'occupied', guest: 'David Smith' },
                      { id: 'Table 5', seats: 4, status: 'free', guest: '' },
                      { id: 'Table 6', seats: 6, status: 'free', guest: '' },
                      { id: 'Table 7', seats: 8, status: 'occupied', guest: 'Private Corporate Group' },
                      { id: 'Table 8', seats: 2, status: 'free', guest: '' }
                    ].map(tab => (
                      <div 
                        key={tab.id} 
                        className={`p-4 rounded-xl border flex flex-col justify-between h-28 text-left transition-all ${
                          tab.status === 'occupied' ? 'bg-red-50/50 border-red-200' :
                          tab.status === 'reserved' ? 'bg-amber-50/50 border-amber-200 animate-pulse' :
                          'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div>
                          <span className="font-bold text-slate-900 text-xs block">{tab.id}</span>
                          <span className="text-[10px] text-slate-400 block">{tab.seats} Seats Max</span>
                        </div>

                        {tab.guest ? (
                          <span className="text-[10px] font-extrabold text-slate-800 truncate block mt-2">👤 {tab.guest}</span>
                        ) : (
                          <span className="text-[10px] text-emerald-600 font-semibold block mt-2">● AVAILABLE</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reservation Booking requests lists */}
                <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-left flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base mb-4">Pending Requests ({reservations.filter(r => r.status === 'pending').length})</h3>
                    <div className="space-y-3.5">
                      {reservations.map(res => (
                        <div key={res.id} className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <strong className="text-slate-900 block font-bold">{res.customerName}</strong>
                              <span className="text-[10px] text-slate-400">{res.guests} Guests • {res.time} PM</span>
                            </div>
                            <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${res.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                              {res.status}
                            </span>
                          </div>

                          {res.notes && (
                            <p className="text-[10px] text-slate-500 italic">"{res.notes}"</p>
                          )}

                          {res.status === 'pending' && (
                            <div className="flex gap-2 pt-2 border-t border-slate-200/50">
                              <button 
                                id={`decline-res-${res.id}`}
                                onClick={() => setReservations(prev => prev.map(r => r.id === res.id ? { ...r, status: 'declined' } : r))}
                                className="flex-1 bg-white hover:bg-slate-100 text-slate-500 border border-slate-200 font-bold py-1 rounded"
                              >
                                Decline
                              </button>
                              <button 
                                id={`approve-res-${res.id}`}
                                onClick={() => setReservations(prev => prev.map(r => r.id === res.id ? { ...r, status: 'approved' } : r))}
                                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-1 rounded shadow"
                              >
                                Approve
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 6: AI COMMAND CENTER */}
          {activeTab === 'ai' && (
            <div className="space-y-6">
              
              <div className="grid lg:grid-cols-12 gap-6 items-stretch">
                
                {/* Chat Bot automated ordering simulator */}
                <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-left flex flex-col h-[550px]">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base leading-none">Automated Conversational Ordering Bot</h3>
                      <span className="text-xs text-slate-400">Let digital AI assistants handle food orders over text and voice channels</span>
                    </div>
                    <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                      <button 
                        id="ai-bot-whatsapp-toggle"
                        onClick={() => setAiBotType('whatsapp')}
                        className={`text-[10px] font-bold px-3 py-1.5 rounded-md transition-colors ${aiBotType === 'whatsapp' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                      >
                        WhatsApp Bot
                      </button>
                      <button 
                        id="ai-bot-voice-toggle"
                        onClick={() => setAiBotType('voice')}
                        className={`text-[10px] font-bold px-3 py-1.5 rounded-md transition-colors ${aiBotType === 'voice' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                      >
                        Voice Bot (Concise)
                      </button>
                    </div>
                  </div>

                  {/* Messages Stream */}
                  <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 p-3 bg-slate-50 rounded-xl border border-slate-100 mb-4">
                    {chatMessages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-md p-3 rounded-2xl text-xs leading-relaxed shadow-xs ${
                          msg.role === 'user' 
                            ? 'bg-slate-900 text-white rounded-tr-none' 
                            : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                        }`}>
                          <span className="block text-[8px] font-bold uppercase tracking-wider text-orange-500 mb-1">
                            {msg.role === 'user' ? 'CUSTOMER' : aiBotType === 'whatsapp' ? 'BITEBOT WHATSAPP' : 'AI VOICE AGENT'}
                          </span>
                          <p>{msg.content}</p>
                        </div>
                      </div>
                    ))}
                    {chatLoading && (
                      <div className="text-[11px] text-slate-400 italic">AI Assistant is thinking...</div>
                    )}
                  </div>

                  {/* Input form */}
                  <div className="flex gap-2">
                    <input 
                      id="input-ai-chat"
                      type="text"
                      placeholder="Ask 'menu', or say 'I want to order pizza'..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && submitChatMsg()}
                      className="flex-1 bg-slate-100 border border-slate-200 rounded-xl p-3 text-xs font-semibold placeholder:text-slate-400 text-slate-800 focus:outline-none"
                    />
                    <button 
                      id="btn-send-ai-chat"
                      onClick={submitChatMsg}
                      className="bg-orange-600 hover:bg-orange-700 text-white p-3 rounded-xl shadow transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Description Generator & Review summaries */}
                <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-left flex flex-col justify-between">
                  
                  {/* Part A: AI Description Generator */}
                  <div className="space-y-4">
                    <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">AI Culinary Description Writer</h3>
                    
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wide mb-1">Dish Name</label>
                      <input 
                        id="input-ai-desc-name"
                        type="text"
                        value={descNameInput}
                        onChange={(e) => setDescNameInput(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wide mb-1">Primary Ingredients</label>
                      <input 
                        id="input-ai-desc-ingredients"
                        type="text"
                        value={descIngredients}
                        onChange={(e) => setDescIngredients(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wide mb-1">Sensory Tone</label>
                      <select 
                        id="select-ai-desc-style"
                        value={descStyle} 
                        onChange={(e) => setDescStyle(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-xs font-bold rounded-lg p-2 focus:outline-none"
                      >
                        <option value="appetizing">Appetizing & Rustic</option>
                        <option value="luxury">Luxury / Fine-Dining</option>
                        <option value="playful">Playful / Trendy</option>
                        <option value="healthy">Healthy & Clean</option>
                      </select>
                    </div>

                    <button 
                      id="btn-trigger-ai-desc-writer"
                      onClick={generateAiDescription}
                      disabled={descGenerating}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2 rounded-lg"
                    >
                      {descGenerating ? 'Generating...' : 'Write Sensory Description'}
                    </button>

                    {generatedDescText && (
                      <div className="bg-orange-50 border border-orange-100 text-slate-800 text-xs p-3 rounded-lg leading-relaxed italic">
                        "{generatedDescText}"
                      </div>
                    )}
                  </div>

                  {/* Part B: Review analysis summary */}
                  <div className="border-t border-slate-100 pt-4 mt-6">
                    <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider mb-2">Automated Guest Reviews Analysis</h3>
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-[11px] leading-relaxed text-slate-600 space-y-2">
                      <div className="text-orange-600 font-extrabold text-[9px]">⚡ GEMINI SENTIMENT ANALYSIS</div>
                      
                      {reviewAnalysis ? (
                        <>
                          <div>
                            <span className="font-bold text-slate-900 block">Core Strength:</span>
                            <span>{reviewAnalysis.strengths[0]}</span>
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">Identified Bottleneck:</span>
                            <span>{reviewAnalysis.weaknesses[0]}</span>
                          </div>
                        </>
                      ) : (
                        <p>Computing reviews database metrics...</p>
                      )}
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* TAB 7: PROMOTIONS */}
          {activeTab === 'promotions' && (
            <div className="space-y-6">
              
              {/* Campaign builder with Gemini seeder */}
              <div className="grid lg:grid-cols-12 gap-6 items-stretch">
                
                {/* AI copy writer generator */}
                <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-left flex flex-col justify-between">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base">AI Coupon & Marketing Copywriter</h3>
                      <span className="text-xs text-slate-400 font-medium">Build high-impact text templates for your promotions</span>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Campaign Launch Goal</label>
                      <input 
                        id="input-campaign-goal"
                        type="text"
                        value={campaignGoal}
                        onChange={(e) => setCampaignGoal(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Promo Main Theme</label>
                      <input 
                        id="input-campaign-theme"
                        type="text"
                        value={campaignTheme}
                        onChange={(e) => setCampaignTheme(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Target Platform</label>
                      <select 
                        id="select-campaign-platform"
                        value={campaignPlatform} 
                        onChange={(e) => setCampaignPlatform(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl p-2.5 focus:outline-none"
                      >
                        <option value="Email">Email Channel</option>
                        <option value="SMS">SMS / WhatsApp Message</option>
                        <option value="Instagram">Instagram Caption</option>
                      </select>
                    </div>

                    <button 
                      id="btn-generate-campaign-ai"
                      onClick={generateMarketingCampaign}
                      disabled={campaignLoading}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs py-3 rounded-xl transition-all"
                    >
                      {campaignLoading ? 'Writing Copy...' : 'Draft Promotion copy'}
                    </button>
                  </div>

                  {generatedCampaign && (
                    <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-4 mt-6 text-xs leading-relaxed text-slate-700 space-y-2">
                      <div className="text-orange-600 font-bold">Subject / Headline Choice:</div>
                      <p className="font-bold text-slate-900">"{generatedCampaign.headlines[0]}"</p>
                      <div className="text-orange-600 font-bold">Body Sample Copy:</div>
                      <p className="italic">"{generatedCampaign.bodyCopy}"</p>
                    </div>
                  )}
                </div>

                {/* Campaigns List */}
                <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-left">
                  <h3 className="font-extrabold text-slate-900 text-base mb-4">Active Marketing Campaigns</h3>
                  <div className="space-y-4">
                    {campaigns.map(cmp => (
                      <div key={cmp.id} className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 text-xs flex justify-between items-center">
                        <div className="space-y-1">
                          <strong className="text-slate-900 text-sm block font-bold">{cmp.title}</strong>
                          <span className="text-[11px] text-slate-500">
                            Type: {cmp.type} {cmp.code ? `• Code: ${cmp.code}` : ''} • Value: {cmp.value}{cmp.discountType === 'percentage' ? '%' : '$'} off
                          </span>
                          <span className="block text-[10px] text-slate-400">Duration: {cmp.startDate} to {cmp.endDate}</span>
                        </div>

                        <div className="text-right">
                          <span className="bg-emerald-100 text-emerald-800 font-bold text-[9px] uppercase px-2 py-0.5 rounded block mb-1">
                            {cmp.status}
                          </span>
                          <span className="text-[11px] font-bold text-slate-900 block">{cmp.usageCount} times used</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 8: CUSTOMERS LIST */}
          {activeTab === 'customers' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-left">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Guest Directory CRM</h3>
                  <span className="text-xs text-slate-400">Segment customers into VIPs and track loyalty points balances.</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                      <th className="pb-3">Name</th>
                      <th className="pb-3">Contact</th>
                      <th className="pb-3">Spent</th>
                      <th className="pb-3">Orders Count</th>
                      <th className="pb-3">Segment Tier</th>
                      <th className="pb-3">Loyalty balance</th>
                      <th className="pb-3">Last Visit</th>
                      <th className="pb-3">Action notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    {customers.map(c => (
                      <tr key={c.id} className="hover:bg-slate-50/55 transition-colors">
                        <td className="py-3 font-bold text-slate-900">
                          <div className="flex items-center gap-2.5">
                            {c.avatar ? (
                              <img src={c.avatar} alt={c.name} className="w-8 h-8 rounded-full object-cover shadow-sm border border-slate-200" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-extrabold text-xs border border-slate-200">
                                {c.name.charAt(0)}
                              </div>
                            )}
                            <span>{c.name}</span>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className="block">{c.email}</span>
                          <span className="text-[10px] text-slate-400">{c.phone}</span>
                        </td>
                        <td className="py-3 font-extrabold text-slate-950">${c.totalSpent.toFixed(2)}</td>
                        <td className="py-3 font-bold text-slate-800">{c.ordersCount} orders</td>
                        <td className="py-3">
                          <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                            c.segment === 'VIP' ? 'bg-purple-100 text-purple-800' :
                            c.segment === 'Loyal' ? 'bg-blue-100 text-blue-800' :
                            'bg-slate-100 text-slate-800'
                          }`}>
                            {c.segment}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-orange-600">{c.loyaltyPoints} pts</span>
                            <button 
                              id={`add-points-${c.id}`}
                              onClick={() => setCustomers(prev => prev.map(cust => cust.id === c.id ? { ...cust, loyaltyPoints: cust.loyaltyPoints + 10 } : cust))}
                              className="text-[9px] font-extrabold bg-slate-100 hover:bg-slate-200 border px-1.5 py-0.5 rounded"
                            >
                              +10
                            </button>
                          </div>
                        </td>
                        <td className="py-3">{c.lastOrderDate}</td>
                        <td className="py-3 italic text-slate-400 max-w-xs truncate">{c.notes || 'None'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 9: SETTINGS PANEL */}
          {activeTab === 'settings' && (
            <div className="grid lg:grid-cols-12 gap-6 items-stretch text-left">
              
              {/* Business operating hours */}
              <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="font-extrabold text-slate-900 text-base mb-4">Business Operating Hours</h3>
                <div className="space-y-3.5">
                  {businessHours.map((hour, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs font-semibold">
                      <span className="w-24 text-slate-700">{hour.day}</span>
                      <div className="flex gap-2 items-center">
                        <input 
                          id={`input-hours-open-${idx}`}
                          type="text" 
                          value={hour.openTime} 
                          onChange={(e) => {
                            const updated = [...businessHours];
                            updated[idx].openTime = e.target.value;
                            setBusinessHours(updated);
                          }}
                          className="w-14 bg-slate-50 border border-slate-200 p-1 rounded text-center font-bold"
                        />
                        <span className="text-slate-400">to</span>
                        <input 
                          id={`input-hours-close-${idx}`}
                          type="text" 
                          value={hour.closeTime} 
                          onChange={(e) => {
                            const updated = [...businessHours];
                            updated[idx].closeTime = e.target.value;
                            setBusinessHours(updated);
                          }}
                          className="w-14 bg-slate-50 border border-slate-200 p-1 rounded text-center font-bold"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery zones config */}
              <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Geofenced Delivery Parameters</h3>
                  <span className="text-xs text-slate-400">Map custom circular delivery parameters with tiered threshold costs</span>
                </div>

                <div className="space-y-4">
                  {deliveryZones.map(zone => (
                    <div key={zone.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs flex flex-wrap gap-4 items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div style={{ backgroundColor: zone.color }} className="w-3.5 h-3.5 rounded-full shrink-0" />
                        <div>
                          <strong className="text-slate-900 text-sm block font-bold">{zone.name}</strong>
                          <span className="text-slate-500">Estimates Time: {zone.estimatedTime}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div>
                          <label className="block text-[10px] text-slate-400 uppercase tracking-wide">Min Order</label>
                          <input 
                            id={`input-zone-min-${zone.id}`}
                            type="number"
                            value={zone.minOrder}
                            onChange={(e) => setDeliveryZones(prev => prev.map(z => z.id === zone.id ? { ...z, minOrder: parseFloat(e.target.value) || 0 } : z))}
                            className="w-20 bg-white border border-slate-200 rounded p-1 font-bold text-slate-800"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-slate-400 uppercase tracking-wide">Delivery fee</label>
                          <input 
                            id={`input-zone-fee-${zone.id}`}
                            type="number"
                            value={zone.deliveryFee}
                            onChange={(e) => setDeliveryZones(prev => prev.map(z => z.id === zone.id ? { ...z, deliveryFee: parseFloat(e.target.value) || 0 } : z))}
                            className="w-20 bg-white border border-slate-200 rounded p-1 font-bold text-slate-800"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                  <h4 className="font-extrabold text-slate-900 text-xs mb-2">Platform Developer Webhooks & Access Keys</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed mb-4">Integrate direct orders seamlessly into third-party fiscalization software, Stripe terminals, or custom SMS relays.</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-mono">
                      <span className="text-slate-400">API_CLIENT_KEY</span>
                      <span className="font-bold text-slate-800">sk_live_2026_*****************a8c</span>
                    </div>
                    <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-mono">
                      <span className="text-slate-400">WEBHOOK_ENDPOINT</span>
                      <span className="font-bold text-slate-800">https://api.urbanbistro.com/webhooks/orders</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 10: REPORTS AND ANALYTICS */}
          {activeTab === 'reports' && (
            <div className="space-y-6 text-left">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Analytical Performance & Reports</h3>
                  <span className="text-xs text-slate-400">Track and review key restaurant performance logs, gross margins, and customer ordering trends.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">Date Range:</span>
                  <select id="reports-date-range" className="bg-slate-50 border border-slate-200 text-xs font-bold p-2 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500">
                    <option value="today">Today (Live)</option>
                    <option value="week">Last 7 Days</option>
                    <option value="month">Last 30 Days</option>
                    <option value="custom">Custom Range</option>
                  </select>
                  <button 
                    id="reports-export-csv"
                    onClick={() => {
                      setReportDownloadFinished(true);
                      setTimeout(() => setReportDownloadFinished(false), 3000);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl shadow transition-colors"
                  >
                    Export CSV Log
                  </button>
                </div>
              </div>

              {reportDownloadFinished && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold p-3.5 rounded-xl flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Preparing CSV export... Export complete! check-report-2026.csv has been prepared and downloaded.</span>
                </div>
              )}

              {/* KPI metrics row */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Total Gross Sales</span>
                  <span className="text-2xl font-black text-slate-900 block">${calculatedTotalRevenue.toFixed(2)}</span>
                  <span className="text-[10px] text-emerald-600 font-bold block flex items-center gap-1">
                    <ArrowUpRight className="w-3.5 h-3.5" /> +14.2% from last period
                  </span>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Average Order Value</span>
                  <span className="text-2xl font-black text-slate-900 block">
                    ${calculateOrdersCount > 0 ? (calculatedTotalRevenue / calculateOrdersCount).toFixed(2) : '0.00'}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold block flex items-center gap-1">
                    <ArrowUpRight className="w-3.5 h-3.5" /> +5.8% basket size growth
                  </span>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Active Orders Tracked</span>
                  <span className="text-2xl font-black text-slate-900 block">{calculateOrdersCount}</span>
                  <span className="text-[10px] text-emerald-600 font-bold block flex items-center gap-1">
                    <ArrowUpRight className="w-3.5 h-3.5" /> 100% online fulfillment rate
                  </span>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Order Cancellation Rate</span>
                  <span className="text-2xl font-black text-slate-900 block">0.0%</span>
                  <span className="text-[10px] text-slate-500 font-bold block">Primes operational hygiene</span>
                </div>
              </div>

              {/* Graphical simulation card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-slate-150 pb-3">
                  <h4 className="font-extrabold text-slate-900 text-sm">Hourly Sales Distribution Simulation</h4>
                  <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">Real-Time Sync</span>
                </div>
                
                {/* Simulated Chart Bars */}
                <div className="h-44 flex items-end gap-3 pt-6 px-4">
                  {[35, 48, 25, 70, 95, 60, 40, 85, 110, 80, 50, 75].map((val, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full bg-emerald-100 hover:bg-emerald-600 rounded-md transition-all relative group" style={{ height: `${(val / 120) * 120}px` }}>
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-950 text-white text-[9px] font-black p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          ${val * 5}
                        </div>
                      </div>
                      <span className="text-[9px] text-slate-400 font-bold">{idx + 10}h</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 11: HELP & CUSTOMER SUPPORT */}
          {activeTab === 'help' && (
            <div className="grid lg:grid-cols-12 gap-6 items-start text-left">
              
              {/* FAQ Section */}
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Frequently Asked Questions</h3>
                  <span className="text-xs text-slate-400">Find answers quickly regarding GloBite's merchant tools, domain setups, and orders.</span>
                </div>

                <div className="space-y-4 text-xs font-semibold text-slate-600">
                  <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl space-y-1.5">
                    <strong className="text-slate-900 font-extrabold block">How do I customize my digital menu?</strong>
                    <p className="text-[11px] text-slate-500 leading-relaxed">Head to the "Menu" manager in the sidebar, where you can add food items, declare price variants (e.g. Small vs. Large), and establish extra optional toppings.</p>
                  </div>

                  <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl space-y-1.5">
                    <strong className="text-slate-900 font-extrabold block">How do I link my custom website domain?</strong>
                    <p className="text-[11px] text-slate-500 leading-relaxed">Inside the "Website Designer", click "Domain Settings" to point your DNS records to our robust GloBite routing CDN servers.</p>
                  </div>

                  <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl space-y-1.5">
                    <strong className="text-slate-900 font-extrabold block">How are online payments processed?</strong>
                    <p className="text-[11px] text-slate-500 leading-relaxed">Configure your Stripe connect details inside the "Restaurant Settings" parameters. This enables direct bank payouts every 24 hours.</p>
                  </div>
                </div>
              </div>

              {/* Support logger */}
              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Log a Priority Support Ticket</h3>
                  <span className="text-xs text-slate-400">Direct transmission to GloBite engineers.</span>
                </div>

                {supportTicketId ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center text-xs space-y-3">
                    <span className="text-emerald-800 font-black text-sm block">Ticket Transmitted Successfully!</span>
                    <p className="text-[11px] text-emerald-700 leading-relaxed font-semibold">Your request has been filed under ID <strong className="font-bold">#{supportTicketId}</strong>. A merchant specialist will coordinate with you shortly.</p>
                    <button 
                      onClick={() => setSupportTicketId(null)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] px-3.5 py-1.5 rounded-lg transition-colors"
                    >
                      File Another Ticket
                    </button>
                  </div>
                ) : (
                  <form 
                    id="support-ticket-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      setSupportTicketId(`TK-${Math.floor(100000 + Math.random() * 900000)}`);
                    }}
                    className="space-y-3.5"
                  >
                    <div>
                      <label className="text-[10px] text-slate-400 font-bold block mb-1">Ticket Department</label>
                      <select id="depart-select" required className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-700 focus:outline-none">
                        <option value="billing">Billing & Subscriptions</option>
                        <option value="technical">Technical Menu/Website Issue</option>
                        <option value="feature">New Feature Recommendation</option>
                        <option value="security">Account Security</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 font-bold block mb-1">Contact Email</label>
                      <input 
                        id="support-contact-email"
                        type="email" 
                        required 
                        defaultValue={userEmail}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 font-bold block mb-1">Detailed Message</label>
                      <textarea 
                        id="support-msg-body"
                        required 
                        rows={4}
                        placeholder="Please describe your technical issue..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none placeholder-slate-400"
                      />
                    </div>

                    <button 
                      id="support-submit-btn"
                      type="submit"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-2.5 rounded-xl shadow transition-colors"
                    >
                      Transmit Ticket to GloBite Support
                    </button>
                  </form>
                )}
              </div>

            </div>
          )}

        </main>
      </div>

    </div>
  );
}
