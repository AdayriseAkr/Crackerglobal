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

import entityImage from "../../assets/entity.png";
import securityImage from "../../assets/security.png";
import liquidityImage from "../../assets/liquidity.png";
import tokenomicsImage from "../../assets/tokenomics.png";
import feesImage from "../../assets/fees.png";
import fundingImage from "../../assets/funding.png";

export const bentoCards = [
  {
    id: "entity",
    label: "Entity",
    title: "Real Company",
    description:
      "Wyoming LLCs, publicly filed and searchable. Not an anon deployer and a Telegram group.",
    modifiers: [],
    image: entityImage,
    // Sits on the card floor, so it rises off it.
    enter: "up",
  },
  {
    id: "security",
    label: "Security",
    title: "Publicly Audited",
    description:
      "Twenty-plus contracts under independent review, published in full before mainnet.",
    modifiers: [],
    image: securityImage,
    enter: "right",
  },
  {
    id: "liquidity",
    label: "Liquidity",
    title: "Liquidity Locked",
    description:
      "At graduation, the LP moves straight into custody with no withdraw path anywhere in the contract. Not for the creator. Not for us. Nobody wakes up one day and pulls the rug, because the code simply doesn't allow it.",
    modifiers: ["feature", "brand"],
    image: liquidityImage,
    // Longest travel of the six — it has the tallest slot to cross.
    enter: "rise",
  },
  {
    id: "tokenomics",
    label: "Tokenomics",
    title: "No Token",
    description:
      "No platform token, no airdrop farm, no emissions quietly diluting you in the background. It's not a launch promise, it's a permanent policy that stays true whether the platform has ten users or ten million.",
    modifiers: ["feature", "tint"],
    image: tokenomicsImage,
    // Scales in rather than slides, so the two wide cards don't mirror.
    enter: "zoom",
  },
  {
    id: "fees",
    label: "Fees",
    title: "Immutable Fees",
    description:
      "Percentages and splits are constants in the contracts, not settings in an admin panel.",
    modifiers: [],
    image: feesImage,
    enter: "left",
  },
  {
    id: "funding",
    label: "Funding",
    title: "Self-Funded",
    description:
      "No VC, no unlock cliff, no investor who needs an exit by Q3.",
    modifiers: [],
    image: fundingImage,
    enter: "tilt",
  },
];
