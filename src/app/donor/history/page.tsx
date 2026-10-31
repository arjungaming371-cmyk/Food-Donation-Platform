'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, CheckCircle2, Award, Heart, Calendar } from 'lucide-react';

export default function DonorHistoryPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [history, setHistory] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'DONOR')) {
      router.push('/login');
      return;
    }

    if (user?.id) {
      fetch('/api/requests?status=COMPLETED')
        .then((r) => r.json())
        .then((d) => {
          if (d.requests) setHistory(d.requests);
        })
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
      <div className="mb-8">
        <Link
          href="/donor/dashboard"
          className="text-xs font-semibold text-gray-500 hover:text-forest-700 flex items-center gap-1 mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
          Verified Donation History
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Historical record of completed surplus redistributions with dual-party confirmations.
        </p>
      </div>

      {history.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-gray-200">
          <p className="text-sm font-bold text-gray-700">No completed donations yet.</p>
          <p className="text-xs text-gray-400 mt-1">
            Once you accept an NGO request and confirm pickup, it will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-teal-100 text-teal-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-teal-600" />
                    Verified Completed
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(req.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="font-bold text-gray-900 text-base">
                  {req.listing?.title}
                </h3>

                <p className="text-xs text-gray-600 mt-1">
                  Delivered to: <strong>{req.recipient?.orgProfile?.orgName || req.recipient?.name}</strong> • Quantity: <strong className="text-forest-800">{req.requestedQuantity} {req.listing?.unit}</strong>
                </p>
                <p className="text-[11px] text-gray-400 font-mono mt-0.5">
                  Verification Code: {req.pickupVerificationCode}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-gray-400 block">Estimated Impact</span>
                <span className="text-lg font-black text-forest-700">
                  ~{Math.round((req.requestedQuantity * 1000) / 400)} meals
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
