'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, Utensils, HeartHandshake, ShieldCheck, Key } from 'lucide-react';

export default function DemoBar() {
  const { demoLogin, user } = useAuth();

  return (
    <div className="bg-gradient-to-r from-forest-900 via-forest-800 to-forest-950 text-white text-xs py-2 px-4 shadow-sm border-b border-forest-700/50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold tracking-wide flex items-center gap-1.5 text-forest-100">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            HACK-P197 Demo Switcher:
          </span>
          <span className="text-forest-200 hidden sm:inline">
            Active: <strong className="text-white">{user ? `${user.name} (${user.role})` : 'Guest Visitor'}</strong>
          </span>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <Link
            href="/demo"
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-gray-950 px-3 py-1 rounded-full font-bold text-[11px] shadow-sm transition-all"
            title="Watch the Automated Step-by-Step Demo Process"
          >
            <span>▶ Auto-Demo Video Mode</span>
          </Link>

          <button
            onClick={() => demoLogin('DONOR')}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 active:bg-white/30 px-2.5 py-1 rounded-full text-white transition-all font-medium border border-white/10"
            title="Log in as Paradise Biryani (Donor)"
          >
            <Utensils className="w-3 h-3 text-amber-300" />
            <span>Donor Demo</span>
          </button>

          <button
            onClick={() => demoLogin('RECIPIENT')}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 active:bg-white/30 px-2.5 py-1 rounded-full text-white transition-all font-medium border border-white/10"
            title="Log in as Hope Community Foundation (NGO)"
          >
            <HeartHandshake className="w-3 h-3 text-emerald-300" />
            <span>NGO Demo</span>
          </button>

          <button
            onClick={() => demoLogin('ADMIN')}
            className="flex items-center gap-1.5 bg-amber-500/20 hover:bg-amber-500/30 active:bg-amber-500/40 px-2.5 py-1 rounded-full text-amber-200 transition-all font-medium border border-amber-400/30"
            title="Log in as System Admin"
          >
            <ShieldCheck className="w-3 h-3 text-amber-400" />
            <span>Admin Demo</span>
          </button>

          <a
            href="/login"
            className="flex items-center gap-1 text-forest-300 hover:text-white ml-2 transition-colors"
          >
            <Key className="w-3 h-3" />
            <span>Credentials</span>
          </a>
        </div>
      </div>
    </div>
  );
}
