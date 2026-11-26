// frontend/src/utils/plans.js

export const STANDARDIZED_PLANS = [
  {
    id: "free-starter",
    category: "all",
    categoryLabel: "Free Plan",
    name: "Free Starter (30 Days)",
    price: "₹0",
    priceNum: 0,
    originalPrice: "₹499",
    limit: 2,
    days: 30,
    featured: 0,
    tag: "FREE",
    badge: "FREE",
    desc: "2 free listings for 1 month (Active by default).",
    features: [
      "2 Free Property Listings",
      "1 Month (30 Days) Listing Validity",
      "Active by Default for All Accounts",
      "Direct Buyer Phone & Inquiries",
      "Standard Search Placement",
    ],
  },
  {
    id: "gold-499",
    category: "all",
    categoryLabel: "Gold Pack",
    name: "Gold Plan (90 Days)",
    price: "₹499",
    priceNum: 499,
    originalPrice: "₹1499",
    limit: 10,
    days: 90,
    featured: 2,
    tag: "POPULAR",
    badge: "POPULAR",
    desc: "10 listings quota for 3 months (90 days).",
    features: [
      "10 Property Listings Quota",
      "3 Months (90 Days) Extended Validity",
      "2 Featured Boost Slots",
      "Verified Badge on Listings",
      "Direct WhatsApp & Phone Leads",
    ],
  },
  {
    id: "pro-999",
    category: "all",
    categoryLabel: "Pro Pack",
    name: "Pro Plan (270 Days)",
    price: "₹999",
    priceNum: 999,
    originalPrice: "₹2999",
    limit: 30,
    days: 270,
    featured: 5,
    tag: "BEST VALUE",
    badge: "BEST VALUE",
    desc: "30 listings quota for 9 months (270 days).",
    features: [
      "30 Property Listings Quota",
      "9 Months (270 Days) Full Validity",
      "5 Featured Boost Slots",
      "Gold Verified Top Ranking",
      "Priority Direct Client Leads",
    ],
  },
];

export const OWNER_PLANS = STANDARDIZED_PLANS;
export const AGENT_PLANS = STANDARDIZED_PLANS;

/**
 * Checks whether a given plan preset matches the user's activePlan.
 */
export function isUserPlanActive(userActivePlan, plan) {
  if (!plan) return false;
  const userPlan = String(userActivePlan || "").trim();
  if (!userPlan) {
    return plan.priceNum === 0;
  }
  const lUser = userPlan.toLowerCase();
  const lPlan = plan.name.toLowerCase();

  if (lUser === lPlan) return true;

  // 999 Pro plan (9 months / 270 days / Standard Agent legacy)
  if (
    (lUser.includes("999") ||
      lUser.includes("pro") ||
      lUser.includes("270") ||
      lUser.includes("9 month") ||
      lUser.includes("standard agent")) &&
    plan.priceNum === 999
  ) {
    return true;
  }

  // 499 Gold plan (3 months / 90 days / Gold Owner legacy)
  if (
    (lUser.includes("499") ||
      lUser.includes("gold") ||
      lUser.includes("90") ||
      lUser.includes("3 month") ||
      lUser.includes("owner plan (60")) &&
    plan.priceNum === 499
  ) {
    return true;
  }

  // Free starter plan
  if (
    (lUser.includes("free") ||
      lUser.includes("starter") ||
      lUser.includes("फ्री") ||
      lUser.includes("0")) &&
    plan.priceNum === 0
  ) {
    return true;
  }

  return false;
}

/**
 * Returns the matching plan object from STANDARDIZED_PLANS for a given activePlan name.
 */
export function getActivePlanPreset(userActivePlan) {
  return STANDARDIZED_PLANS.find((p) => isUserPlanActive(userActivePlan, p)) || STANDARDIZED_PLANS[0];
}
