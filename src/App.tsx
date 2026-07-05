import React, { useState } from 'react';
import MarketingPage from './components/MarketingPage';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import OrderingPortal from './components/OrderingPortal';
import { MenuItem, Order } from './types';

export default function App() {
  const [page, setPage] = useState<string>('landing');
  const [userEmail, setUserEmail] = useState<string>('demo@restaurant.com');
  const [userRole, setUserRole] = useState<'super_admin' | 'restaurant_owner' | 'staff' | 'customer'>('restaurant_owner');
  const [showOrderingPortal, setShowOrderingPortal] = useState<boolean>(false);

  // Global shared live order list
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-8941',
      customerName: 'Emma Wilson',
      customerEmail: 'emma.w@yahoo.com',
      customerPhone: '+1 (555) 345-6789',
      items: [
        { name: 'Margherita Stone Pizza', quantity: 1, price: 18.99, variantName: 'Size', variantOptionName: 'Medium 12"', extrasNames: ['Hot Honey Drizzle'] },
        { name: 'Artisanal Burrata & Heirloom', quantity: 1, price: 15.00 }
      ],
      total: 38.99,
      status: 'preparing',
      type: 'delivery',
      timestamp: '02:40 PM',
      address: '1315 Third Street Promenade, Santa Monica, CA 90401',
      deliveryFee: 4.50,
      paymentMethod: 'online'
    },
    {
      id: 'ORD-7621',
      customerName: 'Sophia Brown',
      customerEmail: 'sophia.brown@gmail.com',
      customerPhone: '+1 (555) 678-9012',
      items: [
        { name: 'Truffle Bacon Burger', quantity: 2, price: 16.50 }
      ],
      total: 33.00,
      status: 'delivered',
      type: 'pickup',
      timestamp: '01:15 PM',
      paymentMethod: 'card'
    }
  ]);

  // Master restaurant menu list state
  const categories = ['Pizza', 'Burgers', 'Pasta', 'Salads', 'Dessert', 'Drinks'];
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

  const handlePlaceOrder = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
  };

  const handleLoginSuccess = (email: string, role: 'super_admin' | 'restaurant_owner' | 'staff' | 'customer') => {
    setUserEmail(email);
    setUserRole(role);
  };

  return (
    <div className="min-h-screen bg-slate-50 antialiased selection:bg-orange-500 selection:text-white">
      {/* Dynamic View router */}
      {page === 'landing' && (
        <MarketingPage onNavigate={setPage} />
      )}

      {page === 'login' && (
        <AuthPage 
          initialMode="login" 
          onNavigate={setPage} 
          onLoginSuccess={handleLoginSuccess} 
        />
      )}

      {page === 'signup' && (
        <AuthPage 
          initialMode="signup" 
          onNavigate={setPage} 
          onLoginSuccess={handleLoginSuccess} 
        />
      )}

      {page === 'dashboard' && (
        <Dashboard 
          userEmail={userEmail} 
          userRole={userRole}
          onLogout={() => setPage('landing')} 
          orders={orders}
          onUpdateOrders={setOrders}
          onOpenStorefront={() => setShowOrderingPortal(true)}
        />
      )}

      {/* Floating Storefront Ordering Simulator Overlay */}
      {showOrderingPortal && (
        <OrderingPortal 
          menuItems={menuItems}
          categories={categories}
          activeLocation="loc-1"
          locations={[
            { id: 'loc-1', name: 'Downtown Bistro (HQ)', address: '240 S Grand Ave, Los Angeles, CA 90012' },
            { id: 'loc-2', name: 'Santa Monica Express', address: '1315 Third Street Promenade, Santa Monica, CA 90401' }
          ]}
          onPlaceOrder={handlePlaceOrder}
          onClose={() => setShowOrderingPortal(false)}
        />
      )}
    </div>
  );
}
