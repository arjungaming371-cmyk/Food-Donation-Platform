'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Utensils,
  HeartHandshake,
  QrCode,
  ShieldCheck,
  TrendingUp,
  Code2,
  Database,
  ArrowRight,
  CheckCircle2,
  Clock,
  MapPin,
  Flame,
  Activity,
  Layers,
} from 'lucide-react';

interface DemoStep {
  id: number;
  phase: string;
  actor: 'DONOR' | 'RECIPIENT' | 'SYSTEM' | 'ADMIN';
  title: string;
  subtitle: string;
  description: string;
  codeSnippet: string;
  codeLanguage: string;
  codeTitle: string;
  dataPayload: any;
  uiState: any;
}

const DEMO_STEPS: DemoStep[] = [
  {
    id: 1,
    phase: 'Step 01 / 06',
    actor: 'DONOR',
    title: 'Donor Publishes Surplus Listing',
    subtitle: 'Paradise Biryani lists 15 kg of surplus Vegetable Dum Biryani',
    description:
      'The restaurant logs surplus food into FoodBridge. It records kitchen preparation time, safe 4-hour thermal window (> 60°C), allergens, and signs the mandatory food-safety declaration.',
    codeTitle: 'POST /api/listings (Database Transaction & Safety Gate)',
    codeLanguage: 'typescript',
    codeSnippet: `// 1. Enforce Mandatory Food Safety Declaration
if (!donorDeclarationConfirmed) {
  throw new Error("Safety pledge required before publishing surplus.");
}

// 2. ACID Transaction: Persist Listing + Status Audit Entry
const listing = await prisma.$transaction(async (tx) => {
  const created = await tx.foodListing.create({
    data: {
      donorId: user.id,
      title: "Vegetable Dum Biryani",
      category: "Cooked Meals",
      totalQuantity: 15,
      availableQuantity: 15,
      unit: "kg",
      dietaryType: "VEG",
      allergens: "Dairy (Ghee & Paneer)",
      storageCondition: "Hot / Insulated (> 60°C)",
      cookedOrPreparedAt: new Date(),
      expiryOrBestBefore: new Date(Date.now() + 4 * 3600000), // 4h window
      status: "AVAILABLE",
    },
  });

  await tx.donationStatusHistory.create({
    data: {
      listingId: created.id,
      actorId: user.id,
      actorRole: "DONOR",
      newStatus: "AVAILABLE",
      note: "Batch published with verified kitchen cook declaration.",
    },
  });
  return created;
});`,
    dataPayload: {
      event: 'LISTING_PUBLISHED',
      listingId: 'lst_biryani_15kg',
      donor: 'Paradise Food Court (Secunderabad)',
      quantity: '15 kg',
      status: 'AVAILABLE',
      safeWindow: '4 hours remaining',
      safetyDeclarationAccepted: true,
    },
    uiState: {
      type: 'LISTING_VIEW',
      foodTitle: 'Vegetable Dum Biryani',
      donorName: 'Paradise Biryani Restaurant',
      quantity: '15 kg',
      category: 'Cooked Meals',
      dietary: 'VEG',
      storage: 'Hot / Insulated (> 60°C)',
      status: 'AVAILABLE',
      progress: 100,
    },
  },
  {
    id: 2,
    phase: 'Step 02 / 06',
    actor: 'RECIPIENT',
    title: 'Smart NGO–Food Matching Discovery',
    subtitle: 'Hope Community Foundation matches at 94% Compatibility',
    description:
      'The NGO logs in. The deterministic matching engine scores available food batches against the NGO’s GPS location (Haversine formula), daily capacity (250 people), and dietary parameters.',
    codeTitle: 'src/lib/matching.ts (Multi-Factor Compatibility Engine)',
    codeLanguage: 'typescript',
    codeSnippet: `export function calculateSmartMatch(listing, org): MatchResult {
  // 1. Proximity via Haversine Formula (35% Weight)
  const distKm = calculateDistanceKm(listing.lat, listing.lng, org.lat, org.lng);
  const distScore = distKm < 5 ? 98 : distKm < 10 ? 80 : 50;

  // 2. Capacity Fit vs 400g Meal Equivalents (30% Weight)
  const approxMeals = (listing.availableQuantity * 1000) / 400; // 15kg = 38 meals
  const capacityRatio = Math.min(approxMeals / org.served, org.served / approxMeals);
  const capScore = Math.min(100, Math.round(capacityRatio * 100)); // 88/100

  // 3. Collection Window Urgency (20% Weight)
  const hoursLeft = (listing.expiry - Date.now()) / 3600000;
  const timeScore = hoursLeft > 2 ? 95 : 60;

  // 4. Dietary Compatibility (15% Weight)
  const dietScore = listing.dietaryType === "VEG" ? 95 : 80;

  // Weighted Total
  const total = Math.round(
    distScore * 0.35 + capScore * 0.30 + timeScore * 0.20 + dietScore * 0.15
  );

  return { score: total, summary: "94% High Compatibility Match" };
}`,
    dataPayload: {
      algorithm: 'DETERMINISTIC_MULTI_FACTOR_MATCH',
      factors: {
        proximityScore: '98/100 (3.2 km distance in Secunderabad)',
        capacityFit: '88/100 (Provides 38 meals for 250 daily beneficiaries)',
        timeWindowScore: '95/100 (3.8 hours remaining)',
        dietaryScore: '95/100 (Vegetarian matched)',
      },
      finalCompatibilityScore: '94%',
    },
    uiState: {
      type: 'DISCOVERY_VIEW',
      foodTitle: 'Vegetable Dum Biryani',
      donorName: 'Paradise Biryani',
      matchScore: 94,
      distance: '3.2 km away',
      mealsEquivalent: '~38 meal equivalents',
      status: 'AVAILABLE',
    },
  },
  {
    id: 3,
    phase: 'Step 03 / 06',
    actor: 'SYSTEM',
    title: 'Safe Reservation & Concurrency Lock',
    subtitle: 'NGO requests 10 kg; stock locks from 15 kg down to 5 kg',
    description:
      'Hope Community Foundation requests 10 kg. The donor accepts. An ACID database transaction reserves the exact quantity and updates the listing stock to 5 kg, preventing any duplicate reservations or negative stock overdrafts.',
    codeTitle: 'POST /api/requests/[id]/status (ACID Lock on Quantity)',
    codeLanguage: 'typescript',
    codeSnippet: `await prisma.$transaction(async (tx) => {
  const listing = await tx.foodListing.findUnique({ where: { id: listingId } });
  
  // Guard against race conditions & double-booking
  if (listing.availableQuantity < request.requestedQuantity) {
    throw new Error("Insufficient surplus remaining to fulfill request.");
  }

  // Deduct reserved stock
  const remaining = listing.availableQuantity - request.requestedQuantity;
  await tx.foodListing.update({
    where: { id: listingId },
    data: { availableQuantity: remaining }, // 15kg -> 5kg
  });

  // Generate 6-digit cryptographic PIN
  const pin = Math.floor(100000 + Math.random() * 900000).toString(); // "849201"

  await tx.donationRequest.update({
    where: { id: requestId },
    data: { status: "ACCEPTED", pickupVerificationCode: pin },
  });

  // Notify counterparty & append immutable audit log
  await tx.notification.create({
    data: { userId: recipientId, title: "Request Accepted! PIN: 849201" },
  });
});`,
    dataPayload: {
      event: 'REQUEST_ACCEPTED',
      requestedQuantity: '10 kg',
      previousStock: '15 kg',
      lockedRemainingStock: '5 kg',
      verificationPIN: '849201',
      doubleBookingPrevented: true,
      transactionStatus: 'COMMITTED',
    },
    uiState: {
      type: 'RESERVATION_VIEW',
      requestedQty: '10 kg',
      remainingQty: '5 kg',
      pin: '849201',
      requestStatus: 'ACCEPTED',
      donorApproved: true,
    },
  },
  {
    id: 4,
    phase: 'Step 04 / 06',
    actor: 'RECIPIENT',
    title: 'Dynamic QR-Based Handover Verification',
    subtitle: 'Driver arrives at loading dock; 6-digit PIN & QR code scanned',
    description:
      'Hope Community driver arrives at the kitchen with thermal food carriers. The driver shows the dynamic QR code and 6-digit PIN (849201). The donor verifies the code, guaranteeing physical custody transfer.',
    codeTitle: 'src/lib/qrcode.ts & Handover Verification Endpoint',
    codeLanguage: 'typescript',
    codeSnippet: `// 1. Generate encrypted QR verification token
const payload = JSON.stringify({
  requestId: "req_9921",
  code: "849201",
  item: "Vegetable Dum Biryani (10 kg)",
});
const qrSvgDataUrl = await QRCode.toDataURL(payload, {
  color: { dark: "#14532d", light: "#ffffff" },
});

// 2. Verify Handover on Arrival
if (enteredCode !== request.pickupVerificationCode) {
  throw new Error("Invalid verification code. Handover rejected.");
}

await prisma.$transaction(async (tx) => {
  await tx.donationRequest.update({
    where: { id: requestId },
    data: {
      donorConfirmedHandover: true,
      recipientConfirmedPickup: true,
      status: "COMPLETED", // Dual-party verified
    },
  });
});`,
    dataPayload: {
      verificationMethod: 'DYNAMIC_QR_AND_6DIGIT_PIN',
      codeVerified: '849201',
      donorHandoverConfirmed: true,
      recipientReceiptConfirmed: true,
      custodyTransferTimestamp: new Date().toISOString(),
      finalStatus: 'COMPLETED',
    },
    uiState: {
      type: 'QR_VIEW',
      pin: '849201',
      qrReady: true,
      driverPresent: true,
      handoverVerified: true,
      status: 'COMPLETED',
    },
  },
  {
    id: 5,
    phase: 'Step 05 / 06',
    actor: 'SYSTEM',
    title: 'Real-Time Impact Ledger Update',
    subtitle: '+10 kg rescued • +25 meals delivered • +25 kg CO2e averted',
    description:
      'Upon completed verification, the impact engine aggregates verified food weight, converts it to 400g adult meal equivalents, and computes greenhouse gas emissions diverted from urban landfills.',
    codeTitle: 'src/lib/impact.ts (Real-Time Impact Aggregation)',
    codeLanguage: 'typescript',
    codeSnippet: `export async function getLiveImpactMetrics(): Promise<ImpactMetrics> {
  const completed = await prisma.donationRequest.findMany({
    where: { status: "COMPLETED" },
    include: { listing: true },
  });

  // Calculate total kilograms rescued
  const totalKg = completed.reduce((sum, r) => sum + r.requestedQuantity, 0);

  // Standard 400g meal-equivalent conversion formula:
  const mealsRescued = Math.round((totalKg * 1000) / 400);

  // Global food diversion greenhouse factor: 2.5 kg CO2e per kg food saved
  const co2AvoidedKg = Math.round(totalKg * 2.5);

  return {
    totalKgSaved: totalKg,
    totalMealsRescued: mealsRescued,
    co2EmissionsAvoidedKg: co2AvoidedKg,
    participatingOrgsCount: await prisma.user.count({ where: { role: "RECIPIENT" } }),
  };
}`,
    dataPayload: {
      incrementalKgSaved: '+10 kg',
      incrementalMealsDelivered: '+25 Meals (@ 400g/meal)',
      incrementalCO2Averted: '+25 kg CO2e',
      beneficiariesFed: 'Hope Community Foundation (Gandhi Hospital Area)',
    },
    uiState: {
      type: 'IMPACT_VIEW',
      totalMeals: '1,075+',
      totalKg: '430 kg',
      co2Averted: '1,075 kg',
      activePartners: '8 Organizations',
    },
  },
  {
    id: 6,
    phase: 'Step 06 / 06',
    actor: 'ADMIN',
    title: 'Admin Moderation & Immutable Audit Log',
    subtitle: 'Complete chronological transparency for platform oversight',
    description:
      'The platform administrator reviews the full transaction lifecycle in the live audit log. Admins have immediate powers to inspect listings, investigate reported flags, or suspend fraudulent accounts.',
    codeTitle: 'GET /api/admin/stats & Immutable Audit Trail Query',
    codeLanguage: 'typescript',
    codeSnippet: `// Complete chronological audit log of all platform state changes
const auditTrail = await prisma.donationStatusHistory.findMany({
  where: { listingId: listing.id },
  include: { actor: { select: { name: true, role: true } } },
  orderBy: { createdAt: "asc" },
});

// Returns immutable lifecycle:
// 1. [DONOR] AVAILABLE: Listing created with safety declaration
// 2. [RECIPIENT] PENDING: Hope Foundation requested 10 kg
// 3. [DONOR] ACCEPTED: Reserved 10 kg, generated PIN 849201
// 4. [SYSTEM] COMPLETED: QR Handover confirmed by both parties`,
    dataPayload: {
      auditLogEntries: [
        { time: '11:00 AM', actor: 'Donor (Paradise)', status: 'AVAILABLE', note: 'Created listing' },
        { time: '11:15 AM', actor: 'NGO (Hope Fdn)', status: 'PENDING', note: 'Requested 10 kg' },
        { time: '11:20 AM', actor: 'Donor (Paradise)', status: 'ACCEPTED', note: 'PIN 849201 issued' },
        { time: '11:45 AM', actor: 'Both Parties', status: 'COMPLETED', note: 'Physical QR handover verified' },
      ],
      moderationStatus: 'VERIFIED_AUDITABLE',
    },
    uiState: {
      type: 'ADMIN_VIEW',
      verifiedEntries: 4,
      reportsPending: 0,
      systemHealth: '100% Operational',
    },
  },
];

