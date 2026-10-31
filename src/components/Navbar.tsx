'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  Heart,
  Globe,
  Bell,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  PlusCircle,
  FileText,
  Shield,
  CheckCircle,
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, unreadNotifications, refreshNotifications } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpenNotifications = async () => {
    setNotificationsOpen(!notificationsOpen);
    if (!notificationsOpen) {
      try {
        const res = await fetch('/api/notifications');
        const data = await res.json();
        if (data.notifications) {
          setNotifications(data.notifications);
        }
        await fetch('/api/notifications', { method: 'PATCH' });
        refreshNotifications();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'ADMIN') return '/admin/dashboard';
    if (user.role === 'DONOR') return '/donor/dashboard';
    return '/recipient/dashboard';
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-forest-700 to-forest-500 flex items-center justify-center text-white shadow-md shadow-forest-600/20 group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5 fill-white text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-gray-900 group-hover:text-forest-700 transition-colors">
                Food<span className="text-forest-600">Bridge</span>
              </span>
              <span className="block text-[10px] text-gray-400 font-medium tracking-wide -mt-1">
                Zero Waste Initiative
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/demo"
              className="text-xs font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 shadow-sm"
            >
              <span>▶ Auto-Demo Walkthrough</span>
            </Link>
            <Link
              href="/recipient/explore"
              className="text-sm font-medium text-gray-600 hover:text-forest-700 transition-colors"
            >
              {t('exploreFood')}
            </Link>
            <Link
              href="/impact"
              className="text-sm font-medium text-gray-600 hover:text-forest-700 transition-colors"
            >
              Impact
            </Link>
            <Link
              href="/how-it-works"
              className="text-sm font-medium text-gray-600 hover:text-forest-700 transition-colors"
            >
              {t('howItWorks')}
            </Link>
            <Link
              href="/safety"
              className="text-sm font-medium text-gray-600 hover:text-forest-700 transition-colors"
            >
              {t('safetyGuidelines')}
            </Link>
          </div>

          {/* Right Controls */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Switcher */}
            <div className="relative flex items-center bg-gray-100 rounded-lg p-1 text-xs">
              <Globe className="w-3.5 h-3.5 text-gray-500 ml-1.5 mr-1" />
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded font-medium transition-all ${
                  language === 'en' ? 'bg-white text-forest-800 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('te')}
                className={`px-2 py-0.5 rounded font-medium transition-all ${
                  language === 'te' ? 'bg-white text-forest-800 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                }`}
                title="తెలుగు"
              >
                తెలుగు
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2 py-0.5 rounded font-medium transition-all ${
                  language === 'hi' ? 'bg-white text-forest-800 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                }`}
                title="हिन्दी"
              >
                हिन्दी
              </button>
            </div>

            {/* Notification Bell */}
            {user && (
              <div className="relative" ref={notifRef}>
                <button
                  onClick={handleOpenNotifications}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors relative"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                      {unreadNotifications}
                    </span>
                  )}
                </button>

                {/* Notifications Popup */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                      <span className="font-semibold text-gray-800 text-sm">Notifications</span>
                      <span className="text-xs text-forest-600 bg-forest-50 px-2 py-0.5 rounded-full font-medium">
                        Live Updates
                      </span>
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-xs text-gray-400">
                          No notifications yet.
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <Link
                            key={n.id}
                            href={n.link || '#'}
                            onClick={() => setNotificationsOpen(false)}
                            className="p-3 block hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-forest-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <div className="text-xs font-semibold text-gray-800">{n.title}</div>
                                <div className="text-[11px] text-gray-600 mt-0.5">{n.message}</div>
                                <div className="text-[10px] text-gray-400 mt-1">
                                  {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Menu or Auth Buttons */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 bg-forest-50 hover:bg-forest-100 border border-forest-200/60 rounded-full transition-all text-forest-900"
                >
                  <div className="w-7 h-7 rounded-full bg-forest-700 text-white font-bold text-xs flex items-center justify-center">
                    {user.name.charAt(0)}
                  </div>
                  <div className="text-left text-xs">
                    <span className="block font-semibold leading-tight">{user.name.split(' ')[0]}</span>
                    <span className="block text-[10px] text-forest-600 font-medium leading-none">{user.role}</span>
                  </div>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs font-semibold text-gray-900">{user.name}</p>
                      <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 bg-forest-100 text-forest-800 rounded">
                        {user.role}
                      </span>
                    </div>

                    <Link
                      href={getDashboardLink()}
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                    >
                      <LayoutDashboard className="w-4 h-4 text-gray-500" />
                      Dashboard
                    </Link>

                    {user.role === 'DONOR' && (
                      <Link
                        href="/donor/create-listing"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                      >
                        <PlusCircle className="w-4 h-4 text-forest-600" />
                        Create Food Listing
                      </Link>
                    )}

                    {user.role === 'ADMIN' && (
                      <Link
                        href="/admin/reports"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                      >
                        <Shield className="w-4 h-4 text-amber-600" />
                        Moderation & Reports
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 border-t border-gray-100"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-gray-700 hover:text-forest-700 transition-colors"
                >
                  {t('login')}
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-xs font-semibold text-white bg-forest-700 hover:bg-forest-800 rounded-lg shadow-sm shadow-forest-700/20 transition-all hover:scale-[1.02]"
                >
                  {t('register')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 pt-2 pb-4 space-y-2">
          <Link
            href="/recipient/explore"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
          >
            {t('exploreFood')}
          </Link>
          <Link
            href="/impact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
          >
            Impact Dashboard
          </Link>
          <Link
            href="/how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
          >
            {t('howItWorks')}
          </Link>
          <Link
            href="/safety"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
          >
            {t('safetyGuidelines')}
          </Link>

          {user ? (
            <>
              <Link
                href={getDashboardLink()}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-forest-800 bg-forest-50 rounded-lg"
              >
                Go to Dashboard ({user.role})
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
              >
                Log Out
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg"
              >
                {t('login')}
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center px-4 py-2 text-sm font-medium text-white bg-forest-700 rounded-lg"
              >
                {t('register')}
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
