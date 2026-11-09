import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ShieldAlert, AlertCircle, X, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { loginUser } from '../../services/api';
import heroLogo from '../../assets/HeroLogo.jpg';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated as administrator
  useEffect(() => {
    if (isLoggedIn && user?.role === 'admin') {
      const destination = location.state?.from?.pathname || '/admin';
      navigate(destination, { replace: true });
    }
  }, [isLoggedIn, user, navigate, location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setError('Please provide both your staff email and password.');
      return;
    }

    setLoading(true);

    try {
      const res = await loginUser({ email: trimmedEmail, password });
      const data = res.data;

      if (!data?.user || !data?.token) {
        throw new Error('Authentication succeeded but received malformed profile from server.');
      }

      // Role check: Only users with 'admin' role may access management
      if (data.user.role !== 'admin') {
        setError('Access denied: This account does not possess administrative privileges.');
        setLoading(false);
        return;
      }

      // Validated Admin
      login(data.user, data.token);

      const destination = location.state?.from?.pathname || '/admin';
      navigate(destination, { replace: true });
    } catch (err) {
      console.error('[AdminLogin] Error authenticating:', err);
      const serverMessage =
        err.response?.data?.message || err.message || 'Unable to authenticate. Please check your credentials.';
      setError(serverMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg-hero flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-montserrat select-none">
      {/* Subtle Artisanal Bakery Background Pattern Watermark */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-brand-border/30 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-brand-primary/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl max-h-4xl bg-[radial-gradient(#F0D5D4_1px,transparent_1px)] [background-size:24px_24px] opacity-35" />
      </div>

      {/* Main Centered Card Container */}
      <div className="relative z-10 w-full max-w-md bg-brand-surface border border-brand-border rounded-2xl shadow-xl p-6 sm:p-8 transition-all">
        {/* Header Section */}
        <div className="text-center mb-6">
          {/* Logo & Brand Name */}
          <div className="flex flex-col items-center gap-2 mb-3">
            <div className="w-12 h-12 rounded-2xl overflow-hidden bg-brand-bg-hero p-0.5 border border-brand-border shadow-xs">
              <img
                src={heroLogo}
                alt="Cake of Paradise Logo"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <span className="font-serif italic text-base text-brand-accent tracking-wide">
              Cake of Paradise
            </span>
          </div>

          {/* Screen Title */}
          <h1 className="font-serif text-2xl font-bold text-brand-text-dark">
            Staff Portal
          </h1>

          {/* Subtitle */}
          <p className="text-xs text-brand-text-muted mt-1.5 leading-relaxed max-w-xs mx-auto">
            Enter your authorized credentials to access the bakery management dashboard.
          </p>

          {/* Restricted Access Badge */}
          <div className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-bg-hero border border-brand-border text-[11px] font-semibold text-brand-accent shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />
            <span>Restricted Access • Staff Only</span>
          </div>
        </div>

        {/* Error Alert Banner */}
        {error && (
          <div
            className="mb-5 bg-red-50 text-red-700 border border-red-200 text-xs p-3 rounded-lg flex items-start justify-between gap-2 animate-in fade-in duration-200"
            role="alert"
          >
            <div className="flex items-start gap-2">
              <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
              <span className="leading-snug">{error}</span>
            </div>
            <button
              type="button"
              onClick={() => setError('')}
              className="text-red-500 hover:text-red-700 p-0.5 rounded transition-colors shrink-0"
              aria-label="Dismiss error"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Form Elements */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <label
              htmlFor="admin-email"
              className="block text-xs font-semibold uppercase tracking-wider text-brand-text-dark mb-1.5"
            >
              Staff Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-text-muted">
                <Mail size={16} />
              </div>
              <input
                id="admin-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@cakeofparadise.com"
                disabled={loading}
                className="w-full pl-10 pr-3.5 py-2.5 bg-brand-surface border border-brand-border focus:border-brand-accent focus:ring-1 focus:ring-brand-accent text-brand-text-body text-sm rounded-lg outline-none transition-all placeholder:text-brand-text-muted/60 disabled:opacity-60"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="admin-password"
              className="block text-xs font-semibold uppercase tracking-wider text-brand-text-dark mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-text-muted">
                <Lock size={16} />
              </div>
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                disabled={loading}
                className="w-full pl-10 pr-10 py-2.5 bg-brand-surface border border-brand-border focus:border-brand-accent focus:ring-1 focus:ring-brand-accent text-brand-text-body text-sm rounded-lg outline-none transition-all placeholder:text-brand-text-muted/60 disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-brand-text-muted hover:text-brand-text-dark transition-colors cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-primary hover:bg-brand-primary-hover text-white font-medium rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin text-white" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Access Management Dashboard</span>
            )}
          </button>
        </form>

        {/* Footer Security Notice & Return Link */}
        <div className="mt-6 pt-5 border-t border-brand-border text-center space-y-3">
          <p className="text-[11px] text-brand-text-muted leading-tight">
            Unauthorized access attempts are logged and monitored.
          </p>

          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-brand-accent hover:underline font-medium transition-colors"
            >
              <ArrowLeft size={13} />
              <span>Return to Cake of Paradise Store</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

