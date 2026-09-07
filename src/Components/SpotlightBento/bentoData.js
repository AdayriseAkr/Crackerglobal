// Card content for the spotlight bento grid.
//
// `modifiers` map to `bentoCard--<name>` classes in SpotlightBento.css:
//   feature -> larger type (the two cards that span 2x2 on desktop)
//   brand   -> #FE6C25 fill, white text, white glow
//   tint    -> #f5e9e3 warm surface
//
// `enter` picks how that card's artwork arrives, mapping to a
// `bentoCardMedia--<name>` class that sets the travel, duration and easing.
// They are all different on purpose: six identical slides firing together reads
// as one mechanical sweep, whereas mixed directions and speeds read as six
// separate objects settling into place. Each is chosen for where its art sits
// in the card — art anchored to a side comes in from that side.
//
// `id` keys the per-card artwork sizing in SpotlightBento.css
// (.bentoCardArt--<id>), so each illustration can be scaled and nudged on its
// own without touching the others.
//
// `image` is the artwork slot. Null leaves the slot laid out but empty, so a
// card can ship without art and nothing shifts.
//
// The card number is derived from array order by the component, so reordering
// renumbers itself. Grid placement is driven by the `feature` modifier, so the
// ORDER of this array is load-bearing — cards 3 and 4 are the wide ones, and
// they hold the two longest pieces of copy for that reason.

import entityImage from "../../assets/entity.webp";
import securityImage from "../../assets/security.webp";
import liquidityImage from "../../assets/liquidity.webp";
// Stays PNG on purpose: this one is 267 KB as PNG and 335 KB as WebP even at
// q60, so converting it would cost 68 KB rather than save any (scripts/optimize-images.mjs
// measures every file and skips the ones WebP cannot beat).
import tokenomicsImage from "../../assets/tokenomics.png";
import feesImage from "../../assets/fees.webp";
import fundingImage from "../../assets/funding.webp";

export const bentoCards = [
  {
    id: "entity",
    label: "Entity",
    title: "Real Company",
    description:
      "Wyoming LLCs, publicly filed and searchable. Not an anon deployer and a Telegram group.",
    modifiers: [],
    image: entityImage,
    // Rises off the card floor it sits on.
    enter: "up",
  },
  {
    id: "security",
    label: "Security",
    title: "Publicly Audited",
    description:
      // Same correction as the audit bullet in featureDialogData.js: the count
      // was wrong, and coverage is the claim worth making. These two are the
      // only places the site says anything about how many contracts there are.
      "Every contract under independent review, published in full before mainnet.",
    modifiers: [],
    image: securityImage,
    enter: "fade",
  },
  {
    id: "liquidity",
    label: "Liquidity",
    title: "Liquidity Locked",
    description:
      "At graduation, the LP locks into custody with no way out. Not for the creator, not for us. The code simply won't allow a rug pull.",
    modifiers: ["feature", "brand"],
    image: liquidityImage,
    // Tallest slot of the six, so the longest travel and slowest settle.
    enter: "rise",
  },
  {
    id: "tokenomics",
    label: "Tokenomics",
    title: "No Token",
    description:
      "No official Cracker token. No airdrop farm. No emissions eating your bag six months out. If we ever launch one, you’ll hear it from us first, and anything else claiming to be Cracker is fake.",
    modifiers: ["feature", "tint"],
    image: tokenomicsImage,
    enter: "fade",
  },
  {
    id: "fees",
    label: "Fees",
    title: "Immutable Fees",
    description:
      "Percentages and splits are constants in the contracts, not settings in an admin panel.",
    modifiers: [],
    image: feesImage,
    enter: "fade",
  },
  {
    id: "funding",
    label: "Compliance",
    title: "AML Screening",
    description:
      "Every wallet is screened first. Sanctioned addresses and restricted jurisdictions never touch the contracts.",
    modifiers: [],
    image: fundingImage,
    enter: "right",
  },
];
