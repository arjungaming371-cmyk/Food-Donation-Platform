'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Heart,
  Utensils,
  Leaf,
  Users,
  Award,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export default function ImpactPage() {
  const [metrics, setMetrics] = useState({
    totalKgSaved: 420,
    totalMealsRescued: 1050,
    totalCompletedDonations: 45,
    co2EmissionsAvoidedKg: 1050,
    participatingDonorsCount: 5,
    participatingOrgsCount: 3,
    totalActiveListings: 10,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/impact')
      .then((res) => res.json())
      .then((data) => {
        if (data.metrics) setMetrics(data.metrics);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-bold text-forest-700 uppercase tracking-wider bg-forest-100 px-3 py-1 rounded-full">
          Live Transparency Ledger
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-gray-900 mt-3 tracking-tight">
          Food Redistribution Impact Dashboard
        </h1>
        <p className="text-sm text-gray-600 mt-3 leading-relaxed">
          Real-time metrics measuring food diverted from landfill destruction, meals delivered to community kitchens, and greenhouse emissions prevented across Hyderabad.
        </p>
      </div>

      {/* Main Impact Hero Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-gradient-to-br from-forest-800 to-forest-950 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-300">
              Meals Rescued
            </span>
            <Utensils className="w-5 h-5 text-amber-300" />
          </div>
          <div className="mt-4">
            <span className="text-4xl sm:text-5xl font-black text-white">
              {metrics.totalMealsRescued.toLocaleString()}
            </span>
            <span className="text-xs text-emerald-200 block mt-1">
              Standard 400g adult meal equivalents
            </span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-gray-400">
              Food Rescued
            </span>
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
              <Heart className="w-4 h-4 fill-emerald-600 text-emerald-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-4xl font-black text-gray-900">
              {metrics.totalKgSaved.toLocaleString()}
            </span>
            <span className="text-base font-bold text-gray-500 ml-1">kg</span>
            <span className="text-xs text-gray-400 block mt-1">
              High-quality surplus food salvaged
            </span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-gray-400">
              CO2 Emissions Averted
            </span>
            <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700">
              <Leaf className="w-4 h-4 text-teal-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-4xl font-black text-teal-700">
              {metrics.co2EmissionsAvoidedKg.toLocaleString()}
            </span>
            <span className="text-base font-bold text-gray-500 ml-1">kg CO2e</span>
            <span className="text-xs text-gray-400 block mt-1">
              Estimated @ 2.5 kg CO2 per kg food saved
            </span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-gray-400">
              Redistribution Runs
            </span>
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
              <Award className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-4xl font-black text-amber-600">
              {metrics.totalCompletedDonations}
            </span>
            <span className="text-xs text-gray-400 block mt-1">
              Dual-confirmed verified pickups completed
            </span>
          </div>
        </div>
      </div>

      {/* Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        {/* Category distribution */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 text-base mb-1">Redistribution by Category</h3>
          <p className="text-xs text-gray-500 mb-6">Percentage share of rescued food streams</p>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                <span>Cooked Meals (Biryani, Dal Rice, Curries)</span>
                <span className="text-forest-700 font-bold">58%</span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-forest-600 rounded-full" style={{ width: '58%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                <span>Bakery & Breads (Chapatis, Loaves, Puffs)</span>
                <span className="text-amber-700 font-bold">22%</span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '22%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                <span>Fruits & Fresh Produce</span>
                <span className="text-teal-700 font-bold">14%</span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-teal-500 rounded-full" style={{ width: '14%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                <span>Packaged Goods & Dairy</span>
                <span className="text-blue-700 font-bold">6%</span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '6%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Participating Organizations */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-900 text-base">Active Hyderabad Community Partners</h3>
              <p className="text-xs text-gray-500">Verified food donors and charitable recipient foundations</p>
            </div>
            <span className="text-xs font-bold bg-forest-50 text-forest-700 px-3 py-1 rounded-full">
              {metrics.participatingDonorsCount + metrics.participatingOrgsCount} Registered
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-forest-100 text-forest-800 font-bold flex items-center justify-center">
                P
              </div>
              <div>
                <p className="font-bold text-gray-900">Paradise Food Court</p>
                <p className="text-[11px] text-gray-500">Secunderabad • Restaurant Donor</p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center">
                H
              </div>
              <div>
                <p className="font-bold text-gray-900">Hope Community Foundation</p>
                <p className="text-[11px] text-gray-500">Musheerabad • 250 Beneficiaries</p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-forest-100 text-forest-800 font-bold flex items-center justify-center">
                B
              </div>
              <div>
                <p className="font-bold text-gray-900">Bawarchi Catering Services</p>
                <p className="text-[11px] text-gray-500">RTC X Roads • Caterer Donor</p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center">
                A
              </div>
              <div>
                <p className="font-bold text-gray-900">Annapurna Food Support Center</p>
                <p className="text-[11px] text-gray-500">Ameerpet • 320 Beneficiaries</p>
              </div>
            </div>
          </div>

          <div className="mt-5 p-3.5 bg-forest-50/60 border border-forest-100 rounded-2xl text-[11px] text-forest-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>
              <strong>Methodology note:</strong> Meal equivalents calculated at 400g per meal. Environmental savings benchmarked from global food waste diversion emission factors (2.5 kg CO2e per kg food).
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
