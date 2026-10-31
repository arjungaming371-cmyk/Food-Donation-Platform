'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Heart, Lock, Mail, ArrowRight, Sparkles, Utensils, HeartHandshake, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, demoLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    const res = await login(email, password);
    if (!res.success) {
      setErrorMsg(res.error || 'Failed to login');
      setLoading(false);
    } else {
      router.push(res.redirectPath || '/');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-stone-50/50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-forest-700 mx-auto flex items-center justify-center text-white shadow-md shadow-forest-700/20">
            <Heart className="w-6 h-6 fill-white" />
          </div>
          <h2 className="mt-4 text-2xl font-black text-gray-900 tracking-tight">
            Sign in to FoodBridge
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            Select an account or use one-click demo credentials below
          </p>
        </div>

        {/* 1-Click Demo Evaluation Box */}
        <div className="bg-forest-900 text-white rounded-2xl p-4 shadow-lg border border-forest-800">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hackathon Evaluation Accounts (1-Click Login):</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => demoLogin('DONOR')}
              type="button"
              className="p-2.5 rounded-xl bg-forest-800 hover:bg-forest-700 border border-forest-700 text-left transition-all group"
            >
              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-300">
                <Utensils className="w-3 h-3" />
                <span>Donor</span>
              </div>
              <p className="text-[10px] text-gray-300 mt-0.5 truncate">Paradise Biryani</p>
            </button>

            <button
              onClick={() => demoLogin('RECIPIENT')}
              type="button"
              className="p-2.5 rounded-xl bg-forest-800 hover:bg-forest-700 border border-forest-700 text-left transition-all group"
            >
              <div className="flex items-center gap-1 text-[11px] font-bold text-teal-300">
                <HeartHandshake className="w-3 h-3" />
                <span>NGO Org</span>
              </div>
              <p className="text-[10px] text-gray-300 mt-0.5 truncate">Hope Foundation</p>
            </button>

            <button
              onClick={() => demoLogin('ADMIN')}
              type="button"
              className="p-2.5 rounded-xl bg-forest-800 hover:bg-forest-700 border border-forest-700 text-left transition-all group"
            >
              <div className="flex items-center gap-1 text-[11px] font-bold text-amber-300">
                <ShieldCheck className="w-3 h-3" />
                <span>Admin</span>
              </div>
              <p className="text-[10px] text-gray-300 mt-0.5 truncate">System Admin</p>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-sm">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="donor1@foodbridge.org"
                  className="w-full pl-10 pr-3.5 py-2.5 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-forest-700 hover:bg-forest-800 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-forest-700/20 transition-all flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-500">
            Don't have an account?{' '}
            <Link href="/register" className="font-bold text-forest-700 hover:underline">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
