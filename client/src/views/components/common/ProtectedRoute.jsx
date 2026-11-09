import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Loader2 } from 'lucide-react';

/**
 * Reusable React Router guard checking AuthContext:
 * - Shows brand-themed loading spinner while auth status resolves.
 * - If unauthenticated, redirects to /admin/login preserving current location in state.
 * - If authenticated but user.role !== 'admin', redirects to home (/).
 * - If authenticated as admin, renders child route via <Outlet /> or children.
 */
export default function ProtectedRoute({ requireAdmin = false, children }) {
  const { user, loading, isLoggedIn } = useAuth();
  const location = useLocation();

  // 1. Show brand-themed loading state while auth restores from token
  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg-hero flex flex-col items-center justify-center p-6 text-center select-none font-montserrat">
        <div className="w-14 h-14 rounded-2xl bg-brand-surface border border-brand-border flex items-center justify-center shadow-sm mb-4">
          <Loader2 className="w-7 h-7 text-brand-primary animate-spin" />
        </div>
        <h2 className="font-playfair font-bold text-lg text-brand-text-dark">
          Verifying Staff Credentials
        </h2>
        <p className="text-xs text-brand-text-muted mt-1">
          Securing access to Cake of Paradise Management Portal...
        </p>
      </div>
    );
  }

  // 2. Unauthenticated: Redirect to /admin/login preserving attempt location
  if (!isLoggedIn || !user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // 3. Authenticated but lacks admin role when requireAdmin is true: Redirect to storefront
  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // 4. Authorized: Render matched route outlet or passed children
  return children ? children : <Outlet />;
}

