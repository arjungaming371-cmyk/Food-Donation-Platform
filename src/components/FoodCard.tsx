'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Clock,
  MapPin,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  Flame,
  Check,
  AlertCircle,
} from 'lucide-react';

interface FoodCardProps {
  listing: any;
  onRequestClick?: (listing: any) => void;
  onReportClick?: (listing: any) => void;
  userRole?: string;
}

export default function FoodCard({ listing, onRequestClick, onReportClick, userRole }: FoodCardProps) {
  const [imageError, setImageError] = useState(false);

  const fallbackImage =
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=60';

  const isAvailable = listing.status === 'AVAILABLE';
  const hoursLeft = Math.max(
    0,
    (new Date(listing.pickupEndTime).getTime() - new Date().getTime()) / (1000 * 60 * 60)
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group">
      {/* Image container */}
      <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
        <img
          src={imageError ? fallbackImage : listing.imageUrl || fallbackImage}
          alt={listing.title}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Dietary Pill */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm">
          {listing.dietaryType === 'VEG' ? (
            <span className="flex items-center gap-1 text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Vegetarian
            </span>
          ) : listing.dietaryType === 'VEGAN' ? (
            <span className="flex items-center gap-1 text-teal-700">
              <span className="w-2 h-2 rounded-full bg-teal-500"></span>
              Vegan
            </span>
          ) : (
            <span className="flex items-center gap-1 text-amber-700">
              <span className="w-2 h-2 rounded-full bg-amber-600"></span>
              Non-Vegetarian
            </span>
          )}
        </div>

        {/* Smart Match Badge */}
        {listing.smartMatch && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{listing.smartMatch.score}% Match</span>
          </div>
        )}

        {/* Status Pill if not AVAILABLE */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-white/90 text-gray-900 font-bold px-3 py-1.5 rounded-lg text-xs uppercase tracking-wider">
              {listing.status}
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Expiry Countdown */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
            <span className="font-medium text-forest-700 bg-forest-50 px-2 py-0.5 rounded">
              {listing.category}
            </span>
            <span className="flex items-center gap-1 text-gray-500 font-medium">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              {hoursLeft > 0 ? (
                hoursLeft < 2 ? (
                  <span className="text-red-600 font-semibold">{hoursLeft.toFixed(1)} hrs left</span>
                ) : (
                  <span>{hoursLeft.toFixed(1)} hrs left</span>
                )
              ) : (
                <span className="text-gray-400">Window closed</span>
              )}
            </span>
          </div>

          <h3 className="font-bold text-gray-900 text-base group-hover:text-forest-700 transition-colors line-clamp-1">
            {listing.title}
          </h3>

          <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
            {listing.description}
          </p>

          {/* Donor & Location */}
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center gap-1.5 truncate">
              <div className="w-5 h-5 rounded-full bg-forest-100 text-forest-800 text-[10px] font-bold flex items-center justify-center">
                {listing.donor?.donorProfile?.businessName?.[0] || 'D'}
              </div>
              <span className="font-medium text-gray-800 truncate max-w-[140px]">
                {listing.donor?.donorProfile?.businessName || listing.donor?.name}
              </span>
            </div>
            <div className="flex items-center gap-1 text-gray-500">
              <MapPin className="w-3 h-3 text-forest-600" />
              <span className="truncate max-w-[120px]">{listing.pickupCity || 'Hyderabad'}</span>
            </div>
          </div>
        </div>

        {/* Quantity and Actions */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-baseline justify-between mb-3">
            <span className="text-xs text-gray-500 font-medium">Available Quantity</span>
            <span className="text-base font-extrabold text-forest-800">
              {listing.availableQuantity}{' '}
              <span className="text-xs font-medium text-gray-600">{listing.unit}</span>
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Link
              href={`/listings/${listing.id}`}
              className="flex-1 py-2 px-3 text-center text-xs font-semibold rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Details
            </Link>

            {userRole === 'RECIPIENT' && isAvailable && (
              <button
                onClick={() => onRequestClick && onRequestClick(listing)}
                className="flex-1 py-2 px-3 text-center text-xs font-semibold rounded-xl bg-forest-700 text-white hover:bg-forest-800 transition-colors shadow-sm"
              >
                Request
              </button>
            )}

            {onReportClick && (
              <button
                onClick={() => onReportClick(listing)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                title="Report issue or incorrect info"
              >
                <ShieldAlert className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
