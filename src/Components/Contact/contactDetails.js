// Contact details. The registered entity and its address come from the Terms
// and the Privacy Policy, which are the version the company is bound by.
//
// The three mailboxes are on crackerglobal.com, which is not the domain the
// site itself is served from (cracker.global). That split is real and
// deliberate, so a find-and-replace across one must not sweep up the other:
// the company owns both names, serves the site from cracker.global and keeps
// mail on crackerglobal.com.
//
// Whatever changes here has to change in legalContent.js too: the Terms and
// the Privacy Policy each name a mailbox in their own body text, and those
// are the copies that carry legal weight.

export const COMPANY = {
  name: "Cracker Limited Liability Co.",
  lines: ["30 N Gould St, Ste N", "Sheridan, WY 82801", "United States"],
};

export const CONTACT_EMAILS = [
  {
    id: "support",
    label: "General & support",
    detail: "Questions about the products, partnerships, anything else.",
    address: "support@crackerglobal.com",
  },
  {
    id: "legal",
    label: "Legal",
    detail: "Terms and Conditions, licensing, formal notices.",
    address: "contact@crackerglobal.com",
  },
  {
    id: "privacy",
    label: "Privacy & data requests",
    detail: "Access, correction or deletion of your personal information.",
    address: "info@crackerglobal.com",
  },
];

export const CONTACT_DIALOG = {
  title: "Get in touch",
  subtitle: "A real company at a real address. Pick whichever route fits.",
};
