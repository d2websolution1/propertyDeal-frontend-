// frontend/src/utils/plans.js

export const STANDARDIZED_PLANS = [
  {
    id: "owner-starter",
    category: "owner",
    categoryLabel: "Owner",
    name: "Free Starter (30 Days)",
    price: "₹0",
    priceNum: 0,
    originalPrice: "₹999",
    limit: 2,
    days: 30,
    featured: 0,
    tag: "FREE",
    badge: "FREE",
    desc: "Post 2 properties completely free with 30 days validity.",
    features: [
      "2 Free Property Listings",
      "30 Days Listing Validity",
      "Direct Buyer Phone & WhatsApp Inquiries",
      "Standard Search Placement",
    ],
  },
  {
    id: "owner-gold",
    category: "owner",
    categoryLabel: "Owner",
    name: "Gold Owner Plan (60 Days)",
    price: "₹499",
    priceNum: 499,
    originalPrice: "₹1499",
    limit: 5,
    days: 60,
    featured: 1,
    tag: "POPULAR",
    badge: "POPULAR",
    desc: "5 active listings for 60 days validity + 1 featured boost slot.",
    features: [
      "5 Property Listings Quota",
      "60 Days Extended Validity",
      "1 Featured Boost Slot",
      "Direct WhatsApp Leads & Calls",
      "Verified Owner Badge",
    ],
  },
  {
    id: "owner-annual",
    category: "owner",
    categoryLabel: "Owner",
    name: "Annual Owner Plan (365 Days)",
    price: "₹1499",
    priceNum: 1499,
    originalPrice: "₹3999",
    limit: 20,
    days: 365,
    featured: 5,
    tag: "BEST VALUE",
    badge: "BEST VALUE",
    desc: "20 active listings for 365 days (1 full year) + 5 featured boosts.",
    features: [
      "20 Property Listings Quota",
      "365 Days (1 Full Year) Validity",
      "5 Featured Boost Slots",
      "Priority Buyer Inquiries",
      "Gold Verified Owner Badge",
    ],
  },
  {
    id: "agent-std",
    category: "agent",
    categoryLabel: "Dealer / Agent",
    name: "Standard Agent Plan (45 Days)",
    price: "₹999",
    priceNum: 999,
    originalPrice: "₹1999",
    limit: 20,
    days: 45,
    featured: 2,
    tag: "AGENT PACK",
    badge: "AGENT PACK",
    desc: "20 listings for 45 days + 2 featured boosts & direct buyer leads.",
    features: [
      "20 Active Listings Quota",
      "45 Days Validity",
      "2 Featured Boost Slots",
      "Verified Agent Badge",
      "Direct Client Inquiries",
    ],
  },
  {
    id: "agent-pro",
    category: "agent",
    categoryLabel: "Dealer / Agent",
    name: "Pro Agent Plan (90 Days)",
    price: "₹1999",
    priceNum: 1999,
    originalPrice: "₹3999",
    limit: 50,
    days: 90,
    featured: 5,
    tag: "MOST POPULAR",
    badge: "MOST POPULAR",
    desc: "50 listings for 90 days + 5 featured boosts & verified badge.",
    features: [
      "50 Active Listings Quota",
      "90 Days Validity",
      "5 Featured Boost Slots",
      "High Search Priority",
      "Dedicated Agent Showcase",
    ],
  },
  {
    id: "agent-annual",
    category: "agent",
    categoryLabel: "Dealer / Agent",
    name: "Annual Agent Plan (365 Days)",
    price: "₹4999",
    priceNum: 4999,
    originalPrice: "₹9999",
    limit: 200,
    days: 365,
    featured: 20,
    tag: "UNLIMITED",
    badge: "UNLIMITED",
    desc: "200 active listings for 365 days (1 full year) + 20 featured slots.",
    features: [
      "200 Active Listings Quota",
      "365 Days (1 Full Year) Validity",
      "20 Featured Slots",
      "Top Homepage Placement",
      "VIP Dedicated Support",
    ],
  },
];

export const OWNER_PLANS = STANDARDIZED_PLANS.filter((p) => p.category === "owner");
export const AGENT_PLANS = STANDARDIZED_PLANS.filter((p) => p.category === "agent");

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

  if ((lUser.includes("standard agent") || lUser.includes("45 day") || lUser.includes("999")) && plan.id === "agent-std") {
    return true;
  }
  if ((lUser.includes("gold") || lUser.includes("60 day") || lUser.includes("499")) && plan.id === "owner-gold") {
    return true;
  }
  if ((lUser.includes("annual agent") || lUser.includes("4999")) && plan.id === "agent-annual") {
    return true;
  }
  if ((lUser.includes("annual owner") || (lUser.includes("annual") && !lUser.includes("agent")) || lUser.includes("1499")) && plan.id === "owner-annual") {
    return true;
  }
  if ((lUser.includes("pro agent") || lUser.includes("90 day") || lUser.includes("1999")) && plan.id === "agent-pro") {
    return true;
  }
  if ((lUser.includes("free") || lUser.includes("starter") || lUser.includes("फ्री")) && plan.priceNum === 0) {
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
