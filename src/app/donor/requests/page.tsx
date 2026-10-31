'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  HeartHandshake,
  Check,
  X,
  QrCode,
  ArrowLeft,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import QrCodeModal from '@/components/QrCodeModal';

export default function DonorRequestsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [requests, setRequests] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [actionError, setActionError] = useState('');

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
    if (!loading && (!user || user.role !== 'DONOR')) {
      router.push('/login');
      return;
    }
    fetchRequests();
  }, [user, loading, router]);

  const handleAction = async (id: string, action: 'ACCEPT' | 'REJECT' | 'CONFIRM_HANDOVER') => {
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

  const openQrVerification = (id: string) => {
    setSelectedRequestId(id);
    setQrModalOpen(true);
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
          href="/donor/dashboard"
          className="text-xs font-semibold text-gray-500 hover:text-forest-700 flex items-center gap-1 mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
          Incoming Food Donation Requests
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Accept or decline NGO collection requests and verify physical food handover via QR code or PIN.
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
          <p className="text-sm font-bold text-gray-700">No requests received yet.</p>
          <p className="text-xs text-gray-400 mt-1">
            Requests from recipient charities will appear here in real time.
          </p>
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
                      ID: #{req.id.slice(-6)} • {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <h3 className="font-bold text-gray-900 text-base">
                    {req.recipient?.orgProfile?.orgName || req.recipient?.name}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600">
                    <span>
                      Requested: <strong className="text-forest-800">{req.requestedQuantity} {req.listing?.unit}</strong>
                    </span>
                    <span>•</span>
                    <span>Item: <strong>{req.listing?.title}</strong></span>
                    <span>•</span>
                    <span>Capacity: {req.recipient?.orgProfile?.estimatedPeopleServed || 100} people</span>
                  </div>

                  {req.notes && (
                    <p className="text-xs text-gray-500 italic bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                      Note from NGO: "{req.notes}"
                    </p>
                  )}

                  {isAccepted && (
                    <div className="flex items-center gap-2 pt-1 text-xs font-semibold text-emerald-700">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Security Handover PIN: <strong className="font-mono text-sm tracking-widest bg-emerald-50 px-2 py-0.5 rounded">{req.pickupVerificationCode}</strong></span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  {isPending && (
                    <>
                      <button
                        onClick={() => handleAction(req.id, 'ACCEPT')}
                        className="px-4 py-2 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept Request</span>
                      </button>

                      <button
                        onClick={() => handleAction(req.id, 'REJECT')}
                        className="px-3.5 py-2 border border-gray-200 hover:bg-red-50 hover:text-red-600 text-gray-600 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Decline</span>
                      </button>
                    </>
                  )}

                  {isAccepted && (
                    <>
                      <button
                        onClick={() => openQrVerification(req.id)}
                        className="px-4 py-2 bg-gradient-to-r from-forest-700 to-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 hover:scale-105"
                      >
                        <QrCode className="w-4 h-4 text-amber-300" />
                        <span>Scan / Verify Code</span>
                      </button>

                      {!req.donorConfirmedHandover && (
                        <button
                          onClick={() => handleAction(req.id, 'CONFIRM_HANDOVER')}
                          className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-semibold transition-colors"
                        >
                          Confirm Handover
                        </button>
                      )}
                    </>
                  )}

                  {isCompleted && (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200">
                      <CheckCircle2 className="w-4 h-4 text-teal-600" />
                      <span>Handover Verified & Completed</span>
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
          isDonor={true}
          onClose={() => setQrModalOpen(false)}
          onVerified={() => fetchRequests()}
        />
      )}
    </div>
  );
}
