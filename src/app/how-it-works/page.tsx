import React from 'react';
import Link from 'next/link';
import {
  Utensils,
  Search,
  Sparkles,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-bold text-forest-700 uppercase tracking-wider bg-forest-100 px-3 py-1 rounded-full">
          Workflow Architecture
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mt-3">
          How FoodBridge Eliminates Surplus Food Waste
        </h1>
        <p className="text-sm text-gray-600 mt-3 leading-relaxed">
          From donor kitchen to NGO delivery van, our platform enforces food safety, eliminates duplicate bookings, and ensures dual-party handover verification.
        </p>
      </div>

      {/* 4-Step Diagram Flow */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
        {/* Step 1 */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm relative">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 font-black text-sm flex items-center justify-center mb-4">
            01
          </div>
          <h3 className="font-bold text-gray-900 text-base mb-2">1. Food Listing</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Donors list surplus cooked meals or fresh goods, specify prep time, expiry window, storage parameters, and complete mandatory safety declarations.
          </p>
        </div>

        {/* Step 2 */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm relative">
          <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 font-black text-sm flex items-center justify-center mb-4">
            02
          </div>
          <h3 className="font-bold text-gray-900 text-base mb-2">2. Smart Matching</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Our deterministic matching engine ranks listings for nearby NGOs by calculating GPS distance, beneficiary capacity fit, dietary needs, and pickup urgency.
          </p>
        </div>

        {/* Step 3 */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm relative">
          <div className="w-10 h-10 rounded-2xl bg-forest-100 text-forest-800 font-black text-sm flex items-center justify-center mb-4">
            03
          </div>
          <h3 className="font-bold text-gray-900 text-base mb-2">3. Safe Reservation</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            The NGO requests whole or partial batch. Upon donor acceptance, database transactions lock the reserved quantity to prevent double booking.
          </p>
        </div>

        {/* Step 4 */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm relative">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 font-black text-sm flex items-center justify-center mb-4">
            04
          </div>
          <h3 className="font-bold text-gray-900 text-base mb-2">4. QR Verification</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            A dynamic QR code and 6-digit PIN are generated. Driver scans code at collection counter. Handover is dual-confirmed and logged to the audit trail.
          </p>
        </div>
      </div>

      {/* Feature Deep Dive 1: Smart Matching Formula */}
      <div className="bg-forest-900 text-white rounded-3xl p-8 mb-16 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              Feature Highlight
            </div>
            <h2 className="text-2xl font-black text-white">Smart NGO–Food Matching Algorithm</h2>
            <p className="text-xs sm:text-sm text-gray-300 mt-3 leading-relaxed">
              To eliminate misallocated donations, FoodBridge scores every potential food match with complete mathematical transparency:
            </p>
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-forest-800/80 border border-forest-700">
                <span className="font-medium text-emerald-200">1. Proximity (Haversine Distance)</span>
                <span className="font-bold text-amber-300">35% Weight</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-forest-800/80 border border-forest-700">
                <span className="font-medium text-emerald-200">2. Beneficiary Scale vs Batch Size</span>
                <span className="font-bold text-amber-300">30% Weight</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-forest-800/80 border border-forest-700">
                <span className="font-medium text-emerald-200">3. Safe Collection Window Remaining</span>
                <span className="font-bold text-amber-300">20% Weight</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-forest-800/80 border border-forest-700">
                <span className="font-medium text-emerald-200">4. Dietary Preference & Storage Compatibility</span>
                <span className="font-bold text-amber-300">15% Weight</span>
              </div>
            </div>
          </div>

          <div className="bg-forest-950 p-6 rounded-2xl border border-forest-800">
            <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-3">
              Matching Factor Breakdown Sample
            </h4>
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-gray-300 text-[11px] mb-1">
                  <span>Proximity (3.2 km in Secunderabad)</span>
                  <span className="text-emerald-400 font-bold">98 / 100</span>
                </div>
                <div className="w-full h-2 bg-forest-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '98%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-gray-300 text-[11px] mb-1">
                  <span>Capacity Fit (15 kg = ~38 meals for 100 people)</span>
                  <span className="text-emerald-400 font-bold">85 / 100</span>
                </div>
                <div className="w-full h-2 bg-forest-800 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-gray-300 text-[11px] mb-1">
                  <span>Pickup Urgency (3.5 hours remaining)</span>
                  <span className="text-amber-400 font-bold">90 / 100</span>
                </div>
                <div className="w-full h-2 bg-forest-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: '90%' }}></div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-forest-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-300">Calculated Compatibility:</span>
                <span className="text-base font-extrabold text-amber-300">92% High Match</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center py-8">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to test the live workflow?</h3>
        <p className="text-xs text-gray-500 mb-6">
          Use the 1-click demo switcher at the top of the screen or explore active listings directly.
        </p>
        <Link
          href="/recipient/explore"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-xs shadow-md transition-all"
        >
          <span>Explore Available Donations</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
