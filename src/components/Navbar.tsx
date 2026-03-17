import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, Settings, ShoppingBag, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/lib/supabase';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const { user } = useAuthStore();
  const location = useLocation();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const navLinks = [
    { to: '/', label: '首頁' },
    { to: '/products', label: '商品列表' },
    { to: '/contact', label: '聯絡我們' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b border-border-default bg-bg-dark/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="名將數位" className="h-10 w-10" />
          <span className="text-2xl font-bold tracking-wider text-primary">名將數位</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-colors ${
                isActive(link.to)
                  ? 'text-primary'
                  : 'text-text-secondary hover:text-primary'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Right */}
        <div className="hidden items-center gap-4 md:flex">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setAdminOpen(!adminOpen)}
                className="flex items-center gap-1 rounded-lg bg-bg-card px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-bg-card-hover"
              >
                <Settings className="h-4 w-4" />
                後台管理
                <ChevronDown className={`h-4 w-4 transition-transform ${adminOpen ? 'rotate-180' : ''}`} />
              </button>
              {adminOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-border-default bg-bg-card py-1 shadow-xl">
                  <Link
                    to="/admin/products"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-bg-card-hover hover:text-primary"
                    onClick={() => setAdminOpen(false)}
                  >
                    <ShoppingBag className="h-4 w-4" />
                    商品管理
                  </Link>
                  <Link
                    to="/admin/contact"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-bg-card-hover hover:text-primary"
                    onClick={() => setAdminOpen(false)}
                  >
                    <Settings className="h-4 w-4" />
                    聯絡資訊
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-danger hover:bg-bg-card-hover"
                  >
                    <LogOut className="h-4 w-4" />
                    登出
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/admin/login"
              className="rounded-lg border border-primary px-4 py-2 text-sm font-medium text-primary transition-all hover:bg-primary hover:text-bg-dark"
            >
              LOGIN
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-text-secondary md:hidden"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border-default bg-bg-dark px-4 pb-4 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`block py-3 text-sm font-medium ${
                isActive(link.to) ? 'text-primary' : 'text-text-secondary'
              }`}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link
                to="/admin/products"
                className="block py-3 text-sm text-text-secondary"
                onClick={() => setMobileOpen(false)}
              >
                商品管理
              </Link>
              <Link
                to="/admin/contact"
                className="block py-3 text-sm text-text-secondary"
                onClick={() => setMobileOpen(false)}
              >
                聯絡資訊
              </Link>
              <button
                onClick={handleSignOut}
                className="block py-3 text-sm text-danger"
              >
                登出
              </button>
            </>
          ) : (
            <Link
              to="/admin/login"
              className="block py-3 text-sm text-primary"
              onClick={() => setMobileOpen(false)}
            >
              LOGIN
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
