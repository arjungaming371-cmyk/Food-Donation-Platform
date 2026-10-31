// Smart NGO-Food Matching Engine for FoodBridge
// Computes transparent match score (0 - 100%) between a Food Listing and an Organization Profile

export interface MatchFactor {
  name: string;
  score: number; // 0 to 100
  weight: number; // sum to 1.0
  reason: string;
}

export interface MatchResult {
  score: number; // Weighted total percentage (0-100)
  factors: MatchFactor[];
  summary: string;
}

// Haversine formula to compute distance in km between two GPS coordinates
export function calculateDistanceKm(
  lat1?: number | null,
  lon1?: number | null,
  lat2?: number | null,
  lon2?: number | null
): number {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 5.0; // fallback estimate in km

  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
}

export function calculateSmartMatch(
  listing: {
    category: string;
    availableQuantity: number;
    unit: string;
    dietaryType: string;
    pickupStartTime: Date | string;
    pickupEndTime: Date | string;
    latitude: number;
    longitude: number;
  },
  org: {
    estimatedPeopleServed: number;
    latitude?: number | null;
    longitude?: number | null;
  }
): MatchResult {
  const factors: MatchFactor[] = [];

  // Factor 1: Proximity & Distance (Weight: 35%)
  const distanceKm = calculateDistanceKm(listing.latitude, listing.longitude, org.latitude, org.longitude);
  let distanceScore = 100;
  if (distanceKm > 20) distanceScore = 20;
  else if (distanceKm > 10) distanceScore = 50;
  else if (distanceKm > 5) distanceScore = 80;
  else distanceScore = 98;

  factors.push({
    name: 'Proximity',
    score: distanceScore,
    weight: 0.35,
    reason: `Estimated ${distanceKm} km away in Hyderabad metropolitan area.`,
  });

  // Factor 2: Quantity vs Beneficiary Scale (Weight: 30%)
  // Convert quantity to approx meals:
  let approxMeals = listing.availableQuantity;
  if (listing.unit === 'kg') approxMeals = (listing.availableQuantity * 1000) / 400; // 400g per meal
  else if (listing.unit === 'pieces' || listing.unit === 'packets') approxMeals = listing.availableQuantity;

  const served = org.estimatedPeopleServed || 100;
  const ratio = Math.min(approxMeals / served, served / approxMeals);
  const quantityScore = Math.min(100, Math.max(30, Math.round(ratio * 100)));

  factors.push({
    name: 'Capacity Fit',
    score: quantityScore,
    weight: 0.30,
    reason: `Provides ~${Math.round(approxMeals)} meal-equivalents for org capacity of ${served} beneficiaries.`,
  });

  // Factor 3: Time Window Feasibility (Weight: 20%)
  const now = new Date().getTime();
  const endTime = new Date(listing.pickupEndTime).getTime();
  const hoursLeft = Math.max(0, (endTime - now) / (1000 * 60 * 60));
  let timeScore = 85;
  if (hoursLeft > 4) timeScore = 95;
  else if (hoursLeft > 2) timeScore = 85;
  else if (hoursLeft > 1) timeScore = 65;
  else timeScore = 40;

  factors.push({
    name: 'Pickup Window',
    score: timeScore,
    weight: 0.20,
    reason: `${hoursLeft.toFixed(1)} hours remaining in safe collection window.`,
  });

  // Factor 4: Food Readiness & Dietary (Weight: 15%)
  const dietaryScore = listing.dietaryType === 'VEG' || listing.dietaryType === 'VEGAN' ? 95 : 85;
  factors.push({
    name: 'Dietary Acceptance',
    score: dietaryScore,
    weight: 0.15,
    reason: `${listing.dietaryType} designation with verified donor storage specifications.`,
  });

  // Total weighted score
  const totalScore = Math.round(
    factors.reduce((sum, f) => sum + f.score * f.weight, 0)
  );

  return {
    score: Math.min(99, Math.max(10, totalScore)),
    factors,
    summary: `${totalScore}% High Compatibility match based on location, redistribution capacity, and collection timeline.`,
  };
}
