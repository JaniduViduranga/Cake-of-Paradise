import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import Modal from './Modal';

export default function LoginModal() {
  const { isLoginOpen, setIsLoginOpen, login, register } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await new Promise((r) => setTimeout(r, 600)); // mock delay
      if (mode === 'login') {
        const result = login({ email: form.email, password: form.password });
        if (!result.success) setError(result.error);
      } else {
        const result = register({ name: form.name, email: form.email, phone: form.phone });
        if (!result.success) setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode((m) => (m === 'login' ? 'register' : 'login'));
    setError('');
    setForm({ name: '', email: '', password: '', phone: '' });
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
              : 'Join us for exclusive offers and order tracking'}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="font-montserrat text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block font-montserrat text-xs font-semibold text-chocolate-800/70 mb-1.5 uppercase tracking-wide">
                Full Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="Jane Doe"
                required
                className="input-field"
              />
            </div>
          )}

          <div>
            <label className="block font-montserrat text-xs font-semibold text-chocolate-800/70 mb-1.5 uppercase tracking-wide">
              Email Address
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
              Password
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
          </div>

          {/* Hint */}
          {mode === 'login' && (
            <p className="font-montserrat text-xs text-chocolate-800/40 text-center">
              Demo: any email + any password
            </p>
          )}

          <button
            id="auth-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3.5 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
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
