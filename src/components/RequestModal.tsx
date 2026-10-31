'use client';

import React, { useState } from 'react';
import { X, HeartHandshake, AlertCircle, CheckCircle2 } from 'lucide-react';

interface RequestModalProps {
  listing: any;
  isOpen: boolean;
  onClose: () => void;
  onRequestSubmitted?: () => void;
}

export default function RequestModal({ listing, isOpen, onClose, onRequestSubmitted }: RequestModalProps) {
  const [quantity, setQuantity] = useState<number>(listing?.availableQuantity || 5);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen || !listing) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0 || quantity > listing.availableQuantity) {
      setErrorMsg(`Please enter a quantity between 1 and ${listing.availableQuantity} ${listing.unit}.`);
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: listing.id,
          requestedQuantity: quantity,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to submit request');
      } else {
        setSuccess(true);
        if (onRequestSubmitted) onRequestSubmitted();
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-forest-900 to-forest-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-amber-300" />
            <h3 className="font-bold text-base">Request Surplus Food</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-forest-200 hover:text-white hover:bg-forest-700/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="bg-forest-50/70 border border-forest-100 rounded-2xl p-4 mb-5">
            <h4 className="font-bold text-gray-900 text-sm">{listing.title}</h4>
            <p className="text-xs text-gray-600 mt-0.5">{listing.category} • {listing.dietaryType}</p>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-gray-500">Available:</span>
              <span className="font-bold text-forest-800">
                {listing.availableQuantity} {listing.unit}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Requested Quantity ({listing.unit}) *
              </label>
              <input
                type="number"
                min="0.5"
                max={listing.availableQuantity}
                step="any"
                value={quantity}
                onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                required
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-forest-600 focus:outline-none"
              />
              <span className="text-[11px] text-gray-400 mt-1 block">
                Can request full batch ({listing.availableQuantity} {listing.unit}) or partial amount.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Logistics & Collection Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., We will arrive with insulated carriers at 4:30 PM..."
                rows={3}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-600 font-medium">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {success && (
            <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-700 font-bold">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
              <span>Donation request submitted! Donor has been notified.</span>
            </div>
          )}

          <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || success}
              className="px-5 py-2.5 bg-forest-700 hover:bg-forest-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              {loading ? 'Submitting...' : 'Send Donation Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
