// Steps for the pinned process section.
//
// `modifiers`-free by design: everything here is content. The phase number is
// derived from array order by the component, so reordering renumbers itself.
//
// Every `href` is a placeholder anchor, not a real destination. They are
// written as fragments so a stray click can't navigate off the page before the
// real URLs land.
//
// CTA labels carry no arrow glyph — the button renders its own arrow as an SVG
// beside the label, so a "→" in the string would show up twice.
//
// Grid placement and the ring are driven by array order, so the ORDER of this
// array is load-bearing.

import launchpadImage from "../../assets/launchpad.png";
import dexImage from "../../assets/dexCard.png";
import walletImage from "../../assets/wallet.png";
import botImage from "../../assets/xbot.png";

export const processSteps = [
  {
    id: "launchpad",
    title: "Launchpad",
    description:
      "Tokens go live with liquidity locked and supply distributed from block one. Every launch is bonded, auditable, and free of the insider allocation that quietly decides most of them.",
    tags: ["Fair Launch", "Locked Liquidity", "Anti-Snipe"],
    image: launchpadImage,
    cta: { label: "Launch a Token", href: "#launchpad" },
  },
  {
    id: "swap",
    title: "CrackerSwap",
    description:
      "Find the cheapest, fastest route across chains before you commit. Bridge in from the major networks, with the total cost shown upfront so there's no surprise at signing.",
    tags: ["Best Rate", "Cross-Chain Bridge", "No Hidden Fees"],
    image: dexImage,
    cta: { label: "Start Swapping", href: "#crackerswap" },
  },
  {
    id: "wallet",
    title: "Crackerwallet",
    description:
      "A self-custody wallet with native BTC and SOL, not wrapped versions pretending to be them. Launch, swap, bridge, and chart from one app, with duplicate-ticker protection so scam clones can't pass as the real thing.",
    tags: ["Self-Custody", "Native Assets", "Anti-Scam"],
    image: walletImage,
    // `downloads` instead of `href`: this CTA opens the platform picker rather
    // than navigating. Each entry's `id` selects its badge styling.
    cta: {
      label: "Get Early Access",
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
    title: "Egg Bot",
    description:
      "Deploy a token straight from a tweet or a Telegram thread, no browser tab required at the exact moment your idea is hot. Non-custodial by design, you sign every transaction, we never touch your keys.",
    tags: ["Deploy from X", "Deploy from Telegram", "Non-Custodial"],
    image: botImage,
    cta: { label: "Try Egg Bot", href: "#egg-bot" },
  },
];
