import React, { useState } from 'react';
import { MenuItem, CartItem, Extra, VariantOption, Order } from '../types';
import { 
  ShoppingBag, Trash2, MapPin, Phone, Mail, Clock, ShieldCheck, 
  ChevronRight, ArrowLeft, Star, Heart, Check, Plus, Minus, AlertCircle, Sparkles
} from 'lucide-react';

interface OrderingPortalProps {
  menuItems: MenuItem[];
  categories: string[];
  activeLocation: string;
  locations: { id: string; name: string; address: string }[];
  onPlaceOrder: (order: Order) => void;
  onClose: () => void;
}

export default function OrderingPortal({ 
  menuItems, 
  categories, 
  activeLocation, 
  locations,
  onPlaceOrder,
  onClose 
}: OrderingPortalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [checkoutMode, setCheckoutMode] = useState<boolean>(false);
  const [orderConfirmed, setOrderConfirmed] = useState<boolean>(false);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  
  // Custom topping helper state
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<VariantOption | undefined>(undefined);
  const [selectedExtras, setSelectedExtras] = useState<Extra[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Delivery details
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [custName, setCustName] = useState('John Carter');
  const [custEmail, setCustEmail] = useState('john.carter@gmail.com');
  const [custPhone, setCustPhone] = useState('+1 (555) 890-2345');
  const [custAddress, setCustAddress] = useState('240 S Grand Ave, Los Angeles, CA 90012');
  const [deliveryZoneFee, setDeliveryZoneFee] = useState(3.50);
  const [payMethod, setPayMethod] = useState<'cash' | 'card' | 'online'>('online');

  const filteredItems = selectedCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

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

    // Build unique ID for cart combo
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
      const existingIdx = prev.findIndex(item => item.id === comboId);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      }
      return [...prev, newCartItem];
    });

    setCustomizingItem(null);
  };

  const updateQuantity = (id: string, amount: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const nextQ = item.quantity + amount;
        return nextQ > 0 ? { ...item, quantity: nextQ } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const calculateSubtotal = () => {
    return cart.reduce((acc, curr) => {
      const varMod = curr.selectedVariant ? curr.selectedVariant.option.priceModifier : 0;
      const extTotal = curr.selectedExtras.reduce((sum, e) => sum + e.price, 0);
      return acc + ((curr.menuItem.price + varMod + extTotal) * curr.quantity);
    }, 0);
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const sub = calculateSubtotal();
    const finalTotal = sub + (deliveryType === 'delivery' ? deliveryZoneFee : 0);

    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: custName,
      customerEmail: custEmail,
      customerPhone: custPhone,
      items: cart.map(item => ({
        name: item.menuItem.name,
        quantity: item.quantity,
        price: item.menuItem.price + (item.selectedVariant?.option.priceModifier || 0) + item.selectedExtras.reduce((acc, c) => acc + c.price, 0),
        variantName: item.selectedVariant?.name,
        variantOptionName: item.selectedVariant?.option.name,
        extrasNames: item.selectedExtras.map(e => e.name)
      })),
      total: finalTotal,
      status: 'pending',
      type: deliveryType,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      address: deliveryType === 'delivery' ? custAddress : undefined,
      deliveryFee: deliveryType === 'delivery' ? deliveryZoneFee : undefined,
      paymentMethod: payMethod
    };

    onPlaceOrder(newOrder);
    setActiveOrder(newOrder);
    setCart([]);
    setCheckoutMode(false);
    setOrderConfirmed(true);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex justify-end font-sans transition-opacity">
      <div className="bg-slate-50 w-full max-w-3xl h-full flex flex-col relative text-left shadow-2xl animate-slide-in overflow-hidden">
        
        {/* Portal Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button 
              id="close-store-portal-btn"
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <span className="bg-orange-100 text-orange-800 text-[9px] font-extrabold tracking-widest uppercase px-2 py-0.5 rounded-full">SIMULATION PORTAL</span>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">{locations.find(l => l.id === activeLocation)?.name || 'Urban Kitchen'} Storefront</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-emerald-100 text-emerald-800 font-bold text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              Direct Channel Live
            </div>
          </div>
        </div>

        {/* Content Body */}
        {!orderConfirmed ? (
          <div className="flex-1 flex overflow-hidden">
            
            {/* Products & Main Menu area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Cover Mockup */}
              <div className="relative h-44 rounded-2xl overflow-hidden shadow-md">
                <img 
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80" 
                  alt="Restaurant cover" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h2 className="text-2xl font-extrabold">{locations.find(l => l.id === activeLocation)?.name || 'Urban Kitchen'}</h2>
                  <p className="text-xs text-slate-300 flex items-center gap-2 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-orange-400" /> {locations.find(l => l.id === activeLocation)?.address || 'Downtown Blvd'}
                  </p>
                </div>
              </div>

              {/* Delivery / Pickup Banner */}
              <div className="bg-white border border-slate-200 rounded-xl p-3 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span className="text-xs font-semibold text-slate-600">Average Preparation: <strong className="text-slate-950">15 - 25 mins</strong></span>
                </div>
                <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200/50">
                  <button 
                    id="store-delivery-toggle"
                    onClick={() => setDeliveryType('delivery')}
                    className={`text-xs font-bold px-3 py-1.5 rounded-md transition-colors ${deliveryType === 'delivery' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                  >
                    Delivery
                  </button>
                  <button 
                    id="store-pickup-toggle"
                    onClick={() => setDeliveryType('pickup')}
                    className={`text-xs font-bold px-3 py-1.5 rounded-md transition-colors ${deliveryType === 'pickup' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                  >
                    Pickup
                  </button>
                </div>
              </div>

              {/* Categories slider */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                <button 
                  id="cat-all-store"
                  onClick={() => setSelectedCategory('All')}
                  className={`text-xs font-bold px-4 py-2 rounded-full border shrink-0 transition-colors ${selectedCategory === 'All' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                >
                  All Items
                </button>
                {categories.map((c, idx) => (
                  <button 
                    id={`cat-btn-store-${idx}`}
                    key={idx}
                    onClick={() => setSelectedCategory(c)}
                    className={`text-xs font-bold px-4 py-2 rounded-full border shrink-0 transition-colors ${selectedCategory === c ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              {/* Item Cards list */}
              <div className="grid sm:grid-cols-2 gap-4">
                {filteredItems.map(item => (
                  <div key={item.id} className="bg-white border border-slate-200/80 hover:border-orange-200 rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:shadow transition-all group">
                    <div className="flex gap-4">
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-1.5 mb-1">
                          <h3 className="font-bold text-slate-900 text-sm">{item.name}</h3>
                          {item.isPopular && (
                            <span className="bg-amber-100 text-amber-800 text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded">POPULAR</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">{item.description}</p>
                      </div>
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-20 h-20 object-cover rounded-xl shadow-sm"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="flex justify-between items-center border-t border-slate-100 pt-3 mt-2">
                      <span className="font-extrabold text-slate-900">${item.price.toFixed(2)}</span>
                      <button 
                        id={`btn-add-item-${item.id}`}
                        onClick={() => openCustomization(item)}
                        className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-extrabold px-3 py-2 rounded-xl flex items-center gap-1 shadow-sm transition-transform active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5" /> Customize
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* Shopping Cart Side panel inside simulation */}
            <div className="w-80 bg-white border-l border-slate-200 flex flex-col">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <span className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-orange-600" /> My Cart ({cart.reduce((a,c) => a + c.quantity, 0)})
                </span>
                {cart.length > 0 && (
                  <button 
                    id="clear-store-cart"
                    onClick={() => setCart([])}
                    className="text-[10px] font-bold text-slate-400 hover:text-red-500 transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 p-4">
                    <div className="bg-slate-50 p-4 rounded-full border border-slate-100 mb-3 text-slate-300">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <p className="text-xs font-bold text-slate-600">Your basket is empty</p>
                    <p className="text-[11px] text-slate-400 mt-1">Pick food on the left and customize your preferences.</p>
                  </div>
                ) : (
                  cart.map((item, idx) => {
                    const varMod = item.selectedVariant ? item.selectedVariant.option.priceModifier : 0;
                    const extrasTotal = item.selectedExtras.reduce((sum, e) => sum + e.price, 0);
                    const itemUnitTotal = item.menuItem.price + varMod + extrasTotal;

                    return (
                      <div key={idx} className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 flex flex-col text-left">
                        <div className="flex justify-between items-start">
                          <span className="font-bold text-slate-900 text-xs leading-tight">{item.menuItem.name}</span>
                          <span className="font-extrabold text-slate-900 text-xs">${(itemUnitTotal * item.quantity).toFixed(2)}</span>
                        </div>

                        {item.selectedVariant && (
                          <span className="text-[10px] text-orange-600 font-semibold mt-1">
                            • {item.selectedVariant.name}: {item.selectedVariant.option.name} (+${item.selectedVariant.option.priceModifier.toFixed(2)})
                          </span>
                        )}

                        {item.selectedExtras.length > 0 && (
                          <div className="text-[10px] text-slate-500 flex flex-wrap gap-1 mt-1">
                            {item.selectedExtras.map(e => (
                              <span key={e.id} className="bg-slate-200/50 px-1.5 py-0.5 rounded">+{e.name}</span>
                            ))}
                          </div>
                        )}

                        {item.specialInstructions && (
                          <p className="text-[9px] text-slate-400 mt-1 italic">"{item.specialInstructions}"</p>
                        )}

                        <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-200/50">
                          <button 
                            id={`trash-cart-item-${idx}`}
                            onClick={() => updateQuantity(item.id, -item.quantity)}
                            className="text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-0.5 shadow-sm">
                            <button 
                              id={`minus-cart-item-${idx}`}
                              onClick={() => updateQuantity(item.id, -1)}
                              className="p-1 hover:bg-slate-50 rounded text-slate-500"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold text-slate-800 px-1">{item.quantity}</span>
                            <button 
                              id={`plus-cart-item-${idx}`}
                              onClick={() => updateQuantity(item.id, 1)}
                              className="p-1 hover:bg-slate-50 rounded text-slate-500"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Basket Footer Price Summary */}
              {cart.length > 0 && (
                <div className="p-4 border-t border-slate-200 bg-white space-y-3">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-800">${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  {deliveryType === 'delivery' && (
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Delivery Fee</span>
                      <span className="font-semibold text-slate-800">${deliveryZoneFee.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-slate-100 pt-2 flex justify-between text-sm font-extrabold text-slate-900">
                    <span>Total Amount</span>
                    <span className="text-orange-600">${(calculateSubtotal() + (deliveryType === 'delivery' ? deliveryZoneFee : 0)).toFixed(2)}</span>
                  </div>

                  {!checkoutMode ? (
                    <button 
                      id="store-checkout-trigger-btn"
                      onClick={() => setCheckoutMode(true)}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl mt-2 transition-all active:scale-95"
                    >
                      Proceed to Simulation Checkout
                    </button>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Success Tracking Screen */
          <div className="flex-1 p-8 overflow-y-auto flex flex-col items-center justify-center max-w-lg mx-auto text-center space-y-6">
            <div className="bg-orange-100 p-5 rounded-full border-4 border-orange-200 text-orange-600 shadow-inner">
              <ShieldCheck className="w-12 h-12" />
            </div>

            <div>
              <span className="bg-orange-100 text-orange-800 text-[10px] font-extrabold tracking-widest uppercase px-3 py-1 rounded-full">
                ORDER SUCCESSFUL
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-3">Your order is on the way!</h2>
              <p className="text-slate-500 text-xs mt-1">Simulated Order: <strong className="text-slate-800">{activeOrder?.id}</strong></p>
            </div>

            {/* Live simulator timeline map */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 w-full space-y-4 shadow-sm text-left">
              <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">Live Status tracking</h4>
              
              <div className="relative pl-6 space-y-6 border-l border-orange-500">
                <div className="relative">
                  <span className="absolute -left-8 top-0.5 bg-orange-600 text-white p-1 rounded-full text-[8px] border-2 border-white shadow">
                    <Check className="w-2.5 h-2.5" />
                  </span>
                  <div className="text-xs font-bold text-slate-900">Order Placed Successfully</div>
                  <p className="text-[11px] text-slate-500 mt-0.5">We received your request and matched the closest delivery pilot.</p>
                </div>

                <div className="relative">
                  <span className="absolute -left-8 top-0.5 bg-orange-500 text-white p-1 rounded-full text-[8px] border-2 border-white shadow">
                    <span className="w-2.5 h-2.5 block rounded-full bg-white animate-ping" />
                  </span>
                  <div className="text-xs font-bold text-orange-600">Merchant Is Preparing Food</div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Sourdough is in the stone-oven. Chef is applying fresh basil pearls.</p>
                </div>

                <div className="relative">
                  <span className="absolute -left-8 top-0.5 bg-slate-200 text-slate-400 p-1 rounded-full text-[8px] border-2 border-white shadow">
                    <span className="w-2.5 h-2.5 block" />
                  </span>
                  <div className="text-xs font-semibold text-slate-400">Out for Delivery</div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Your courier will transport with premium insulated thermal gear.</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 w-full">
              <button 
                id="reset-simulation-order-btn"
                onClick={() => {
                  setOrderConfirmed(false);
                  setActiveOrder(null);
                }}
                className="flex-1 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs py-3.5 rounded-xl border border-slate-200 shadow-sm"
              >
                Order Something Else
              </button>
              <button 
                id="go-back-dashboard-simulate-btn"
                onClick={onClose}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3.5 rounded-xl shadow-lg"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        )}

        {/* Custom Toppings Modal overlay inside ordering portal */}
        {customizingItem && (
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-6 text-left">
            <div className="bg-white border border-slate-200 shadow-2xl rounded-2xl w-full max-w-md p-6 flex flex-col max-h-[90%] overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg leading-tight">{customizingItem.name}</h3>
                  <span className="text-xs text-slate-400">Add options, extras and instructions</span>
                </div>
                <button 
                  id="close-customize-modal"
                  onClick={() => setCustomizingItem(null)}
                  className="p-1 hover:bg-slate-100 rounded text-slate-400"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-6 pr-1">
                {/* Variant selection */}
                {customizingItem.variants.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">{customizingItem.variants[0].name}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {customizingItem.variants[0].options.map(opt => (
                        <button 
                          id={`variant-opt-${opt.id}`}
                          key={opt.id}
                          onClick={() => setSelectedVariant(opt)}
                          className={`p-3 text-left border rounded-xl font-semibold text-xs flex justify-between items-center transition-all ${selectedVariant?.id === opt.id ? 'border-orange-600 bg-orange-50/30' : 'border-slate-200 hover:bg-slate-50'}`}
                        >
                          <span>{opt.name}</span>
                          <span className="text-slate-500">
                            {opt.priceModifier >= 0 ? `+$${opt.priceModifier.toFixed(2)}` : `-$${Math.abs(opt.priceModifier).toFixed(2)}`}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Extras Selection */}
                {customizingItem.extras.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Add Premium Extras</h4>
                    <div className="space-y-1.5">
                      {customizingItem.extras.map(e => {
                        const isSelected = selectedExtras.some(extra => extra.id === e.id);
                        return (
                          <button 
                            id={`extra-opt-${e.id}`}
                            key={e.id}
                            onClick={() => toggleExtra(e)}
                            className={`w-full p-3 text-left border rounded-xl font-semibold text-xs flex justify-between items-center transition-all ${isSelected ? 'border-orange-600 bg-orange-50/30' : 'border-slate-200 hover:bg-slate-50'}`}
                          >
                            <span className="flex items-center gap-2">
                              <span className={`w-4 h-4 rounded border flex items-center justify-center text-white ${isSelected ? 'bg-orange-600 border-orange-600' : 'border-slate-300'}`}>
                                {isSelected && <Check className="w-3 h-3" />}
                              </span>
                              {e.name}
                            </span>
                            <span className="text-slate-500">+${e.price.toFixed(2)}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Special instructions */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Special Cooking instructions</h4>
                  <textarea 
                    id="textarea-special-instruct"
                    rows={2}
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="e.g. Well-done crust, sauce on the side, allergies..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-900"
                  />
                </div>
              </div>

              {/* Customize Footer */}
              <div className="border-t border-slate-100 pt-4 mt-4 flex items-center justify-between">
                <div className="flex items-center gap-3 bg-slate-100 p-1 rounded-xl border border-slate-200/50">
                  <button 
                    id="quantity-minus-btn"
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-extrabold text-slate-800 px-1">{quantity}</span>
                  <button 
                    id="quantity-plus-btn"
                    onClick={() => setQuantity(prev => prev + 1)}
                    className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button 
                  id="add-custom-item-cart-btn"
                  onClick={handleAddToCart}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-3 rounded-xl shadow transition-colors"
                >
                  Add To Basket (Total: ${(
                    ((customizingItem.price + (selectedVariant?.priceModifier || 0) + selectedExtras.reduce((acc, c) => acc + c.price, 0)) * quantity)
                  ).toFixed(2)})
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Checkout Dialog Overlay inside simulation */}
        {checkoutMode && (
          <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-6 text-left">
            <form onSubmit={handleCheckoutSubmit} className="bg-white border border-slate-200 shadow-2xl rounded-2xl w-full max-w-md p-6 flex flex-col max-h-[90%] overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg leading-tight">Simulation Checkout</h3>
                  <span className="text-xs text-slate-400">Provide fake customer coordinates for the demo</span>
                </div>
                <button 
                  id="close-checkout-modal"
                  type="button"
                  onClick={() => setCheckoutMode(false)}
                  className="p-1 hover:bg-slate-100 rounded text-slate-400"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Customer Name</label>
                  <input 
                    id="input-cust-name"
                    type="text"
                    required
                    value={custName}
                    onChange={(e) => setCustName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Customer Email</label>
                  <input 
                    id="input-cust-email"
                    type="email"
                    required
                    value={custEmail}
                    onChange={(e) => setCustEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Customer Phone</label>
                  <input 
                    id="input-cust-phone"
                    type="text"
                    required
                    value={custPhone}
                    onChange={(e) => setCustPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 placeholder:text-slate-400"
                  />
                </div>

                {deliveryType === 'delivery' && (
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Delivery Address</label>
                    <input 
                      id="input-cust-address"
                      type="text"
                      required
                      value={custAddress}
                      onChange={(e) => setCustAddress(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 placeholder:text-slate-400"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Simulated Payment Method</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button 
                      id="pay-online-toggle"
                      type="button"
                      onClick={() => setPayMethod('online')}
                      className={`p-2.5 text-center border rounded-xl font-semibold text-xs transition-colors ${payMethod === 'online' ? 'border-orange-600 bg-orange-50/20 text-orange-950' : 'border-slate-200 hover:bg-slate-50 text-slate-700'}`}
                    >
                      Credit Card
                    </button>
                    <button 
                      id="pay-card-toggle"
                      type="button"
                      onClick={() => setPayMethod('card')}
                      className={`p-2.5 text-center border rounded-xl font-semibold text-xs transition-colors ${payMethod === 'card' ? 'border-orange-600 bg-orange-50/20 text-orange-950' : 'border-slate-200 hover:bg-slate-50 text-slate-700'}`}
                    >
                      Apple Pay
                    </button>
                    <button 
                      id="pay-cash-toggle"
                      type="button"
                      onClick={() => setPayMethod('cash')}
                      className={`p-2.5 text-center border rounded-xl font-semibold text-xs transition-colors ${payMethod === 'cash' ? 'border-orange-600 bg-orange-50/20 text-orange-950' : 'border-slate-200 hover:bg-slate-50 text-slate-700'}`}
                    >
                      Cash on Delivery
                    </button>
                  </div>
                </div>

                <div className="bg-orange-50/80 border border-orange-100 rounded-xl p-3 flex gap-2 text-orange-900 mt-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 text-orange-600 shrink-0" />
                  <p className="text-[10px] leading-normal font-semibold">This checkout is a simulation. Placing this order will immediately register it into your Merchant Console so you can test live notification and kitchen queue tracking!</p>
                </div>
              </div>

              {/* Checkout submit footer */}
              <div className="border-t border-slate-100 pt-4 mt-4 flex justify-between items-center bg-white">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">FINAL DUE</span>
                  <span className="text-sm font-extrabold text-slate-900">${(calculateSubtotal() + (deliveryType === 'delivery' ? deliveryZoneFee : 0)).toFixed(2)}</span>
                </div>
                <button 
                  id="confirm-checkout-btn"
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg shadow-orange-600/10"
                >
                  Place Mock Order
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
