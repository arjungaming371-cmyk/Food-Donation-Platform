'use client';

import React, { useState } from 'react';
import { MapPin, Navigation, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface MapLocation {
  id: string;
  title: string;
  donorName: string;
  category: string;
  quantity: string;
  lat: number;
  lng: number;
  address: string;
  dietary: string;
}

const DEMO_HYDERABAD_LOCATIONS: MapLocation[] = [
  {
    id: 'loc-1',
    title: 'Vegetable Biryani with Mirchi Ka Salan',
    donorName: 'Paradise Biryani',
    category: 'Cooked Meals',
    quantity: '15 kg',
    lat: 17.4399,
    lng: 78.4983,
    address: 'MG Road, Secunderabad',
    dietary: 'VEG',
  },
  {
    id: 'loc-2',
    title: 'Fresh Wheat Chapatis (80 pcs)',
    donorName: 'Bawarchi Caterers',
    category: 'Cooked Meals',
    quantity: '80 pieces',
    lat: 17.4042,
    lng: 78.4983,
    address: 'RTC X Roads, Chikkadpally',
    dietary: 'VEG',
  },
  {
    id: 'loc-3',
    title: 'Fresh Seasonal Fruits Assortment',
    donorName: 'Green Leaf Grocers',
    category: 'Fruits & Vegetables',
    quantity: '12 kg',
    lat: 17.4156,
    lng: 78.4354,
    address: 'Road No 12, Banjara Hills',
    dietary: 'VEGAN',
  },
  {
    id: 'loc-4',
    title: 'Tadka Dal & Steamed Sona Masoori Rice',
    donorName: 'Taj Krishna Banquets',
    category: 'Cooked Meals',
    quantity: '10 kg',
    lat: 17.4168,
    lng: 78.4487,
    address: 'Road No 1, Banjara Hills',
    dietary: 'VEG',
  },
  {
    id: 'loc-5',
    title: 'Traditional Curd Rice with Pomegranate',
    donorName: 'Minerva Grand Bakery & Meals',
    category: 'Cooked Meals',
    quantity: '10 kg',
    lat: 17.4411,
    lng: 78.5011,
    address: 'SD Road, Secunderabad',
    dietary: 'VEG',
  },
];

export default function InteractiveMap() {
  const [activePin, setActivePin] = useState<MapLocation>(DEMO_HYDERABAD_LOCATIONS[0]);

  return (
    <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm overflow-hidden">
      {/* Map Header */}
      <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <h3 className="text-base font-bold text-gray-900">
              Hyderabad Metropolitan Food Redistribution Grid
            </h3>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time surplus clusters across Secunderabad, Banjara Hills, and Chikkadpally
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-forest-700 bg-forest-50 px-3 py-1.5 rounded-xl border border-forest-100">
          <Navigation className="w-3.5 h-3.5 text-forest-600" />
          <span>Centered: Hyderabad, Telangana (17.4° N, 78.4° E)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3">
        {/* Interactive Stylized Grid Canvas */}
        <div className="lg:col-span-2 relative h-80 sm:h-96 bg-gradient-to-br from-slate-900 via-forest-950 to-slate-950 p-6 flex flex-col justify-between overflow-hidden">
          {/* Subtle SVG Map Grid Background */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#22c55e" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              {/* Hussain Sagar Lake representation */}
              <ellipse cx="65%" cy="50%" rx="55" ry="35" fill="#0284c7" opacity="0.4" />
              <text x="63%" y="52%" fill="#38bdf8" fontSize="10" opacity="0.7">Hussain Sagar</text>
            </svg>
          </div>

          <div className="relative z-10 flex justify-between items-start">
            <span className="bg-forest-900/90 text-emerald-300 border border-forest-600/50 text-[11px] px-3 py-1 rounded-full backdrop-blur-sm font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Live Demo Dispatch Hub
            </span>

            <span className="text-[11px] text-gray-300 bg-black/40 px-2.5 py-1 rounded-md backdrop-blur-sm">
              Click pins to inspect food batches
            </span>
          </div>

          {/* Interactive Pins on Map */}
          <div className="relative z-10 h-48 w-full">
            {DEMO_HYDERABAD_LOCATIONS.map((loc, idx) => {
              // Normalized positions for aesthetic representation
              const positions = [
                { top: '30%', left: '72%' }, // Secunderabad
                { top: '65%', left: '68%' }, // Chikkadpally
                { top: '55%', left: '30%' }, // Banjara Hills Rd 12
                { top: '48%', left: '42%' }, // Taj Krishna Rd 1
                { top: '22%', left: '78%' }, // SD Road
              ];
              const pos = positions[idx] || { top: '50%', left: '50%' };
              const isSelected = activePin.id === loc.id;

              return (
                <button
                  key={loc.id}
                  onClick={() => setActivePin(loc)}
                  style={{ top: pos.top, left: pos.left }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none transition-all duration-200 ${
                    isSelected ? 'scale-125 z-20' : 'hover:scale-110 z-10'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg transition-transform ${
                        isSelected
                          ? 'bg-amber-500 ring-4 ring-amber-300/40'
                          : 'bg-emerald-600 hover:bg-emerald-500'
                      }`}
                    >
                      <MapPin className="w-4 h-4 fill-white" />
                    </div>
                    <span
                      className={`mt-1 text-[10px] font-semibold px-2 py-0.5 rounded shadow-sm whitespace-nowrap ${
                        isSelected
                          ? 'bg-amber-400 text-gray-900'
                          : 'bg-black/70 text-gray-200 group-hover:bg-black/90'
                      }`}
                    >
                      {loc.donorName.split(' ')[0]}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="relative z-10 flex items-center justify-between text-[11px] text-gray-400">
            <span>Coordinates: ~17.3850° N, 78.4867° E (Hyderabad Metro)</span>
            <span className="text-emerald-400 font-medium">5 Active Hubs Open</span>
          </div>
        </div>

        {/* Selected Pin Details Panel */}
        <div className="p-5 flex flex-col justify-between bg-gray-50 border-t lg:border-t-0 lg:border-l border-gray-100">
          <div>
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span className="font-semibold text-forest-700 bg-forest-100 px-2 py-0.5 rounded">
                {activePin.category}
              </span>
              <span className="font-semibold text-emerald-700">
                {activePin.dietary === 'VEGAN' ? 'Vegan' : 'Vegetarian'}
              </span>
            </div>

            <h4 className="font-bold text-gray-900 text-base leading-snug">
              {activePin.title}
            </h4>

            <p className="text-xs text-gray-600 mt-2 font-medium flex items-center gap-1.5">
              <span className="text-gray-400">Donor:</span>
              <span className="font-bold text-gray-800">{activePin.donorName}</span>
            </p>

            <p className="text-xs text-gray-500 mt-1 flex items-start gap-1">
              <MapPin className="w-3.5 h-3.5 text-forest-600 mt-0.5 flex-shrink-0" />
              <span>{activePin.address}</span>
            </p>

            <div className="mt-4 p-3 bg-white rounded-xl border border-gray-200/80">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Available Batch:</span>
                <span className="text-sm font-extrabold text-forest-800">
                  {activePin.quantity}
                </span>
              </div>
              <div className="mt-2 text-[11px] text-gray-500 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Ready for immediate NGO transport pickup</span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Link
              href="/recipient/explore"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-semibold text-xs shadow-sm transition-all"
            >
              <span>Explore All Listings</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
