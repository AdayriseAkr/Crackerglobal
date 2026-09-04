// Steps for the pinned process section — the four products, one panel each.
//
// `modifiers`-free by design: everything here is content. The index is derived
// from array order by the component, so reordering renumbers itself;
// `productLabel` is the product name that sits beside it ("01 — Launchpad")
// and is separate from `title`, which is the headline for that product.
//
// These were `phaseLabel` and rendered as "Phase 01". They are not phases:
// all four exist alongside each other, and two of them are Coming Soon, so a
// numbered sequence read as a delivery roadmap that had reached step two.
//
// Launchpad and Dex point at the live products, through siteLinks.js so there
// is one copy of each URL. Wallet and Egg Bot have not shipped: their CTAs are
// `comingSoon`, which the section renders as a disabled button rather than a
// link, and the fragments they still carry are placeholders for the day they
// turn on.
//
// CTA labels carry no arrow glyph — the button renders its own arrow as an SVG
// beside the label, so a "→" in the string would show up twice.
//
// Grid placement and the ring are driven by array order, so the ORDER of this
// array is load-bearing.

import { LAUNCHPAD_URL, DEX_URL } from "../../siteLinks.js";

import launchpadImage from "../../assets/launchpad.webp";
import dexImage from "../../assets/dexCard.webp";
import walletImage from "../../assets/wallet.webp";
import botImage from "../../assets/xbot.webp";

export const processSteps = [
  {
    id: "launchpad",
    productLabel: "Launchpad",
    title: "Launch Your Token",
    description:
      "Create a token in 60 seconds. Launch directly into permanently locked liquidity. No vesting, no unlocks, no exit scams.",
    features: [
      { label: "Liquidity Locked Forever" },
      { label: "Zero Price Jump" },
      { label: "Bots Pay, You Don't" },
    ],
    image: launchpadImage,
    cta: { label: "Launch a Token", href: LAUNCHPAD_URL },
  },
  {
    id: "swap",
    productLabel: "Dex",
    title: "Trade with No Surprises",
    description:
      "Swap across five chains. See the best rate before you commit, bridge included, zero hidden fees.",
    features: [
      { label: "Best Route, Upfront" },
      { label: "Cross-Chain Bridge Built In" },
      { label: "No Hidden Fees" },
    ],
    image: dexImage,
    cta: { label: "Start Swapping", href: DEX_URL },
  },
  {
    id: "wallet",
    productLabel: "Wallet",
    title: "Self-Custody, Every Chain",
    description:
      "Native Bitcoin and Solana keys. No wrapped versions, no bridge risk. Launch, swap, send, all from one app.",
    features: [
      { label: "True Self-Custody" },
      { label: "Native Assets, Real Security" },
      { label: "One App, Every Network" },
    ],
    image: walletImage,
    // `comingSoon` short-circuits the CTA into a disabled button, so the
    // platform picker below it is unreachable until the wallet actually ships.
    // The `downloads` payload is deliberately left intact rather than deleted:
    // removing this one flag is the whole job of turning the CTA back on.
    cta: {
      label: "Coming Soon",
      comingSoon: true,
      dialogTitle: "Get Crackerwallet",
      dialogSubtitle:
        "Native BTC and SOL, self-custody, with duplicate-ticker protection built in. Choose your platform.",
      downloads: [
        { id: "chrome", href: "#chrome-web-store" },
        { id: "play", href: "#google-play" },
        { id: "appstore", href: "#app-store" },
      ],
    },
  },
  {
    id: "eggbot",
    productLabel: "Egg Bot",
    title: "Deploy from X or Telegram",
    description:
      "Launch a token straight from a tweet or thread. No browser tab needed. Sign every transaction, we never touch your keys.",
    features: [
      { label: "Deploy from X", comingSoon: true },
      { label: "Deploy from Telegram", comingSoon: true },
      { label: "You Control Every Transaction" },
    ],
    image: botImage,
    // Both deploy channels are still unreleased, so the product CTA is
    // disabled the same way the wallet's is. `href` is kept for the day it
    // turns back on: deleting `comingSoon` and restoring the label is the
    // whole change.
    cta: { label: "Coming Soon", comingSoon: true, href: "#egg-bot" },
  },
];
