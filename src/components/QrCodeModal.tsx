'use client';

import React, { useState, useEffect } from 'react';
import { X, QrCode, CheckCircle2, ShieldCheck, Copy, Check } from 'lucide-react';

interface QrCodeModalProps {
  requestId: string;
  isOpen: boolean;
  onClose: () => void;
  onVerified?: () => void;
  isDonor?: boolean;
}

export default function QrCodeModal({ requestId, isOpen, onClose, onVerified, isDonor }: QrCodeModalProps) {
  const [data, setData] = useState<{ code: string; qrDataUrl: string; status: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [inputCode, setInputCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && requestId) {
      setLoading(true);
      setErrorMsg('');
      setSuccessMsg('');
      fetch(`/api/requests/${requestId}/qrcode`)
        .then((res) => res.json())
        .then((resData) => {
          if (resData.success) {
            setData(resData);
            if (!isDonor) {
              setInputCode(resData.code);
            }
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, requestId, isDonor]);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    if (data?.code) {
      navigator.clipboard.writeText(data.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleVerify = async () => {
    if (!inputCode) {
      setErrorMsg('Please enter the 6-digit pickup verification code.');
      return;
    }
    setVerifying(true);
    setErrorMsg('');
    try {
      const res = await fetch(`/api/requests/${requestId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'VERIFY_CODE',
          code: inputCode.trim(),
        }),
      });
      const result = await res.json();
      if (!res.ok) {
        setErrorMsg(result.error || 'Verification failed');
      } else {
        setSuccessMsg('Handover successfully verified! Donation marked as COMPLETED.');
        if (onVerified) onVerified();
        setTimeout(() => {
          onClose();
        }, 1800);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Verification error');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-forest-900 to-forest-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-amber-300" />
            <h3 className="font-bold text-base">QR Pickup Verification</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-forest-200 hover:text-white hover:bg-forest-700/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-4 border-forest-600 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-xs text-gray-500 font-medium">Generating secure QR code...</p>
            </div>
          ) : (
            <div>
              <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                Scan this QR code during physical food collection or present the 6-digit security PIN to confirm handover and close the transaction.
              </p>

              {/* QR Image */}
              {data?.qrDataUrl && (
                <div className="inline-block p-3 bg-white rounded-2xl border-2 border-forest-100 shadow-inner mb-4">
                  <img
                    src={data.qrDataUrl}
                    alt="Pickup Verification QR Code"
                    className="w-48 h-48 mx-auto"
                  />
                </div>
              )}

              {/* 6-digit Code Display */}
              <div className="bg-forest-50 border border-forest-200 rounded-2xl p-3 mb-5 flex items-center justify-between max-w-xs mx-auto">
                <div className="text-left">
                  <span className="block text-[10px] uppercase font-bold text-forest-600 tracking-wider">
                    Verification PIN
                  </span>
                  <span className="text-2xl font-black text-forest-950 tracking-widest">
                    {data?.code || '------'}
                  </span>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="p-2 rounded-xl bg-white border border-forest-200 hover:bg-forest-100 text-forest-700 transition-colors"
                  title="Copy PIN"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Verification Form */}
              <div className="border-t border-gray-100 pt-4 text-left">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  {isDonor ? 'Verify Recipient Handover Code:' : 'Instant Handover Confirmation:'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    placeholder="Enter 6-digit PIN"
                    maxLength={6}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-sm font-mono tracking-widest text-center focus:ring-2 focus:ring-forest-600 focus:outline-none"
                  />
                  <button
                    onClick={handleVerify}
                    disabled={verifying}
                    className="px-4 py-2 bg-forest-700 hover:bg-forest-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                  >
                    {verifying ? 'Verifying...' : 'Verify & Complete'}
                  </button>
                </div>

                {errorMsg && (
                  <p className="text-xs text-red-600 font-medium mt-2 bg-red-50 p-2 rounded-lg">
                    {errorMsg}
                  </p>
                )}

                {successMsg && (
                  <p className="text-xs text-emerald-700 font-semibold mt-2 bg-emerald-50 p-2 rounded-lg flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{successMsg}</span>
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-400 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-forest-600" />
                <span>Dual-key verified transaction logged to immutable audit trail</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
