import React, { useState } from 'react';
import { 
  ShoppingBag, Flame, Calendar, Users, User, LogOut, CheckCircle, Clock, 
  MapPin, Phone, Mail, Check, Play, AlertCircle, RefreshCw, Star, Heart
} from 'lucide-react';
import { Order, Customer, Reservation } from '../types';

interface StaffDashboardProps {
  userEmail: string;
  orders: Order[];
  onUpdateOrders: (orders: Order[]) => void;
  onLogout: () => void;
}

export default function StaffDashboard({ userEmail, orders, onUpdateOrders, onLogout }: StaffDashboardProps) {
  const [activeTab, setActiveTab] = useState<string>('staff_orders');
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [notification, setNotification] = useState<string | null>(null);

  // Local stateful mock data for staff activities
  const [staffProfile, setStaffProfile] = useState({
    name: 'Chef Mario',
    role: 'Kitchen Head / Duty Manager',
    email: userEmail,
    id: 'STF-482',
    shift: 'Morning (08:00 - 16:00)',
    permissions: ['Monitor Order Queue', 'Kitchen Status Control', 'Manage Reservations', 'Update Ingredient Inventory'],
    avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=120&h=120&q=80'
  });

  const [staffReservations, setStaffReservations] = useState<Reservation[]>([
    { id: 'res-101', customerName: 'David Smith', customerPhone: '+1 (555) 234-5678', customerEmail: 'dsmith@outlook.com', guests: 4, date: '2026-07-05', time: '19:30', tableId: 'Table 4', status: 'pending', notes: 'Celebrating wedding anniversary.' },
    { id: 'res-102', customerName: 'Alice Johnson', customerPhone: '+1 (555) 456-7890', customerEmail: 'alice@gmail.com', guests: 2, date: '2026-07-05', time: '20:00', tableId: 'Table 2', status: 'approved', notes: 'Window view requested.' },
    { id: 'res-103', customerName: 'Marcus Aurelius', customerPhone: '+1 (555) 999-8888', customerEmail: 'philosopher@rome.com', guests: 6, date: '2026-07-06', time: '18:00', tableId: 'Table 10 (Large)', status: 'approved' }
  ]);

  const [staffCustomers, setStaffCustomers] = useState<Customer[]>([
    { id: 'c-1', name: 'John Carter', email: 'john.carter@gmail.com', phone: '+1 (555) 890-2345', ordersCount: 14, totalSpent: 342.50, segment: 'VIP', lastOrderDate: '2026-07-04', notes: 'Prefers gluten-free pizza options.', loyaltyPoints: 240, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80' },
    { id: 'c-2', name: 'Emma Wilson', email: 'emma.w@yahoo.com', phone: '+1 (555) 345-6789', ordersCount: 8, totalSpent: 184.00, segment: 'Loyal', lastOrderDate: '2026-07-03', notes: 'Prefers outdoor seating when dining in.', loyaltyPoints: 120, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&h=120&q=80' },
    { id: 'c-3', name: 'David Smith', email: 'dsmith@outlook.com', phone: '+1 (555) 234-5678', ordersCount: 2, totalSpent: 45.50, segment: 'New', lastOrderDate: '2026-07-05', notes: '', loyaltyPoints: 30, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80' }
  ]);

  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const updateOrderStatus = (orderId: string, nextStatus: Order['status']) => {
    const updated = orders.map(o => {
      if (o.id === orderId) {
        triggerNotification(`Order #${orderId} status changed to "${nextStatus}"`);
        return { ...o, status: nextStatus };
      }
      return o;
    });
    onUpdateOrders(updated);
  };

  const handleReservationStatus = (id: string, status: 'approved' | 'declined') => {
    setStaffReservations(prev => prev.map(res => {
      if (res.id === id) {
        triggerNotification(`Table Reservation for ${res.customerName} set to "${status}"`);
        return { ...res, status };
      }
      return res;
    }));
  };

  const getBreadcrumbs = () => {
    const section = activeTab.replace('staff_', '').replace('_', ' ');
    return (
      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 mb-1.5 tracking-wide uppercase select-none">
        <span>Staff Workspace</span>
        <span className="text-slate-300">/</span>
        <span className="text-blue-500 capitalize">{section}</span>
      </div>
    );
  };

  const sidebarItems = [
    { id: 'staff_orders', label: "Today's Orders", icon: ShoppingBag, count: orders.filter(o => o.status === 'pending').length },
    { id: 'staff_kitchen', label: 'Kitchen Queue', icon: Flame, count: orders.filter(o => o.status === 'preparing').length },
    { id: 'staff_reservations', label: 'Table Bookings', icon: Calendar, count: staffReservations.filter(r => r.status === 'pending').length },
    { id: 'staff_customers', label: 'Customer CRM', icon: Users },
    { id: 'staff_profile', label: 'My Shift Profile', icon: User },
  ];

  return (
    <div id="staff-workspace-layout" className="bg-slate-50 min-h-screen text-slate-900 flex font-sans text-left relative overflow-hidden">
      
      {/* Toast notifications */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 bg-blue-900 border border-blue-700 text-white px-4 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-bold">{notification}</span>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 text-white">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="font-black text-lg tracking-wider">GLOBITE<span className="text-xs font-bold text-blue-400 ml-1">STAFF</span></span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {sidebarItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`btn-nav-staff-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-inner border border-blue-500' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.count && item.count > 0 ? (
                  <span className="bg-blue-500 text-white font-black text-[10px] px-1.5 py-0.5 rounded-full">
                    {item.count}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl mb-3 flex items-center gap-2.5">
            {staffProfile.avatar ? (
              <img src={staffProfile.avatar} alt={staffProfile.name} className="w-8 h-8 rounded-full object-cover border border-slate-750 shadow-sm" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center text-xs font-bold text-white uppercase border border-slate-750">
                CM
              </div>
            )}
            <div className="min-w-0">
              <span className="text-[11px] font-black block truncate">{staffProfile.name}</span>
              <span className="text-[10px] text-slate-500 block truncate">{staffProfile.role}</span>
            </div>
          </div>
          <button
            id="staff-logout-btn"
            onClick={onLogout}
            className="w-full bg-slate-850 hover:bg-slate-800 text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors border border-slate-800"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOP HEADER */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 shadow-sm">
          <div className="flex flex-col items-start">
            {getBreadcrumbs()}
            <h1 className="text-xs text-slate-500">
              You are managing: <strong className="text-slate-900">Urban Kitchen Bistro</strong> 
              <span className="ml-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full">Growth Plan</span>
            </h1>
          </div>

          {/* Interactive Online Switcher */}
          <div className="flex items-center gap-4">
            <button 
              id="staff-toggle-online-btn"
              onClick={() => {
                setIsOnline(!isOnline);
                triggerNotification(`Restaurant orders are now ${!isOnline ? 'Online' : 'Offline'}.`);
              }}
              className={`flex items-center gap-2 border px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition-all ${
                isOnline 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
              <span>Ordering System:</span>
              <strong className="font-extrabold uppercase">{isOnline ? 'Online' : 'Offline'}</strong>
            </button>
          </div>
        </header>

        {/* WORKSPACE */}
        <main className="flex-1 p-8 overflow-y-auto space-y-6">

          {/* TAB: TODAY'S ORDERS */}
          {activeTab === 'staff_orders' && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-wrap gap-4 items-center justify-between shadow-sm">
                <div>
                  <h2 className="text-base font-black text-slate-900 mb-0.5">Active Food Delivery & Pickup Orders</h2>
                  <p className="text-xs text-slate-500 font-semibold">Monitor real-time incoming customer orders and progress them through processing stages.</p>
                </div>
              </div>

              {/* ORDERS GRID BY STATUS */}
              <div className="grid lg:grid-cols-3 gap-6 text-left">
                {/* Pending Column */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                    <span className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" /> Pending Incoming ({orders.filter(o => o.status === 'pending').length})
                    </span>
                  </div>

                  <div className="space-y-3">
                    {orders.filter(o => o.status === 'pending').length === 0 ? (
                      <div className="text-center py-8 text-xs text-slate-400 font-medium">No incoming pending requests.</div>
                    ) : (
                      orders.filter(o => o.status === 'pending').map(ord => (
                        <div key={ord.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 hover:shadow transition-shadow">
                          <div className="flex justify-between items-start">
                            <div>
                              <strong className="text-xs font-black text-slate-900">Order #{ord.id}</strong>
                              <span className="text-[10px] text-slate-400 block">{ord.timestamp} • {ord.type}</span>
                            </div>
                            <span className="font-extrabold text-xs text-slate-950">${ord.total.toFixed(2)}</span>
                          </div>

                          <div className="text-xs font-semibold text-slate-700 bg-white border border-slate-100 p-2.5 rounded-lg space-y-1">
                            {ord.items.map((it, idx) => (
                              <div key={idx} className="flex justify-between">
                                <span>{it.quantity}x {it.name}</span>
                                <span className="text-[10px] text-slate-400 font-mono">${(it.price * it.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>

                          <div className="flex gap-2">
                            <button 
                              onClick={() => updateOrderStatus(ord.id, 'preparing')}
                              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                            >
                              <Play className="w-3 h-3 fill-white" /> Accept Order
                            </button>
                            <button 
                              onClick={() => updateOrderStatus(ord.id, 'cancelled')}
                              className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs px-2.5 py-1.5 rounded-lg transition-colors"
                            >
                              Decline
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Preparing Column */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                    <span className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" /> Kitchen Preparing ({orders.filter(o => o.status === 'preparing').length})
                    </span>
                  </div>

                  <div className="space-y-3">
                    {orders.filter(o => o.status === 'preparing').length === 0 ? (
                      <div className="text-center py-8 text-xs text-slate-400 font-medium">No meals currently preparing in the kitchen.</div>
                    ) : (
                      orders.filter(o => o.status === 'preparing').map(ord => (
                        <div key={ord.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <strong className="text-xs font-black text-slate-900">Order #{ord.id}</strong>
                              <span className="text-[10px] text-slate-400 block">{ord.timestamp} • {ord.type}</span>
                            </div>
                            <span className="font-extrabold text-xs text-slate-950">${ord.total.toFixed(2)}</span>
                          </div>

                          <div className="text-xs font-semibold text-slate-700 bg-white border border-slate-100 p-2.5 rounded-lg space-y-1">
                            {ord.items.map((it, idx) => (
                              <div key={idx} className="flex justify-between">
                                <span>{it.quantity}x {it.name}</span>
                              </div>
                            ))}
                          </div>

                          <button 
                            onClick={() => updateOrderStatus(ord.id, 'ready')}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1"
                          >
                            <Check className="w-4 h-4" /> Mark Food as Ready
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Out for Delivery Column */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                    <span className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Out For Delivery / Ready ({orders.filter(o => o.status === 'ready').length})
                    </span>
                  </div>

                  <div className="space-y-3">
                    {orders.filter(o => o.status === 'ready').length === 0 ? (
                      <div className="text-center py-8 text-xs text-slate-400 font-medium">No orders waiting for dispatcher.</div>
                    ) : (
                      orders.filter(o => o.status === 'ready').map(ord => (
                        <div key={ord.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <strong className="text-xs font-black text-slate-900">Order #{ord.id}</strong>
                              <span className="text-[10px] text-slate-500 block truncate">Dest: {ord.address || 'Dining Table'}</span>
                            </div>
                            <span className="font-extrabold text-xs text-slate-950">${ord.total.toFixed(2)}</span>
                          </div>

                          <button 
                            onClick={() => updateOrderStatus(ord.id, 'delivered')}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1"
                          >
                            <CheckCircle className="w-4 h-4" /> Dispatch & Complete
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: KITCHEN MONITOR QUEUE */}
          {activeTab === 'staff_kitchen' && (
            <div className="space-y-6">
              <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-md text-left">
                <div>
                  <h2 className="text-lg font-black text-white mb-0.5">Kitchen Command Monitor</h2>
                  <p className="text-xs text-slate-400">Large screen kitchen-friendly grid showing meal items to cook and check off instantly.</p>
                </div>
                <span className="bg-blue-600 text-white font-black text-xs px-3 py-1.5 rounded-lg">
                  Meals Preparing: {orders.filter(o => o.status === 'preparing').length}
                </span>
              </div>

              {orders.filter(o => o.status === 'preparing').length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400 font-bold shadow-sm">
                  🍲 All orders are fully cooked! There are no dishes currently on the stoves.
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                  {orders.filter(o => o.status === 'preparing').map(ord => (
                    <div key={ord.id} className="bg-white border-2 border-blue-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-blue-400 transition-colors">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                          <strong className="text-blue-600 text-sm font-extrabold">Order #{ord.id}</strong>
                          <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-black uppercase">
                            {ord.type}
                          </span>
                        </div>

                        <div className="space-y-2">
                          {ord.items.map((it, idx) => (
                            <div key={idx} className="flex justify-between items-start py-1 border-b border-slate-50">
                              <div className="min-w-0">
                                <span className="font-extrabold text-slate-900 text-sm">{it.quantity}x {it.name}</span>
                                {it.extrasNames && it.extrasNames.length > 0 && (
                                  <span className="text-[10px] text-slate-400 block truncate font-semibold">
                                    + {it.extrasNames.join(', ')}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {ord.address && (
                          <div className="text-[10px] text-slate-400 font-bold block truncate">
                            👤 {ord.customerName} • {ord.customerPhone}
                          </div>
                        )}
                      </div>

                      <div className="pt-4 mt-4 border-t border-slate-100">
                        <button 
                          onClick={() => updateOrderStatus(ord.id, 'ready')}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-2 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Check className="w-4 h-4 stroke-[3]" /> Done Cooking
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: TABLE BOOKINGS */}
          {activeTab === 'staff_reservations' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 text-left shadow-sm">
              <h2 className="text-base font-black text-slate-900 mb-1">Today's Restaurant Table Reservations</h2>
              <p className="text-xs text-slate-500 font-semibold mb-6">Review reservations details, allocate table numbers, and change approval statuses.</p>

              <div className="overflow-x-auto">
                <table className="w-full text-xs font-semibold text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 text-[10px] uppercase tracking-wider">
                      <th className="py-3 px-4">Customer Details</th>
                      <th className="py-3 px-4">Party Size</th>
                      <th className="py-3 px-4">Date & Time</th>
                      <th className="py-3 px-4">Allocated Table</th>
                      <th className="py-3 px-4">Notes</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {staffReservations.map(res => (
                      <tr key={res.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-4">
                          <strong className="text-slate-900 block">{res.customerName}</strong>
                          <span className="text-[10px] text-slate-400 block font-mono">{res.customerPhone}</span>
                        </td>
                        <td className="py-4 px-4 text-slate-700 font-extrabold">{res.guests} Guests</td>
                        <td className="py-4 px-4 font-bold text-slate-800">{res.date} @ {res.time}</td>
                        <td className="py-4 px-4">
                          <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded font-black">
                            {res.tableId || 'Unallocated'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-slate-500 max-w-xs truncate">{res.notes || '—'}</td>
                        <td className="py-4 px-4">
                          <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded ${
                            res.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                            res.status === 'pending' ? 'bg-amber-100 text-amber-800 animate-pulse' :
                            'bg-rose-100 text-rose-800'
                          }`}>
                            {res.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          {res.status === 'pending' ? (
                            <div className="flex gap-1 justify-end">
                              <button 
                                onClick={() => handleReservationStatus(res.id, 'approved')}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] px-2.5 py-1 rounded"
                              >
                                Approve
                              </button>
                              <button 
                                onClick={() => handleReservationStatus(res.id, 'declined')}
                                className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-[10px] px-2.5 py-1 rounded"
                              >
                                Decline
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-bold">Processed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: CUSTOMERS */}
          {activeTab === 'staff_customers' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 text-left shadow-sm">
              <h2 className="text-base font-black text-slate-900 mb-1">Customer CRM Profile Sheets</h2>
              <p className="text-xs text-slate-500 font-semibold mb-6">Review dietary comments, allergy reports, and meal purchase frequencies.</p>

              <div className="overflow-x-auto">
                <table className="w-full text-xs font-semibold text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 text-[10px] uppercase tracking-wider">
                      <th className="py-3 px-4">Customer Details</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Orders count</th>
                      <th className="py-3 px-4">Loyalty Balance</th>
                      <th className="py-3 px-4">Customer notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {staffCustomers.map(cust => (
                      <tr key={cust.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2.5">
                            {cust.avatar ? (
                              <img src={cust.avatar} alt={cust.name} className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-sm" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-extrabold text-xs">
                                {cust.name.charAt(0)}
                              </div>
                            )}
                            <div>
                              <strong className="text-slate-900 block font-bold">{cust.name}</strong>
                              <span className="text-[10px] text-slate-400 block font-mono">{cust.phone}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-slate-600 font-mono">{cust.email}</td>
                        <td className="py-4 px-4 font-bold text-slate-800">{cust.ordersCount} orders</td>
                        <td className="py-4 px-4 font-extrabold text-blue-600">{cust.loyaltyPoints} points</td>
                        <td className="py-4 px-4 text-slate-500 font-medium">
                          {cust.notes ? (
                            <span className="text-rose-700 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded text-[11px] font-bold block w-fit">
                              ⚠️ {cust.notes}
                            </span>
                          ) : 'No special notes'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: MY SHIFT PROFILE */}
          {activeTab === 'staff_profile' && (
            <div className="grid lg:grid-cols-3 gap-6 text-left items-start">
              <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="text-slate-900 font-black text-base border-b border-slate-100 pb-3">Operational Session Details</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Staff Member Name</span>
                    <strong className="text-sm font-bold text-slate-800 block mt-0.5">{staffProfile.name}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">System assigned ID</span>
                    <strong className="text-sm font-bold text-slate-800 font-mono block mt-0.5">{staffProfile.id}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Email credentials</span>
                    <strong className="text-sm font-bold text-slate-800 block mt-0.5">{staffProfile.email}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Assigned Duty Shift</span>
                    <strong className="text-sm font-bold text-slate-800 block mt-0.5">{staffProfile.shift}</strong>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="text-slate-900 font-black text-base border-b border-slate-100 pb-2">My Permissions</h3>
                <div className="space-y-2">
                  {staffProfile.permissions.map((perm, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-100 px-3 py-2 rounded-xl">
                      <Check className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>{perm}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
}
