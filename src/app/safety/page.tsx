import React from 'react';
import Link from 'next/link';
import { ShieldAlert, AlertTriangle, CheckCircle2, Thermometer, Clock, ShieldCheck, Flame } from 'lucide-react';

export default function SafetyPage() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-xs font-bold text-amber-800 uppercase tracking-wider bg-amber-100 px-3 py-1 rounded-full">
          Quality & Compliance Protocols
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mt-3">
          Food Safety & Responsible Handling Guidelines
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-2">
          Strict operational guidelines and disclaimers for donors and recipient organizations participating in FoodBridge.
        </p>
      </div>

      {/* Mandatory Statutory Disclaimer Box */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-6 sm:p-8 mb-12 shadow-sm">
        <div className="flex items-start gap-4">
          <AlertTriangle className="w-8 h-8 text-amber-600 flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Statutory Food Safety Disclaimer
            </h2>
            <p className="text-xs sm:text-sm text-gray-800 mt-2 leading-relaxed">
              <strong>FoodBridge does not certify food safety or medically verify any item listed on the platform.</strong> Donors are exclusively responsible for the accuracy of food information, hygiene standards during preparation, and strict adherence to applicable local food-safety requirements (such as FSSAI standards).
            </p>
            <p className="text-xs sm:text-sm text-gray-800 mt-2 leading-relaxed">
              Recipient organizations must conduct an on-site sensory inspection (appearance, odor, packaging integrity, and temperature) before taking custody of or distributing any food to beneficiaries. <strong>Never distribute food that shows signs of spoilage, abnormal temperature drop, or contamination.</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Mandatory Donor Declaration Section */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 mb-12 shadow-sm" id="declaration">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-forest-100 text-forest-800 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5 text-forest-700" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">Mandatory Donor Declaration</h3>
            <p className="text-xs text-gray-500">Required before publishing every single surplus listing</p>
          </div>
        </div>

        <blockquote className="p-4 bg-forest-50/60 border-l-4 border-forest-600 rounded-r-xl text-xs sm:text-sm text-forest-950 font-medium italic leading-relaxed">
          "I confirm that the food information, preparation time, storage details, and handling instructions provided are accurate to the best of my knowledge, and I will follow applicable local food-safety requirements."
        </blockquote>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-xs text-gray-600">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>Preparation and listing timestamps must reflect true kitchen cook completion time.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>All common allergens (dairy, nuts, gluten, mustard) must be explicitly disclosed.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>Donors may not hide or alter expiry/use-by guidelines once a batch is published.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>Food that has been on customer plates or buffet self-service is strictly prohibited.</span>
          </div>
        </div>
      </div>

      {/* Temperature & Storage Guidelines */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center mb-4">
            <Flame className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-gray-900 text-sm">Hot Food Transport</h4>
          <p className="text-2xl font-black text-red-600 mt-1">&gt; 60°C (140°F)</p>
          <p className="text-xs text-gray-500 mt-2 leading-relaxed">
            Must be held in thermally insulated containers. Maximum safe redistribution time from preparation is 4 hours without reheating.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
            <Thermometer className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-gray-900 text-sm">Chilled & Dairy Items</h4>
          <p className="text-2xl font-black text-blue-600 mt-1">&lt; 5°C (41°F)</p>
          <p className="text-xs text-gray-500 mt-2 leading-relaxed">
            Must remain refrigerated in insulated cool-boxes with cold packs. Curd, milk, and cream items must not be exposed to ambient summer heat.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
            <Clock className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-gray-900 text-sm">Dry Bakery & Fresh Produce</h4>
          <p className="text-2xl font-black text-emerald-600 mt-1">Room Temp (Dry)</p>
          <p className="text-xs text-gray-500 mt-2 leading-relaxed">
            Bread and bakery items must remain in clean, sealed wrappers away from moisture and direct sunlight. Fresh produce must be washed thoroughly.
          </p>
        </div>
      </div>

      {/* Recipient Responsibilities */}
      <div className="bg-stone-100/70 rounded-3xl p-6 sm:p-8 border border-stone-200">
        <h3 className="font-bold text-gray-900 text-base mb-2">Recipient Organization Inspection Checklist</h3>
        <p className="text-xs text-gray-600 mb-4">
          Before clicking "Confirm Pickup" or providing the 6-digit PIN to the donor, your field volunteer must verify:
        </p>
        <div className="space-y-2 text-xs text-gray-700">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-forest-700"></span>
            <span>Food packaging is intact with no pest, dust, or chemical exposure.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-forest-700"></span>
            <span>Food temperature feels appropriate (steaming hot or chilled to the touch).</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-forest-700"></span>
            <span>Visual inspection shows natural aroma and no rancid or sour smell.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-forest-700"></span>
            <span>If any doubt exists, reject the batch immediately and report the listing through the FoodBridge portal.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
