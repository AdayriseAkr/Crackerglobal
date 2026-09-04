// Where "Join Us" sends people. One module, because the same two destinations
// are reached from three places now — the top nav, the Community card in What
// You Get, and the icons in the Community section — and three copies of a URL
// is three chances for one of them to go stale.

// The Community section linked https://x.com/globalcracker?s=21, which is not
// the account. Corrected here, and since every entry point reads this module
// the old handle is gone from the site in one edit.
export const X_URL = "https://x.com/Cracker_Global";

// A private-group invite link, not a public @handle. Those can be revoked or
// rotated from inside Telegram, at which point this one stops working with no
// sign of it in the code — so if the group ever stops filling up, check the
// invite here before anything else.
export const TELEGRAM_URL = "https://t.me/+6L_UucDs7Vk4NWFh";

export const JOIN_DIALOG = {
  title: "Join the community",
  subtitle:
    "Launches, updates and the people building on Cracker. Pick where you want to find us.",
};

export const JOIN_LINKS = [
  { id: "x", href: X_URL },
  { id: "telegram", href: TELEGRAM_URL },
];
