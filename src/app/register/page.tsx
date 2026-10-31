'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Heart, Utensils, HeartHandshake, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [role, setRole] = useState<'DONOR' | 'RECIPIENT'>('DONOR');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Hyderabad');

  // Donor fields
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('Restaurant');
  const [fssaiNumber, setFssaiNumber] = useState('');
  const [pickupInstructions, setPickupInstructions] = useState('');
  const [safetyPledge, setSafetyPledge] = useState(true);

  // Recipient fields
  const [orgName, setOrgName] = useState('');
  const [orgType, setOrgType] = useState('NGO');
  const [regNumber, setRegNumber] = useState('');
  const [peopleServed, setPeopleServed] = useState('150');
  const [beneficiaryDescription, setBeneficiaryDescription] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (role === 'DONOR' && !safetyPledge) {
      setErrorMsg('You must agree to the Food Safety Pledge to register as a donor.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const payload: any = {
        name,
        email,
        password,
        role,
        phone,
        address,
        city,
      };

      if (role === 'DONOR') {
        payload.businessName = businessName || name;
        payload.businessType = businessType;
        payload.fssaiNumber = fssaiNumber;
        payload.pickupInstructions = pickupInstructions;
        payload.safetyPledgeAccepted = safetyPledge;
      } else {
        payload.orgName = orgName || name;
        payload.orgType = orgType;
        payload.registrationNumber = regNumber;
        payload.estimatedPeopleServed = parseInt(peopleServed) || 100;
        payload.beneficiaryDescription = beneficiaryDescription;
      }

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Registration failed');
      } else {
        await refreshUser();
        router.push(role === 'DONOR' ? '/donor/dashboard' : '/recipient/dashboard');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] py-12 px-4 sm:px-6 lg:px-8 bg-stone-50/50 flex items-center justify-center">
      <div className="max-w-xl w-full">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-forest-700 mx-auto flex items-center justify-center text-white shadow-md">
            <Heart className="w-6 h-6 fill-white" />
          </div>
          <h2 className="mt-4 text-2xl font-black text-gray-900 tracking-tight">
            Join the FoodBridge Network
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            Create your account to start donating surplus food or receiving it for your beneficiaries
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-sm">
          {/* Role Switcher Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-2xl mb-6 text-xs font-bold">
            <button
              type="button"
              onClick={() => setRole('DONOR')}
              className={`py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                role === 'DONOR'
                  ? 'bg-white text-forest-800 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Utensils className="w-4 h-4 text-amber-600" />
              <span>Food Donor (Restaurant/Kitchen)</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('RECIPIENT')}
              className={`py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                role === 'RECIPIENT'
                  ? 'bg-white text-forest-800 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <HeartHandshake className="w-4 h-4 text-emerald-600" />
              <span>Recipient Org (NGO/Shelter)</span>
            </button>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Core credentials */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Name / Contact Person *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organization.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Password (min 6 characters) *
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98480 00000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Address / Locality *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Road 12, Banjara Hills"
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none bg-gray-50"
                />
              </div>
            </div>

            {/* Role-specific fields */}
            {role === 'DONOR' ? (
              <div className="pt-3 border-t border-gray-100 space-y-3">
                <span className="block text-xs font-bold text-forest-800 uppercase tracking-wider">
                  Donor Business Information
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Business / Restaurant Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Paradise Food Court"
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Business Type *
                    </label>
                    <select
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                    >
                      <option value="Restaurant">Restaurant</option>
                      <option value="Hotel">Hotel</option>
                      <option value="Caterer">Caterer</option>
                      <option value="Grocery">Grocery / Supermarket</option>
                      <option value="Community Kitchen">Community Kitchen / Bakery</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    FSSAI License / Registration (Optional demo)
                  </label>
                  <input
                    type="text"
                    value={fssaiNumber}
                    onChange={(e) => setFssaiNumber(e.target.value)}
                    placeholder="14-digit FSSAI number (e.g. 13618011000234)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                  />
                </div>

                {/* Mandatory Safety Pledge */}
                <div className="p-3 bg-forest-50 border border-forest-200 rounded-2xl">
                  <label className="flex items-start gap-2 cursor-pointer text-xs text-gray-700">
                    <input
                      type="checkbox"
                      checked={safetyPledge}
                      onChange={(e) => setSafetyPledge(e.target.checked)}
                      className="mt-0.5 rounded text-forest-700 focus:ring-forest-600"
                    />
                    <span className="leading-relaxed">
                      <strong>Mandatory Food Safety Declaration:</strong> I confirm that surplus food information, preparation timestamps, and storage handling instructions provided will be accurate, and I will adhere to applicable food-safety regulations.
                    </span>
                  </label>
                </div>
              </div>
            ) : (
              <div className="pt-3 border-t border-gray-100 space-y-3">
                <span className="block text-xs font-bold text-forest-800 uppercase tracking-wider">
                  Recipient Organization Details
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Organization Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      placeholder="e.g. Hope Community Foundation"
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Organization Type *
                    </label>
                    <select
                      value={orgType}
                      onChange={(e) => setOrgType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                    >
                      <option value="NGO">Non-Governmental Organization (NGO)</option>
                      <option value="Charitable Organization">Charitable Trust</option>
                      <option value="Orphanage">Orphanage</option>
                      <option value="Shelter">Night Shelter / Homeless Relief</option>
                      <option value="Community Group">Community Distribution Group</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Govt / Trust Registration Number
                    </label>
                    <input
                      type="text"
                      value={regNumber}
                      onChange={(e) => setRegNumber(e.target.value)}
                      placeholder="e.g. HYD/NGO/2020/4102"
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Estimated People Served Per Day *
                    </label>
                    <input
                      type="number"
                      required
                      value={peopleServed}
                      onChange={(e) => setPeopleServed(e.target.value)}
                      placeholder="150"
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Beneficiary Focus / Distribution Area
                  </label>
                  <textarea
                    rows={2}
                    value={beneficiaryDescription}
                    onChange={(e) => setBeneficiaryDescription(e.target.value)}
                    placeholder="Briefly describe who receives meals and your transport readiness..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3 px-4 rounded-xl bg-forest-700 hover:bg-forest-800 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-forest-700/20 transition-all flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-500">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-forest-700 hover:underline">
              Log in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
