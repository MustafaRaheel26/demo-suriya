import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, User, MapPin, ClipboardList, Heart, Star, 
  Search, Plus, Minus, Check, ChevronRight, CheckCircle, 
  LogOut, Trash2, ShieldCheck, Clock, Award
} from 'lucide-react';
import { MenuItem, Order, CartItem, Extra, VariantOption } from '../types';

interface CustomerDashboardProps {
  userEmail: string;
  menuItems: MenuItem[];
  orders: Order[];
  onUpdateOrders: (orders: Order[]) => void;
  onLogout: () => void;
}

export default function CustomerDashboard({ 
  userEmail, 
  menuItems, 
  orders, 
  onUpdateOrders, 
  onLogout 
}: CustomerDashboardProps) {
  const [activeTab, setActiveTab] = useState<string>('customer_menu');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [notification, setNotification] = useState<string | null>(null);

  // Shopping Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [payMethod, setPayMethod] = useState<'cash' | 'card' | 'online'>('online');
  const [custAddress, setCustAddress] = useState('240 S Grand Ave, Los Angeles, CA 90012');

  // Topping Customizer modal
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<VariantOption | undefined>(undefined);
  const [selectedExtras, setSelectedExtras] = useState<Extra[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Saved customer states
  const [customerProfile, setCustomerProfile] = useState({
    name: 'John Carter',
    email: userEmail,
    phone: '+1 (555) 890-2345',
    loyaltyPoints: 180,
    savedAddresses: [
      { id: 'addr-1', label: 'Home (Default)', address: '240 S Grand Ave, Los Angeles, CA 90012' },
      { id: 'addr-2', label: 'Office', address: '1315 Third Street Promenade, Santa Monica, CA 90401' }
    ],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80'
  });

  const [favorites, setFavorites] = useState<string[]>(['item-1', 'item-2']);

  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const categories = ['All', ...Array.from(new Set(menuItems.map(item => item.category)))];

  const filteredItems = selectedCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const searchedItems = filteredItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openCustomization = (item: MenuItem) => {
    setCustomizingItem(item);
    setSelectedVariant(item.variants.length > 0 ? item.variants[0].options[0] : undefined);
    setSelectedExtras([]);
    setSpecialInstructions('');
    setQuantity(1);
  };

  const toggleExtra = (extra: Extra) => {
    if (selectedExtras.some(e => e.id === extra.id)) {
      setSelectedExtras(selectedExtras.filter(e => e.id !== extra.id));
    } else {
      setSelectedExtras([...selectedExtras, extra]);
    }
  };

  const handleAddToCart = () => {
    if (!customizingItem) return;

    const basePrice = customizingItem.price;
    const variantModifier = selectedVariant ? selectedVariant.priceModifier : 0;
    const extrasTotal = selectedExtras.reduce((acc, curr) => acc + curr.price, 0);
    const unitPrice = basePrice + variantModifier + extrasTotal;

    const comboId = `${customizingItem.id}-${selectedVariant?.id || 'none'}-${selectedExtras.map(e => e.id).sort().join(',')}`;

    const newCartItem: CartItem = {
      id: comboId,
      menuItem: customizingItem,
      selectedVariant: selectedVariant ? {
        name: customizingItem.variants[0]?.name || 'Size',
        option: selectedVariant
      } : undefined,
      selectedExtras: selectedExtras,
      quantity,
      specialInstructions: specialInstructions.trim() || undefined
    };

    setCart(prev => {
      const idx = prev.findIndex(item => item.id === comboId);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx].quantity += quantity;
        return updated;
      }
      return [...prev, newCartItem];
    });

    setCustomizingItem(null);
    triggerNotification(`Added ${quantity}x "${customizingItem.name}" to cart.`);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const calculateSubtotal = () => {
    return cart.reduce((acc, item) => {
      const base = item.menuItem.price;
      const vMod = item.selectedVariant ? item.selectedVariant.option.priceModifier : 0;
      const eMod = item.selectedExtras.reduce((tot, ex) => tot + ex.price, 0);
      return acc + ((base + vMod + eMod) * item.quantity);
    }, 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const subtotal = calculateSubtotal();
    const fee = deliveryType === 'delivery' ? 3.50 : 0;
    const total = subtotal + fee;

    const orderId = `ORD-GUEST-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: orderId,
      customerName: customerProfile.name,
      customerEmail: customerProfile.email,
      customerPhone: customerProfile.phone,
      items: cart.map(c => ({
        name: c.menuItem.name,
        quantity: c.quantity,
        price: c.menuItem.price + (c.selectedVariant?.option.priceModifier || 0) + c.selectedExtras.reduce((tot, ex) => tot + ex.price, 0),
        variantName: c.selectedVariant?.name,
        variantOptionName: c.selectedVariant?.option.name,
        extrasNames: c.selectedExtras.map(e => e.name)
      })),
      total: total,
      status: 'pending',
      type: deliveryType,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      address: deliveryType === 'delivery' ? custAddress : undefined,
      deliveryFee: fee,
      paymentMethod: payMethod
    };

    onUpdateOrders([newOrder, ...orders]);
    setCart([]);
    setCustomerProfile(prev => ({
      ...prev,
      loyaltyPoints: prev.loyaltyPoints + Math.floor(total * 0.5) // earn 0.5 points per $ spent
    }));

    triggerNotification(`Success! Order #${orderId} has been placed. You earned loyalty points!`);
    setActiveTab('customer_orders');
  };

  const handleToggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(fav => fav !== id));
      triggerNotification('Removed from Favorites');
    } else {
      setFavorites([...favorites, id]);
      triggerNotification('Added to Favorites!');
    }
  };

  const getBreadcrumbs = () => {
    const section = activeTab.replace('customer_', '').replace('_', ' ');
    return (
      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 mb-1.5 tracking-wide uppercase select-none">
        <span>Guest Workspace</span>
        <span className="text-slate-300">/</span>
        <span className="text-orange-500 capitalize">{section}</span>
      </div>
    );
  };

  const sidebarItems = [
    { id: 'customer_menu', label: 'Browse Menu & Shop', icon: ShoppingBag },
    { id: 'customer_orders', label: 'Active Order History', icon: ClipboardList, count: orders.filter(o => o.customerEmail === userEmail && o.status !== 'delivered' && o.status !== 'cancelled').length },
    { id: 'customer_addresses', label: 'Saved Addresses', icon: MapPin },
    { id: 'customer_favorites', label: 'My Favorites', icon: Heart, count: favorites.length },
    { id: 'customer_rewards', label: 'Loyalty Rewards', icon: Award },
    { id: 'customer_profile', label: 'Guest Profile', icon: User },
  ];

  return (
    <div id="customer-portal-layout" className="bg-slate-50 min-h-screen text-slate-900 flex font-sans text-left relative overflow-hidden">
      
      {/* Toast */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 bg-orange-900 border border-orange-700 text-white px-4 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-bold">{notification}</span>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 text-white">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
            <span className="font-black text-lg tracking-wider">GLOBITE<span className="text-xs font-bold text-orange-400 ml-1">SHOP</span></span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {sidebarItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`btn-nav-customer-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive 
                    ? 'bg-orange-600 text-white shadow-inner border border-orange-500' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.count && item.count > 0 ? (
                  <span className="bg-orange-500 text-slate-950 font-black text-[10px] px-1.5 py-0.5 rounded-full">
                    {item.count}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl mb-3 flex items-center gap-2.5">
            {customerProfile.avatar ? (
              <img src={customerProfile.avatar} alt={customerProfile.name} className="w-8 h-8 rounded-full object-cover border border-slate-750 shadow-sm" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-orange-950 flex items-center justify-center text-xs font-bold text-white uppercase border border-slate-750">
                JC
              </div>
            )}
            <div className="min-w-0">
              <span className="text-[11px] font-black block truncate">{customerProfile.name}</span>
              <span className="text-[10px] text-slate-500 block truncate">{customerProfile.loyaltyPoints} Rewards Points</span>
            </div>
          </div>
          <button
            id="customer-logout-btn"
            onClick={onLogout}
            className="w-full bg-slate-850 hover:bg-slate-800 text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors border border-slate-800"
          >
            <LogOut className="w-3.5 h-3.5" />
            Exit Guest Portal
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOP HEADER */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 shadow-sm">
          <div className="flex flex-col items-start">
            {getBreadcrumbs()}
            <h1 className="text-xs font-black text-slate-900 tracking-tight">Urban Kitchen Bistro Storefront Simulator</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-xl text-xs font-bold text-orange-800 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-orange-600" />
              <span>{customerProfile.loyaltyPoints} loyalty points available</span>
            </div>
          </div>
        </header>

        {/* WORKSPACE */}
        <main className="flex-1 p-8 overflow-y-auto space-y-6">

          {/* TAB: BROWSE MENU & SHOP */}
          {activeTab === 'customer_menu' && (
            <div className="grid lg:grid-cols-12 gap-6 items-start text-left">
              
              {/* Left Side: Shop items */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Search & Categories */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-wrap gap-4 justify-between items-center">
                  <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-xl text-xs w-full sm:w-64">
                    <Search className="w-4 h-4 text-slate-500" />
                    <input 
                      type="text" 
                      placeholder="Search favorite dishes..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-transparent border-none focus:outline-none placeholder-slate-400 text-xs w-full text-slate-800"
                    />
                  </div>

                  {/* Categories Pills */}
                  <div className="flex flex-wrap gap-1.5">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                          selectedCategory === cat 
                            ? 'bg-orange-600 text-white' 
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grid list of dishes */}
                <div className="grid sm:grid-cols-2 gap-6">
                  {searchedItems.map(item => {
                    const isFav = favorites.includes(item.id);
                    return (
                      <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:border-orange-200 hover:shadow-md transition-all">
                        <div className="space-y-3">
                          <div className="h-40 rounded-xl overflow-hidden relative bg-slate-100">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                            <button 
                              onClick={() => handleToggleFavorite(item.id)}
                              className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center text-slate-500 hover:text-orange-600 transition-colors"
                            >
                              <Heart className={`w-4 h-4 ${isFav ? 'fill-orange-600 text-orange-600' : ''}`} />
                            </button>
                            {item.isPopular && (
                              <span className="absolute bottom-2.5 left-2.5 bg-orange-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow">
                                Popular Choice
                              </span>
                            )}
                          </div>

                          <div>
                            <div className="flex justify-between items-start gap-2 mb-1">
                              <h4 className="font-extrabold text-slate-900 text-sm">{item.name}</h4>
                              <span className="font-black text-slate-950 text-xs shrink-0">${item.price.toFixed(2)}</span>
                            </div>
                            <p className="text-slate-400 text-[11px] font-semibold leading-relaxed line-clamp-2">{item.description}</p>
                          </div>
                        </div>

                        <div className="pt-4 mt-4 border-t border-slate-100">
                          <button 
                            onClick={() => openCustomization(item)}
                            className="w-full bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-100 font-extrabold text-xs py-2 rounded-xl transition-all flex items-center justify-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" /> Order Customize
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Side: Interactive Cart & Checkout Panel */}
              <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-left space-y-5">
                <h3 className="font-black text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
                  <ShoppingBag className="w-5 h-5 text-orange-600" /> Simulated Meal Cart
                </h3>

                {cart.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-xs font-semibold">
                    🛒 Your cart is empty.<br />Add delicious customized dishes to begin checkout.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Cart Items List */}
                    <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                      {cart.map(item => (
                        <div key={item.id} className="bg-slate-50 border border-slate-150 p-2.5 rounded-xl flex items-center justify-between gap-3 text-xs font-bold text-slate-800">
                          <div className="min-w-0">
                            <span>{item.quantity}x {item.menuItem.name}</span>
                            {item.selectedVariant && (
                              <span className="text-[10px] text-slate-400 block font-semibold">
                                Size: {item.selectedVariant.option.name}
                              </span>
                            )}
                            {item.selectedExtras.length > 0 && (
                              <span className="text-[10px] text-slate-400 block truncate font-semibold">
                                + {item.selectedExtras.map(e => e.name).join(', ')}
                              </span>
                            )}
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-rose-600 hover:bg-rose-50 p-1 rounded transition-colors shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Delivery Options */}
                    <div className="bg-slate-50 border border-slate-150 p-3 rounded-xl space-y-3">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wide block mb-1">Fulfillment Preference</span>
                        <div className="grid grid-cols-2 gap-1.5">
                          <button 
                            onClick={() => setDeliveryType('delivery')}
                            className={`py-1 text-xs font-bold rounded ${deliveryType === 'delivery' ? 'bg-orange-600 text-white' : 'bg-white text-slate-700 border border-slate-200'}`}
                          >
                            Delivery
                          </button>
                          <button 
                            onClick={() => setDeliveryType('pickup')}
                            className={`py-1 text-xs font-bold rounded ${deliveryType === 'pickup' ? 'bg-orange-600 text-white' : 'bg-white text-slate-700 border border-slate-200'}`}
                          >
                            Takeaway
                          </button>
                        </div>
                      </div>

                      {deliveryType === 'delivery' && (
                        <div>
                          <label className="text-[10px] text-slate-400 uppercase tracking-wide block mb-1">Destination Address</label>
                          <input 
                            type="text"
                            value={custAddress}
                            onChange={(e) => setCustAddress(e.target.value)}
                            className="w-full bg-white border border-slate-200 p-2 rounded text-xs text-slate-800 font-bold focus:outline-none"
                          />
                        </div>
                      )}
                    </div>

                    {/* Payments */}
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wide block mb-1">Simulated Gateway</span>
                      <div className="grid grid-cols-3 gap-1">
                        {(['cash', 'card', 'online'] as const).map(m => (
                          <button
                            key={m}
                            onClick={() => setPayMethod(m)}
                            className={`py-1 text-[10px] uppercase font-black rounded ${payMethod === m ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'}`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Total math */}
                    <div className="space-y-1.5 border-t border-slate-100 pt-3 text-xs font-semibold text-slate-600">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span className="text-slate-900 font-bold">${calculateSubtotal().toFixed(2)}</span>
                      </div>
                      {deliveryType === 'delivery' && (
                        <div className="flex justify-between">
                          <span>Courier Fee:</span>
                          <span className="text-slate-900 font-bold">$3.50</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm font-black text-slate-950 pt-1.5 border-t border-slate-100">
                        <span>Grand Total:</span>
                        <span>${(calculateSubtotal() + (deliveryType === 'delivery' ? 3.50 : 0)).toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Checkout CTA */}
                    <button 
                      id="customer-place-simulated-order-btn"
                      onClick={handleCheckout}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs py-2.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5"
                    >
                      <ShieldCheck className="w-4 h-4" /> Place Simulated Order
                    </button>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB: ACTIVE ORDER HISTORY */}
          {activeTab === 'customer_orders' && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm text-left">
                <h2 className="text-base font-black text-slate-900 mb-1">Your Live Trackable Requests</h2>
                <p className="text-xs text-slate-500 font-semibold">Monitor active orders and watch simulated status progression in real-time.</p>
              </div>

              {orders.filter(o => o.customerEmail === userEmail).length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400 font-bold shadow-sm">
                  📋 No simulated orders found. Place your first request on the "Browse Menu" shop tab!
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.filter(o => o.customerEmail === userEmail).map(ord => (
                    <div key={ord.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-left space-y-6">
                      
                      {/* Order brief */}
                      <div className="flex flex-wrap gap-4 justify-between items-center border-b border-slate-100 pb-4">
                        <div>
                          <strong className="text-slate-900 text-sm font-black block">Order ID: #{ord.id}</strong>
                          <span className="text-[10px] text-slate-400 font-bold">{ord.timestamp} • Fulfillment: {ord.type}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-0.5">Grand Total</span>
                          <span className="font-extrabold text-slate-950 text-sm">${ord.total.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Timeline Visual tracker */}
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-3">Live Status Progression</span>
                        
                        <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-black tracking-wide uppercase">
                          <div className={`p-2 rounded-xl border ${ord.status === 'pending' ? 'bg-orange-50 border-orange-300 text-orange-800' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                            1. Received
                          </div>
                          <div className={`p-2 rounded-xl border ${ord.status === 'preparing' ? 'bg-blue-50 border-blue-300 text-blue-800' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                            2. Cooking
                          </div>
                          <div className={`p-2 rounded-xl border ${ord.status === 'ready' ? 'bg-amber-50 border-amber-300 text-amber-800' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                            3. Ready / Out
                          </div>
                          <div className={`p-2 rounded-xl border ${ord.status === 'delivered' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                            4. Complete
                          </div>
                        </div>

                        <div className="mt-3.5 bg-slate-50 border border-slate-150 p-3 rounded-xl flex items-center gap-2 text-xs font-semibold">
                          <Clock className="w-4 h-4 text-orange-600" />
                          <span className="text-slate-700">
                            {ord.status === 'pending' && "Your order was successfully transmitted. The merchant staff is reviewing your food basket."}
                            {ord.status === 'preparing' && "Chef Mario is hand-tossing your artisanal pizza. It's inside the wood-fired stones!"}
                            {ord.status === 'ready' && "Your food is fully prepared, boxed in eco-kraft packaging, and on its way to your destination."}
                            {ord.status === 'delivered' && "Delivered! Savor your warm, freshly baked Italian meal. Thanks for choosing GloBite."}
                          </span>
                        </div>
                      </div>

                      {/* Receipt items list */}
                      <div className="bg-slate-50 border border-slate-150 rounded-xl p-4 text-xs font-bold text-slate-800 space-y-1.5">
                        <span className="text-[9px] text-slate-400 uppercase tracking-wider block mb-1">Receipt breakdown</span>
                        {ord.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span>{it.quantity}x {it.name} {it.variantOptionName ? `(${it.variantOptionName})` : ''}</span>
                            <span className="text-slate-900">${(it.price * it.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: SAVED ADDRESSES */}
          {activeTab === 'customer_addresses' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 text-left shadow-sm space-y-6">
              <div>
                <h2 className="text-base font-black text-slate-900 mb-1">Your Delivery Destination Coordinates</h2>
                <p className="text-xs text-slate-500 font-semibold">Saved geocoded destination locations for lightning-fast courier orders.</p>
              </div>

              <div className="space-y-3.5">
                {customerProfile.savedAddresses.map(addr => (
                  <div key={addr.id} className="bg-slate-50 border border-slate-150 p-4 rounded-xl flex items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-xs font-black text-slate-900 block">{addr.label}</strong>
                        <span className="text-xs text-slate-500 font-semibold block">{addr.address}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 font-mono">{addr.id}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: MY FAVORITES */}
          {activeTab === 'customer_favorites' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 text-left shadow-sm space-y-6">
              <div>
                <h2 className="text-base font-black text-slate-900 mb-1">My Favorite Dishes</h2>
                <p className="text-xs text-slate-500 font-semibold">Your curated selection of highly ordered, mouth-watering gourmet dishes.</p>
              </div>

              {favorites.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs font-semibold">
                  ❤️ Your favorites catalog is empty. Tap the heart symbol on any dish to bookmark it!
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {menuItems.filter(m => favorites.includes(m.id)).map(item => (
                    <div key={item.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between hover:border-orange-200 transition-colors">
                      <div>
                        <div className="h-32 rounded-xl overflow-hidden mb-3">
                          <img src={item.image} alt={item.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        </div>
                        <h4 className="font-extrabold text-slate-900 text-xs mb-1">{item.name}</h4>
                        <span className="text-orange-600 text-xs font-bold">${item.price.toFixed(2)}</span>
                      </div>
                      <button 
                        onClick={() => openCustomization(item)}
                        className="mt-4 bg-orange-600 hover:bg-orange-700 text-white font-bold text-[10px] py-1.5 rounded-lg transition-colors"
                      >
                        Order now
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: LOYALTY REWARDS */}
          {activeTab === 'customer_rewards' && (
            <div className="grid lg:grid-cols-3 gap-6 text-left items-start">
              
              <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
                <div>
                  <h3 className="text-slate-900 font-black text-base border-b border-slate-100 pb-3">Available Loyalty Rewards Coupons</h3>
                  <p className="text-xs text-slate-500 font-semibold mt-1">Convert your points into direct checkout cashback coupons.</p>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-50 border border-slate-150 rounded-xl p-4 flex items-center justify-between gap-4">
                    <div>
                      <strong className="text-xs font-black text-slate-900 block">$5 Cash Coupon</strong>
                      <span className="text-xs text-slate-500 font-semibold block">Claim for 100 points • Works on all online checkout orders</span>
                    </div>
                    <button 
                      onClick={() => {
                        if (customerProfile.loyaltyPoints >= 100) {
                          setCustomerProfile(prev => ({ ...prev, loyaltyPoints: prev.loyaltyPoints - 100 }));
                          triggerNotification('Coupon successfully claimed! Coupon code: LOYAL5');
                        } else {
                          triggerNotification('Insufficient loyalty points balance.');
                        }
                      }}
                      className="bg-orange-600 hover:bg-orange-700 text-white font-black text-[10px] px-3.5 py-2 rounded-lg transition-colors"
                    >
                      Redeem Coupon
                    </button>
                  </div>

                  <div className="bg-slate-50 border border-slate-150 rounded-xl p-4 flex items-center justify-between gap-4">
                    <div>
                      <strong className="text-xs font-black text-slate-900 block">$15 Premium Cash Coupon</strong>
                      <span className="text-xs text-slate-500 font-semibold block">Claim for 250 points • Works on all order types</span>
                    </div>
                    <button 
                      onClick={() => {
                        if (customerProfile.loyaltyPoints >= 250) {
                          setCustomerProfile(prev => ({ ...prev, loyaltyPoints: prev.loyaltyPoints - 250 }));
                          triggerNotification('Coupon successfully claimed! Coupon code: LOYAL15');
                        } else {
                          triggerNotification('Insufficient loyalty points balance.');
                        }
                      }}
                      className="bg-orange-600 hover:bg-orange-700 text-white font-black text-[10px] px-3.5 py-2 rounded-lg transition-colors"
                    >
                      Redeem Coupon
                    </button>
                  </div>
                </div>
              </div>

              {/* Points display card */}
              <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 flex flex-col justify-between min-h-[220px]">
                <div className="space-y-1">
                  <Award className="w-10 h-10 text-orange-400" />
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">My Point Balance</span>
                  <strong className="text-4xl font-black text-white block">{customerProfile.loyaltyPoints}</strong>
                </div>

                <div className="text-[11px] text-slate-400 leading-relaxed bg-slate-950 border border-slate-800 p-3 rounded-xl font-semibold">
                  You earn <span className="text-orange-400 font-black">0.5 loyalty points</span> for every simulated dollar spent during checkout. Keep ordering to claim bigger cash discounts!
                </div>
              </div>

            </div>
          )}

          {/* TAB: GUEST PROFILE */}
          {activeTab === 'customer_profile' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 text-left shadow-sm space-y-5 max-w-2xl">
              <h2 className="text-slate-900 font-black text-base border-b border-slate-100 pb-3">Guest Profile Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider block mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={customerProfile.name}
                    onChange={(e) => setCustomerProfile(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider block mb-1">Verified Email Address</label>
                  <input 
                    type="email" 
                    value={customerProfile.email}
                    disabled
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-400 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider block mb-1">Mobile Contact Phone</label>
                  <input 
                    type="text" 
                    value={customerProfile.phone}
                    onChange={(e) => setCustomerProfile(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button 
                  onClick={() => triggerNotification('Saved guest profile changes successfully.')}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow-md transition-colors"
                >
                  Save Profile Settings
                </button>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* CUSTOMIZER MODAL */}
      {customizingItem && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full shadow-2xl p-6 text-left flex flex-col justify-between max-h-[90vh] overflow-y-auto space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="font-extrabold text-slate-900 text-base">{customizingItem.name}</h3>
                <span className="font-extrabold text-sm text-slate-950">${customizingItem.price.toFixed(2)}</span>
              </div>
              <p className="text-xs text-slate-500 font-semibold">{customizingItem.description}</p>

              {/* Variants Section */}
              {customizingItem.variants.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">
                    Choose {customizingItem.variants[0].name}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {customizingItem.variants[0].options.map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setSelectedVariant(opt)}
                        className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                          selectedVariant?.id === opt.id 
                            ? 'border-orange-500 bg-orange-50 text-orange-900' 
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="block">{opt.name}</span>
                        <span className="text-[10px] text-slate-400 block font-semibold">
                          {opt.priceModifier > 0 ? `+$${opt.priceModifier.toFixed(2)}` : 'Included'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Extras Section */}
              {customizingItem.extras.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Add Custom Toppings</span>
                  <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                    {customizingItem.extras.map(ex => {
                      const isAdded = selectedExtras.some(e => e.id === ex.id);
                      return (
                        <button
                          key={ex.id}
                          onClick={() => toggleExtra(ex)}
                          className={`w-full p-2 rounded-xl border text-xs font-bold flex justify-between items-center transition-all ${
                            isAdded 
                              ? 'border-orange-500 bg-orange-50 text-orange-900' 
                              : 'border-slate-150 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <span>{ex.name}</span>
                          <span>+${ex.price.toFixed(2)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-xs font-bold text-slate-700">Customize Quantity</span>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-200"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-extrabold text-sm text-slate-900">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-200"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-2 border-t border-slate-100 pt-4">
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-black text-xs py-2.5 rounded-xl transition-colors shadow-md"
              >
                Add To Basket
              </button>
              <button 
                onClick={() => setCustomizingItem(null)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
