import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Store, CreditCard, Users, Brain, Activity, 
  ShieldAlert, Settings, Palette, Terminal, CheckCircle, AlertTriangle, 
  Trash2, Shield, LogOut, ArrowRight, RefreshCw, Layers, DollarSign, Search
} from 'lucide-react';

interface SuperAdminDashboardProps {
  userEmail: string;
  onLogout: () => void;
}

interface PlatformRestaurant {
  id: string;
  name: string;
  ownerEmail: string;
  plan: 'Starter' | 'Growth' | 'Enterprise';
  status: 'active' | 'suspended' | 'pending';
  signupDate: string;
  revenue: number;
}

interface PlatformPlan {
  id: string;
  name: string;
  price: number;
  billing: 'monthly' | 'annually';
  features: string[];
}

interface PlatformUser {
  id: string;
  name: string;
  email: string;
  role: 'SaaS Owner' | 'Restaurant Owner' | 'Staff' | 'Customer';
  status: 'active' | 'inactive';
  avatar?: string;
}

export default function SuperAdminDashboard({ userEmail, onLogout }: SuperAdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<string>('super_dashboard');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [notification, setNotification] = useState<string | null>(null);

  // Stateful lists for rich interaction
  const [restaurants, setRestaurants] = useState<PlatformRestaurant[]>([
    { id: 'RST-101', name: 'Urban Kitchen Bistro', ownerEmail: 'owner@urbanbistro.com', plan: 'Growth', status: 'active', signupDate: '2026-01-15', revenue: 14230.50 },
    { id: 'RST-102', name: 'Pizza Rustica', ownerEmail: 'mario@rustica.com', plan: 'Starter', status: 'active', signupDate: '2026-03-22', revenue: 5840.00 },
    { id: 'RST-103', name: 'Downtown Gourmet Burger', ownerEmail: 'jane@burgers.com', plan: 'Starter', status: 'pending', signupDate: '2026-07-04', revenue: 0 },
    { id: 'RST-104', name: 'Sourdough Artisan Bakery', ownerEmail: 'sally@sourdough.com', plan: 'Enterprise', status: 'suspended', signupDate: '2025-11-02', revenue: 32410.00 },
    { id: 'RST-105', name: 'Taco Amigo Express', ownerEmail: 'pablo@amigo.com', plan: 'Growth', status: 'pending', signupDate: '2026-07-05', revenue: 0 },
  ]);

  const [plans, setPlans] = useState<PlatformPlan[]>([
    { id: 'PLAN-1', name: 'Starter Plan', price: 29, billing: 'monthly', features: ['1 Location', 'Commission-free Orders', 'Digital Menu', 'Basic Analytics'] },
    { id: 'PLAN-2', name: 'Growth Plan', price: 79, billing: 'monthly', features: ['Unlimited Locations', 'Advanced SEO Website Builder', 'AI Menu generation & descriptions', 'Customer loyalty engine', 'SMS Order alerts'] },
    { id: 'PLAN-3', name: 'Enterprise Plan', price: 199, billing: 'monthly', features: ['Multi-brand support', 'Dedicated Account Manager', 'Custom API access', 'Third-party delivery integrations', 'Premium 24/7 Phone Support'] },
  ]);

  const [users, setUsers] = useState<PlatformUser[]>([
    { id: 'USR-001', name: 'Platform Admin', email: userEmail, role: 'SaaS Owner', status: 'active', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80' },
    { id: 'USR-002', name: 'Chef Mario', email: 'owner@urbanbistro.com', role: 'Restaurant Owner', status: 'active', avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=120&h=120&q=80' },
    { id: 'USR-003', name: 'Jane Miller', email: 'jane.manager@urbanbistro.com', role: 'Staff', status: 'active', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&h=120&q=80' },
    { id: 'USR-004', name: 'John Carter', email: 'john.carter@gmail.com', role: 'Customer', status: 'active', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80' },
    { id: 'USR-005', name: 'Emma Wilson', email: 'emma.w@yahoo.com', role: 'Customer', status: 'active', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&h=120&q=80' },
  ]);

  const [platformBranding, setPlatformBranding] = useState({
    title: 'GloBite',
    accentColor: '#FF5A36',
    whiteLabelMode: true,
    supportEmail: 'partner-ops@globite-platform.com',
  });

  const [auditLogs, setAuditLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] [INFO] GloBite platform core initializing...`,
    `[${new Date().toLocaleTimeString()}] [SYSTEM] Container cluster on port 3000 verified.`,
    `[${new Date().toLocaleTimeString()}] [SECURITY] Cloud SQL database connection pooled.`,
    `[${new Date().toLocaleTimeString()}] [SECURITY] OAuth identity validation service activated.`,
    `[${new Date().toLocaleTimeString()}] [AUDIT] Administrator ${userEmail} logged into Super Console.`,
  ]);

  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // State manipulation handlers
  const handleApproveRestaurant = (id: string) => {
    setRestaurants(prev => prev.map(r => {
      if (r.id === id) {
        triggerNotification(`Approved restaurant "${r.name}". Status changed to Active.`);
        setAuditLogs(logs => [`[${new Date().toLocaleTimeString()}] [AUDIT] Approved restaurant ${r.name} (${id})`, ...logs]);
        return { ...r, status: 'active' };
      }
      return r;
    }));
  };

  const handleSuspendRestaurant = (id: string) => {
    setRestaurants(prev => prev.map(r => {
      if (r.id === id) {
        triggerNotification(`Suspended restaurant "${r.name}". Status changed to Suspended.`);
        setAuditLogs(logs => [`[${new Date().toLocaleTimeString()}] [AUDIT] Suspended restaurant ${r.name} (${id})`, ...logs]);
        return { ...r, status: 'suspended' };
      }
      return r;
    }));
  };

  const handleActivateRestaurant = (id: string) => {
    setRestaurants(prev => prev.map(r => {
      if (r.id === id) {
        triggerNotification(`Activated suspended restaurant "${r.name}".`);
        setAuditLogs(logs => [`[${new Date().toLocaleTimeString()}] [AUDIT] Activated restaurant ${r.name} (${id})`, ...logs]);
        return { ...r, status: 'active' };
      }
      return r;
    }));
  };

  const handleDeleteRestaurant = (id: string) => {
    const target = restaurants.find(r => r.id === id);
    if (target && confirm(`Are you sure you want to permanently delete "${target.name}"?`)) {
      setRestaurants(prev => prev.filter(r => r.id !== id));
      triggerNotification(`Permanently deleted restaurant "${target.name}".`);
      setAuditLogs(logs => [`[${new Date().toLocaleTimeString()}] [AUDIT] Deleted restaurant ${target.name} (${id})`, ...logs]);
    }
  };

  const handleToggleUserStatus = (id: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        const nextStatus = u.status === 'active' ? 'inactive' : 'active';
        triggerNotification(`Toggled user "${u.name}" status to ${nextStatus}.`);
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const handleUpdatePlanPrice = (id: string, newPrice: number) => {
    setPlans(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, price: newPrice };
      }
      return p;
    }));
    triggerNotification(`Subscription tier pricing updated.`);
  };

  const calculatedTotalRevenue = restaurants.reduce((acc, curr) => acc + curr.revenue, 0);
  const activeSaaSRevenue = plans.reduce((acc, p) => {
    const count = restaurants.filter(r => r.plan === p.name.split(' ')[0] && r.status === 'active').length;
    return acc + (count * p.price);
  }, 0);

  const sidebarItems = [
    { id: 'super_dashboard', label: 'Console Dashboard', icon: LayoutDashboard },
    { id: 'super_restaurants', label: 'Manage Restaurants', icon: Store, count: restaurants.filter(r => r.status === 'pending').length },
    { id: 'super_plans', label: 'Subscription Plans', icon: CreditCard },
    { id: 'super_users', label: 'System Users', icon: Users },
    { id: 'super_ai_usage', label: 'Gemini AI Billing', icon: Brain },
    { id: 'super_audit_logs', label: 'System Terminal Logs', icon: Terminal },
    { id: 'super_branding', label: 'Platform Branding', icon: Palette },
  ];

  const currentUser = users.find(u => u.email === userEmail) || {
    name: 'Platform Admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80'
  };

  return (
    <div id="super-admin-layout" className="bg-slate-950 min-h-screen text-slate-100 flex font-sans text-left relative overflow-hidden">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 border border-slate-700 text-slate-100 px-4 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-semibold">{notification}</span>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-slate-400" />
            <span className="font-black text-lg tracking-wider text-white">GLOBITE<span className="text-xs font-bold text-slate-400 ml-1">PRO</span></span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {sidebarItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`btn-nav-super-${item.id}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setSearchTerm('');
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive 
                    ? 'bg-slate-800 text-white shadow-inner border border-slate-700' 
                    : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.count && item.count > 0 ? (
                  <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-1.5 py-0.5 rounded-full animate-pulse">
                    {item.count}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl mb-3 flex items-center gap-2.5">
            {currentUser.avatar ? (
              <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-full object-cover border border-slate-700 shadow-sm" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-white uppercase">
                {currentUser.name.charAt(0)}
              </div>
            )}
            <div className="min-w-0">
              <span className="text-[11px] font-black text-white block truncate">{currentUser.name}</span>
              <span className="text-[10px] text-slate-500 block truncate">{userEmail}</span>
            </div>
          </div>
          <button
            id="super-logout-btn"
            onClick={onLogout}
            className="w-full bg-slate-800 hover:bg-slate-700/80 text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors border border-slate-700"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out Securely
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOP HEADER */}
        <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-8 shrink-0">
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 tracking-wide uppercase">
              <span>SaaS Platform Admin</span>
              <span>/</span>
              <span className="text-slate-300 capitalize">{activeTab.replace('super_', '').replace('_', ' ')}</span>
            </div>
            <h1 className="text-sm font-black text-white tracking-tight">Platform Configuration Workspace</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-400">Cluster Status:</span>
              <span className="text-white font-black">Healthy</span>
            </div>
          </div>
        </header>

        {/* WORKSPACE */}
        <main className="flex-1 p-8 overflow-y-auto space-y-6">

          {/* TAB: CONSOLE DASHBOARD */}
          {activeTab === 'super_dashboard' && (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-wrap gap-4 items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-white mb-1">Welcome back, Super Admin</h2>
                  <p className="text-xs text-slate-400">Monitor multi-tenant merchant onboarding, subscription renewals, platform MRR, and Gemini AI query costs.</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setActiveTab('super_restaurants')} className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all">
                    Approve Pending Restaurants
                  </button>
                </div>
              </div>

              {/* STATS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-1">Global Platform Volume</span>
                  <div className="text-2xl font-black text-white">${calculatedTotalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                  <span className="text-[10px] text-emerald-400 font-bold block mt-1">+14.2% from last month</span>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-1">Platform SaaS MRR</span>
                  <div className="text-2xl font-black text-white">${activeSaaSRevenue}/mo</div>
                  <span className="text-[10px] text-slate-400 font-bold block mt-1">Based on active plans</span>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-1">Total Onboarded Brands</span>
                  <div className="text-2xl font-black text-white">{restaurants.length}</div>
                  <span className="text-[10px] text-amber-400 font-bold block mt-1">{restaurants.filter(r => r.status === 'pending').length} pending approval</span>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-1">AI Usage Cost</span>
                  <div className="text-2xl font-black text-white">$0.18</div>
                  <span className="text-[10px] text-slate-400 font-bold block mt-1">Gemini API consumption</span>
                </div>
              </div>

              {/* BOTTOM COLUMNS */}
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Pending Approvals quick-list */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 text-left">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                    <h3 className="font-black text-sm text-white flex items-center gap-2">
                      <Store className="w-4 h-4 text-slate-400" /> Onboarding Pipeline
                    </h3>
                    <button onClick={() => setActiveTab('super_restaurants')} className="text-xs text-slate-400 hover:text-white font-bold">
                      View All
                    </button>
                  </div>
                  <div className="space-y-3">
                    {restaurants.filter(r => r.status === 'pending').length === 0 ? (
                      <div className="text-center py-6 text-xs text-slate-500 font-semibold">
                        No pending restaurant applications. All caught up!
                      </div>
                    ) : (
                      restaurants.filter(r => r.status === 'pending').map(rest => (
                        <div key={rest.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between gap-4">
                          <div>
                            <strong className="text-xs font-black text-white block">{rest.name}</strong>
                            <span className="text-[10px] text-slate-500">Owner: {rest.ownerEmail} • Plan: {rest.plan}</span>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleApproveRestaurant(rest.id)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-slate-950 font-black text-[10px] px-3 py-1.5 rounded-lg transition-colors"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => handleDeleteRestaurant(rest.id)}
                              className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* System Stats Alerts */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-left">
                  <h3 className="font-black text-sm text-white mb-4 flex items-center gap-2 border-b border-slate-800 pb-3">
                    <Activity className="w-4 h-4 text-slate-400" /> Platform Services Status
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-400">Database Engine</span>
                      <span className="text-emerald-400 font-bold">Online</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-400">Gemini SDK Endpoint</span>
                      <span className="text-emerald-400 font-bold">Connected (v1)</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-400">Stripe Payment Gateway</span>
                      <span className="text-emerald-400 font-bold">Active</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-400">White-Label Branding CDN</span>
                      <span className="text-emerald-400 font-bold">Ready</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: MANAGE RESTAURANTS */}
          {activeTab === 'super_restaurants' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-left">
              <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
                <div>
                  <h2 className="text-base font-black text-white">Multi-Tenant Onboarded Restaurants</h2>
                  <span className="text-xs text-slate-400">Review restaurant listings, toggle subscription status, suspend, or delete merchant portals.</span>
                </div>

                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-xs">
                  <Search className="w-4 h-4 text-slate-500" />
                  <input 
                    type="text" 
                    placeholder="Search restaurant or email..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent border-none text-white focus:outline-none placeholder-slate-600 text-xs w-48"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-semibold">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-500 uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-4">Restaurant Details</th>
                      <th className="py-3 px-4">Owner Email</th>
                      <th className="py-3 px-4">Selected Plan</th>
                      <th className="py-3 px-4">Signed Up</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Total Revenue</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {restaurants
                      .filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()) || r.ownerEmail.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map(rest => (
                        <tr key={rest.id} className="hover:bg-slate-800/20 transition-colors">
                          <td className="py-4 px-4">
                            <span className="font-bold text-white block">{rest.name}</span>
                            <span className="text-[10px] text-slate-500 font-mono block">{rest.id}</span>
                          </td>
                          <td className="py-4 px-4 text-slate-300">{rest.ownerEmail}</td>
                          <td className="py-4 px-4">
                            <span className="bg-slate-800 border border-slate-700 text-slate-200 px-2 py-0.5 rounded text-[10px] font-bold">
                              {rest.plan}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-slate-400">{rest.signupDate}</td>
                          <td className="py-4 px-4">
                            <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded ${
                              rest.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                              rest.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                              'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            }`}>
                              {rest.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 font-black text-white">${rest.revenue.toFixed(2)}</td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex gap-1.5 justify-end">
                              {rest.status === 'pending' && (
                                <button 
                                  onClick={() => handleApproveRestaurant(rest.id)}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-slate-950 font-black text-[10px] px-2.5 py-1 rounded"
                                >
                                  Approve
                                </button>
                              )}
                              {rest.status === 'active' && (
                                <button 
                                  onClick={() => handleSuspendRestaurant(rest.id)}
                                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[10px] px-2.5 py-1 rounded border border-slate-700"
                                >
                                  Suspend
                                </button>
                              )}
                              {rest.status === 'suspended' && (
                                <button 
                                  onClick={() => handleActivateRestaurant(rest.id)}
                                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[10px] px-2.5 py-1 rounded border border-slate-700"
                                >
                                  Activate
                                </button>
                              )}
                              <button 
                                onClick={() => handleDeleteRestaurant(rest.id)}
                                className="bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 font-bold text-[10px] px-2 py-1 rounded"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: SUBSCRIPTION PLANS */}
          {activeTab === 'super_plans' && (
            <div className="grid md:grid-cols-3 gap-6 text-left">
              {plans.map(p => (
                <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-black text-white text-base">{p.name}</h3>
                      <span className="bg-slate-800 text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded font-mono">{p.id}</span>
                    </div>

                    <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                      <label className="text-[10px] text-slate-500 font-black uppercase tracking-wide block mb-1">Monthly Pricing ($)</label>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-slate-400">$</span>
                        <input 
                          type="number"
                          value={p.price}
                          onChange={(e) => handleUpdatePlanPrice(p.id, parseInt(e.target.value) || 0)}
                          className="bg-transparent text-xl font-black text-white focus:outline-none w-24"
                        />
                        <span className="text-xs text-slate-500 font-bold">/ month</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider block">Features included</span>
                      {p.features.map((feat, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs font-semibold text-slate-300">
                          <CheckCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-800/80 mt-6">
                    <button 
                      onClick={() => triggerNotification(`Successfully persisted edits for subscription tier ${p.name}.`)}
                      className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-2 rounded-xl transition-all border border-slate-700"
                    >
                      Save Tier Edits
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB: SYSTEM USERS */}
          {activeTab === 'super_users' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-left">
              <h2 className="text-base font-black text-white mb-2">Registered platform user accounts</h2>
              <p className="text-xs text-slate-400 mb-6">Manage login privileges and roles across all platform layers.</p>

              <div className="overflow-x-auto">
                <table className="w-full text-xs font-semibold text-left">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-500 text-[10px] uppercase tracking-wider">
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Email Address</th>
                      <th className="py-3 px-4">Role Assigned</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-slate-800/20 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            {u.avatar ? (
                              <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover border border-slate-700 shadow-sm" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-xs border border-slate-700">
                                {u.name.charAt(0)}
                              </div>
                            )}
                            <div>
                              <span className="font-bold text-white block">{u.name}</span>
                              <span className="text-[10px] text-slate-500 block font-mono">{u.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-slate-300 font-mono">{u.email}</td>
                        <td className="py-4 px-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            u.role === 'SaaS Owner' ? 'bg-slate-800 text-slate-200 border border-slate-700' :
                            u.role === 'Restaurant Owner' ? 'bg-emerald-950 text-emerald-300' :
                            u.role === 'Staff' ? 'bg-blue-950 text-blue-300' :
                            'bg-orange-950 text-orange-300'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`w-2.5 h-2.5 rounded-full inline-block mr-2 ${u.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          <span className="capitalize">{u.status}</span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button 
                            onClick={() => handleToggleUserStatus(u.id)}
                            className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg border border-slate-700"
                          >
                            Toggle Status
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: GEMINI AI BILLING */}
          {activeTab === 'super_ai_usage' && (
            <div className="grid lg:grid-cols-3 gap-6 items-start text-left">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                  <h3 className="font-black text-white text-base mb-2">Gemini 3.5 LLM Service Meter</h3>
                  <p className="text-xs text-slate-400 mb-6">Real-time telemetry mapping prompts, tokens, and billing logs on the Google AI Studio pipeline.</p>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Total Tokens Metered</span>
                      <strong className="text-lg font-black text-white block mt-1">98,421</strong>
                    </div>
                    <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">API Latency Avg</span>
                      <strong className="text-lg font-black text-white block mt-1">840ms</strong>
                    </div>
                    <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Total Platform Cost</span>
                      <strong className="text-lg font-black text-white block mt-1">$0.18</strong>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-slate-400">Total Prompt Tokens (Limit: 5M/mo)</span>
                        <span className="text-slate-200">98.4k / 5M</span>
                      </div>
                      <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                        <div className="h-full bg-slate-400" style={{ width: '2%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                  <h3 className="font-black text-white text-base mb-4">API Key Configuration</h3>
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-400 flex items-center justify-between">
                    <span>GEMINI_API_KEY_SECURE_VAL</span>
                    <span className="font-bold text-white">••••••••••••••••••••••••••••••••</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                <h3 className="font-black text-white text-base">SaaS AI Capabilities</h3>
                <div className="space-y-3 text-xs font-semibold">
                  <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl flex gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-white font-bold block">AI Menu Generator</span>
                      <span className="text-slate-500 text-[11px]">Generate specialized food dishes from any cuisine.</span>
                    </div>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl flex gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-white font-bold block">AI Dish Description Synthesizer</span>
                      <span className="text-slate-500 text-[11px]">Creates high-converting appetizing copy based on ingredients.</span>
                    </div>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl flex gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-white font-bold block">CRM Smart Support Bot</span>
                      <span className="text-slate-500 text-[11px]">Answers customer order status and coordinates in real-time.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: SYSTEM TERMINAL LOGS */}
          {activeTab === 'super_audit_logs' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-left space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-base font-black text-white">System Operations Terminal</h2>
                  <span className="text-xs text-slate-400">Live operational container and cluster stream logs</span>
                </div>
                <button 
                  onClick={() => {
                    setAuditLogs(prev => [`[${new Date().toLocaleTimeString()}] [INFO] Admin requested fresh health diagnostics. All services validated green.`, ...prev]);
                    triggerNotification('Fetched live diagnostics logs.');
                  }}
                  className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Force Diagnostics
                </button>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl font-mono text-[11px] text-emerald-400 space-y-2 max-h-[400px] overflow-y-auto">
                {auditLogs.map((log, idx) => (
                  <div key={idx} className="leading-relaxed whitespace-pre-wrap">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: PLATFORM BRANDING */}
          {activeTab === 'super_branding' && (
            <div className="grid lg:grid-cols-2 gap-6 text-left">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-5">
                <h3 className="font-black text-white text-base border-b border-slate-800 pb-3">White-Label Configurations</h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] text-slate-500 font-black uppercase tracking-wider block mb-1.5">SaaS Platform Title</label>
                    <input 
                      type="text" 
                      value={platformBranding.title}
                      onChange={(e) => setPlatformBranding(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-slate-400"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 font-black uppercase tracking-wider block mb-1.5">Primary Branding Hex Color</label>
                    <div className="flex gap-2">
                      <input 
                        type="color" 
                        value={platformBranding.accentColor}
                        onChange={(e) => setPlatformBranding(prev => ({ ...prev, accentColor: e.target.value }))}
                        className="w-10 h-10 bg-slate-950 border border-slate-800 rounded-xl p-1 cursor-pointer focus:outline-none"
                      />
                      <input 
                        type="text" 
                        value={platformBranding.accentColor}
                        onChange={(e) => setPlatformBranding(prev => ({ ...prev, accentColor: e.target.value }))}
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-bold font-mono text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 font-black uppercase tracking-wider block mb-1.5">Default Operations Support Email</label>
                    <input 
                      type="email" 
                      value={platformBranding.supportEmail}
                      onChange={(e) => setPlatformBranding(prev => ({ ...prev, supportEmail: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-bold text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={() => {
                      triggerNotification('SaaS platform branding changes saved securely.');
                      setAuditLogs(logs => [`[${new Date().toLocaleTimeString()}] [AUDIT] Saved white-label configuration changes.`, ...logs]);
                    }}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-2.5 rounded-xl border border-slate-700"
                  >
                    Save Branding Configurations
                  </button>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="font-black text-white text-base border-b border-slate-800 pb-3">Branding Preview</h3>
                  
                  <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: platformBranding.accentColor }} />
                      <strong className="text-white text-sm font-black">{platformBranding.title}</strong>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      This is a real-time representation of how the platform wordmark renders to merchants and end-users during white-labeled login sessions.
                    </p>
                    <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-[10px] font-mono text-slate-500">
                      SUPPORT: {platformBranding.supportEmail}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-[11px] text-slate-500 leading-relaxed">
                  <strong>White-Label Domain Redirection Mode</strong> is currently <span className="text-emerald-400 font-bold">Enabled</span>. Your merchant customized web pages automatically inherit these parameters unless they configure third-party DNS overlays.
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
}
