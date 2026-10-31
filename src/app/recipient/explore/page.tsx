'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  Search,
  Filter,
  MapPin,
  Sparkles,
  Map as MapIcon,
  Grid,
  Clock,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import FoodCard from '@/components/FoodCard';
import InteractiveMap from '@/components/InteractiveMap';
import RequestModal from '@/components/RequestModal';
import ReportModal from '@/components/ReportModal';

export default function ExploreFoodPage() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('ALL');
  const [dietary, setDietary] = useState('ALL');
  const [sort, setSort] = useState('newest');
  const [viewMode, setViewMode] = useState<'GRID' | 'MAP'>('GRID');

  // Modals
  const [selectedListing, setSelectedListing] = useState<any | null>(null);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  const fetchListings = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (category !== 'ALL') params.append('category', category);
    if (dietary !== 'ALL') params.append('dietary', dietary);
    if (sort) params.append('sort', sort);
    params.append('status', 'AVAILABLE');

    fetch(`/api/listings?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.listings) setListings(data.listings);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchListings();
  }, [category, dietary, sort]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchListings();
  };

  const handleOpenRequest = (listing: any) => {
    setSelectedListing(listing);
    setRequestModalOpen(true);
  };

  const handleOpenReport = (listing: any) => {
    setSelectedListing(listing);
    setReportModalOpen(true);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-gray-200 gap-4 mb-6">
        <div>
          <span className="text-xs font-bold text-forest-700 uppercase tracking-wider bg-forest-100 px-3 py-1 rounded-full">
            Real-Time Surplus Discovery
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">
            Available Food Donations in Hyderabad
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Discover verified surplus batches with Smart Match ranking and live pickup countdowns.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-2xl text-xs font-bold">
          <button
            onClick={() => setViewMode('GRID')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
              viewMode === 'GRID' ? 'bg-white text-forest-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>Card Grid</span>
          </button>
          <button
            onClick={() => setViewMode('MAP')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
              viewMode === 'MAP' ? 'bg-white text-forest-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <MapIcon className="w-4 h-4" />
            <span>Map View</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-sm mb-8 space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-10 pr-3.5 py-2.5 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-forest-700 hover:bg-forest-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
          <div className="flex items-center gap-1.5 text-gray-500 font-semibold">
            <Filter className="w-3.5 h-3.5 text-forest-700" />
            <span>Filters:</span>
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-1.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 font-medium focus:ring-2 focus:ring-forest-600 focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="Cooked Meals">Cooked Meals</option>
            <option value="Bakery & Bread">Bakery & Bread</option>
            <option value="Fruits & Vegetables">Fruits & Vegetables</option>
            <option value="Packaged Food">Packaged Food</option>
            <option value="Dairy">Dairy</option>
          </select>

          <select
            value={dietary}
            onChange={(e) => setDietary(e.target.value)}
            className="px-3 py-1.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 font-medium focus:ring-2 focus:ring-forest-600 focus:outline-none"
          >
            <option value="ALL">All Dietary Types</option>
            <option value="VEG">Vegetarian (Veg)</option>
            <option value="VEGAN">Vegan</option>
            <option value="NON_VEG">Non-Vegetarian</option>
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-1.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 font-medium focus:ring-2 focus:ring-forest-600 focus:outline-none"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="ending_soon">Sort: Safe Window Ending Soon</option>
            <option value="quantity">Sort: Highest Quantity</option>
          </select>

          {(category !== 'ALL' || dietary !== 'ALL' || searchTerm) && (
            <button
              onClick={() => {
                setCategory('ALL');
                setDietary('ALL');
                setSearchTerm('');
              }}
              className="text-xs text-red-600 hover:underline font-semibold ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Main View Area */}
      {viewMode === 'MAP' ? (
        <div className="space-y-6">
          <InteractiveMap />
        </div>
      ) : (
        <div>
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-4 border-forest-600 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-xs text-gray-400 font-medium">Finding available surplus donations...</p>
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8">
              <p className="text-base font-bold text-gray-800">No surplus food batches match your criteria.</p>
              <p className="text-xs text-gray-400 mt-1 mb-4">
                Try selecting a different food category or resetting active filters.
              </p>
              <button
                onClick={() => {
                  setCategory('ALL');
                  setDietary('ALL');
                  setSearchTerm('');
                }}
                className="px-4 py-2 bg-forest-700 text-white rounded-xl text-xs font-bold"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((item) => (
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
      )}

      {/* Modals */}
      <RequestModal
        listing={selectedListing}
        isOpen={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        onRequestSubmitted={() => fetchListings()}
      />
      <ReportModal
        listing={selectedListing}
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
      />
    </div>
  );
}
