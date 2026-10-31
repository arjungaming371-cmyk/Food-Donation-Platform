'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Utensils,
  MapPin,
  Clock,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Thermometer,
  ArrowLeft,
  HeartHandshake,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import RequestModal from '@/components/RequestModal';
import ReportModal from '@/components/ReportModal';

export default function ListingDetailPage() {
  const { id } = useParams() as { id: string };
  const { user } = useAuth();
  const router = useRouter();

  const [listing, setListing] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetch(`/api/listings/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.listing) setListing(data.listing);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-forest-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="py-16 text-center">
        <h2 className="text-lg font-bold text-gray-800">Food listing not found</h2>
        <Link href="/recipient/explore" className="text-xs text-forest-700 font-bold hover:underline mt-2 inline-block">
          Return to Food Discovery
        </Link>
      </div>
    );
  }

  const hoursLeft = Math.max(
    0,
    (new Date(listing.pickupEndTime).getTime() - new Date().getTime()) / (1000 * 60 * 60)
  );

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <Link
        href="/recipient/explore"
        className="text-xs font-semibold text-gray-500 hover:text-forest-700 flex items-center gap-1 mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Food Discovery</span>
      </Link>

      <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
        {/* Hero image and status */}
        <div className="relative h-64 sm:h-80 w-full bg-gray-100">
          <img
            src={listing.imageUrl}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

          <div className="absolute top-4 left-4 flex gap-2">
            <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-forest-800 shadow-sm">
              {listing.category}
            </span>
            <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-emerald-800 shadow-sm">
              {listing.dietaryType}
            </span>
          </div>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
              {listing.donor?.donorProfile?.businessName || listing.donor?.name}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-0.5">{listing.title}</h1>
          </div>
        </div>

        {/* Content body */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Top highlight bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-forest-50/70 border border-forest-100">
            <div>
              <span className="text-[11px] text-gray-500 uppercase font-semibold">Available Batch</span>
              <p className="text-xl font-black text-forest-900 mt-0.5">
                {listing.availableQuantity} <span className="text-xs font-normal">{listing.unit}</span>
              </p>
            </div>

            <div>
              <span className="text-[11px] text-gray-500 uppercase font-semibold">Safe Window</span>
              <p className="text-xl font-black text-amber-700 mt-0.5">
                {hoursLeft.toFixed(1)} <span className="text-xs font-normal">hrs left</span>
              </p>
            </div>

            <div>
              <span className="text-[11px] text-gray-500 uppercase font-semibold">Storage Spec</span>
              <p className="text-sm font-bold text-gray-800 mt-1 truncate">
                {listing.storageCondition}
              </p>
            </div>

            <div>
              <span className="text-[11px] text-gray-500 uppercase font-semibold">Status</span>
              <p className="text-sm font-black text-emerald-700 mt-1 uppercase">
                {listing.status}
              </p>
            </div>
          </div>

          {/* Smart Match Factor Breakdown */}
          {listing.smartMatch && (
            <div className="bg-gradient-to-br from-forest-900 to-forest-950 text-white p-6 rounded-2xl shadow-lg border border-forest-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <h3 className="font-bold text-base text-white">Smart Match Compatibility Breakdown</h3>
                </div>
                <span className="text-xl font-black text-amber-300">
                  {listing.smartMatch.score}% Match
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {listing.smartMatch.factors.map((f: any, idx: number) => (
                  <div key={idx} className="p-3 rounded-xl bg-forest-800/80 border border-forest-700">
                    <div className="flex justify-between font-bold mb-1">
                      <span className="text-emerald-200">{f.name}</span>
                      <span className="text-amber-300">{f.score}/100</span>
                    </div>
                    <p className="text-[11px] text-gray-300">{f.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description & Handling Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-2">Description & Composition</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {listing.description || 'No detailed composition notes provided.'}
              </p>

              <div className="mt-4 space-y-2 text-xs">
                <p className="text-gray-600">
                  <strong>Allergens:</strong> {listing.allergens || 'None declared'}
                </p>
                <p className="text-gray-600">
                  <strong>Kitchen Cook Time:</strong>{' '}
                  {new Date(listing.cookedOrPreparedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-gray-600">
                  <strong>Safe Pickup Window Closes:</strong>{' '}
                  {new Date(listing.pickupEndTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-2">Collection & Handling Logistics</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {listing.handlingInstructions}
              </p>

              <div className="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-100 text-xs space-y-2">
                <p className="font-semibold text-gray-900 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-forest-700" />
                  <span>{listing.pickupAddress}</span>
                </p>
                <p className="text-gray-500 text-[11px]">
                  Pickup Instructions: {listing.donor?.donorProfile?.pickupInstructions || 'Report to staff on arrival.'}
                </p>
              </div>
            </div>
          </div>

          {/* Mandatory Donor Safety Pledge Badge */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-700 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-bold text-xs text-emerald-900 block">
                Donor Safety Pledge Confirmed
              </span>
              <p className="text-[11px] text-emerald-800 leading-relaxed mt-0.5">
                The food donor has signed the mandatory FoodBridge safety declaration certifying that prep times, temperature storage guidelines, and hygienic packaging were adhered to during surplus handling.
              </p>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="pt-6 border-t border-gray-100 flex items-center justify-between gap-4">
            <button
              onClick={() => setReportModalOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <ShieldAlert className="w-4 h-4 text-red-500" />
              <span>Report Listing</span>
            </button>

            {user?.role === 'RECIPIENT' && listing.status === 'AVAILABLE' ? (
              <button
                onClick={() => setRequestModalOpen(true)}
                className="px-6 py-3 bg-forest-700 hover:bg-forest-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 hover:scale-105"
              >
                <HeartHandshake className="w-4 h-4 text-amber-300" />
                <span>Request This Food Batch</span>
              </button>
            ) : listing.status !== 'AVAILABLE' ? (
              <span className="text-xs font-bold text-gray-400 bg-gray-100 px-4 py-2 rounded-xl">
                Batch currently {listing.status}
              </span>
            ) : (
              <Link
                href="/login"
                className="px-5 py-2.5 bg-forest-700 text-white font-bold text-xs rounded-xl"
              >
                Log In as NGO to Request
              </Link>
            )}
          </div>
        </div>
      </div>

      <RequestModal
        listing={listing}
        isOpen={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        onRequestSubmitted={() => router.push('/recipient/requests')}
      />
      <ReportModal
        listing={listing}
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
      />
    </div>
  );
}
