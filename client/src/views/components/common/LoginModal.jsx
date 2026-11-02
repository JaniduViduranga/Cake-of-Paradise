import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import authService from '../../../services/authService';
import Modal from './Modal';

export default function LoginModal() {
  const {
    isLoginOpen,
    setIsLoginOpen,
    login,
    redirectPath,
    setRedirectPath,
  } = useAuth();

  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
  });

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'login') {
        const res = await authService.login({
          email: form.email.trim(),
          password: form.password,
        });

        if (res.success && res.token && res.user) {
          login(res.user, res.token);
          setIsLoginOpen(false);

          if (redirectPath) {
            navigate(redirectPath);
            if (setRedirectPath) setRedirectPath(null);
          }
        } else {
          setError(res.message || 'Failed to sign in.');
        }
      } else {
        const res = await authService.register({
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          password: form.password,
        });

        if (res.success && res.token && res.user) {
          login(res.user, res.token);
          setIsLoginOpen(false);

          if (redirectPath) {
            navigate(redirectPath);
            if (setRedirectPath) setRedirectPath(null);
          }
        } else {
          setError(res.message || 'Registration failed.');
        }
      }
    } catch (err) {
      const serverMessage =
        err.response?.data?.message ||
        err.message ||
        'Authentication failed. Please check your network and credentials.';
      setError(serverMessage);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode((m) => (m === 'login' ? 'register' : 'login'));
    setError('');
    setForm({ fullName: '', email: '', password: '', phone: '' });
  };

  return (
    <Modal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} maxWidth="max-w-md">
      <div className="px-8 py-8">
        {/* Header */}
        <div className="text-center mb-7">
          <p className="font-playfair italic text-caramel-600 text-lg mb-1">Cake of Paradise</p>
          <h2 className="font-playfair font-bold text-2xl text-chocolate-900">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="font-montserrat text-sm text-chocolate-800/50 mt-2">
            {mode === 'login'
              ? 'Sign in to track orders and manage your profile'
              : 'Join us for custom cake orders and order tracking'}
          </p>
        </div>

        {/* Backend validation error display */}
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle size={16} className="text-red-500 shrink-0" />
            <p className="font-montserrat text-xs sm:text-sm text-red-600 font-medium">
              {error}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block font-montserrat text-xs font-semibold text-chocolate-800/70 mb-1.5 uppercase tracking-wide">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => update('fullName', e.target.value)}
                placeholder="Jane Doe"
                required
                className="input-field"
              />
            </div>
          )}

          <div>
            <label className="block font-montserrat text-xs font-semibold text-chocolate-800/70 mb-1.5 uppercase tracking-wide">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              placeholder="jane@example.com"
              required
              className="input-field"
            />
          </div>

          {mode === 'register' && (
            <div>
              <label className="block font-montserrat text-xs font-semibold text-chocolate-800/70 mb-1.5 uppercase tracking-wide">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="input-field"
              />
            </div>
          )}

          <div>
            <label className="block font-montserrat text-xs font-semibold text-chocolate-800/70 mb-1.5 uppercase tracking-wide">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="input-field pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-chocolate-800/40 hover:text-chocolate-800/70"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {mode === 'register' && (
              <p className="text-[11px] text-chocolate-800/50 mt-1">
                Must be at least 6 characters.
              </p>
            )}
          </div>

          <button
            id="auth-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3.5 mt-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Please wait...</span>
              </>
            ) : mode === 'login' ? (
              'Sign In'
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="font-montserrat text-sm text-chocolate-800/50">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              onClick={switchMode}
              className="text-caramel-600 font-semibold hover:text-caramel-700 underline"
            >
              {mode === 'login' ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </Modal>
  );
}
