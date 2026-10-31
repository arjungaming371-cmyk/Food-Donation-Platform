'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Utensils,
  PlusCircle,
  Clock,
  ShieldCheck,
  AlertCircle,
  MapPin,
  CheckCircle2,
} from 'lucide-react';

export default function CreateListingPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Cooked Meals');
  const [quantity, setQuantity] = useState('15');
  const [unit, setUnit] = useState('kg');
  const [dietaryType, setDietaryType] = useState('VEG');
  const [allergens, setAllergens] = useState('None');
  const [storageCondition, setStorageCondition] = useState('Hot / Insulated');
  const [handlingInstructions, setHandlingInstructions] = useState(
    'Keep insulated in thermal food carriers. Consume or redistribute within 4 hours.'
  );
  const [pickupAddress, setPickupAddress] = useState(user?.address || 'MG Road, Secunderabad, Hyderabad');
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=60'
  );
  const [declaration, setDeclaration] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!declaration) {
      setErrorMsg('Mandatory Food Safety Declaration must be accepted before publishing.');
      return;
    }

    const qty = parseFloat(quantity);
    if (isNaN(qty) || qty <= 0) {
      setErrorMsg('Quantity must be greater than zero.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const now = new Date();
      const prepTime = new Date(now.getTime() - 1 * 60 * 60 * 1000); // 1 hr ago
      const expiryTime = new Date(now.getTime() + 4 * 60 * 60 * 1000); // 4 hrs from now

      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          category,
          imageUrl,
          quantity: qty,
          unit,
          dietaryType,
          allergens,
          cookedOrPreparedAt: prepTime.toISOString(),
          expiryOrBestBefore: expiryTime.toISOString(),
          storageCondition,
          handlingInstructions,
          donorDeclarationConfirmed: true,
          pickupAddress,
          pickupStartTime: now.toISOString(),
          pickupEndTime: expiryTime.toISOString(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to publish listing');
      } else {
        router.push('/donor/manage');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error publishing listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <span className="text-xs font-bold text-forest-700 uppercase tracking-wider bg-forest-100 px-3 py-1 rounded-full">
          Surplus Redistribution
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">
          Publish Surplus Food Listing
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Share safe, wholesome surplus food with registered community charities across Hyderabad.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-600 font-medium">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Food Details */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Utensils className="w-4 h-4 text-forest-700" />
              Food Item Details
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Food Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Vegetable Dum Biryani (15 kg)"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Description & Ingredients
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe items, freshness, packaging format (sealed foil trays, vessels)..."
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                  >
                    <option value="Cooked Meals">Cooked Meals</option>
                    <option value="Bakery & Bread">Bakery & Bread</option>
                    <option value="Fruits & Vegetables">Fruits & Vegetables</option>
                    <option value="Packaged Food">Packaged Food</option>
                    <option value="Dairy">Dairy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Dietary Classification *
                  </label>
                  <select
                    value={dietaryType}
                    onChange={(e) => setDietaryType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                  >
                    <option value="VEG">Vegetarian (Veg)</option>
                    <option value="VEGAN">Vegan</option>
                    <option value="NON_VEG">Non-Vegetarian</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Known Allergens
                  </label>
                  <input
                    type="text"
                    value={allergens}
                    onChange={(e) => setAllergens(e.target.value)}
                    placeholder="e.g. Dairy, Gluten, Peanuts"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Quantity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Available Quantity *
                  </label>
                  <input
                    type="number"
                    min="0.5"
                    step="any"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="15"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Measurement Unit *
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                  >
                    <option value="kg">Kilograms (kg)</option>
                    <option value="pieces">Pieces / Units</option>
                    <option value="packets">Packets</option>
                    <option value="servings">Individual Servings</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Storage & Pickup Logistics */}
          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-forest-700" />
              Storage Conditions & Pickup Location
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Storage Condition *
                  </label>
                  <select
                    value={storageCondition}
                    onChange={(e) => setStorageCondition(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                  >
                    <option value="Hot / Insulated">Hot / Insulated (&gt; 60°C)</option>
                    <option value="Refrigerated">Refrigerated (&lt; 5°C)</option>
                    <option value="Room Temperature">Room Temperature (Dry)</option>
                    <option value="Frozen">Frozen</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Handling Instructions *
                  </label>
                  <input
                    type="text"
                    required
                    value={handlingInstructions}
                    onChange={(e) => setHandlingInstructions(e.target.value)}
                    placeholder="e.g. Transport in insulated boxes, distribute within 4 hrs"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Pickup Address (Hyderabad Metro) *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    placeholder="e.g. Paradise Food Court, MG Road, Secunderabad"
                    className="w-full pl-9 pr-3.5 py-2.5 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Food Photo URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Mandatory Safety Pledge Checkbox */}
          <div className="p-4 bg-amber-50/80 border border-amber-300 rounded-2xl">
            <label className="flex items-start gap-3 cursor-pointer text-xs text-gray-800">
              <input
                type="checkbox"
                required
                checked={declaration}
                onChange={(e) => setDeclaration(e.target.checked)}
                className="mt-0.5 rounded text-forest-700 focus:ring-forest-600 w-4 h-4"
              />
              <span className="leading-relaxed">
                <strong className="text-gray-900">Mandatory Food Safety Declaration:</strong> "I confirm that the food information, preparation time, storage details, and handling instructions provided are accurate to the best of my knowledge, and I will follow applicable local food-safety requirements."
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-forest-700 hover:bg-forest-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-emerald-300" />
              <span>{loading ? 'Publishing...' : 'Publish Listing'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
