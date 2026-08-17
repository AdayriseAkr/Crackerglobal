// Steps for the pinned process section. Placeholder copy over the four real
// Cracker products — swap the strings, keep the shape.
//
// Every `cta.href` is a placeholder anchor, not a real destination. They are
// written as fragments so a stray click can't navigate off the page before the
// real URLs land.
//
// The count is not hardcoded anywhere: the tracker, the scroll distance and the
// step boundaries all derive from this array's length, so adding a fifth step
// is a matter of adding an entry here.

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
    cta: { label: "Open Launchpad", href: "#launchpad" },
  },
  {
    id: "dex",
    title: "Decentralised Exchange",
    description:
      "Route across every supported chain in a single transaction. Orders settle through DevvE CTS rather than a public mempool, so there is no front-running to price in and no bridge to babysit.",
    tags: ["Zero MEV", "No Slippage", "Multi-Chain"],
    image: dexImage,
    cta: { label: "Start Trading", href: "#dex" },
  },
  {
    id: "wallet",
    title: "Wallet",
    description:
      "Self-custody across every chain the ecosystem touches, with launch access and swap routing built in rather than bolted on. Your keys never leave the device.",
    tags: ["Self-Custody", "Hardware Ready", "One Balance"],
    image: walletImage,
    cta: { label: "Get the Wallet", href: "#wallet" },
  },
  {
    id: "bot",
    title: "Twitter Bot",
    description:
      "Live launch alerts, price moves and holder milestones posted the moment they happen. Track any Cracker token straight from the timeline, no dashboard required.",
    tags: ["Live Alerts", "Auto-Post", "Sentiment"],
    image: botImage,
    cta: { label: "Follow the Bot", href: "#bot" },
  },
];
