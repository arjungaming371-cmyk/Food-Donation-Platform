'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  HeartHandshake,
  QrCode,
  CheckCircle2,
  X,
  ArrowLeft,
  Clock,
  MapPin,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';
import QrCodeModal from '@/components/QrCodeModal';

export default function RecipientRequestsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [requests, setRequests] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [actionError, setActionError] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchRequests = () => {
    fetch('/api/requests')
      .then((res) => res.json())
      .then((data) => {
        if (data.requests) setRequests(data.requests);
      })
      .catch(console.error)
      .finally(() => setIsLoadingData(false));
  };

  useEffect(() => {
    if (!loading && (!user || user.role !== 'RECIPIENT')) {
      router.push('/login');
      return;
    }
    fetchRequests();
  }, [user, loading, router]);

  const handleAction = async (id: string, action: 'CANCEL' | 'CONFIRM_PICKUP') => {
    setActionError('');
    try {
      const res = await fetch(`/api/requests/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (!res.ok) {
        setActionError(data.error || 'Action failed');
      } else {
        fetchRequests();
      }
    } catch (e: any) {
      setActionError(e.message || 'Error occurred');
    }
  };

  const openQrModal = (id: string) => {
    setSelectedRequestId(id);
    setQrModalOpen(true);
  };

  const copyPin = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
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
      <div className="mb-8">
        <Link
          href="/recipient/dashboard"
          className="text-xs font-semibold text-gray-500 hover:text-forest-700 flex items-center gap-1 mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
          My Food Requests & Pickup Verification
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Monitor donation acceptance, access your pickup QR codes, and confirm receipts.
        </p>
      </div>

      {actionError && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-600 font-medium">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {requests.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-gray-200">
          <p className="text-sm font-bold text-gray-700">No requests submitted yet.</p>
          <p className="text-xs text-gray-400 mt-1 mb-4">
            Browse available surplus food in Hyderabad and submit your first request.
          </p>
          <Link
            href="/recipient/explore"
            className="px-4 py-2 bg-forest-700 text-white rounded-xl text-xs font-bold"
          >
            Discover Food Batches
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => {
            const isPending = req.status === 'PENDING';
            const isAccepted = req.status === 'ACCEPTED';
            const isCompleted = req.status === 'COMPLETED';

            return (
              <div
                key={req.id}
                className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        isCompleted
                          ? 'bg-teal-100 text-teal-800'
                          : isAccepted
                          ? 'bg-emerald-100 text-emerald-800'
                          : isPending
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {req.status}
                    </span>
                    <span className="text-xs text-gray-400">
                      ID: #{req.id.slice(-6)} • {new Date(req.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="font-bold text-gray-900 text-base">
                    {req.listing?.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600">
                    <span>
                      Donor:{' '}
                      <strong className="text-gray-900">
                        {req.listing?.donor?.donorProfile?.businessName || req.listing?.donor?.name}
                      </strong>
                    </span>
                    <span>•</span>
                    <span>
                      Quantity: <strong className="text-forest-800">{req.requestedQuantity} {req.listing?.unit}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <MapPin className="w-3.5 h-3.5 text-forest-700 flex-shrink-0" />
                    <span>Pickup Address: {req.listing?.pickupAddress}</span>
                  </div>

                  {isAccepted && (
                    <div className="flex items-center gap-3 pt-2">
                      <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                        <QrCode className="w-4 h-4 text-emerald-700" />
                        <span className="text-xs font-semibold text-emerald-800">
                          Pickup PIN: <strong className="font-mono text-sm tracking-widest">{req.pickupVerificationCode}</strong>
                        </span>
                        <button
                          onClick={() => copyPin(req.pickupVerificationCode, req.id)}
                          className="ml-1 text-emerald-600 hover:text-emerald-900"
                          title="Copy PIN"
                        >
                          {copiedId === req.id ? <Check className="w-3.5 h-3.5 text-forest-800" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <span className="text-[11px] text-gray-500">
                        Show this PIN to donor at counter
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  {isAccepted && (
                    <>
                      <button
                        onClick={() => openQrModal(req.id)}
                        className="px-4 py-2 bg-gradient-to-r from-forest-700 to-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 hover:scale-105"
                      >
                        <QrCode className="w-4 h-4 text-amber-300" />
                        <span>Show QR Code</span>
                      </button>

                      {!req.recipientConfirmedPickup && (
                        <button
                          onClick={() => handleAction(req.id, 'CONFIRM_PICKUP')}
                          className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
                        >
                          Confirm Receipt
                        </button>
                      )}
                    </>
                  )}

                  {isPending && (
                    <button
                      onClick={() => handleAction(req.id, 'CANCEL')}
                      className="px-3.5 py-2 border border-gray-200 hover:bg-red-50 hover:text-red-600 text-gray-600 rounded-xl text-xs font-semibold transition-colors"
                    >
                      Cancel Request
                    </button>
                  )}

                  {isCompleted && (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200">
                      <CheckCircle2 className="w-4 h-4 text-teal-600" />
                      <span>Received & Distributed</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* QR Modal */}
      {selectedRequestId && (
        <QrCodeModal
          requestId={selectedRequestId}
          isOpen={qrModalOpen}
          isDonor={false}
          onClose={() => setQrModalOpen(false)}
          onVerified={() => fetchRequests()}
        />
      )}
    </div>
  );
}
