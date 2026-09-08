// Contact details. The registered entity and its address come from the Terms
// and the Privacy Policy, which are the version the company is bound by.
//
// The three mailboxes and the site now sit on the same domain,
// crackerglobal.com. They did not always: the documents named a separate
// cracker.global for the site, which was never registered, and that reference
// has since been corrected in legalContent.js.
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
