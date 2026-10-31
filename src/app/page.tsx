'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Heart,
  Utensils,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Clock,
  MapPin,
  QrCode,
  Leaf,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import FoodCard from '@/components/FoodCard';
import InteractiveMap from '@/components/InteractiveMap';
import RequestModal from '@/components/RequestModal';
import ReportModal from '@/components/ReportModal';

export default function HomePage() {
  const { user, demoLogin } = useAuth();
  const { t } = useLanguage();

  const [metrics, setMetrics] = useState({
    totalKgSaved: 420,
    totalMealsRescued: 1050,
    co2EmissionsAvoidedKg: 1050,
    participatingOrgsCount: 3,
    participatingDonorsCount: 5,
  });

  const [recentListings, setRecentListings] = useState<any[]>([]);
  const [selectedListing, setSelectedListing] = useState<any | null>(null);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  useEffect(() => {
    // Fetch live metrics
    fetch('/api/impact')
      .then((res) => res.json())
      .then((d) => {
        if (d.metrics) setMetrics(d.metrics);
      })
      .catch(console.error);

    // Fetch sample available listings
    fetch('/api/listings?status=AVAILABLE')
      .then((res) => res.json())
      .then((d) => {
        if (d.listings) setRecentListings(d.listings.slice(0, 6));
      })
      .catch(console.error);
  }, []);

  const handleOpenRequest = (listing: any) => {
    setSelectedListing(listing);
    setRequestModalOpen(true);
  };

  const handleOpenReport = (listing: any) => {
    setSelectedListing(listing);
    setReportModalOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-forest-50/70 via-white to-stone-50/40 py-16 sm:py-24 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-100/80 border border-forest-200 text-forest-800 text-xs font-semibold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>HACK-P197 Finalist Platform • Active in Hyderabad</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tight leading-[1.15]">
              Good Food. <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest-700 via-emerald-600 to-teal-700">
                Zero Waste.
              </span>{' '}
              Better Tomorrow.
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed font-normal">
              FoodBridge coordinates surplus cooked meals and fresh goods from restaurants, hotels, and banquets directly to verified NGOs, orphanages, and community shelters across Hyderabad.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href="/demo"
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-gray-950 font-black text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                <span>▶ Auto-Demo Video Mode</span>
              </Link>

              <Link
                href="/donor/create-listing"
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-sm shadow-lg shadow-forest-700/25 transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                <Utensils className="w-4 h-4 text-amber-300" />
                <span>{t('donateFood')}</span>
              </Link>

              <Link
                href="/recipient/explore"
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 font-bold text-sm shadow-sm transition-all hover:border-forest-600 flex items-center justify-center gap-2"
              >
                <HeartHandshake className="w-4 h-4 text-forest-600" />
                <span>{t('exploreFood')}</span>
              </Link>
            </div>

            {/* Quick Judge Login Card */}
            <div className="pt-8 max-w-lg mx-auto">
              <div className="p-4 bg-white/90 backdrop-blur-md rounded-2xl border border-forest-200 shadow-md">
                <div className="flex items-center justify-between text-xs font-bold text-gray-800 mb-2">
                  <span className="flex items-center gap-1.5 text-forest-800">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Hackathon Evaluation Quick Switch
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">1-Click Testing</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => demoLogin('DONOR')}
                    className="p-2 rounded-xl bg-forest-50 hover:bg-forest-100 text-forest-800 text-xs font-semibold border border-forest-200/60 transition-all flex flex-col items-center justify-center gap-1"
                  >
                    <Utensils className="w-3.5 h-3.5 text-amber-600" />
                    <span>Donor View</span>
                  </button>
                  <button
                    onClick={() => demoLogin('RECIPIENT')}
                    className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200/60 transition-all flex flex-col items-center justify-center gap-1"
                  >
                    <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
                    <span>NGO View</span>
                  </button>
                  <button
                    onClick={() => demoLogin('ADMIN')}
                    className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold border border-amber-200/60 transition-all flex flex-col items-center justify-center gap-1"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                    <span>Admin View</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Impact Ticker Section */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-forest-50/60 border border-forest-100 text-center">
              <span className="block text-3xl sm:text-4xl font-black text-forest-800">
                {metrics.totalMealsRescued.toLocaleString()}+
              </span>
              <span className="block text-xs font-semibold uppercase tracking-wider text-forest-600 mt-1">
                {t('mealsSaved')}
              </span>
              <span className="text-[10px] text-gray-400 mt-0.5 block">@ 400g standard meal equivalent</span>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-center">
              <span className="block text-3xl sm:text-4xl font-black text-emerald-800">
                {metrics.totalKgSaved.toLocaleString()} kg
              </span>
              <span className="block text-xs font-semibold uppercase tracking-wider text-emerald-600 mt-1">
                {t('kgSaved')}
              </span>
              <span className="text-[10px] text-gray-400 mt-0.5 block">Diverted from urban landfills</span>
            </div>

            <div className="p-5 rounded-2xl bg-teal-50/60 border border-teal-100 text-center">
              <span className="block text-3xl sm:text-4xl font-black text-teal-800">
                {metrics.co2EmissionsAvoidedKg.toLocaleString()} kg
              </span>
              <span className="block text-xs font-semibold uppercase tracking-wider text-teal-600 mt-1">
                {t('co2Averted')}
              </span>
              <span className="text-[10px] text-gray-400 mt-0.5 block">~2.5 kg CO2 avoided per kg food</span>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-100 text-center">
              <span className="block text-3xl sm:text-4xl font-black text-amber-800">
                {metrics.participatingOrgsCount + metrics.participatingDonorsCount}
              </span>
              <span className="block text-xs font-semibold uppercase tracking-wider text-amber-700 mt-1">
                Network Partners
              </span>
              <span className="text-[10px] text-gray-400 mt-0.5 block">
                {metrics.participatingDonorsCount} Donors • {metrics.participatingOrgsCount} Verified NGOs
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Standout Innovations Preview */}
      <section className="py-16 bg-stone-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-forest-700 uppercase tracking-wider bg-forest-100 px-3 py-1 rounded-full">
              Enterprise Hackathon Architecture
            </span>
            <h2 className="text-3xl font-black text-gray-900 mt-3">
              Built for Scale, Trust, & Safety
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              Solving real-world distribution friction with verified identity, transaction locking, and dual-party confirmation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-emerald-700" />
              </div>
              <h3 className="text-base font-bold text-gray-900">Smart NGO–Food Matching</h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                Deterministic matching algorithm calculating proximity (Haversine formula), capacity fit against beneficiary headcount, dietary constraints, and pickup window feasibility.
              </p>
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-1.5 text-xs text-forest-700 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Explainable factor breakdown</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center mb-4">
                <QrCode className="w-6 h-6 text-forest-700" />
              </div>
              <h3 className="text-base font-bold text-gray-900">QR Pickup Verification</h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                Accepted donations generate an encrypted 6-digit PIN and dynamic QR code. Donors and NGOs scan/verify on arrival to prevent disputed deliveries and verify true handover.
              </p>
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-1.5 text-xs text-forest-700 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Dual-confirmation security</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6 text-amber-700" />
              </div>
              <h3 className="text-base font-bold text-gray-900">Strict Safety & Governance</h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                Mandatory donor preparation declarations, allergen tagging, storage condition specs, reporting workflows, and full administrator moderation audit logging.
              </p>
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-1.5 text-xs text-forest-700 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>FSSAI guidance compliant</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Map Preview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold text-forest-700 uppercase tracking-wider bg-forest-100 px-3 py-1 rounded-full">
                Interactive Food Discovery
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">
                Active Hyderabad Redistribution Network
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Visualizing partner locations across Secunderabad, Ameerpet, RTC X Roads, and Banjara Hills.
              </p>
            </div>
            <Link
              href="/recipient/explore"
              className="text-xs font-bold text-forest-700 hover:text-forest-800 flex items-center gap-1.5 hover:underline"
            >
              <span>Explore all available donations</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <InteractiveMap />
        </div>
      </section>

      {/* Recent Available Listings Grid */}
      <section className="py-16 bg-stone-50/60 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-gray-900">
                Available Surplus Batches Right Now
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Freshly listed surplus from verified food businesses ready for NGO collection
              </p>
            </div>

            <Link
              href="/recipient/explore"
              className="px-4 py-2 bg-white border border-gray-200 hover:border-forest-600 rounded-xl text-xs font-bold text-gray-800 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5 text-forest-600" />
            </Link>
          </div>

          {recentListings.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-200 p-6">
              <p className="text-xs text-gray-500 font-medium">Loading active listings...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentListings.map((item) => (
                <FoodCard
                  key={item.id}
                  listing={item}
                  userRole={user?.role}
                  onRequestClick={handleOpenRequest}
                  onReportClick={handleOpenReport}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modals */}
      <RequestModal
        listing={selectedListing}
        isOpen={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
      />
      <ReportModal
        listing={selectedListing}
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
      />
    </div>
  );
}
