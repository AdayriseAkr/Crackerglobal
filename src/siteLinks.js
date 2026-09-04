// The live product destinations.
//
// One module because these are already reached from several places — the hero
// CTA and its brief-box links, the product cards in the Brief section — and the
// X handle taught us what happens otherwise: a URL hardcoded in one component
// went stale and nobody knew until it was opened. There is nowhere here for a
// second copy to drift.
//
// The Wallet and Egg Bot have no entry: neither has shipped, and both are
// behind Coming Soon flags rather than links. They belong here when they do.

export const LAUNCHPAD_URL = "https://cracker.fun";
export const DEX_URL = "https://crackerswap.com";
