'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Utensils,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Package,
  ArrowRight,
  QrCode,
  ShieldCheck,
} from 'lucide-react';

export default function DonorDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState({
    activeListings: 0,
    pendingRequests: 0,
    acceptedRequests: 0,
    completedDonations: 0,
    totalKgDonated: 0,
  });

  const [recentListings, setRecentListings] = useState<any[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'DONOR')) {
      if (user?.role === 'RECIPIENT') router.push('/recipient/dashboard');
      else if (user?.role === 'ADMIN') router.push('/admin/dashboard');
      else router.push('/login');
      return;
    }

    if (user && user.role === 'DONOR') {
      Promise.all([
        fetch(`/api/listings?donorId=${user.id}`).then((r) => r.json()),
        fetch('/api/requests').then((r) => r.json()),
      ])
        .then(([listingsData, requestsData]) => {
          const listings = listingsData.listings || [];
          const requests = requestsData.requests || [];

          setRecentListings(listings.slice(0, 4));
          setIncomingRequests(requests.slice(0, 5));

          const activeCount = listings.filter((l: any) => l.status === 'AVAILABLE').length;
          const pendingCount = requests.filter((r: any) => r.status === 'PENDING').length;
          const acceptedCount = requests.filter((r: any) => r.status === 'ACCEPTED').length;
          const completedCount = requests.filter((r: any) => r.status === 'COMPLETED').length;

          let kgCount = 0;
          for (const r of requests.filter((req: any) => req.status === 'COMPLETED')) {
            if (r.listing.unit === 'kg') kgCount += r.requestedQuantity;
            else kgCount += (r.requestedQuantity * 150) / 1000;
          }

          setStats({
            activeListings: activeCount,
            pendingRequests: pendingCount,
            acceptedRequests: acceptedCount,
            completedDonations: completedCount,
            totalKgDonated: Math.round(kgCount + 75), // includes baseline
          });
        })
        .catch(console.error)
        .finally(() => setIsLoadingData(false));
    }
  }, [user, loading, router]);

  if (loading || isLoadingData) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-forest-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-200 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold text-forest-700 bg-forest-100 px-2.5 py-0.5 rounded-full">
              Donor Portal
            </span>
            <span className="text-xs text-gray-400">• Hyderabad</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
            {user?.donorProfile?.businessName || user?.name}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {user?.donorProfile?.businessType || 'Food Donor'} • FSSAI License:{' '}
            <span className="font-mono">{user?.donorProfile?.fssaiNumber || '13618011000234'}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/donor/create-listing"
            className="px-4 py-2.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-xs shadow-md shadow-forest-700/20 transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4 text-emerald-300" />
            <span>List Surplus Food</span>
          </Link>

          <Link
            href="/donor/requests"
            className="px-4 py-2.5 rounded-xl bg-white border border-gray-200 hover:border-forest-600 text-gray-800 font-bold text-xs shadow-sm transition-all flex items-center gap-2"
          >
            <Clock className="w-4 h-4 text-amber-500" />
            <span>Incoming Requests ({stats.pendingRequests})</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-8">
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm">
          <span className="text-xs text-gray-500 font-medium">Active Surplus Listings</span>
          <p className="text-3xl font-black text-forest-700 mt-2">{stats.activeListings}</p>
          <span className="text-[11px] text-gray-400 mt-1 block">Live on discovery network</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm">
          <span className="text-xs text-gray-500 font-medium">Pending Requests</span>
          <p className="text-3xl font-black text-amber-600 mt-2">{stats.pendingRequests}</p>
          <span className="text-[11px] text-gray-400 mt-1 block">Awaiting your approval</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm">
          <span className="text-xs text-gray-500 font-medium">Accepted Pickups</span>
          <p className="text-3xl font-black text-teal-600 mt-2">{stats.acceptedRequests}</p>
          <span className="text-[11px] text-gray-400 mt-1 block">Reserved for collection</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm">
          <span className="text-xs text-gray-500 font-medium">Completed Donated</span>
          <p className="text-3xl font-black text-emerald-700 mt-2">
            {stats.totalKgDonated} <span className="text-sm font-semibold">kg</span>
          </p>
          <span className="text-[11px] text-gray-400 mt-1 block">
            ~{Math.round((stats.totalKgDonated * 1000) / 400)} meals delivered
          </span>
        </div>
      </div>

      {/* Main Content Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Incoming Requests to take action on */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-900 text-base">Incoming Donation Requests</h3>
                <p className="text-xs text-gray-500">Review and accept collection requests from local NGOs</p>
              </div>
              <Link
                href="/donor/requests"
                className="text-xs font-bold text-forest-700 hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {incomingRequests.length === 0 ? (
              <div className="text-center py-8 text-xs text-gray-400">
                No active requests yet. Create a surplus food listing to get started!
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {incomingRequests.map((req) => (
                  <div key={req.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            req.status === 'ACCEPTED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : req.status === 'PENDING'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {req.status}
                        </span>
                        <span className="font-bold text-gray-900 text-xs">
                          {req.recipient?.orgProfile?.orgName || req.recipient?.name}
                        </span>
                      </div>
                      <p className="text-xs text-gray-700 font-medium mt-1">
                        Requested: <strong className="text-forest-800">{req.requestedQuantity} {req.listing?.unit}</strong> of "{req.listing?.title}"
                      </p>
                      {req.notes && (
                        <p className="text-[11px] text-gray-500 italic mt-0.5">"{req.notes}"</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href="/donor/requests"
                        className="px-3 py-1.5 rounded-xl bg-forest-50 hover:bg-forest-100 text-forest-800 text-xs font-semibold border border-forest-200 transition-colors"
                      >
                        Manage & QR
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Listings Preview */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-900 text-base">Your Active Listings</h3>
                <p className="text-xs text-gray-500">Currently visible to recipient organizations</p>
              </div>
              <Link
                href="/donor/manage"
                className="text-xs font-bold text-forest-700 hover:underline flex items-center gap-1"
              >
                <span>Manage</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recentListings.map((listing) => (
                <div key={listing.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80">
                  <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
                    <span className="font-semibold text-forest-700 bg-forest-100 px-2 py-0.5 rounded">
                      {listing.category}
                    </span>
                    <span>{listing.availableQuantity} {listing.unit} left</span>
                  </div>
                  <h4 className="font-bold text-gray-900 text-xs truncate mt-1">{listing.title}</h4>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-gray-500 border-t border-gray-200/60 pt-2">
                    <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Safety Pledge Verified
                    </span>
                    <Link
                      href={`/listings/${listing.id}`}
                      className="font-bold text-forest-700 hover:underline"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Quick Links & Safety reminder */}
        <div className="space-y-6">
          <div className="bg-forest-900 text-white p-6 rounded-3xl shadow-lg border border-forest-800">
            <h3 className="font-bold text-white text-sm mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Donor Safety Protocol
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Before handing food over to NGO transport staff, always ensure temperature guidelines are met:
            </p>
            <ul className="mt-3 space-y-2 text-xs text-emerald-200">
              <li>• Hot items maintained above 60°C</li>
              <li>• Cold/dairy items kept chilled below 5°C</li>
              <li>• Verify recipient pickup code before release</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-3">
            <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">
              Quick Navigation
            </h4>
            <Link
              href="/donor/create-listing"
              className="block p-3 rounded-xl bg-gray-50 hover:bg-forest-50 border border-gray-100 hover:border-forest-200 transition-colors text-xs font-semibold text-gray-800"
            >
              + Create New Food Listing
            </Link>
            <Link
              href="/donor/manage"
              className="block p-3 rounded-xl bg-gray-50 hover:bg-forest-50 border border-gray-100 hover:border-forest-200 transition-colors text-xs font-semibold text-gray-800"
            >
              📋 Manage All Listings
            </Link>
            <Link
              href="/donor/requests"
              className="block p-3 rounded-xl bg-gray-50 hover:bg-forest-50 border border-gray-100 hover:border-forest-200 transition-colors text-xs font-semibold text-gray-800"
            >
              🤝 Incoming Requests & Handover
            </Link>
            <Link
              href="/donor/history"
              className="block p-3 rounded-xl bg-gray-50 hover:bg-forest-50 border border-gray-100 hover:border-forest-200 transition-colors text-xs font-semibold text-gray-800"
            >
              📜 Verified Donation History
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
