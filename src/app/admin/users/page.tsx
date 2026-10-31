'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Users, ArrowLeft, ShieldCheck, UserX, CheckCircle, AlertCircle } from 'lucide-react';

export default function AdminUsersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [usersList, setUsersList] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [msg, setMsg] = useState('');

  const fetchUsers = () => {
    fetch('/api/admin/users')
      .then((res) => res.json())
      .then((d) => {
        if (d.users) setUsersList(d.users);
      })
      .catch(console.error)
      .finally(() => setIsLoadingData(false));
  };

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) {
      router.push('/login');
      return;
    }
    fetchUsers();
  }, [user, loading, router]);

  const handleToggleSuspend = async (userId: string, isSuspended: boolean) => {
    setMsg('');
    try {
      const action = isSuspended ? 'RESTORE_USER' : 'SUSPEND_USER';
      const res = await fetch('/api/admin/moderation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          targetId: userId,
          reason: 'Administrative moderation review',
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg(data.message || 'User status updated');
        fetchUsers();
      }
    } catch (e: any) {
      setMsg(e.message || 'Action failed');
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
          User & Organization Management
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Review accounts, verified organizations, and manage account access suspension.
        </p>
      </div>

      {msg && (
        <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold">
          {msg}
        </div>
      )}

      <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">User / Organization</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Details</th>
                <th className="py-3 px-4">Activity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {usersList.map((u) => {
                const orgTitle =
                  u.donorProfile?.businessName || u.orgProfile?.orgName || u.name;
                const orgType =
                  u.donorProfile?.businessType || u.orgProfile?.orgType || 'System User';

                return (
                  <tr key={u.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-gray-900">{orgTitle}</div>
                      <div className="text-[11px] text-gray-400 font-normal">{u.email}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          u.role === 'ADMIN'
                            ? 'bg-amber-100 text-amber-800'
                            : u.role === 'DONOR'
                            ? 'bg-forest-100 text-forest-800'
                            : 'bg-teal-100 text-teal-800'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">
                      <div>{orgType}</div>
                      <div className="text-[10px] text-gray-400">{u.address || u.city}</div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">
                      {u.role === 'DONOR' && (
                        <span>{u._count?.listings || 0} Listings</span>
                      )}
                      {u.role === 'RECIPIENT' && (
                        <span>{u._count?.requests || 0} Requests</span>
                      )}
                      {u.role === 'ADMIN' && <span>Control Access</span>}
                    </td>
                    <td className="py-3.5 px-4">
                      {u.isSuspended ? (
                        <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                          Suspended
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          Active & Verified
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {u.role !== 'ADMIN' && (
                        <button
                          onClick={() => handleToggleSuspend(u.id, u.isSuspended)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                            u.isSuspended
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-red-50 text-red-600 hover:bg-red-100'
                          }`}
                        >
                          {u.isSuspended ? 'Restore' : 'Suspend'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
