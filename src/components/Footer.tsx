'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, AlertTriangle, ShieldCheck, Mail, MapPin } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-forest-950 text-gray-300 pt-12 pb-8 border-t border-forest-900 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mandatory Food Safety Disclaimer Banner */}
        <div className="bg-forest-900/80 border border-amber-500/40 rounded-xl p-4 sm:p-5 mb-10 shadow-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-white font-semibold text-sm flex items-center gap-2">
                Mandatory Food Safety & Responsibility Notice
              </h4>
              <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                {t('safetyDisclaimerNotice')}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 text-sm">
          {/* Col 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-forest-600 flex items-center justify-center text-white">
                <Heart className="w-4 h-4 fill-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">FoodBridge</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Empowering restaurants, caterers, and grocery stores to connect directly with verified NGOs, shelters, and relief kitchens in Hyderabad.
            </p>
            <div className="text-[11px] text-emerald-400 font-semibold tracking-wide">
              Problem Statement: HACK-P197
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h5 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              Platform Features
            </h5>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <Link href="/recipient/explore" className="hover:text-white transition-colors">
                  Explore Surplus Food
                </Link>
              </li>
              <li>
                <Link href="/donor/create-listing" className="hover:text-white transition-colors">
                  List Food Surplus (Donors)
                </Link>
              </li>
              <li>
                <Link href="/impact" className="hover:text-white transition-colors">
                  Live Impact Statistics
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-white transition-colors">
                  Smart NGO-Food Matching
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h5 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              Safety & Governance
            </h5>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <Link href="/safety" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Food Safety Guidelines
                </Link>
              </li>
              <li>
                <Link href="/safety#declaration" className="hover:text-white transition-colors">
                  Mandatory Donor Pledge
                </Link>
              </li>
              <li>
                <Link href="/how-it-works#qr-flow" className="hover:text-white transition-colors">
                  QR Pickup Verification
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Hackathon Team & Architecture
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h5 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              Operational Hub
            </h5>
            <div className="space-y-2 text-xs text-gray-400">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                Hyderabad Metropolitan Area, Telangana, India
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                support@foodbridge.org
              </p>
              <div className="pt-2">
                <span className="inline-block px-2.5 py-1 rounded bg-forest-900 border border-forest-800 text-[10px] text-emerald-300 font-medium">
                  Verified Safe Redistribution Network
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-forest-900/80 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© 2026 FoodBridge — Built for Student Hackathon HACK-P197.</p>
          <p className="text-[11px] text-gray-400">
            Next.js App Router • Prisma ORM • PostgreSQL / SQLite • Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
