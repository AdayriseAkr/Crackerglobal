import topLeft from "../../assets/topLeft.png";
import bottomLeft from "../../assets/bottomLeft.png";
import topRight from "../../assets/topRight.png";
import bottomRight from "../../assets/bottomRight.png";

// Placeholder content for the expandable Main Feature cards.
// Swap these values out once real product data is ready — the shape
// (stats / bullets / showcase / chart) is what FeatureDialog expects.

const featureDialogData = {
  verifiedFounders: {
    id: "verifiedFounders",
    eyebrow: "Trust & Identity",
    title: "Verified Founders",
    description:
      "Every project on Cracker is launched by a founder who has passed identity verification — no anonymous teams, no hidden wallets. Verification status is public and permanent on-chain.",
    ctaPrimary: "Explore Verification",
    ctaSecondary: "See requirements",
    bullets: [
      "Founders complete KYC before their launch goes live",
      "Public, on-chain founder reputation score",
      "Removes anonymity as a rug-pull vector",
      "Builds long-term community trust from day one",
    ],
    stats: [
      { label: "Verified founders", value: 128, suffix: "+" },
      { label: "KYC compliance", value: 100, suffix: "%" },
      { label: "Anonymous launches", value: 0, suffix: "" },
    ],
    image: topLeft,
    badge: "Verified",
    launchHeadline: "Meet the founders you can trust",
    launchCta: "Go to Launchpad",
    chart: {
      label: "Founder reputation score",
      value: 92,
      suffix: "/100",
      bars: [30, 42, 38, 55, 61, 58, 70, 66, 78, 82, 79, 92, 88, 95, 90, 97],
    },
    accent: "founders",
  },

  lockedLiquidity: {
    id: "lockedLiquidity",
    eyebrow: "Security",
    title: "Permanently Locked Liquidity",
    description:
      "Liquidity pool tokens are locked or burned at launch and can never be withdrawn by the team. Every lock is verifiable on-chain, so trading stability isn't a promise — it's provable.",
    ctaPrimary: "Explore Liquidity Locks",
    ctaSecondary: "View lock proof",
    bullets: [
      "Liquidity pool tokens are burned or locked at launch",
      "No team wallet can ever withdraw pooled liquidity",
      "Lock proof is fully auditable on-chain",
      "Removes the single biggest rug-pull risk entirely",
    ],
    stats: [
      { label: "Liquidity locked", value: 2.4, suffix: "M+", prefix: "$", decimals: 1 },
      { label: "Locked forever", value: 100, suffix: "%" },
      { label: "Rug pulls", value: 0, suffix: "" },
    ],
    image: bottomLeft,
    badge: "Locked",
    launchHeadline: "Liquidity that never leaves",
    launchCta: "Go to Launchpad",
    chart: {
      label: "Locked liquidity growth (30d)",
      value: 2.4,
      prefix: "$",
      suffix: "M",
      decimals: 1,
      bars: [18, 22, 25, 24, 30, 34, 33, 40, 46, 52, 58, 65, 63, 70, 74, 80],
    },
    accent: "liquidity",
  },

  auctionAccess: {
    id: "auctionAccess",
    eyebrow: "Fair Launch",
    title: "Auction Based Launch Access",
    description:
      "No whitelists, no private allocations, no VC dumping. Launch access is won through a transparent, on-chain auction where price is discovered by real demand, not insider deals.",
    ctaPrimary: "Explore Live Auctions",
    ctaSecondary: "How bidding works",
    bullets: [
      "No private allocations or pre-sale VC rounds",
      "Every bid is transparent and on-chain",
      "Price discovered by real market demand",
      "Equal access for every single participant",
    ],
    stats: [
      { label: "Avg. participants", value: 540, suffix: "+" },
      { label: "Bot sniping", value: 0, suffix: "%" },
      { label: "Private allocations", value: 0, suffix: "" },
    ],
    image: topRight,
    badge: "Live Auction",
    launchHeadline: "Let's launch the next block",
    launchCta: "Go to Launchpad",
    chart: {
      label: "Live bid volume",
      value: 86400,
      suffix: "",
      bars: [12, 18, 20, 28, 35, 40, 52, 60, 71, 80, 88, 95, 90, 98, 93, 100],
    },
    accent: "auction",
  },

  stabilityReserve: {
    id: "stabilityReserve",
    eyebrow: "Market Health",
    title: "Built In Stability Reserve",
    description:
      "A portion of every transaction feeds a transparent, on-chain reserve. During periods of high volatility, the reserve can auto-deploy to dampen extreme price swings and support the market.",
    ctaPrimary: "Explore The Reserve",
    ctaSecondary: "View reserve ledger",
    bullets: [
      "A share of every transaction feeds the reserve",
      "Auto-deploys support during high volatility",
      "Reserve balance is transparent and on-chain",
      "Designed to soften extreme price swings",
    ],
    stats: [
      { label: "Reserve fund", value: 1.8, suffix: "M+", prefix: "$", decimals: 1 },
      { label: "Monitoring", value: 24, suffix: "/7" },
      { label: "Manual intervention", value: 0, suffix: "" },
    ],
    image: bottomRight,
    badge: "Reserve",
    launchHeadline: "Stability, built right in",
    launchCta: "Go to Launchpad",
    chart: {
      label: "Reserve fund growth (30d)",
      value: 1.8,
      prefix: "$",
      suffix: "M",
      decimals: 1,
      bars: [20, 24, 22, 28, 33, 31, 38, 44, 49, 55, 60, 68, 65, 72, 76, 82],
    },
    accent: "reserve",
  },
};

export default featureDialogData;
