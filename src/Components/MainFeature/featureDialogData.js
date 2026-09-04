// The expanded dialogs have their own artwork now, one per feature. The four
// CARD FACES still use the placeholders — they are a different crop at a
// different size, and MainFeature.jsx imports those separately.
import liquidityLockArt from "../../assets/LiquidityLockedForeverEx.webp";
import zeroPriceArt from "../../assets/zeroPriceGapEx.webp";
import botsPayArt from "../../assets/BotsPayYpuDontEx.webp";
import creatorFeesArt from "../../assets/EarnEveryTradeEx.webp";

// The four Main Feature cards. The card face shows only `title` (see the
// .blTag markup in MainFeature.jsx); everything else here is the expanded
// dialog the card opens into.
//
// Every number below is one of the protocol's own stated constants — curve
// target, fee schedule, creator share — not a growth metric. That is why no
// `chart.live` flag is set on any of them: FeatureDialog only drifts a
// showcase figure upward over time when a card opts in, and a fixed constant
// like "0 price gap" ticking upward would be actively wrong.

const featureDialogData = {
  lockedLiquidity: {
    id: "lockedLiquidity",
    eyebrow: "01. Liquidity & Security",
    title: "Liquidity Locked Forever",
    description:
      "Every graduated token's liquidity is permanently locked in the CrackerSwap pool. No timelock, no unlock date, no multisig override. What goes in at graduation can never come back out to a single wallet.",
    ctaPrimary: "Explore the Mechanics",
    ctaSecondary: "Read the Audit",
    bullets: [
      "Curve fills at 4.2 ETH, then graduates automatically",
      "4.15 ETH flows straight into the pool as permanent liquidity",
      "Admin multisig + timelock governs upgrades only, never fees, never LP",
      "20+ contracts independently audited by QuillAudits, re-audited monthly",
    ],
    stats: [
      { label: "Curve target", value: 4.2, suffix: " ETH", decimals: 1 },
      { label: "Into the pool at graduation", value: 4.15, suffix: " ETH", decimals: 2 },
      { label: "Ever withdrawable from locked LP", value: 0, prefix: "$" },
    ],
    image: liquidityLockArt,
    badge: "Locked",
    launchHeadline: "Liquidity that can never leave",
    launchCta: "Go to Launchpad",
    chart: {
      label: "Bonding curve filling to graduation",
      value: 4.2,
      suffix: " ETH",
      decimals: 1,
      bars: [8, 14, 19, 27, 33, 41, 46, 54, 61, 68, 74, 81, 87, 92, 96, 100],
    },
    accent: "liquidity",
  },

  zeroPriceGap: {
    id: "zeroPriceGap",
    eyebrow: "02. Fair Execution",
    title: "Zero Price Gap",
    description:
      "Most launchpads let the price jump the second a token graduates to a DEX, and that gap is where bots front-run your community. Cracker's bonding curve hands off to the CrackerSwap pool at the exact same price, every time.",
    ctaPrimary: "See How Graduation Works",
    ctaSecondary: "Compare to Other Launchpads",
    bullets: [
      "Same price, same block, curve to pool",
      "No presale allocation, no insider entry point",
      "Built on Uniswap V4 infrastructure for the meme launchpad",
      "Applies identically across every supported chain",
    ],
    stats: [
      { label: "Total curve fee", value: 1.25, suffix: "%", decimals: 2 },
      { label: "Price discontinuity at graduation", value: 0, suffix: "" },
      { label: "Presale allocation", value: 0, suffix: "%" },
    ],
    image: zeroPriceArt,
    badge: "No Gap",
    launchHeadline: "Same price, same block",
    launchCta: "Go to Launchpad",
    chart: {
      // Deliberately flat: this series spans the graduation handoff, and the
      // whole claim is that nothing happens to the price when it lands. The
      // small variance is ordinary market noise — a perfectly uniform series
      // renders as one solid block rather than reading as a steady line.
      label: "Price across the graduation handoff",
      value: 0,
      suffix: "% gap",
      bars: [58, 61, 59, 62, 60, 63, 61, 62, 60, 62, 61, 63, 60, 62, 61, 62],
    },
    accent: "founders",
  },

  botsPay: {
    id: "botsPay",
    eyebrow: "03. Anti-Bot Design",
    title: "Bots Pay, You Don't",
    description:
      "New tokens get sniped in the first seconds by bots, not people. Cracker's opening fee starts brutal and falls fast, punishing the snipers while your real community gets in cheap.",
    ctaPrimary: "See the Fee Curve",
    ctaSecondary: "Read the Feature Doc",
    bullets: [
      "Opening fee starts at 50%",
      "Decays to 1.25% over the first 10 minutes",
      "Fee is enforced on-chain, not optional or creator-set",
      "Same protection on every chain Cracker supports",
    ],
    stats: [
      { label: "Opening fee", value: 50, suffix: "%" },
      // The floor is the standing curve fee, so it has to be the same 1.25%
      // card 02 states as "Total curve fee" — the decay lands on the normal
      // rate, it does not undercut it.
      { label: "Settles at", value: 1.25, suffix: "%", decimals: 2 },
      { label: "Decay window", value: 10, suffix: " min" },
    ],
    image: botsPayArt,
    badge: "Anti-Bot",
    launchHeadline: "Let the bots pay for it",
    launchCta: "Go to Launchpad",
    chart: {
      // The bars are the fee schedule itself, 50% down to 1.25% across the
      // first ten minutes, and the shape is the feature. They are drawn
      // normalised against their own max (FeatureDialog.jsx), so 100 is the
      // opening 50% and the tail has to land on 2.5 for the floor to read as
      // the 1.25% the stat above claims.
      label: "Opening fee decay (first 10 minutes)",
      value: 50,
      suffix: "%",
      bars: [100, 78, 60, 46, 35, 27, 21, 16, 12, 9, 7, 5, 4, 3.2, 2.7, 2.5],
    },
    accent: "auction",
  },

  creatorFees: {
    id: "creatorFees",
    eyebrow: "04. Creator Economics",
    title: "Earn Every Trade, Forever",
    description:
      "Every trade on your graduated token carries a 1.0% swap fee, and most of it is yours. Your share is set by the highest volume tier your token ever reaches, and it never drops back down.",
    ctaPrimary: "See Fee Tiers",
    ctaSecondary: "Claim Your Earnings",
    // Two units in play here, and mixing them is what the earlier copy got
    // wrong ("70% of the 0.70% creator share" reads as 0.49% of a trade).
    // The share of the FEE is 70% -> 40%; the share of the TRADE is
    // 0.70% -> 0.40%. Wherever both appear, the fee share is stated first and
    // the trade share follows it, so the reader is never left to multiply.
    bullets: [
      "70% of the 1.0% swap fee at launch, which is 0.70% of every trade",
      "Tapers toward 40% only as your token grows into higher volume tiers",
      "Tier is a ratchet: it locks at your highest tier ever and never reverts down",
      "You claim accrued fees on-chain, anytime. Cracker never holds them",
    ],
    // All three in the same unit (share of a trade) so the row reads as one
    // scale: the whole fee, your cut of it, and the floor that cut settles at.
    stats: [
      { label: "Swap fee on every trade", value: 1.0, suffix: "%", decimals: 1 },
      { label: "Your cut at launch", value: 0.7, suffix: "%", decimals: 2 },
      { label: "Tier floor as volume grows", value: 0.4, suffix: "%", decimals: 2 },
    ],
    image: creatorFeesArt,
    badge: "Creator Fees",
    launchHeadline: "Get paid on every trade",
    launchCta: "Go to Launchpad",
    chart: {
      label: "Creator share by volume tier (0.70% → 0.40%)",
      value: 0.7,
      suffix: "%",
      decimals: 2,
      // Same curve, restated as a share of the trade to match the label and
      // the stat row above. The bars render normalised against their own max
      // (see FeatureDialog.jsx), so the scale they are written in does not
      // change the drawing — only which unit the file is self-consistent in.
      bars: [0.70, 0.70, 0.68, 0.66, 0.64, 0.61, 0.58, 0.55, 0.52, 0.50, 0.47, 0.45, 0.43, 0.42, 0.41, 0.40],
    },
    accent: "reserve",
  },
};

export default featureDialogData;
