'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  ShieldAlert,
  ArrowLeft,
  CheckCircle2,
  Trash2,
  UserX,
  AlertTriangle,
  Clock,
} from 'lucide-react';

export default function AdminReportsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [reports, setReports] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [actionMsg, setActionMsg] = useState('');

  const fetchReports = () => {
    fetch('/api/reports')
      .then((res) => res.json())
      .then((data) => {
        if (data.reports) setReports(data.reports);
      })
      .catch(console.error)
      .finally(() => setIsLoadingData(false));
  };

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) {
      router.push('/login');
      return;
    }
    fetchReports();
  }, [user, loading, router]);

  const handleModeration = async (
    action: 'REMOVE_LISTING' | 'SUSPEND_USER' | 'RESOLVE_REPORT',
    targetId: string,
    reason?: string
  ) => {
    setActionMsg('');
    try {
      const res = await fetch('/api/admin/moderation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          targetId,
          reason: reason || 'Action taken by administrator pursuant to community safety policy.',
          adminNotes: 'Investigated by system admin.',
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setActionMsg(data.message || 'Action completed successfully');
        fetchReports();
      }
    } catch (e: any) {
      setActionMsg(e.message || 'Action failed');
    }
  };

  if (loading || isLoadingData) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <Link
          href="/admin/dashboard"
          className="text-xs font-semibold text-gray-500 hover:text-amber-700 flex items-center gap-1 mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Control Center</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
          User Reports & Moderation Queue
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Review community flagged items, remove inappropriate listings, and enforce food safety compliance.
        </p>
      </div>

      {actionMsg && (
        <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800 font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{actionMsg}</span>
        </div>
      )}

      {reports.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-gray-200">
          <p className="text-sm font-bold text-gray-700">No reports in the queue.</p>
          <p className="text-xs text-gray-400 mt-1">Platform listings and safety standards are clear.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((r) => {
            const isResolved = r.status === 'RESOLVED';

            return (
              <div
                key={r.id}
                className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        isResolved
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {r.status}
                    </span>
                    <span className="text-xs text-gray-400">
                      Report #{r.id.slice(-6)} • {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span>Reason: {r.reason}</span>
                  </h3>

                  <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <strong>Report Details:</strong> "{r.details}"
                  </p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                    <span>
                      Reporter: <strong>{r.reporter?.name}</strong> ({r.reporter?.role})
                    </span>
                    {r.listing && (
                      <>
                        <span>•</span>
                        <span>
                          Listing: <strong className="text-gray-900">"{r.listing.title}"</strong> ({r.listing.status})
                        </span>
                      </>
                    )}
                  </div>

                  {r.adminNotes && (
                    <p className="text-[11px] text-emerald-700 font-medium">
                      Admin Resolution: {r.adminNotes}
                    </p>
                  )}
                </div>

                {/* Moderation Controls */}
                <div className="flex flex-wrap items-center gap-2">
                  {!isResolved && (
                    <>
                      {r.listing && r.listing.status !== 'REMOVED' && (
                        <button
                          onClick={() => handleModeration('REMOVE_LISTING', r.listing.id, r.reason)}
                          className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                          title="Remove listing from public marketplace"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove Listing</span>
                        </button>
                      )}

                      {r.reportedUser && !r.reportedUser.isSuspended && (
                        <button
                          onClick={() => handleModeration('SUSPEND_USER', r.reportedUser.id, r.reason)}
                          className="px-3.5 py-2 bg-gray-800 hover:bg-black text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                        >
                          <UserX className="w-3.5 h-3.5" />
                          <span>Suspend Account</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleModeration('RESOLVE_REPORT', r.id)}
                        className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Resolve Report</span>
                      </button>
                    </>
                  )}

                  {isResolved && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Investigated & Resolved</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
