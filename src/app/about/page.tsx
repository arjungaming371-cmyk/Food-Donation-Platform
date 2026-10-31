import React from 'react';
import Link from 'next/link';
import { Heart, Sparkles, Code2, Database, Shield, CheckCircle2, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <span className="text-xs font-bold text-forest-700 uppercase tracking-wider bg-forest-100 px-3 py-1 rounded-full">
          Problem Statement HACK-P197
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mt-3">
          About the FoodBridge Platform
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Engineered for the Internal & External Hackathon — Backend Web Development
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6 text-sm text-gray-700 leading-relaxed mb-10">
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">The Problem Statement</h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Every day in metropolitan centers like Hyderabad, metric tons of wholesome, safe surplus cooked meals and fresh perishable goods are discarded by banquet halls, restaurants, caterers, and corporate kitchens. Simultaneously, local orphanages, homeless shelters, and community food kitchens struggle with daily ingredient costs and procurement.
          </p>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mt-2">
            The fundamental bottleneck is not lack of goodwill—it is lack of real-time coordination, transparent trust verification, food safety auditing, and double-booking prevention.
          </p>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Our Solution: FoodBridge</h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            FoodBridge provides a mission-critical full-stack infrastructure connecting surplus food producers with verified recipient NGOs through:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-xs">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span><strong>Smart NGO–Food Matching:</strong> Transparent mathematical algorithm prioritizing distance, capacity, urgency, and dietary compatibility.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span><strong>QR-Based Handover Verification:</strong> Encrypted dynamic QR codes and 6-digit PIN verification to confirm physical handover.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span><strong>ACID Database Transactions:</strong> Safe concurrent reservations with zero negative quantity anomalies or double-bookings.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span><strong>Live Impact Ledger:</strong> Real-time conversion to meal-equivalents (400g) and landfill greenhouse emission offsets.</span>
            </li>
          </ul>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Technology Architecture</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <span className="block font-bold text-gray-900">Next.js 14 App Router</span>
              <span className="text-[11px] text-gray-500">React & Server Actions</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <span className="block font-bold text-gray-900">PostgreSQL / Prisma</span>
              <span className="text-[11px] text-gray-500">ACID Relational Schema</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <span className="block font-bold text-gray-900">Tailwind CSS</span>
              <span className="text-[11px] text-gray-500">Custom SaaS Design</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <span className="block font-bold text-gray-900">JWT & Bcrypt</span>
              <span className="text-[11px] text-gray-500">Role-Based Security</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
