'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, ShieldCheck, Clock, FileText } from 'lucide-react';

export default function AdminAuditLogsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [logs, setLogs] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) {
      router.push('/login');
      return;
    }

    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then((d) => {
        if (d.auditLogs) setLogs(d.auditLogs);
      })
      .finally(() => setIsLoadingData(false));
  }, [user, loading, router]);

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
          Administrative Audit Logs
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Complete chronological record of moderation events, user suspensions, and listing takedowns.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
        {logs.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-8">No audit logs recorded yet.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {logs.map((log) => (
              <div key={log.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full text-[10px]">
                      {log.action}
                    </span>
                    <span className="text-gray-400 font-mono text-[11px]">
                      Target: {log.targetType} #{log.targetId.slice(-6)}
                    </span>
                  </div>
                  <p className="text-gray-800 font-medium text-xs">{log.details}</p>
                </div>

                <div className="text-right sm:flex-shrink-0">
                  <span className="text-gray-500 block text-[11px]">
                    Admin: <strong>{log.admin?.name || 'System Admin'}</strong>
                  </span>
                  <span className="text-gray-400 text-[10px] font-mono">
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
