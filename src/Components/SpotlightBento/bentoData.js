// Card content for the spotlight bento grid.
//
// `modifiers` map to `bentoCard--<name>` classes in SpotlightBento.css:
//   feature -> larger type (the two cards that span 2x2 on desktop)
//   brand   -> #FE6C25 fill, white text, white glow
//   tint    -> #f5e9e3 warm surface
//
// Grid placement is driven by :nth-child in the stylesheet, so the ORDER of
// this array is load-bearing — cards 3 and 4 are the two big ones.

export const bentoCards = [
  {
    label: "Launch",
    title: "Fair Launchpad",
    description:
      "Tokens go live with liquidity locked and supply distributed from block one. No insider allocation, no stealth mint.",
    modifiers: [],
  },
  {
    label: "Protection",
    title: "Zero MEV",
    description:
      "Orders settle without front-running, sandwich attacks, or hidden reordering in the mempool.",
    modifiers: [],
  },
  {
    label: "Trading",
    title: "Multi-Chain Swap",
    description:
      "Route across every supported chain in a single transaction. No bridge to babysit, no slippage to price in, no wrapped asset left stranded on the wrong side.",
    modifiers: ["feature", "brand"],
  },
  {
    label: "Infrastructure",
    title: "DevvE CTS",
    description:
      "Settlement runs on DevvE's Consensus Transaction System — deterministic ordering, instead of a public auction for block space.",
    modifiers: ["feature", "tint"],
  },
  {
    label: "Compliance",
    title: "US-Compliant",
    description:
      "Built inside the regulatory perimeter from day one, not retrofitted around it.",
    modifiers: [],
  },
  {
    label: "Community",
    title: "Holder Governed",
    description:
      "Treasury, listings, and roadmap steered by the people actually holding the token.",
    modifiers: [],
  },
];
