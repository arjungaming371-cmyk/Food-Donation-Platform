'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Utensils, PlusCircle, Trash2, ShieldAlert, ArrowLeft, ExternalLink, Clock } from 'lucide-react';

export default function ManageListingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [listings, setListings] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const fetchListings = () => {
    if (user?.id) {
      fetch(`/api/listings?donorId=${user.id}&status=ALL`)
        .then((res) => res.json())
        .then((d) => {
          if (d.listings) setListings(d.listings);
        })
        .finally(() => setIsLoadingData(false));
    }
  };

  useEffect(() => {
    if (!loading && (!user || user.role !== 'DONOR')) {
      router.push('/login');
      return;
    }
    fetchListings();
  }, [user, loading, router]);

  const handleCancelListing = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to cancel and remove listing: "${title}"?`)) return;

    try {
      const res = await fetch(`/api/listings/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchListings();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading || isLoadingData) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-forest-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link
            href="/donor/dashboard"
            className="text-xs font-semibold text-gray-500 hover:text-forest-700 flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            Manage Surplus Food Listings
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Track real-time inventory, remaining quantities, and cancel batches if necessary.
          </p>
        </div>

        <Link
          href="/donor/create-listing"
          className="px-4 py-2.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-xs shadow-sm flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4 text-emerald-300" />
          <span>New Listing</span>
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-gray-200">
          <p className="text-sm font-bold text-gray-700">No surplus listings created yet.</p>
          <p className="text-xs text-gray-400 mt-1 mb-4">Post surplus food to make it discoverable for NGOs.</p>
          <Link
            href="/donor/create-listing"
            className="px-4 py-2 bg-forest-700 text-white rounded-xl text-xs font-bold"
          >
            Create Your First Listing
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Food Item</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Available / Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Safe Expiry Window</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {listings.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-gray-900">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.imageUrl}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                        />
                        <div>
                          <div className="font-bold text-gray-900">{item.title}</div>
                          <div className="text-[10px] text-gray-400 font-normal">
                            {item._count?.requests || 0} requests received
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-600 font-medium">
                      <span className="bg-gray-100 px-2 py-0.5 rounded text-[11px] text-gray-700">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-gray-800">
                      <span className="text-forest-700 font-bold">{item.availableQuantity}</span> / {item.totalQuantity} {item.unit}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.status === 'AVAILABLE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'RESERVED'
                            ? 'bg-amber-100 text-amber-800'
                            : item.status === 'COMPLETED'
                            ? 'bg-teal-100 text-teal-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-500 font-mono text-[11px]">
                      {new Date(item.pickupEndTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/listings/${item.id}`}
                          className="p-1.5 text-gray-400 hover:text-forest-700 hover:bg-forest-50 rounded-lg transition-colors"
                          title="View Listing Details"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        {item.status === 'AVAILABLE' && (
                          <button
                            onClick={() => handleCancelListing(item.id, item.title)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Cancel / Remove Listing"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
