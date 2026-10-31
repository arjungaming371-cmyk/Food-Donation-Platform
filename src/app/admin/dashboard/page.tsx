'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  ShieldCheck,
  Users,
  Utensils,
  HeartHandshake,
  ShieldAlert,
  FileText,
  Activity,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [data, setData] = useState<{
    stats: any;
    auditLogs: any[];
    recentEvents: any[];
  } | null>(null);

  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) {
      if (user?.role === 'DONOR') router.push('/donor/dashboard');
      else if (user?.role === 'RECIPIENT') router.push('/recipient/dashboard');
      else router.push('/login');
      return;
    }

    if (user && user.role === 'ADMIN') {
      fetch('/api/admin/stats')
        .then((res) => res.json())
        .then((d) => {
          if (d.success) setData(d);
        })
        .catch(console.error)
        .finally(() => setIsLoadingData(false));
    }
  }, [user, loading, router]);

  if (loading || isLoadingData) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const stats = data?.stats || {
    totalUsers: 9,
    totalDonors: 5,
    totalRecipients: 3,
    totalListings: 10,
    activeDonations: 9,
    pendingRequests: 1,
    completedDonations: 1,
    pendingReports: 1,
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-200 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
              Administrator Control Center
            </span>
            <span className="text-xs text-gray-400">• Hyderabad Metro System</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
            Platform Moderation & Security
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Monitor system integrity, resolve user safety reports, enforce food quality standards, and inspect audit trails.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/reports"
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <ShieldAlert className="w-4 h-4 text-amber-200" />
            <span>Reports Queue ({stats.pendingReports})</span>
          </Link>
          <Link
            href="/admin/users"
            className="px-4 py-2.5 rounded-xl bg-white border border-gray-200 hover:border-gray-400 text-gray-800 font-bold text-xs shadow-sm transition-all"
          >
            Manage Users
          </Link>
        </div>
      </div>

      {/* KPI Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-8">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <span className="text-xs text-gray-500 font-medium">Total Registered Users</span>
          <p className="text-3xl font-black text-gray-900 mt-2">{stats.totalUsers}</p>
          <span className="text-[11px] text-gray-400 mt-1 block">
            {stats.totalDonors} Donors • {stats.totalRecipients} Recipient NGOs
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <span className="text-xs text-gray-500 font-medium">Food Surplus Batches</span>
          <p className="text-3xl font-black text-forest-700 mt-2">{stats.totalListings}</p>
          <span className="text-[11px] text-gray-400 mt-1 block">
            {stats.activeDonations} Currently Active in Market
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <span className="text-xs text-gray-500 font-medium">Completed Deliveries</span>
          <p className="text-3xl font-black text-teal-700 mt-2">{stats.completedDonations}</p>
          <span className="text-[11px] text-gray-400 mt-1 block">
            Dual-verified collection handovers
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <span className="text-xs text-gray-500 font-medium">Pending Moderation Reports</span>
          <p className="text-3xl font-black text-amber-600 mt-2">{stats.pendingReports}</p>
          <span className="text-[11px] text-gray-400 mt-1 block">Requires admin investigation</span>
        </div>
      </div>

      {/* Audit Trails and Quick Moderation Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Platform Status Events */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-forest-700" />
              Live Platform Transaction Log
            </h3>
            <span className="text-[10px] text-forest-600 bg-forest-50 px-2 py-0.5 rounded-full font-mono">
              Immutable Trail
            </span>
          </div>

          <div className="divide-y divide-gray-100 text-xs">
            {data?.recentEvents && data.recentEvents.length > 0 ? (
              data.recentEvents.map((evt) => (
                <div key={evt.id} className="py-3">
                  <div className="flex items-center justify-between text-gray-500 text-[11px]">
                    <span className="font-semibold text-gray-800">
                      {evt.actor?.name} ({evt.actorRole})
                    </span>
                    <span className="font-mono">
                      {new Date(evt.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-gray-700 mt-1 font-medium">{evt.note}</p>
                  <span className="text-[10px] text-forest-600 uppercase font-bold tracking-wider">
                    Status: {evt.newStatus}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 py-4 text-center">No recent events.</p>
            )}
          </div>
        </div>

        {/* Admin Action Audit Logs */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              Administrative Audit Trail
            </h3>
            <Link href="/admin/audit-logs" className="text-xs font-bold text-amber-700 hover:underline">
              View All Logs
            </Link>
          </div>

          <div className="divide-y divide-gray-100 text-xs">
            {data?.auditLogs && data.auditLogs.length > 0 ? (
              data.auditLogs.map((log) => (
                <div key={log.id} className="py-3">
                  <div className="flex items-center justify-between text-gray-500 text-[11px]">
                    <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                      {log.action}
                    </span>
                    <span className="font-mono">
                      {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-gray-700 mt-1 font-medium">{log.details}</p>
                  <span className="text-[10px] text-gray-400">
                    Admin: {log.admin?.name || 'System Admin'}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 py-4 text-center">No moderation logs yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
