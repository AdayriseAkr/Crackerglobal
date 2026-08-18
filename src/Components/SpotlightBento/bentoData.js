// Card content for the spotlight bento grid.
//
// `modifiers` map to `bentoCard--<name>` classes in SpotlightBento.css:
//   feature -> larger type (the two cards that span 2x2 on desktop)
//   brand   -> #FE6C25 fill, white text, white glow
//   tint    -> #f5e9e3 warm surface
//
// `image` is the artwork slot. Null leaves the slot empty but still laid out,
// so dropping art in later cannot change the grid's proportions.
//
// The card number is derived from array order by the component, so reordering
// renumbers itself. Grid placement is driven by :nth-child in the stylesheet,
// so the ORDER of this array is load-bearing — cards 3 and 4 are the two big
// ones, and they hold the two longest pieces of copy for that reason.

export const bentoCards = [
  {
    label: "Entity",
    title: "Real Company",
    description:
      "Wyoming LLCs, publicly filed and searchable. Not an anon deployer and a Telegram group.",
    modifiers: [],
    image: null,
  },
  {
    label: "Security",
    title: "Publicly Audited",
    description:
      "Twenty-plus contracts under independent review, published in full before mainnet.",
    modifiers: [],
    image: null,
  },
  {
    label: "Liquidity",
    title: "Liquidity Locked",
    description:
      "At graduation, the LP moves straight into custody with no withdraw path anywhere in the contract. Not for the creator. Not for us. Nobody wakes up one day and pulls the rug, because the code simply doesn't allow it.",
    modifiers: ["feature", "brand"],
    image: null,
  },
  {
    label: "Tokenomics",
    title: "No Token",
    description:
      "No platform token, no airdrop farm, no emissions quietly diluting you in the background. It's not a launch promise, it's a permanent policy that stays true whether the platform has ten users or ten million.",
    modifiers: ["feature", "tint"],
    image: null,
  },
  {
    label: "Fees",
    title: "Immutable Fees",
    description:
      "Percentages and splits are constants in the contracts, not settings in an admin panel.",
    modifiers: [],
    image: null,
  },
  {
    label: "Funding",
    title: "Self-Funded",
    description:
      "No VC, no unlock cliff, no investor who needs an exit by Q3.",
    modifiers: [],
    image: null,
  },
];