export default function InteractiveDemoPage() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<number>(4000); // 4 seconds per step
  const [activeTab, setActiveTab] = useState<'CODE' | 'PAYLOAD'>('CODE');

  const step = DEMO_STEPS[currentStepIndex];

  // Auto-play timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= DEMO_STEPS.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, speed]);

  const handleNext = () => {
    if (currentStepIndex < DEMO_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-gray-200 gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-forest-700 bg-forest-100 px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Automated Walkthrough Engine
            </span>
            <span className="text-xs text-gray-400 font-mono">HACK-P197 Live Demo Simulator</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-gray-900 mt-2 tracking-tight">
            End-to-End Workflow & Architecture Simulator
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Watch the complete surplus food journey from kitchen listing to QR handover, with code execution and database transactions visible in real time.
          </p>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-gray-200 shadow-sm">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-forest-700 hover:bg-forest-800 text-white'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause Auto-Demo</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Play Auto-Demo</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
            title="Restart Walkthrough"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="text-xs font-semibold text-gray-600 bg-gray-50 border border-gray-200 rounded-xl px-2 py-1.5 focus:outline-none"
          >
            <option value={6000}>Speed: 0.7x (Slow)</option>
            <option value={4000}>Speed: 1.0x (Normal)</option>
            <option value={2500}>Speed: 1.5x (Fast)</option>
          </select>
        </div>
      </div>

      {/* Step Navigation Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 mb-8">
        {DEMO_STEPS.map((s, index) => {
          const isActive = index === currentStepIndex;
          const isDone = index < currentStepIndex;

          return (
            <button
              key={s.id}
              onClick={() => {
                setIsPlaying(false);
                setCurrentStepIndex(index);
              }}
              className={`p-3 rounded-2xl border text-left transition-all ${
                isActive
                  ? 'bg-forest-900 text-white border-forest-900 shadow-md ring-2 ring-forest-600/50'
                  : isDone
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                  {s.phase.split(' / ')[0]}
                </span>
                {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
              </div>
              <p className="text-xs font-bold mt-1 truncate">{s.title.split(' ')[0]} {s.title.split(' ')[1]}</p>
            </button>
          );
        })}
      </div>

      {/* Main Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Left Column: Interactive Screen Mockup (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-200/90 shadow-lg overflow-hidden">
            {/* Screen Header Bar */}
            <div className="px-5 py-3.5 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-400"></span>
                <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                <span className="text-xs font-mono text-gray-500 ml-2">
                  https://food-donation-platform-blond.vercel.app{step.actor === 'DONOR' ? '/donor/manage' : step.actor === 'RECIPIENT' ? '/recipient/explore' : '/admin/dashboard'}
                </span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-forest-100 text-forest-800">
                {step.actor} VIEW
              </span>
            </div>

            {/* Dynamic Interactive Stage */}
            <div className="p-6 sm:p-8 min-h-[380px] flex flex-col justify-between bg-stone-50/40">
              {/* Dynamic UI Renderer based on Step */}
              {step.uiState.type === 'LISTING_VIEW' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-forest-700 bg-forest-100 px-3 py-1 rounded-full">
                      {step.uiState.category} • {step.uiState.dietary}
                    </span>
                    <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>3.9 hrs remaining</span>
                    </span>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
                    <h3 className="text-xl font-black text-gray-900">{step.uiState.foodTitle}</h3>
                    <p className="text-xs text-gray-600">
                      Prepared fresh at <strong>Paradise Food Court (Secunderabad)</strong>. Insulated at 65°C in clean catering vessels.
                    </p>

                    <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                      <div className="p-3 bg-forest-50/60 rounded-xl border border-forest-100">
                        <span className="text-gray-500 block text-[11px]">Available Quantity:</span>
                        <span className="text-xl font-black text-forest-800">{step.uiState.quantity}</span>
                      </div>
                      <div className="p-3 bg-forest-50/60 rounded-xl border border-forest-100">
                        <span className="text-gray-500 block text-[11px]">Storage Specs:</span>
                        <span className="text-xs font-bold text-gray-800">{step.uiState.storage}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-800 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Mandatory Food Safety Declaration Accepted by Kitchen Manager.</span>
                    </div>
                  </div>
                </div>
              )}

              {step.uiState.type === 'DISCOVERY_VIEW' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-semibold">Discovery Grid: Hyderabad</span>
                    <span className="text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      {step.uiState.matchScore}% High Compatibility Match
                    </span>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-black text-gray-900">{step.uiState.foodTitle}</h3>
                        <p className="text-xs text-gray-500">{step.uiState.donorName} • {step.uiState.distance}</p>
                      </div>
                      <span className="text-xs font-bold text-forest-800 bg-forest-50 px-2.5 py-1 rounded-lg">
                        15 kg Available
                      </span>
                    </div>

                    <div className="p-3 bg-stone-50 rounded-xl text-xs space-y-2 border border-gray-100">
                      <div className="flex justify-between text-gray-600">
                        <span>Proximity (Haversine 3.2 km):</span>
                        <span className="font-bold text-emerald-700">98% Match</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Capacity Fit (Hope Fdn: 250 people):</span>
                        <span className="font-bold text-emerald-700">88% Match</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Collection Window (&gt; 3 hours):</span>
                        <span className="font-bold text-emerald-700">95% Match</span>
                      </div>
                    </div>

                    <button className="w-full py-2.5 bg-forest-700 text-white rounded-xl font-bold text-xs shadow-sm flex items-center justify-center gap-1.5">
                      <HeartHandshake className="w-4 h-4 text-amber-300" />
                      <span>Request 10 kg for Distribution</span>
                    </button>
                  </div>
                </div>
              )}

              {step.uiState.type === 'RESERVATION_VIEW' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-gray-500">Inventory Lock Transaction</span>
                    <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
                      ACID Locked
                    </span>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
                    <h3 className="text-lg font-black text-gray-900">Surplus Batch Deducted</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                        <span className="text-[10px] text-emerald-700 uppercase font-bold">Reserved by NGO</span>
                        <p className="text-2xl font-black text-emerald-800 mt-1">{step.uiState.requestedQty}</p>
                      </div>
                      <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                        <span className="text-[10px] text-amber-700 uppercase font-bold">Remaining Market Stock</span>
                        <p className="text-2xl font-black text-amber-800 mt-1">{step.uiState.remainingQty}</p>
                      </div>
                    </div>

                    <div className="p-3 bg-forest-900 text-white rounded-xl flex items-center justify-between">
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-forest-200">
                          Handover Security PIN
                        </span>
                        <span className="text-xl font-mono font-black text-amber-300 tracking-widest">
                          {step.uiState.pin}
                        </span>
                      </div>
                      <span className="text-xs bg-forest-800 px-2.5 py-1 rounded-lg border border-forest-700 text-emerald-200 font-semibold">
                        Awaiting Driver Collection
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {step.uiState.type === 'QR_VIEW' && (
                <div className="space-y-4 text-center">
                  <div className="bg-white p-6 rounded-2xl border-2 border-forest-100 shadow-sm max-w-sm mx-auto">
                    <div className="w-10 h-10 rounded-2xl bg-forest-100 text-forest-700 mx-auto flex items-center justify-center mb-2">
                      <QrCode className="w-5 h-5 text-forest-700" />
                    </div>
                    <h3 className="text-base font-bold text-gray-900">Dynamic Handover QR</h3>
                    <p className="text-xs text-gray-500 mb-3">Scanned at loading dock counter</p>

                    {/* Stylized QR Box */}
                    <div className="w-40 h-40 mx-auto bg-forest-950 p-2 rounded-2xl flex items-center justify-center shadow-inner">
                      <div className="w-full h-full bg-white rounded-xl p-2 flex flex-col justify-between">
                        <div className="flex justify-between">
                          <div className="w-8 h-8 bg-forest-900 rounded-sm"></div>
                          <div className="w-8 h-8 bg-forest-900 rounded-sm"></div>
                        </div>
                        <div className="text-[10px] font-mono font-bold text-forest-950 tracking-wider">
                          PIN: {step.uiState.pin}
                        </div>
                        <div className="flex justify-between">
                          <div className="w-8 h-8 bg-forest-900 rounded-sm"></div>
                          <div className="w-4 h-4 bg-emerald-600 rounded-sm self-end"></div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 p-2 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Dual Handover Verified: Status Completed</span>
                    </div>
                  </div>
                </div>
              )}

              {step.uiState.type === 'IMPACT_VIEW' && (
                <div className="space-y-4">
                  <span className="text-xs font-bold text-forest-700 uppercase tracking-wider">
                    Live Impact Ledger Ticker
                  </span>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-forest-800 to-forest-950 text-white p-5 rounded-2xl shadow-md">
                      <span className="text-[10px] uppercase font-bold text-emerald-300">
                        Meals Rescued & Delivered
                      </span>
                      <p className="text-3xl font-black mt-2 text-white">{step.uiState.totalMeals}</p>
                      <span className="text-[10px] text-emerald-200 block mt-1">+25 meals from this transaction</span>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                      <span className="text-[10px] uppercase font-bold text-gray-400">
                        Total Food Diverted
                      </span>
                      <p className="text-3xl font-black mt-2 text-forest-800">{step.uiState.totalKg}</p>
                      <span className="text-[10px] text-gray-500 block mt-1">+10 kg surplus salvaged</span>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                      <span className="text-[10px] uppercase font-bold text-gray-400">
                        CO2 Emissions Averted
                      </span>
                      <p className="text-3xl font-black mt-2 text-teal-700">{step.uiState.co2Averted}</p>
                      <span className="text-[10px] text-gray-500 block mt-1">@ 2.5 kg CO2e / kg food</span>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                      <span className="text-[10px] uppercase font-bold text-gray-400">
                        Participating Network
                      </span>
                      <p className="text-3xl font-black mt-2 text-amber-600">{step.uiState.activePartners}</p>
                      <span className="text-[10px] text-gray-500 block mt-1">5 Donors • 3 Verified NGOs</span>
                    </div>
                  </div>
                </div>
              )}

              {step.uiState.type === 'ADMIN_VIEW' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                      Admin Control & Audit Log
                    </span>
                    <span className="text-xs text-gray-400 font-mono">Status: Immutable Ledger</span>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm divide-y divide-gray-100 text-xs">
                    <div className="py-2 flex items-center justify-between">
                      <span className="font-bold text-gray-800">11:00 AM • Donor (Paradise)</span>
                      <span className="bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded text-[10px]">
                        AVAILABLE
                      </span>
                    </div>
                    <div className="py-2 flex items-center justify-between">
                      <span className="font-bold text-gray-800">11:15 AM • Recipient (Hope NGO)</span>
                      <span className="bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded text-[10px]">
                        PENDING
                      </span>
                    </div>
                    <div className="py-2 flex items-center justify-between">
                      <span className="font-bold text-gray-800">11:20 AM • Donor (Paradise)</span>
                      <span className="bg-teal-100 text-teal-800 font-semibold px-2 py-0.5 rounded text-[10px]">
                        ACCEPTED
                      </span>
                    </div>
                    <div className="py-2 flex items-center justify-between">
                      <span className="font-bold text-gray-800">11:45 AM • Both Parties (QR PIN)</span>
                      <span className="bg-forest-700 text-white font-bold px-2 py-0.5 rounded text-[10px]">
                        COMPLETED
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Progress and Step Navigation Buttons */}
              <div className="pt-6 border-t border-gray-200/60 flex items-center justify-between">
                <button
                  onClick={handlePrev}
                  disabled={currentStepIndex === 0}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-200 disabled:opacity-40 transition-colors flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <span className="text-xs font-mono text-gray-400 font-bold">
                  {currentStepIndex + 1} of {DEMO_STEPS.length}
                </span>

                <button
                  onClick={handleNext}
                  disabled={currentStepIndex === DEMO_STEPS.length - 1}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-forest-700 hover:bg-forest-800 text-white disabled:opacity-40 transition-colors flex items-center gap-1 shadow-sm"
                >
                  <span>Next Step</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Code & Architecture Explainer (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-forest-950 text-gray-200 rounded-3xl border border-forest-800 shadow-xl overflow-hidden flex flex-col h-full">
            {/* Header Tabs */}
            <div className="p-4 bg-forest-900 border-b border-forest-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white tracking-wide">
                  Behind the Scenes: Code & Data
                </span>
              </div>

              <div className="flex items-center gap-1 bg-forest-950 p-1 rounded-xl text-xs">
                <button
                  onClick={() => setActiveTab('CODE')}
                  className={`px-2.5 py-1 rounded-lg font-mono font-bold transition-all ${
                    activeTab === 'CODE' ? 'bg-forest-800 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Source Code
                </button>
                <button
                  onClick={() => setActiveTab('PAYLOAD')}
                  className={`px-2.5 py-1 rounded-lg font-mono font-bold transition-all ${
                    activeTab === 'PAYLOAD' ? 'bg-forest-800 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  JSON Payload
                </button>
              </div>
            </div>

            {/* Code / JSON Display */}
            <div className="p-5 flex-1 flex flex-col justify-between overflow-x-auto text-xs font-mono">
              <div>
                <span className="text-[11px] text-amber-300 font-bold block mb-2">
                  // {step.codeTitle}
                </span>

                {activeTab === 'CODE' ? (
                  <pre className="text-gray-300 leading-relaxed overflow-x-auto p-3 bg-black/40 rounded-xl border border-forest-800/80 text-[11px]">
                    <code>{step.codeSnippet}</code>
                  </pre>
                ) : (
                  <pre className="text-emerald-300 leading-relaxed overflow-x-auto p-3 bg-black/40 rounded-xl border border-forest-800/80 text-[11px]">
                    <code>{JSON.stringify(step.dataPayload, null, 2)}</code>
                  </pre>
                )}
              </div>

              {/* Explanatory Callout */}
              <div className="mt-4 p-3 rounded-xl bg-forest-900/80 border border-forest-800 text-[11px] text-gray-300 font-sans leading-relaxed">
                <strong className="text-white block mb-0.5">{step.title}</strong>
                {step.description}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Jump to Live Testing CTA */}
      <div className="bg-gradient-to-r from-forest-900 via-forest-800 to-forest-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
            Ready to test in real time?
          </span>
          <h2 className="text-xl sm:text-2xl font-black mt-1">
            Test the live platform with 1-click judge credentials
          </h2>
          <p className="text-xs text-gray-300 mt-1">
            You can interactively execute this entire workflow yourself on the production application.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/recipient/explore"
            className="px-5 py-3 rounded-xl bg-white text-forest-900 hover:bg-gray-100 font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <span>Explore Live Listings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/login"
            className="px-5 py-3 rounded-xl bg-forest-700 hover:bg-forest-600 text-white font-bold text-xs border border-forest-500/50 shadow-md transition-all"
          >
            Judge Login
          </Link>
        </div>
      </div>
    </div>
  );
}
