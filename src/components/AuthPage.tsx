import React, { useState } from 'react';
import { Utensils, Mail, Lock, User, ArrowLeft, ArrowRight, ShieldCheck, Key, Shield, Store, Users, UserCheck } from 'lucide-react';

interface AuthPageProps {
  initialMode?: 'login' | 'signup' | 'forgot' | 'verify';
  onNavigate: (page: string) => void;
  onLoginSuccess: (userEmail: string, role: 'super_admin' | 'restaurant_owner' | 'staff' | 'customer') => void;
}

type UserRole = 'super_admin' | 'restaurant_owner' | 'staff' | 'customer';

export default function AuthPage({ initialMode = 'login', onNavigate, onLoginSuccess }: AuthPageProps) {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot' | 'verify'>(initialMode);
  const [selectedRole, setSelectedRole] = useState<UserRole>('restaurant_owner');
  const [email, setEmail] = useState('demo@restaurant.com');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Urban Kitchen');
  const [verificationCode, setVerificationCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Helper to change role and auto-populate demo credentials for seamless testing
  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setStatusMessage(null);
    if (role === 'restaurant_owner') {
      setEmail('owner@kitchen.com');
      setPassword('password123');
    } else if (role === 'staff') {
      setEmail('chef@kitchen.com');
      setPassword('password123');
    } else if (role === 'super_admin') {
      setEmail('admin@globite.com');
      setPassword('password123');
    } else if (role === 'customer') {
      setEmail('customer@gmail.com');
      setPassword('password123');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);

    setTimeout(() => {
      setIsSubmitting(false);
      if (mode === 'login') {
        onLoginSuccess(email, selectedRole);
        onNavigate('dashboard');
      } else if (mode === 'signup') {
        setStatusMessage('Account request registered! We sent a 6-digit confirmation code to your email.');
        setMode('verify');
      } else if (mode === 'forgot') {
        setStatusMessage('If this account exists, we sent instructions to reset your password.');
      } else if (mode === 'verify') {
        onLoginSuccess(email, 'restaurant_owner');
        onNavigate('dashboard');
      }
    }, 900);
  };

  // Theme configuration based on the selected role
  const getThemeClasses = () => {
    switch (selectedRole) {
      case 'super_admin':
        return {
          accentText: 'text-slate-900',
          accentBg: 'bg-slate-900',
          hoverBg: 'hover:bg-slate-800',
          borderAccent: 'border-slate-900',
          pillBg: 'bg-slate-100 text-slate-800 border-slate-200',
          badgeText: 'text-slate-500',
          brandHeader: 'CONSOLE V2.6'
        };
      case 'restaurant_owner':
        return {
          accentText: 'text-emerald-600',
          accentBg: 'bg-emerald-600',
          hoverBg: 'hover:bg-emerald-700',
          borderAccent: 'border-emerald-600',
          pillBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          badgeText: 'text-emerald-500',
          brandHeader: 'MERCHANT HUB'
        };
      case 'staff':
        return {
          accentText: 'text-blue-600',
          accentBg: 'bg-blue-600',
          hoverBg: 'hover:bg-blue-700',
          borderAccent: 'border-blue-600',
          pillBg: 'bg-blue-50 text-blue-800 border-blue-200',
          badgeText: 'text-blue-500',
          brandHeader: 'STAFF PORTAL'
        };
      case 'customer':
        return {
          accentText: 'text-orange-600',
          accentBg: 'bg-orange-600',
          hoverBg: 'hover:bg-orange-700',
          borderAccent: 'border-orange-600',
          pillBg: 'bg-orange-50 text-orange-800 border-orange-200',
          badgeText: 'text-orange-500',
          brandHeader: 'STOREFRONT'
        };
    }
  };

  const theme = getThemeClasses();

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex items-center justify-center p-6 text-left">
      {/* Container Card */}
      <div className="bg-white border border-slate-200 shadow-2xl rounded-3xl w-full max-w-6xl grid lg:grid-cols-12 overflow-hidden">
        
        {/* Left Hand Visual Hero Panel */}
        <div className="lg:col-span-5 bg-gradient-to-tr from-slate-900 via-slate-950 to-slate-900 p-10 text-white flex flex-col justify-between relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.15),transparent_60%)]" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onNavigate('landing')}>
              <div className="bg-orange-600 text-white p-2 rounded-xl">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight text-white block">GloBite</span>
                <span className="text-[9px] font-mono block text-orange-400 tracking-widest font-bold leading-none">{theme.brandHeader}</span>
              </div>
            </div>

            <div className="mt-16">
              <h2 className="text-3xl font-extrabold tracking-tight text-white leading-snug">
                Powering the world's finest direct eateries.
              </h2>
              <p className="text-sm text-slate-400 mt-4 leading-relaxed">
                Connect your physical POS, manage online reservations, draft elegant AI menus, and launch geofenced delivery zones in minutes.
              </p>
            </div>
          </div>

          <div className="relative z-10 border-t border-slate-800/80 pt-6 mt-12 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-slate-400">99.99% Node Cluster Response Live</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Approved by over 12,500 active restaurants, and delivering commission-free delight on every table booking.
            </p>
          </div>
        </div>

        {/* Right Hand Interactive Form Panel */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
          <div className="mb-6">
            <button 
              id="back-to-landing-btn"
              onClick={() => onNavigate('landing')}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-bold transition-colors mb-6"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Marketing Website
            </button>

            {mode === 'login' && (
              <>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Welcome to GloBite</h1>
                <p className="text-slate-500 text-sm mt-1">Select your user role to enter the correct portal workspace.</p>
              </>
            )}
            {mode === 'signup' && (
              <>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Launch commission-free</h1>
                <p className="text-slate-500 text-sm mt-1">Join thousands of high-profit restaurant owners today.</p>
              </>
            )}
            {mode === 'forgot' && (
              <>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Recover access key</h1>
                <p className="text-slate-500 text-sm mt-1">We'll email you credentials immediately.</p>
              </>
            )}
            {mode === 'verify' && (
              <>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Verification required</h1>
                <p className="text-slate-500 text-sm mt-1">Confirm your active merchant workspace email.</p>
              </>
            )}
          </div>

          {/* Interactive Role Selector tabs - ONLY shown in Login mode to satisfy "Each login redirects to correct dashboard" */}
          {mode === 'login' && (
            <div className="mb-6 bg-slate-100 p-1.5 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-1.5 border border-slate-200">
              <button
                type="button"
                id="login-role-owner-btn"
                onClick={() => handleRoleSelect('restaurant_owner')}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                  selectedRole === 'restaurant_owner'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Store className="w-4 h-4" />
                <span>Owner</span>
              </button>
              
              <button
                type="button"
                id="login-role-staff-btn"
                onClick={() => handleRoleSelect('staff')}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                  selectedRole === 'staff'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Staff</span>
              </button>

              <button
                type="button"
                id="login-role-customer-btn"
                onClick={() => handleRoleSelect('customer')}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                  selectedRole === 'customer'
                    ? 'bg-orange-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Customer</span>
              </button>

              <button
                type="button"
                id="login-role-super-btn"
                onClick={() => handleRoleSelect('super_admin')}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                  selectedRole === 'super_admin'
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Super Admin</span>
              </button>
            </div>
          )}

          {/* Role explanation subtitle based on choice */}
          {mode === 'login' && (
            <div className={`p-3.5 mb-6 rounded-xl border text-xs font-medium leading-relaxed ${theme.pillBg}`}>
              {selectedRole === 'super_admin' && (
                <p>
                  🛡️ <strong>Platform Owner Workspace:</strong> Manage global SaaS properties, approve or suspend restaurant networks, monitor revenue growth, and regulate plan tiers.
                </p>
              )}
              {selectedRole === 'restaurant_owner' && (
                <p>
                  🌱 <strong>Restaurant Admin:</strong> Manage orders, configure menus, adjust physical table reservations, customize your web template, and build push marketing campaigns.
                </p>
              )}
              {selectedRole === 'staff' && (
                <p>
                  💼 <strong>Kitchen & Counter Operations:</strong> Access orders, reservation lists, and basic kitchen dashboards without administrative settings access.
                </p>
              )}
              {selectedRole === 'customer' && (
                <p>
                  🛒 <strong>Guest Profile:</strong> Browse live menus, check out, track order status timelines, edit delivery addresses, and claim loyalty rewards.
                </p>
              )}
            </div>
          )}

          {statusMessage && (
            <div className="bg-orange-50 border border-orange-200 text-orange-900 text-xs font-bold p-4 rounded-xl mb-6">
              {statusMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Restaurant Name</label>
                <div className="relative">
                  <Store className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                  <input 
                    id="input-signup-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Urban Kitchen Bistro"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 transition-colors"
                  />
                </div>
              </div>
            )}

            {mode !== 'verify' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Account Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                  <input 
                    id="input-auth-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@restaurant.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 transition-colors"
                  />
                </div>
              </div>
            )}

            {(mode === 'login' || mode === 'signup') && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Security Key / Password</label>
                  {mode === 'login' && (
                    <button 
                      id="btn-goto-forgot"
                      type="button" 
                      onClick={() => setMode('forgot')}
                      className={`text-xs font-bold ${theme.accentText} hover:underline`}
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                  <input 
                    id="input-auth-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 transition-colors"
                  />
                </div>
              </div>
            )}

            {mode === 'verify' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Enter 6-Digit Verification Code</label>
                <div className="relative">
                  <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                  <input 
                    id="input-auth-verification"
                    type="text"
                    required
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm font-bold tracking-widest text-slate-800 text-center placeholder:tracking-normal placeholder:text-slate-400 focus:outline-none focus:border-slate-900 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Visual Quick Fill helper box for evaluation */}
            {mode === 'login' && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[10px] text-slate-500 flex justify-between items-center">
                <span>⚡ Demo Mode: Credentials auto-filled! Click to log in.</span>
                <span className="font-bold text-slate-800 uppercase px-2 py-0.5 bg-slate-200/80 rounded-md">READY</span>
              </div>
            )}

            <button
              id="auth-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className={`w-full ${theme.accentBg} ${theme.hoverBg} text-white font-bold text-sm py-3.5 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2`}
            >
              {isSubmitting ? (
                <span>Securing Environment...</span>
              ) : (
                <>
                  {mode === 'login' && <span>Access {selectedRole.replace('_', ' ')} Dashboard</span>}
                  {mode === 'signup' && <span>Create My Restaurant Workspace</span>}
                  {mode === 'forgot' && <span>Generate Restore Link</span>}
                  {mode === 'verify' && <span>Verify & Authenticate</span>}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
            {mode === 'login' ? (
              <span>
                New to GloBite?{' '}
                <button 
                  id="link-goto-signup"
                  onClick={() => setMode('signup')}
                  className="font-bold text-orange-600 hover:text-orange-700 hover:underline"
                >
                  Create free owner account
                </button>
              </span>
            ) : (
              <span>
                Already registered?{' '}
                <button 
                  id="link-goto-login"
                  onClick={() => setMode('login')}
                  className="font-bold text-orange-600 hover:text-orange-700 hover:underline"
                >
                  Sign in here
                </button>
              </span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
