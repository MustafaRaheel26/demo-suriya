import React, { useState, useEffect } from 'react';
import { 
  Utensils, Sparkles, TrendingUp, ChevronRight, Globe, Layers, 
  Smartphone, Shield, Bell, Check, MessageSquare, ArrowRight, Star, 
  HelpCircle, Mail, MapPin, Phone, RefreshCw, ShoppingCart, Play, CheckCircle2,
  Laptop, Clock, Tablet, Calendar, Award, AlertCircle, Volume2, VolumeX,
  Map, Printer, Receipt, ThumbsUp, ChevronDown, Flame, CreditCard, Heart,
  ShoppingBag, Eye, Users, FileText, Smile, X, Menu, Plus, Facebook, Twitter, Linkedin, Instagram, Youtube
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MarketingPageProps {
  onNavigate: (page: string) => void;
}

export default function MarketingPage({ onNavigate }: MarketingPageProps) {
  // Navigation active tab: 'home' or 'pricing'
  const [subPage, setSubPage] = useState<'home' | 'pricing'>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [hasScrolled, setHasScrolled] = useState<boolean>(false);

  // FAQ state (First item open by default)
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  // ----------------------------------------------------
  // SCROLL DETECTION (STICKY HEADER SHADOW EFFECTS)
  // ----------------------------------------------------
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll helper
  const handleScrollTo = (sectionId: string) => {
    setMobileMenuOpen(false);
    setSubPage('home');
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        const offset = 80; // height of sticky header
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  // ----------------------------------------------------
  // INTERACTIVE STATE: MENU PREVIEW (HERO FIELD)
  // ----------------------------------------------------
  const [heroCart, setHeroCart] = useState<{ name: string; price: number; qty: number }[]>([]);
  const heroDishes = [
    { id: 'hd-1', name: 'Neapolitan Sourdough Margherita', desc: 'Crushed San Marzano tomatoes, fresh Bufala mozzarella, basil, EVOO', price: 14.00, img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=150&q=80' },
    { id: 'hd-2', name: 'Charred Pepperoni & Spicy Honey', desc: 'Artisanal cured pepperoni cups, chili flakes, organic hot honey drizzle', price: 16.50, img: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=150&q=80' },
  ];

  const addToHeroCart = (dish: typeof heroDishes[0]) => {
    setHeroCart(prev => {
      const existing = prev.find(item => item.name === dish.name);
      if (existing) {
        return prev.map(item => item.name === dish.name ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { name: dish.name, price: dish.price, qty: 1 }];
    });
  };

  const getHeroCartTotal = () => {
    return heroCart.reduce((acc, item) => acc + (item.price * item.qty), 0).toFixed(2);
  };

  const getHeroCartQty = () => {
    return heroCart.reduce((acc, item) => acc + item.qty, 0);
  };

  // ----------------------------------------------------
  // INTERACTIVE STATE: RESERVATION DEPOSITS (SECTION 3)
  // ----------------------------------------------------
  const [reservations, setReservations] = useState([
    { id: 'res-1', guest: 'Marcus Aurelius', size: 4, status: 'paid', amount: 40, time: '7:30 PM' },
    { id: 'res-2', guest: 'Dr. Helen Carter', size: 2, status: 'paid', amount: 20, time: '8:00 PM' },
    { id: 'res-3', guest: 'Diner Reservation', size: 6, status: 'pending', amount: 60, time: '6:15 PM' },
  ]);

  const handlePayDeposit = (id: string) => {
    setReservations(prev => prev.map(res => res.id === id ? { ...res, status: 'paid' } : res));
  };

  // ----------------------------------------------------
  // INTERACTIVE STATE: WEBSITE BUILDER SIMULATOR (SECTION 4)
  // ----------------------------------------------------
  const [builderTheme, setBuilderTheme] = useState<'orange' | 'emerald' | 'ocean' | 'royal'>('orange');
  const [builderDevice, setBuilderDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [restaurantName, setRestaurantName] = useState<string>('Piazza Rustica');

  // Theme presets config
  const themeStyles = {
    orange: { bg: 'bg-[#FF5A36]', text: 'text-[#FF5A36]', hover: 'hover:bg-[#E04F2F]', border: 'border-[#FF5A36]/30' },
    emerald: { bg: 'bg-emerald-600', text: 'text-emerald-600', hover: 'hover:bg-emerald-700', border: 'border-emerald-600/30' },
    ocean: { bg: 'bg-sky-600', text: 'text-sky-600', hover: 'hover:bg-sky-700', border: 'border-sky-600/30' },
    royal: { bg: 'bg-violet-600', text: 'text-violet-600', hover: 'hover:bg-violet-700', border: 'border-violet-600/30' }
  };

  // ----------------------------------------------------
  // INTERACTIVE STATE: RINGING ORDER TERMINAL (SECTION 6)
  // ----------------------------------------------------
  const [terminalState, setTerminalState] = useState<'ringing' | 'accepted' | 'cooking'>('ringing');
  const [selectedPrepTime, setSelectedPrepTime] = useState<number>(25);

  const triggerRering = () => {
    setTerminalState('ringing');
  };

  return (
    <div className="bg-[#FAFBFD] font-sans text-slate-800 min-h-screen selection:bg-[#FF5A36] selection:text-white relative overflow-x-hidden">
      
      {/* 2. GLOBAL HEADER */}
      <nav 
        className={`sticky top-0 z-50 px-6 py-4 md:px-12 flex items-center justify-between transition-all duration-300 ${
          hasScrolled 
            ? 'bg-[#1E2430] shadow-xl border-b border-slate-800/80 py-3.5' 
            : 'bg-[#1E2430] border-b border-slate-800/40'
        }`}
      >
        {/* Left: Logo */}
        <div 
          className="flex items-center gap-1.5 cursor-pointer select-none"
          onClick={() => {
            setSubPage('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <span className="font-black text-xl tracking-tight text-white uppercase">
            Glo<span className="text-[#FF5A36]">Bite</span>
          </span>
        </div>

        {/* Center/Right Nav links (exactly 4 items, uppercase, clean spacing) */}
        <div className="hidden md:flex items-center gap-10 text-[11px] font-bold tracking-widest text-slate-300">
          <button 
            onClick={() => handleScrollTo('features')}
            className="hover:text-[#FF5A36] transition-colors uppercase relative py-1 group cursor-pointer"
          >
            FOOD ORDERING
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#FF5A36] transition-all group-hover:w-full" />
          </button>
          
          <button 
            onClick={() => handleScrollTo('services')}
            className="hover:text-[#FF5A36] transition-colors uppercase relative py-1 group cursor-pointer"
          >
            RESTAURANT SERVICES
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#FF5A36] transition-all group-hover:w-full" />
          </button>
          
          <button 
            onClick={() => {
              setSubPage('pricing');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`transition-colors uppercase relative py-1 group cursor-pointer ${
              subPage === 'pricing' ? 'text-[#FF5A36]' : 'hover:text-[#FF5A36]'
            }`}
          >
            PRICING
            <span className={`absolute bottom-0 left-0 h-[2px] bg-[#FF5A36] transition-all ${subPage === 'pricing' ? 'w-full' : 'w-0 group-hover:w-full'}`} />
          </button>

          <button 
            onClick={() => onNavigate('login')}
            className="text-white bg-[#FF5A36] hover:bg-[#E04F2F] px-4 py-2 rounded-lg font-extrabold transition-all hover:scale-105 active:scale-95 shadow-md shadow-[#FF5A36]/10 cursor-pointer"
          >
            LOG IN
          </button>
        </div>

        {/* Mobile Hamburger Drawer Trigger */}
        <div className="md:hidden">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-slate-200 hover:text-white focus:outline-none cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 left-0 right-0 bg-[#1E2430] border-b border-slate-800 z-40 px-6 py-6 flex flex-col gap-5 text-sm font-bold tracking-wider text-slate-200 md:hidden shadow-2xl"
          >
            <button 
              onClick={() => handleScrollTo('features')}
              className="text-left py-2 hover:text-[#FF5A36] border-b border-slate-800/40"
            >
              FOOD ORDERING
            </button>
            <button 
              onClick={() => handleScrollTo('services')}
              className="text-left py-2 hover:text-[#FF5A36] border-b border-slate-800/40"
            >
              RESTAURANT SERVICES
            </button>
            <button 
              onClick={() => {
                setMobileMenuOpen(false);
                setSubPage('pricing');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-left py-2 hover:text-[#FF5A36] border-b border-slate-800/40"
            >
              PRICING
            </button>
            <button 
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('login');
              }}
              className="w-full text-center bg-[#FF5A36] text-white py-3 rounded-xl hover:bg-[#E04F2F] transition-colors mt-2"
            >
              LOG IN
            </button>
          </motion.div>
        )}
      </AnimatePresence>


      {/* SUBPAGE 1: HOMEPAGE */}
      {subPage === 'home' && (
        <div>
          {/* 4.1 HERO */}
          <section className="bg-white border-b border-slate-100 py-16 lg:py-24 px-6 md:px-12 relative overflow-hidden">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column: Headings & CTAs */}
              <div className="lg:col-span-6 text-left flex flex-col items-start">
                
                {/* Status Pill */}
                <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-3.5 py-1.5 text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A36] animate-pulse" />
                  Commission-Free Ordering Engine
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight mb-5">
                  Keep Your Margins.<br />
                  <span className="text-[#FF5A36]">Direct Food Ordering.</span>
                </h1>

                <p className="text-slate-500 text-sm sm:text-base leading-relaxed mb-8 max-w-lg">
                  Set up online ordering for takeaway, delivery, order-ahead & table reservations in one system. Eliminate heavy aggregators and take direct orders with absolute ease.
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                  <button 
                    onClick={() => onNavigate('signup')}
                    className="bg-[#FF5A36] hover:bg-[#E04F2F] text-white text-xs sm:text-sm font-extrabold px-8 py-4 rounded-xl shadow-lg shadow-[#FF5A36]/20 transition-all hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Sell Food Online
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleScrollTo('features')}
                    className="bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs sm:text-sm font-bold px-7 py-4 rounded-xl transition-all cursor-pointer flex items-center justify-center"
                  >
                    Learn How It Works
                  </button>
                </div>
              </div>

              {/* Right Column: Hero Browser-Window Mockup */}
              <div className="lg:col-span-6 flex justify-center w-full relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-100 to-indigo-100 rounded-3xl blur-2xl opacity-40 -z-10" />
                
                {/* Browser Container */}
                <div className="w-full max-w-lg bg-[#1E2430] border border-slate-800 shadow-2xl rounded-2xl overflow-hidden flex flex-col text-slate-800">
                  
                  {/* Browser Chromes */}
                  <div className="flex items-center justify-between bg-[#1E2430] px-4 py-3 border-b border-slate-800/80">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#FF5A36]/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <div className="bg-[#12161F] text-[10px] text-slate-400 font-mono px-5 py-1 rounded-md border border-slate-800/60 flex items-center gap-1.5">
                      <Shield className="w-3 h-3 text-[#FF5A36]" />
                      your-bistro.globite.app/menu
                    </div>
                    <div className="relative">
                      <ShoppingCart className="w-4 h-4 text-slate-300" />
                      {getHeroCartQty() > 0 && (
                        <span className="absolute -top-2.5 -right-2.5 bg-[#FF5A36] text-white font-mono font-bold text-[8px] h-4.5 w-4.5 rounded-full flex items-center justify-center shadow-md animate-scale-in">
                          {getHeroCartQty()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Main Page Content */}
                  <div className="bg-white p-5 text-left flex-1 min-h-[290px]">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900 tracking-tight">PIZZERIA BELLA</h4>
                        <p className="text-[10px] text-slate-400 font-semibold block mt-0.5">★ 4.9 Direct • Hand-crafted Wood-fired Pizzas</p>
                      </div>
                      <span className="text-[9px] bg-emerald-50 text-emerald-600 font-black px-2 py-1 rounded border border-emerald-100">
                        OPEN FOR DELIVERY
                      </span>
                    </div>

                    <div className="mb-3">
                      <span className="text-xs font-black text-[#FF5A36] tracking-wider uppercase block">Stone-Baked Specials</span>
                    </div>

                    {/* Dish list */}
                    <div className="space-y-4">
                      {heroDishes.map((dish) => (
                        <div key={dish.id} className="flex gap-4 items-center justify-between border-b border-slate-50 pb-3">
                          <div className="flex-1 pr-2">
                            <h5 className="font-bold text-xs text-slate-800">{dish.name}</h5>
                            <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">{dish.desc}</p>
                            <span className="text-xs font-black text-slate-700 block mt-1">${dish.price.toFixed(2)}</span>
                          </div>
                          <div className="flex flex-col items-center gap-2">
                            <img 
                              src={dish.img} 
                              alt={dish.name} 
                              className="w-12 h-12 rounded-lg object-cover border border-slate-100 shrink-0 shadow-xs" 
                            />
                            <button 
                              onClick={() => addToHeroCart(dish)}
                              className="bg-slate-100 hover:bg-[#FF5A36] hover:text-white text-slate-800 font-black text-[9px] px-2 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Plus className="w-2.5 h-2.5" />
                              ADD
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Interactive Cart Panel drawer */}
                    {heroCart.length > 0 && (
                      <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between animate-fade-in">
                        <div className="text-left">
                          <span className="text-[10px] font-bold text-slate-500 block">YOUR SIMULATED CART</span>
                          <span className="text-xs font-extrabold text-slate-800">
                            {heroCart.length} item{heroCart.length > 1 ? 's' : ''} • Total: ${getHeroCartTotal()}
                          </span>
                        </div>
                        <button 
                          onClick={() => setHeroCart([])}
                          className="text-[9px] text-slate-400 hover:text-slate-600 font-bold underline cursor-pointer"
                        >
                          Clear Cart
                        </button>
                      </div>
                    )}

                  </div>

                </div>
              </div>

            </div>
          </section>


          {/* 4.2 FEATURE SECTION 1 — SELL ONLINE / ZERO COST */}
          <section id="features" className="py-20 lg:py-28 px-6 md:px-12 bg-[#F7F8FA] border-b border-slate-100">
            <div className="max-w-7xl mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="grid lg:grid-cols-12 gap-12 items-center"
              >
                {/* Left Column: Text Content */}
                <div className="lg:col-span-6 text-left">
                  <span className="text-xs text-[#FF5A36] font-extrabold tracking-widest uppercase block mb-3">
                    SELL FOOD ONLINE
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
                    Turn Digital Visitors Into Profitable Regular Diners
                  </h2>
                  <div className="text-slate-500 text-sm sm:text-base space-y-4 leading-relaxed">
                    <p>
                      Your website shouldn't just be an expensive digital brochure. It should be the most efficient sales representative your kitchen has. 
                    </p>
                    <p>
                      With GloBite's integrated ordering layer, guests can instantly select dishes, choose optional variants, pay with their cards, and confirm their arrival times. No friction, no third-party dispatch fees, and zero middle-men.
                    </p>
                    <p>
                      Keep your customer database, collect clean marketing details, and protect your margins with a direct system built to run at <strong className="font-bold text-slate-900">zero costs</strong>.
                    </p>
                  </div>
                </div>

                {/* Right Column: Visual Mockup */}
                <div className="lg:col-span-6 flex justify-center">
                  <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-2xl shadow-xl p-6 text-left">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-4">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                      <span className="text-[10px] text-slate-400 font-mono block pl-2">Customer Web Interface</span>
                    </div>

                    <div className="bg-[#1E2430] p-6 rounded-xl text-center text-white relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF5A36]/10 rounded-full blur-xl" />
                      <span className="font-mono text-[9px] uppercase text-[#FF5A36] font-bold block mb-1">Interactive Button Demo</span>
                      <h4 className="font-extrabold text-base mb-4 text-slate-100">Ready to place your order?</h4>
                      
                      <button 
                        onClick={() => onNavigate('signup')}
                        className="bg-[#FF5A36] hover:bg-[#E04F2F] text-white font-extrabold text-xs tracking-wider px-6 py-3 rounded-lg shadow-md uppercase transition-all hover:scale-105 active:scale-95 cursor-pointer inline-flex items-center gap-2"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        ORDER NOW & SAVE
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>


          {/* 4.3 FEATURE SECTION 2 — ORDERING WIDGETS (REVERSED LAYOUT) */}
          <section className="py-20 lg:py-28 px-6 md:px-12 bg-white border-b border-slate-100">
            <div className="max-w-7xl mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="grid lg:grid-cols-12 gap-12 items-center"
              >
                {/* Left Column: Visual (reversed) */}
                <div className="lg:col-span-6 lg:order-1 flex justify-center">
                  <div className="w-full max-w-md bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-lg p-5 text-left relative">
                    <div className="border-b border-slate-200 pb-3 mb-4 flex items-center justify-between text-slate-400 text-[10px]">
                      <span>Website Preview Chrome</span>
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                      </div>
                    </div>

                    <div className="bg-white border border-slate-100 h-64 rounded-xl flex flex-col justify-between p-4 relative overflow-hidden">
                      <div>
                        <div className="h-4 bg-slate-100 rounded w-1/3 mb-2" />
                        <div className="h-3 bg-slate-100 rounded w-2/3 mb-1" />
                        <div className="h-3 bg-slate-100 rounded w-1/2 mb-1" />
                      </div>

                      {/* Floating widgets right side mock */}
                      <div className="absolute right-3 top-1/3 flex flex-col gap-2.5 z-10">
                        <div className="bg-[#FF5A36] text-white text-[9px] font-extrabold px-3 py-2 rounded-lg shadow-lg flex items-center gap-1.5 hover:scale-105 transition-transform cursor-pointer">
                          <ShoppingBag className="w-3 h-3" />
                          <span>See Menu & Order</span>
                        </div>
                        <div className="bg-slate-900 text-white text-[9px] font-extrabold px-3 py-2 rounded-lg shadow-lg flex items-center gap-1.5 hover:scale-105 transition-transform cursor-pointer">
                          <Calendar className="w-3 h-3 text-[#FF5A36]" />
                          <span>Book Table</span>
                        </div>
                      </div>

                      <div className="text-[10px] text-slate-400 border-t border-slate-100 pt-3">
                        *Widgets float unobtrusively on any mobile or desktop viewport.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Text (reversed) */}
                <div className="lg:col-span-6 lg:order-2 text-left">
                  <span className="text-xs text-[#FF5A36] font-extrabold tracking-widest uppercase block mb-3">
                    RECEIVE MORE ORDERS
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
                    Place Your Ordering Entry Point Right at the Forefront
                  </h2>
                  <div className="text-slate-500 text-sm sm:text-base space-y-4 leading-relaxed">
                    <p>
                      Do not force hungry customers to hunt for a downloadable PDF or a separate third-party portal link. The ordering button should be front, center, and impossible to overlook.
                    </p>
                    <p>
                      GloBite installs two intelligent, sticky widgets on your website: our flagship <strong className="font-bold text-slate-900">menu/order widget</strong> designed to guide shoppers to a checkout completion, and our customizable <strong className="font-bold text-slate-900">table-reservation widget</strong> which lets them secure physical seats.
                    </p>
                    <p>
                      Both widgets remain floating on the right side of any mobile or desktop device, providing a friction-free gateway to dining with you.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>


          {/* 4.4 FEATURE SECTION 3 — RESERVATION DEPOSITS */}
          <section className="py-20 lg:py-28 px-6 md:px-12 bg-[#F7F8FA] border-b border-slate-100">
            <div className="max-w-7xl mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="grid lg:grid-cols-12 gap-12 items-center"
              >
                {/* Left Column: Text */}
                <div className="lg:col-span-6 text-left">
                  <span className="text-xs text-[#FF5A36] font-extrabold tracking-widest uppercase block mb-3">
                    REDUCE NO-SHOWS
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
                    Eliminate Dead Tables with Reservation Deposits
                  </h2>
                  <div className="text-slate-500 text-sm sm:text-base space-y-4 leading-relaxed">
                    <p>
                      Empty seats are lost revenue that your restaurant can never recover. When diners reserve tables and fail to show up, it hurts your staff, your food preparation, and your bottom line.
                    </p>
                    <p>
                      Set up secure booking parameters that require table deposits for peak hours, large parties, or special weekend events. You define the rules, GloBite collects the funds securely.
                    </p>
                    <p>
                      Protect your kitchen margins, reduce costly empty-seat rates, and build a dependable reservation book that transforms interest into confirmed physical attendance.
                    </p>
                  </div>
                </div>

                {/* Right Column: Visual Reservation Cards (Interactive) */}
                <div className="lg:col-span-6 flex justify-center">
                  <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-6 text-left">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">DINE-IN MANAGEMENT</span>
                        <h4 className="font-extrabold text-sm text-slate-900">Table Reservations Tonight</h4>
                      </div>
                      <span className="bg-[#FF5A36]/10 text-[#FF5A36] text-[8px] font-bold px-2 py-1 rounded">
                        REVENUE PROTECTED
                      </span>
                    </div>

                    <div className="space-y-3">
                      {reservations.map((res) => (
                        <div 
                          key={res.id} 
                          className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between"
                        >
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-slate-800">{res.guest}</span>
                              <span className="text-[9px] text-slate-400 font-mono">• Party of {res.size}</span>
                            </div>
                            <span className="text-[10px] text-slate-500 font-medium block mt-0.5">Time Slot: {res.time}</span>
                          </div>

                          <div>
                            {res.status === 'paid' ? (
                              <div className="flex items-center gap-1.5 text-emerald-600">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-extrabold uppercase">Paid (${res.amount})</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-extrabold text-amber-600 uppercase">Pending</span>
                                <button 
                                  onClick={() => handlePayDeposit(res.id)}
                                  className="bg-[#FF5A36] hover:bg-[#E04F2F] text-white text-[9px] font-extrabold px-2.5 py-1 rounded-lg transition-all shadow-xs cursor-pointer"
                                >
                                  Secure Deposit
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 bg-orange-50/50 border border-orange-100 p-3 rounded-xl text-center">
                      <p className="text-[10px] text-slate-600 leading-normal">
                        💡 <strong>Interactive Demo:</strong> Tap <span className="text-[#FF5A36] font-bold">Secure Deposit</span> to simulate a customer paying their reservation holding fee.
                      </p>
                    </div>

                  </div>
                </div>
              </motion.div>
            </div>
          </section>


          {/* 4.5 FEATURE SECTION 4 — WEBSITE BUILDER (REVERSED LAYOUT) */}
          <section id="website-builder" className="py-20 lg:py-28 px-6 md:px-12 bg-white border-b border-slate-100">
            <div className="max-w-7xl mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="grid lg:grid-cols-12 gap-12 items-center"
              >
                {/* Left Column: Visual (reversed) (Interactive customizer) */}
                <div className="lg:col-span-6 lg:order-1 flex justify-center">
                  <div className="w-full max-w-md bg-[#1E2430] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl p-5 text-left text-slate-300">
                    
                    {/* Simulator controls */}
                    <div className="flex flex-col gap-3 mb-5 border-b border-slate-800 pb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-[#FF5A36] font-extrabold uppercase tracking-wider">WEBSITE BUILDER CONTROLS</span>
                        <span className="text-[9px] text-slate-500">Real-time Preview</span>
                      </div>
                      
                      {/* Name editor */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Restaurant Name</label>
                        <input 
                          type="text" 
                          value={restaurantName} 
                          onChange={(e) => setRestaurantName(e.target.value)}
                          maxLength={25}
                          className="bg-[#12161F] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#FF5A36] font-semibold"
                        />
                      </div>

                      {/* Theme colors */}
                      <div className="flex gap-2.5 items-center">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Theme color:</span>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setBuilderTheme('orange')}
                            className={`w-4 h-4 rounded-full bg-[#FF5A36] border cursor-pointer ${builderTheme === 'orange' ? 'border-white ring-2 ring-[#FF5A36]' : 'border-transparent'}`} 
                          />
                          <button 
                            onClick={() => setBuilderTheme('emerald')}
                            className={`w-4 h-4 rounded-full bg-emerald-600 border cursor-pointer ${builderTheme === 'emerald' ? 'border-white ring-2 ring-emerald-600' : 'border-transparent'}`} 
                          />
                          <button 
                            onClick={() => setBuilderTheme('ocean')}
                            className={`w-4 h-4 rounded-full bg-sky-600 border cursor-pointer ${builderTheme === 'ocean' ? 'border-white ring-2 ring-sky-600' : 'border-transparent'}`} 
                          />
                          <button 
                            onClick={() => setBuilderTheme('royal')}
                            className={`w-4 h-4 rounded-full bg-violet-600 border cursor-pointer ${builderTheme === 'royal' ? 'border-white ring-2 ring-violet-600' : 'border-transparent'}`} 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Miniature Web Mockup */}
                    <div className="bg-white rounded-xl border border-slate-200 text-slate-800 p-4 min-h-[180px] flex flex-col justify-between">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-3">
                        <span className="font-extrabold text-xs text-slate-900 tracking-tight">{restaurantName || 'My Restaurant'}</span>
                        <span className={`w-2 h-2 rounded-full ${builderTheme === 'orange' ? 'bg-[#FF5A36]' : builderTheme === 'emerald' ? 'bg-emerald-600' : builderTheme === 'ocean' ? 'bg-sky-600' : 'bg-violet-600'}`} />
                      </div>

                      <div className="text-center py-4 relative">
                        <h5 className="font-black text-sm text-slate-800">Welcome to Delicious Dining</h5>
                        <p className="text-[8px] text-slate-400 max-w-xs mx-auto mt-1">Sourdough gourmet delicacies freshly crafted on demand daily.</p>
                        
                        <div className="mt-3 flex justify-center">
                          <span className={`text-[8px] font-bold text-white px-3 py-1.5 rounded shadow-sm ${themeStyles[builderTheme].bg}`}>
                            ORDER ONLINE NOW
                          </span>
                        </div>
                      </div>

                      <div className="text-slate-400 text-[8px] border-t border-slate-50 pt-2 text-center">
                        ✓ Search Engine Friendly • Fully Responsive Layout
                      </div>
                    </div>

                  </div>
                </div>

                {/* Right Column: Text (reversed) */}
                <div className="lg:col-span-6 lg:order-2 text-left">
                  <span className="text-xs text-[#FF5A36] font-extrabold tracking-widest uppercase block mb-3">
                    BUILD A STRONG ONLINE PRESENCE
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
                    A High-Converting Website Generated in Minutes
                  </h2>
                  <div className="text-slate-500 text-sm sm:text-base space-y-4 leading-relaxed">
                    <p>
                      Don't waste thousands of dollars hiring developers or fighting bloated generic page builder themes. GloBite auto-generates a gorgeous, blazing-fast, mobile-optimized restaurant website complete with integrated menu ordering.
                    </p>
                    <p>
                      Customize colors, add your custom domain, write your menu descriptions, and launch in minutes. No technical background or coding skills required. 
                    </p>
                    <p>
                      Tested analytics reveal that <strong className="font-bold text-slate-900">clients using our optimized websites saw up to 38% more online sales</strong> than those redirecting users to generic aggregators.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>


          {/* 4.6 FEATURE SECTION 5 — FAST SETUP */}
          <section className="py-20 lg:py-28 px-6 md:px-12 bg-[#F7F8FA] border-b border-slate-100">
            <div className="max-w-7xl mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="grid lg:grid-cols-12 gap-12 items-center"
              >
                {/* Left Column: Text */}
                <div className="lg:col-span-6 text-left">
                  <span className="text-xs text-[#FF5A36] font-extrabold tracking-widest uppercase block mb-3">
                    ACCELERATE YOUR SUCCESS
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
                    Take Your First Live Order Before Tonight's Dinner Rush
                  </h2>
                  
                  <div className="space-y-6 mt-8">
                    {/* Step 1 */}
                    <div className="flex gap-4">
                      <div className="bg-[#FF5A36] text-white font-black text-xs h-8 w-8 rounded-lg flex items-center justify-center shrink-0 shadow-md">
                        1
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base">Create Your GloBite Account</h4>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-normal">
                          Register your restaurant profile, upload logo files, and input base operating hours.
                        </p>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex gap-4">
                      <div className="bg-[#FF5A36] text-white font-black text-xs h-8 w-8 rounded-lg flex items-center justify-center shrink-0 shadow-md">
                        2
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base">Add the Smart Ordering Widget</h4>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-normal">
                          Embed the floating booking or ordering button on your current website with one simple line of code.
                        </p>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex gap-4">
                      <div className="bg-[#FF5A36] text-white font-black text-xs h-8 w-8 rounded-lg flex items-center justify-center shrink-0 shadow-md">
                        3
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base">Confirm Incoming Orders From the App</h4>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-normal">
                          Open the order-taking panel on your mobile device to receive and accept orders instantly.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Visual STEP TICKET CARD */}
                <div className="lg:col-span-6 flex justify-center">
                  <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-6 text-left relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#FF5A36]" />
                    
                    <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-400 font-extrabold block">LIVE TRACKING</span>
                        <h4 className="font-extrabold text-sm text-slate-900">Setup Completion Progress</h4>
                      </div>
                      <span className="text-xs font-black text-slate-700 bg-slate-100 px-2 py-1 rounded">
                        3 / 3 Steps
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                          <span className="text-xs font-extrabold text-slate-800">Account Configuration</span>
                        </div>
                        <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded uppercase">Success</span>
                      </div>

                      <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                          <span className="text-xs font-extrabold text-slate-800">Menu Upload & Embed Widget</span>
                        </div>
                        <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded uppercase">Success</span>
                      </div>

                      <div className="p-3 bg-[#FF5A36]/5 border border-[#FF5A36]/10 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="w-5 h-5 rounded-full bg-[#FF5A36] text-white text-[9px] font-black flex items-center justify-center animate-pulse">✓</span>
                          <span className="text-xs font-extrabold text-slate-800">Kitchen Terminal Active</span>
                        </div>
                        <span className="text-[9px] font-extrabold text-[#FF5A36] bg-[#FF5A36]/10 px-1.5 py-0.5 rounded uppercase animate-pulse">Live</span>
                      </div>
                    </div>

                  </div>
                </div>
              </motion.div>
            </div>
          </section>


          {/* 4.7 FEATURE SECTION 6 — MOBILE APP ORDERING (REVERSED LAYOUT) */}
          <section id="services" className="py-20 lg:py-28 px-6 md:px-12 bg-white border-b border-slate-100">
            <div className="max-w-7xl mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="grid lg:grid-cols-12 gap-12 items-center"
              >
                {/* Left Column: Visual (reversed) Interactive Kitchen Receiver Tablet Simulator */}
                <div className="lg:col-span-6 lg:order-1 flex justify-center w-full">
                  <div className="w-full max-w-sm bg-[#1E2430] border-4 border-slate-800 rounded-3xl p-4 shadow-2xl relative overflow-hidden">
                    
                    {/* Ringing Sound Indicator */}
                    <div className="absolute top-3 right-4 flex items-center gap-2">
                      <span className="text-[9px] text-slate-400 font-mono">Kitchen Bell</span>
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    </div>

                    {/* Ringing Terminal Screens */}
                    <AnimatePresence mode="wait">
                      {terminalState === 'ringing' && (
                        <motion.div 
                          key="ringing"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="bg-[#12161F] text-white p-5 rounded-2xl border border-red-500/30 text-center flex flex-col justify-between min-h-[220px]"
                        >
                          <div>
                            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-3 animate-bounce">
                              <Bell className="w-5 h-5 text-red-500" />
                            </div>
                            <span className="text-red-500 text-[10px] font-black uppercase tracking-widest block animate-pulse">Incoming Direct Order</span>
                            <h5 className="font-extrabold text-sm text-slate-100 mt-1">#ORD-4952 • David K.</h5>
                            <p className="text-[10px] text-slate-400 mt-1.5 leading-relaxed">
                              1x Spicy Rigatoni Vodka, 1x Crusty Garlic Slices, 1x Diet Kola Soda
                            </p>
                          </div>

                          <div className="mt-4 flex gap-2">
                            <button 
                              onClick={() => setTerminalState('accepted')}
                              className="bg-[#FF5A36] hover:bg-[#E04F2F] text-white font-extrabold text-[10px] tracking-wider px-4 py-2.5 rounded-lg flex-1 cursor-pointer transition-colors"
                            >
                              ACCEPT ORDER
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {terminalState === 'accepted' && (
                        <motion.div 
                          key="accepted"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="bg-[#12161F] text-white p-5 rounded-2xl border border-[#FF5A36]/30 text-center flex flex-col justify-between min-h-[220px]"
                        >
                          <div>
                            <span className="text-[#FF5A36] text-[9px] font-extrabold uppercase tracking-widest block">Configure Kitchen Timer</span>
                            <h5 className="font-extrabold text-sm text-slate-100 mt-1">Estimated Preparation Time</h5>
                            <p className="text-[10px] text-slate-400 mt-1 leading-normal">Select a delivery/pickup prep duration:</p>
                            
                            <div className="grid grid-cols-3 gap-2 mt-4">
                              {[15, 25, 40].map((t) => (
                                <button 
                                  key={t}
                                  onClick={() => setSelectedPrepTime(t)}
                                  className={`py-2 rounded-lg font-bold font-mono text-xs cursor-pointer border ${selectedPrepTime === t ? 'bg-[#FF5A36] text-white border-transparent' : 'bg-slate-800 border-slate-700 text-slate-300'}`}
                                >
                                  {t}m
                                </button>
                              ))}
                            </div>
                          </div>

                          <button 
                            onClick={() => setTerminalState('cooking')}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[10px] tracking-wider px-4 py-2.5 rounded-lg mt-4 cursor-pointer transition-colors uppercase"
                          >
                            CONFIRM {selectedPrepTime} MINUTES
                          </button>
                        </motion.div>
                      )}

                      {terminalState === 'cooking' && (
                        <motion.div 
                          key="cooking"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="bg-[#12161F] text-white p-5 rounded-2xl border border-emerald-500/30 text-center flex flex-col justify-between min-h-[220px]"
                        >
                          <div>
                            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-3">
                              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            </div>
                            <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest block">Kitchen Order Approved</span>
                            <p className="text-[11px] text-slate-200 mt-1 leading-relaxed">
                              Notification dispatched to customer! Cooking timer set to <strong>{selectedPrepTime} minutes</strong>.
                            </p>
                          </div>

                          <div className="mt-4 flex gap-2">
                            <button 
                              onClick={triggerRering}
                              className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[9px] px-3 py-2 rounded-lg flex-1 cursor-pointer"
                            >
                              Simulate Next Order
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </div>
                </div>

                {/* Right Column: Text (reversed) */}
                <div className="lg:col-span-6 lg:order-2 text-left">
                  <span className="text-xs text-[#FF5A36] font-extrabold tracking-widest uppercase block mb-3">
                    ENJOY ITS SIMPLICITY OF USE
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
                    Accept Orders Instantly From Your Mobile Screen
                  </h2>
                  <div className="text-slate-500 text-sm sm:text-base space-y-4 leading-relaxed">
                    <p>
                      Forget about expensive dedicated hardware or proprietary thermal printers. GloBite runs seamlessly on any tablet, iPad, or smartphone you already own.
                    </p>
                    <p>
                      When a diner places an order, the GloBite app chimes loudly to alert your staff. Tapping the screen lets you inspect the cart, make special kitchen modifications, set a precise cooking timer, and confirm.
                    </p>
                    <p>
                      Once accepted, the customer receives an automatic notification detailing when their meal will arrive or be ready for collection.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>


          {/* 4.8 FAQ SECTION */}
          <section className="px-6 py-20 lg:py-28 max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-xs text-[#FF5A36] font-extrabold tracking-widest uppercase block mb-3">
                GOT QUESTIONS?
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-slate-500 text-sm sm:text-base">
                Everything you need to know about our service tier structure and optional integrations.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: "What is an online ordering system and how does it work?",
                  a: "An online ordering system allows restaurant clients to browse your menu digitally, select dishes, customize options, choose delivery or pick-up slots, pay securely online, and transmit the order directly to your kitchen. GloBite does this seamlessly without charging commission percentages on any transaction."
                },
                {
                  q: "Why is GloBite the best choice?",
                  a: "GloBite keeps things honest. Our core ordering features (including digital widgets, table booking tools, menu hosting, and order confirmations) are entirely commission-free. We offset operations through optional premium tools like custom native app publications, Advanced Couponing builders, or integrated merchant payments."
                },
                {
                  q: "Do I need technical skills to set it up?",
                  a: "Not at all. If you can fill out simple form fields and upload photo images, you have all the skills needed to use GloBite. We auto-generate code blocks you can copy-paste onto WordPress, Wix, Squarespace, or Shopify in under 30 seconds."
                },
                {
                  q: "Can I accept orders without a website?",
                  a: "Yes! GloBite can generate a highly functional, search-optimized mini-website for your restaurant automatically, or you can share direct menu-ordering URLs on your social platforms like Instagram, WhatsApp, or Google Business profile."
                },
                {
                  q: "Can I sell through social media (Instagram/Google/WhatsApp)?",
                  a: "Absolutely. When you configure your GloBite menu, we issue a unique direct link. You can place this link inside your Instagram Bio, WhatsApp catalog, or the primary 'Order' button of your local Google Map profile."
                },
                {
                  q: "Can I use GloBite for QR code table ordering?",
                  a: "Yes, GloBite supports scan-to-order QR codes. You can export unique PDF QR codes for your physical tables. Diners scan the code, browse the digital menu, place orders directly to the kitchen, and pay from their phones."
                }
              ].map((f, i) => (
                <div key={i} className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-xs hover:border-slate-200 transition-all">
                  <button 
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                    className="w-full text-left px-6 py-5 font-bold text-slate-900 flex items-center justify-between hover:bg-slate-50/50 transition-colors focus:outline-none cursor-pointer"
                  >
                    <span className="text-xs sm:text-sm font-extrabold text-slate-800">{f.q}</span>
                    <span className="text-[#FF5A36] font-black text-lg ml-4">
                      {activeFaq === i ? "−" : "+"}
                    </span>
                  </button>
                  {activeFaq === i && (
                    <div className="px-6 pb-5 text-slate-500 text-xs sm:text-sm leading-relaxed border-t border-slate-50 pt-3 bg-slate-50/10">
                      {f.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>


          {/* 4.9 TESTIMONIALS SECTION */}
          <section className="bg-[#1E2430] text-slate-100 py-20 lg:py-28 px-6 md:px-12 relative">
            <div className="max-w-7xl mx-auto">
              
              <div className="text-center mb-16">
                <span className="text-xs text-[#FF5A36] font-extrabold tracking-widest uppercase block mb-3">
                  TRUSTED GLOBALLY
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
                  What Restaurants Are Saying
                </h2>
                <p className="text-slate-400 text-sm sm:text-base font-medium">
                  Over 4,250 restaurants and counting trust GloBite to handle daily volumes.
                </p>
              </div>

              {/* 4-card grid (2x2 on tablet, 1 col mobile) */}
              <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                
                {/* Testimonial 1 */}
                <div className="bg-[#12161F] border border-slate-800 p-6 rounded-2xl flex flex-col justify-between hover:border-[#FF5A36]/30 transition-all shadow-lg">
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic mb-6">
                    "We were paying over $1,200 a month in portal commissions. Swapping to GloBite was the best operational decision we've made. Setup took ten minutes, and now our customers order directly from our bio links. It's truly commission-free."
                  </p>
                  <div className="flex items-center gap-3">
                    <img 
                      src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=120&h=120&q=80" 
                      alt="Guillaume Foucault" 
                      className="w-10 h-10 rounded-full object-cover border border-slate-750"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-white">Guillaume Foucault</h4>
                      <p className="text-[10px] text-slate-500">Owner, Le Petit Bistro • Paris 🇫🇷</p>
                    </div>
                  </div>
                </div>

                {/* Testimonial 2 */}
                <div className="bg-[#12161F] border border-slate-800 p-6 rounded-2xl flex flex-col justify-between hover:border-[#FF5A36]/30 transition-all shadow-lg">
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic mb-6">
                    "We run 3 pizza stores. Keeping up with incoming tickets on various portal devices was a kitchen nightmare. Having everything land on a single tablet screen with GloBite has streamlined our food prep times massively. Highly recommended."
                  </p>
                  <div className="flex items-center gap-3">
                    <img 
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&h=120&q=80" 
                      alt="Antonio Moretti" 
                      className="w-10 h-10 rounded-full object-cover border border-slate-750"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-white">Antonio Moretti</h4>
                      <p className="text-[10px] text-slate-500">General Manager, Pizza Pronto • Milan 🇮🇹</p>
                    </div>
                  </div>
                </div>

                {/* Testimonial 3 */}
                <div className="bg-[#12161F] border border-slate-800 p-6 rounded-2xl flex flex-col justify-between hover:border-[#FF5A36]/30 transition-all shadow-lg">
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic mb-6">
                    "Charging table deposits on Friday and Saturday nights completely eliminated our no-shows. We used to lose two or three big tables every single weekend. Now, guests commit early, and our revenue is secured."
                  </p>
                  <div className="flex items-center gap-3">
                    <img 
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80" 
                      alt="Sarah Higgins" 
                      className="w-10 h-10 rounded-full object-cover border border-slate-750"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-white">Sarah Higgins</h4>
                      <p className="text-[10px] text-slate-500">Director, Hearthwood Grill • Chicago 🇺🇸</p>
                    </div>
                  </div>
                </div>

                {/* Testimonial 4 */}
                <div className="bg-[#12161F] border border-slate-800 p-6 rounded-2xl flex flex-col justify-between hover:border-[#FF5A36]/30 transition-all shadow-lg">
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic mb-6">
                    "The custom QR table-ordering has helped us save on floor staffing. Diners sit down, scan the code, place orders, and pay instantly. It's incredibly fast, and tips actually increased because the checkout process is so smooth."
                  </p>
                  <div className="flex items-center gap-3">
                    <img 
                      src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&h=120&q=80" 
                      alt="Koji Tanaka" 
                      className="w-10 h-10 rounded-full object-cover border border-slate-750"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-white">Koji Tanaka</h4>
                      <p className="text-[10px] text-slate-500">General Manager, Izakaya Hanabi • Tokyo 🇯🇵</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>


          {/* 4.10 FINAL CTA BAND */}
          <section className="bg-[#FAFBFD] py-16 lg:py-24 px-6 text-center border-t border-slate-100">
            <div className="max-w-3xl mx-auto">
              <span className="text-xs text-[#FF5A36] font-extrabold tracking-widest uppercase block mb-3">
                SECURE YOUR SALES TODAY
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
                Take Control of Your Kitchen Margins
              </h2>
              <p className="text-slate-500 mb-8 max-w-lg mx-auto text-xs sm:text-sm leading-relaxed">
                Stop losing up to 30% of your transaction totals to aggregators. Set up direct, commission-free online food ordering in minutes.
              </p>
              
              <button 
                onClick={() => onNavigate('signup')}
                className="bg-[#FF5A36] hover:bg-[#E04F2F] text-white font-extrabold text-xs sm:text-sm px-8 py-4 rounded-xl shadow-lg shadow-[#FF5A36]/10 hover:-translate-y-0.5 transition-all active:scale-95 cursor-pointer"
              >
                Launch Your Free Storefront Now
              </button>
            </div>
          </section>

        </div>
      )}


      {/* SUBPAGE 2: PRICING PAGE */}
      {subPage === 'pricing' && (
        <div className="animate-fade-in">
          
          {/* 5.1 HERO */}
          <section className="bg-white border-b border-slate-100 py-16 lg:py-24 px-6 text-center relative overflow-hidden">
            <div className="max-w-4xl mx-auto relative z-10">
              
              {/* Pill badge */}
              <div className="inline-flex items-center gap-2 bg-[#FF5A36]/5 border border-[#FF5A36]/15 rounded-full px-3.5 py-1.5 text-[10px] font-bold text-[#FF5A36] uppercase tracking-wider mb-6">
                Transparent & Predictable
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-tight mb-4">
                Simple Pricing, No Surprises.
              </h1>
              <p className="text-slate-500 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
                Find out exactly what it costs to operate your direct online ordering system. Run your restaurant without paying commission fees per order.
              </p>

              <div className="w-16 h-[3px] bg-[#FF5A36] mx-auto mt-6" />
            </div>
          </section>


          {/* 5.2 BENEFITS STRIP (2X4 Checkmark Grid) */}
          <section className="py-12 px-6 bg-[#F7F8FA] border-b border-slate-100">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white border border-slate-100 rounded-2xl shadow-md p-6 sm:p-8">
                <div className="grid sm:grid-cols-2 gap-4 md:gap-6 text-left">
                  {[
                    "Unlimited customer orders processed",
                    "Support for unlimited physical locations",
                    "Zero commission percentages per transaction",
                    "No mandatory flat monthly base fees",
                    "No long-term contracts or commitment sheets",
                    "No credit card required to open account",
                    "No hidden setup or startup fees",
                    "No unexpected billing or maintenance costs"
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="bg-emerald-50 rounded-full p-1 text-emerald-600 shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-slate-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>


          {/* 5.3 "INCLUDED IN FREE PLAN" GRID (25 cards) */}
          <section className="py-16 lg:py-24 px-6 md:px-12 bg-white border-b border-slate-100">
            <div className="max-w-7xl mx-auto">
              
              <div className="text-center mb-16 max-w-2xl mx-auto">
                <span className="text-xs text-[#FF5A36] font-extrabold tracking-widest uppercase block mb-3">
                  POWERFUL CORE FEATURES
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Everything Included in Your Free Account
                </h2>
                <p className="text-slate-500 text-xs sm:text-sm mt-3">
                  Our core platform delivers everything needed to run professional, direct-to-consumer online ordering forever.
                </p>
              </div>

              {/* ~20 feature cards (25 cards implemented) */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                
                {/* 1. Website Ordering Widget */}
                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs hover:border-[#FF5A36]/30 hover:shadow-md transition-all text-left">
                  <div className="bg-slate-50 w-10 h-10 rounded-xl flex items-center justify-center mb-4 border border-slate-100">
                    <Layers className="w-5 h-5 text-[#FF5A36]" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-2">Website Ordering Widget</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Embed a responsive menu with lightning-fast performance on any CMS.
                  </p>
                </div>

                {/* 2. Social & Link Ordering */}
                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs hover:border-[#FF5A36]/30 hover:shadow-md transition-all text-left">
                  <div className="bg-slate-50 w-10 h-10 rounded-xl flex items-center justify-center mb-4 border border-slate-100">
                    <Globe className="w-5 h-5 text-[#FF5A36]" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-2">Social & Link Ordering</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Share custom direct-order links via Instagram, WhatsApp, or Google maps.
                  </p>
                </div>

                {/* 3. Mobile Ordering */}
                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs hover:border-[#FF5A36]/30 hover:shadow-md transition-all text-left">
                  <div className="bg-slate-50 w-10 h-10 rounded-xl flex items-center justify-center mb-4 border border-slate-100">
                    <Smartphone className="w-5 h-5 text-[#FF5A36]" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-2">Mobile Ordering</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    High-performance smartphone menu layout designed to maximize basket size.
                  </p>
                </div>

                {/* 4. Real-time Order Confirmation */}
                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs hover:border-[#FF5A36]/30 hover:shadow-md transition-all text-left">
                  <div className="bg-slate-50 w-10 h-10 rounded-xl flex items-center justify-center mb-4 border border-slate-100">
                    <Bell className="w-5 h-5 text-[#FF5A36]" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-2">Real-time Confirmation</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Receive and accept order alerts instantly on your tablet or smartphone receiver.
                  </p>
                </div>

                {/* 5. Table Reservation Widget */}
                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs hover:border-[#FF5A36]/30 hover:shadow-md transition-all text-left">
                  <div className="bg-slate-50 w-10 h-10 rounded-xl flex items-center justify-center mb-4 border border-slate-100">
                    <Calendar className="w-5 h-5 text-[#FF5A36]" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-2">Table Reservation Widget</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Allow physical diners to book tables online without paying external cover fees.
                  </p>
                </div>

                {/* 6. Order Ahead with Reservation */}
                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs hover:border-[#FF5A36]/30 hover:shadow-md transition-all text-left">
                  <div className="bg-slate-50 w-10 h-10 rounded-xl flex items-center justify-center mb-4 border border-slate-100">
                    <Clock className="w-5 h-5 text-[#FF5A36]" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-2">Order Ahead with Booking</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Let dining guests select and pay for food when reserving a physical table.
                  </p>
                </div>

                {/* 7. Vacation / Pause Mode */}
                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs hover:border-[#FF5A36]/30 hover:shadow-md transition-all text-left">
                  <div className="bg-slate-50 w-10 h-10 rounded-xl flex items-center justify-center mb-4 border border-slate-100">
                    <RefreshCw className="w-5 h-5 text-[#FF5A36]" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-2">Vacation / Pause Mode</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Temporarily pause or adjust ordering hours during holidays or busy kitchen rushes.
                  </p>
                </div>

                {/* 8. Out-of-Stock Marking */}
                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs hover:border-[#FF5A36]/30 hover:shadow-md transition-all text-left">
                  <div className="bg-slate-50 w-10 h-10 rounded-xl flex items-center justify-center mb-4 border border-slate-100">
                    <AlertCircle className="w-5 h-5 text-[#FF5A36]" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-2">Out-of-Stock Marking</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Instantly hide sold-out dishes from your live menu with a single tap.
                  </p>
                </div>

                {/* 9. Contactless Delivery & Pickup */}
                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs hover:border-[#FF5A36]/30 hover:shadow-md transition-all text-left">
                  <div className="bg-slate-50 w-10 h-10 rounded-xl flex items-center justify-center mb-4 border border-slate-100">
                    <Shield className="w-5 h-5 text-[#FF5A36]" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-2">Contactless Delivery & Pickup</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Keep operations safe with curbside drop-offs and touchless pickups.
                  </p>
                </div>

                {/* 10. Free Menu Photo Stock */}
                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs hover:border-[#FF5A36]/30 hover:shadow-md transition-all text-left">
                  <div className="bg-slate-50 w-10 h-10 rounded-xl flex items-center justify-center mb-4 border border-slate-100">
                    <Sparkles className="w-5 h-5 text-[#FF5A36]" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-2">Free Menu Photo Stock</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Access high-resolution, licensing-free culinary photos to beautify your menu.
                  </p>
                </div>

                {/* 11. Scheduled Orders */}
                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs hover:border-[#FF5A36]/30 hover:shadow-md transition-all text-left">
                  <div className="bg-slate-50 w-10 h-10 rounded-xl flex items-center justify-center mb-4 border border-slate-100">
                    <Calendar className="w-5 h-5 text-[#FF5A36]" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-2">Scheduled Orders</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Allow customers to place orders days or hours in advance.
                  </p>
                </div>

                {/* 12. Cancel & Reject with Reason */}
                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs hover:border-[#FF5A36]/30 hover:shadow-md transition-all text-left">
                  <div className="bg-slate-50 w-10 h-10 rounded-xl flex items-center justify-center mb-4 border border-slate-100">
                    <MessageSquare className="w-5 h-5 text-[#FF5A36]" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-2">Cancel & Reject with Reason</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Easily reject orders and notify customers with automatic pre-set explanations.
                  </p>
                </div>

                {/* 13. Shared Discovery App */}
                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs hover:border-[#FF5A36]/30 hover:shadow-md transition-all text-left">
                  <div className="bg-slate-50 w-10 h-10 rounded-xl flex items-center justify-center mb-4 border border-slate-100">
                    <SearchIcon className="w-5 h-5 text-[#FF5A36]" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-2">Shared Discovery App</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Gain visibility through our local diner listing search platform at no cost.
                  </p>
                </div>

                {/* 14. Reporting Dashboard */}
                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs hover:border-[#FF5A36]/30 hover:shadow-md transition-all text-left">
                  <div className="bg-slate-50 w-10 h-10 rounded-xl flex items-center justify-center mb-4 border border-slate-100">
                    <TrendingUp className="w-5 h-5 text-[#FF5A36]" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-2">Reporting Dashboard</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Track sales volume, average order values, and customer retention metrics.
                  </p>
                </div>

                {/* 15. Promo & Coupon Builder */}
                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs hover:border-[#FF5A36]/30 hover:shadow-md transition-all text-left">
                  <div className="bg-slate-50 w-10 h-10 rounded-xl flex items-center justify-center mb-4 border border-slate-100">
                    <Award className="w-5 h-5 text-[#FF5A36]" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-2">Promo & Coupon Builder</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Design custom discounts, cart value tier rules, and percentage savings.
                  </p>
                </div>

                {/* 16. First-time Customer Promo */}
                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs hover:border-[#FF5A36]/30 hover:shadow-md transition-all text-left">
                  <div className="bg-slate-50 w-10 h-10 rounded-xl flex items-center justify-center mb-4 border border-slate-100">
                    <Heart className="w-5 h-5 text-[#FF5A36]" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-2">First-time Customer Promo</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Automatically welcome new diners with a custom introductory discount rule.
                  </p>
                </div>

                {/* 17. Flyer Generator */}
                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs hover:border-[#FF5A36]/30 hover:shadow-md transition-all text-left">
                  <div className="bg-slate-50 w-10 h-10 rounded-xl flex items-center justify-center mb-4 border border-slate-100">
                    <FileText className="w-5 h-5 text-[#FF5A36]" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-2">Flyer Generator</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Auto-create high-resolution print-ready flyers containing your custom QR order code.
                  </p>
                </div>

                {/* 18. Customer Invitations */}
                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs hover:border-[#FF5A36]/30 hover:shadow-md transition-all text-left">
                  <div className="bg-slate-50 w-10 h-10 rounded-xl flex items-center justify-center mb-4 border border-slate-100">
                    <Users className="w-5 h-5 text-[#FF5A36]" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-2">Customer Invitations</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Re-engage past diners with custom-tailored discount incentives automatically.
                  </p>
                </div>

                {/* 19. SEO & Site Health Checker */}
                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs hover:border-[#FF5A36]/30 hover:shadow-md transition-all text-left">
                  <div className="bg-slate-50 w-10 h-10 rounded-xl flex items-center justify-center mb-4 border border-slate-100">
                    <CheckCircle2 className="w-5 h-5 text-[#FF5A36]" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-2">SEO & Site Health Checker</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Verify how well search engines list your menu with integrated health audits.
                  </p>
                </div>

                {/* 20. Google Business Checker */}
                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs hover:border-[#FF5A36]/30 hover:shadow-md transition-all text-left">
                  <div className="bg-slate-50 w-10 h-10 rounded-xl flex items-center justify-center mb-4 border border-slate-100">
                    <MapPin className="w-5 h-5 text-[#FF5A36]" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-2">Google Business Checker</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Monitor your local presence and ensure ordering links are correctly synced.
                  </p>
                </div>

                {/* 21. Third-party Integrations */}
                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs hover:border-[#FF5A36]/30 hover:shadow-md transition-all text-left">
                  <div className="bg-slate-50 w-10 h-10 rounded-xl flex items-center justify-center mb-4 border border-slate-100">
                    <Laptop className="w-5 h-5 text-[#FF5A36]" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-2">Third-party Integrations</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Sync easily with local courier fleets, logistics providers, and basic routing APIs.
                  </p>
                </div>

                {/* 22. Multi-template Receipt Editor */}
                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs hover:border-[#FF5A36]/30 hover:shadow-md transition-all text-left">
                  <div className="bg-slate-50 w-10 h-10 rounded-xl flex items-center justify-center mb-4 border border-slate-100">
                    <Printer className="w-5 h-5 text-[#FF5A36]" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-2">Receipt Editor</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Format beautiful printed receipt layouts with custom footers and greeting cards.
                  </p>
                </div>

                {/* 23. Custom Delivery Zone Drawing */}
                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs hover:border-[#FF5A36]/30 hover:shadow-md transition-all text-left">
                  <div className="bg-slate-50 w-10 h-10 rounded-xl flex items-center justify-center mb-4 border border-slate-100">
                    <Map className="w-5 h-5 text-[#FF5A36]" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-2">Custom Delivery Zones</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Define delivery radii and dynamic minimum orders using an interactive polygon map.
                  </p>
                </div>

                {/* 24. QR Code Dine-in Menu */}
                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs hover:border-[#FF5A36]/30 hover:shadow-md transition-all text-left">
                  <div className="bg-slate-50 w-10 h-10 rounded-xl flex items-center justify-center mb-4 border border-slate-100">
                    <Utensils className="w-5 h-5 text-[#FF5A36]" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-2">QR Code Dine-in Menu</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Place scan-to-order QR codes on tables to let physical guests order direct.
                  </p>
                </div>

                {/* 25. End-of-day Email Report */}
                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs hover:border-[#FF5A36]/30 hover:shadow-md transition-all text-left">
                  <div className="bg-slate-50 w-10 h-10 rounded-xl flex items-center justify-center mb-4 border border-slate-100">
                    <Receipt className="w-5 h-5 text-[#FF5A36]" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-2">Daily Closing Reports</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Receive detailed daily closing statistics directly to your operations inbox.
                  </p>
                </div>

              </div>

            </div>
          </section>


          {/* 5.4 "OPTIONAL PAID ADD-ONS" SECTION (4-card row) */}
          <section className="py-16 lg:py-24 px-6 md:px-12 bg-[#F7F8FA] border-b border-slate-100">
            <div className="max-w-7xl mx-auto">
              
              <div className="text-center mb-16 max-w-2xl mx-auto">
                <span className="text-xs text-[#FF5A36] font-extrabold tracking-widest uppercase block mb-3">
                  EXPAND YOUR CAPABILITIES
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Optional Premium Add-ons
                </h2>
                <p className="text-slate-500 text-xs sm:text-sm mt-3">
                  Subscribe to powerful specialized services on flat predictable rates as your operations grow.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 text-left">
                
                {/* Add-on 1 */}
                <div className="bg-white border border-slate-200/60 p-6 rounded-2xl shadow-md flex flex-col justify-between relative overflow-hidden">
                  <div>
                    <div className="bg-[#FF5A36]/10 w-10 h-10 rounded-xl flex items-center justify-center mb-4">
                      <Laptop className="w-5 h-5 text-[#FF5A36]" />
                    </div>
                    <h4 className="font-extrabold text-sm sm:text-base text-slate-900 mb-2">Restaurant POS System</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Seamlessly sync incoming orders, kitchen ticket workflows, and financial sheets with our POS console.
                    </p>
                  </div>
                  <div className="mt-6 border-t border-slate-100 pt-4">
                    <span className="text-2xl font-black text-slate-900">$49</span>
                    <span className="text-[10px] text-slate-400 font-bold block">/mo • flat rate</span>
                  </div>
                </div>

                {/* Add-on 2 */}
                <div className="bg-white border border-slate-200/60 p-6 rounded-2xl shadow-md flex flex-col justify-between relative overflow-hidden">
                  <div>
                    <div className="bg-[#FF5A36]/10 w-10 h-10 rounded-xl flex items-center justify-center mb-4">
                      <CreditCard className="w-5 h-5 text-[#FF5A36]" />
                    </div>
                    <h4 className="font-extrabold text-sm sm:text-base text-slate-900 mb-2">Online Payments</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Accept credit cards and digital wallets natively with Apple Pay and Google Pay during checkout.
                    </p>
                  </div>
                  <div className="mt-6 border-t border-slate-100 pt-4">
                    <span className="text-2xl font-black text-slate-900">$29</span>
                    <span className="text-[10px] text-slate-400 font-bold block">/mo • flat rate</span>
                  </div>
                </div>

                {/* Add-on 3 */}
                <div className="bg-white border border-slate-200/60 p-6 rounded-2xl shadow-md flex flex-col justify-between relative overflow-hidden">
                  <div>
                    <div className="bg-[#FF5A36]/10 w-10 h-10 rounded-xl flex items-center justify-center mb-4">
                      <Calendar className="w-5 h-5 text-[#FF5A36]" />
                    </div>
                    <h4 className="font-extrabold text-sm sm:text-base text-slate-900 mb-2">Booking Deposits</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Safeguard table booking revenue by collecting security deposits to prevent weekend empty tables.
                    </p>
                  </div>
                  <div className="mt-6 border-t border-slate-100 pt-4">
                    <span className="text-2xl font-black text-slate-900">$1.50</span>
                    <span className="text-[10px] text-slate-400 font-bold block">/booking • accepted only</span>
                  </div>
                </div>

                {/* Add-on 4 */}
                <div className="bg-white border border-slate-200/60 p-6 rounded-2xl shadow-md flex flex-col justify-between relative overflow-hidden">
                  <div>
                    <div className="bg-[#FF5A36]/10 w-10 h-10 rounded-xl flex items-center justify-center mb-4">
                      <Award className="w-5 h-5 text-[#FF5A36]" />
                    </div>
                    <h4 className="font-extrabold text-sm sm:text-base text-slate-900 mb-2">Advanced Promos</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Unlock advanced discount flows, automated push triggers, and targeted customer segment invites.
                    </p>
                  </div>
                  <div className="mt-6 border-t border-slate-100 pt-4">
                    <span className="text-2xl font-black text-slate-900">$19</span>
                    <span className="text-[10px] text-slate-400 font-bold block">/mo • flat rate</span>
                  </div>
                </div>

              </div>

            </div>
          </section>


          {/* 5.5 "WHAT'S THE CATCH?" SECTION */}
          <section className="py-16 lg:py-24 px-6 max-w-3xl mx-auto text-left">
            <h3 className="text-2xl font-black text-slate-900 mb-6 border-b border-slate-100 pb-4">
              How is GloBite completely commission-free? What's the catch?
            </h3>
            
            <div className="text-slate-500 text-sm sm:text-base space-y-4 leading-relaxed font-medium">
              <p>
                The explanation is perfectly straightforward. Our core online food ordering application (which includes menu hosting, client widgets, table reservation books, and instant ringing terminals) is, and always will be, free of charge. We do not extract percentage commissions from your hard-earned orders because we believe restaurants should retain 100% of their operational margins.
              </p>
              <p>
                We sustain operations exclusively through our optional premium products. If your restaurant requires an advanced POS terminal integration, custom native Android & iOS app builds, or targeted marketing automation kits, you can choose to subscribe to those specific modules on flat monthly fees. If you don't need them, you can operate your GloBite system indefinitely without ever paying us a single penny.
              </p>
            </div>
          </section>


          {/* 5.6 DEMO CTA BAND (Video thumbnail card) */}
          <section className="py-16 lg:py-24 px-6 bg-white text-center border-t border-slate-100">
            <div className="max-w-4xl mx-auto">
              
              <div className="text-center mb-10 max-w-xl mx-auto">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">See GloBite in Action</h3>
                <p className="text-slate-500 text-xs sm:text-sm">Take a three-minute tour of our kitchen terminal software and order capture flows.</p>
              </div>

              {/* Video card placeholder */}
              <div className="bg-slate-950 rounded-2xl overflow-hidden aspect-video relative max-w-2xl mx-auto shadow-2xl border border-slate-800 flex items-center justify-center group cursor-pointer">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center opacity-45 group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                
                {/* Play button */}
                <div className="bg-[#FF5A36] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl relative z-10 group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 fill-current ml-0.5" />
                </div>

                <div className="absolute bottom-6 left-6 text-left z-10">
                  <span className="text-[#FF5A36] text-[10px] font-black uppercase tracking-widest block">GloBite Platform Overview</span>
                  <h4 className="font-extrabold text-sm sm:text-base text-white mt-1">Accepting Orders in Under 3 Minutes</h4>
                </div>
              </div>

            </div>
          </section>

        </div>
      )}


      {/* 3. GLOBAL FOOTER */}
      <footer className="bg-[#12161F] text-slate-400 py-16 px-6 md:px-12 border-t border-slate-900 text-left relative z-10">
        <div className="max-w-7xl mx-auto">
          
          {/* Link Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            
            {/* Column 1 */}
            <div>
              <span className="block font-extrabold text-white text-[11px] tracking-widest uppercase mb-4">
                Food Ordering
              </span>
              <ul className="space-y-2.5 text-xs">
                <li><button onClick={() => handleScrollTo('features')} className="hover:text-white transition-colors cursor-pointer text-left">Overview</button></li>
                <li><span className="text-slate-500">QR Code Ordering</span></li>
                <li><span className="text-slate-500">Website Ordering</span></li>
                <li><span className="text-slate-500">Social Ordering</span></li>
                <li><button onClick={() => handleScrollTo('features')} className="hover:text-white transition-colors cursor-pointer text-left">How It Works</button></li>
              </ul>
            </div>

            {/* Column 2 */}
            <div>
              <span className="block font-extrabold text-white text-[11px] tracking-widest uppercase mb-4">
                Restaurant Services
              </span>
              <ul className="space-y-2.5 text-xs">
                <li><button onClick={() => handleScrollTo('services')} className="hover:text-white transition-colors cursor-pointer text-left">Overview</button></li>
                <li><span className="text-slate-500">Scheduled Orders</span></li>
                <li><span className="text-slate-500">Food Delivery</span></li>
                <li><span className="text-slate-500">Takeaway Options</span></li>
                <li><button onClick={() => handleScrollTo('features')} className="hover:text-white transition-colors cursor-pointer text-left">Table Reservations</button></li>
                <li><span className="text-slate-500">Hotel In-Room Ordering</span></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <span className="block font-extrabold text-white text-[11px] tracking-widest uppercase mb-4">
                Marketing & Sales
              </span>
              <ul className="space-y-2.5 text-xs">
                <li><span className="text-slate-500">Platform Videos</span></li>
                <li><span className="text-slate-500">Marketing Tools</span></li>
                <li><button onClick={() => handleScrollTo('website-builder')} className="hover:text-white transition-colors cursor-pointer text-left">Website Generator</button></li>
                <li><span className="text-slate-500">How to Sell Direct</span></li>
                <li><span className="text-slate-500">Industry Blog</span></li>
              </ul>
            </div>

            {/* Column 4 */}
            <div>
              <span className="block font-extrabold text-white text-[11px] tracking-widest uppercase mb-4">
                Partner & Support
              </span>
              <ul className="space-y-2.5 text-xs">
                <li><span className="text-slate-500">Partner Program</span></li>
                <li><span className="text-slate-500">Direct Ordering API</span></li>
                <li><button onClick={() => handleScrollTo('features')} className="hover:text-white transition-colors cursor-pointer text-left">System FAQ</button></li>
                <li><span className="text-slate-500">Customer Testimonials</span></li>
              </ul>
            </div>

          </div>

          <div className="h-px bg-slate-800 my-10" />

          {/* Language Selector + secondary links */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800">
            
            {/* Language Selector pill */}
            <div className="inline-flex items-center gap-2 bg-[#1E2430] border border-slate-800 rounded-full px-4 py-2 text-xs font-bold text-slate-300">
              <Globe className="w-3.5 h-3.5 text-[#FF5A36]" />
              <span>English (United States)</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </div>

            {/* Secondary links */}
            <div className="flex flex-wrap justify-center gap-6 text-xs font-bold text-slate-400">
              <span className="hover:text-white cursor-pointer transition-colors">Contact</span>
              <span className="hover:text-white cursor-pointer transition-colors">About Us</span>
              <span className="hover:text-white cursor-pointer transition-colors">Press Room</span>
              <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-white cursor-pointer transition-colors">Terms of Use</span>
            </div>

            {/* Social Icons (5 circular elements) */}
            <div className="flex items-center gap-3">
              {[
                { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/globite' },
                { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/globite' },
                { name: 'Linkedin', icon: Linkedin, href: 'https://linkedin.com/company/globite' },
                { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/globite' },
                { name: 'Youtube', icon: Youtube, href: 'https://youtube.com/globite' }
              ].map((sc) => {
                const IconComponent = sc.icon;
                return (
                  <a 
                    key={sc.name}
                    href={sc.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-[#1E2430] hover:bg-[#FF5A36] hover:text-white text-slate-400 border border-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                    title={sc.name}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                  </a>
                );
              })}
            </div>

          </div>

          {/* Bottom Bar copyright & simple text description */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs text-slate-500 text-center sm:text-left">
            <p className="max-w-md">
              GloBite is an independent direct-to-consumer restaurant software engine providing online ordering, booking widgets, and mobile receivers with zero commission rates.
            </p>
            <p className="shrink-0">
              © 2026 GloBite Inc. All Rights Reserved.
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
}

// Custom search icon workaround
function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
