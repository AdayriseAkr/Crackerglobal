// Terms and Privacy, as supplied by LegalByte (both dated 12/11/2025).
//
// VERBATIM, with one recorded exception. Every sentence below is word for word
// from the source PDFs, including the product naming. Nothing is paraphrased,
// reordered or summarised, and nothing should be: this is the text the company
// is bound by, and an edit that reads as tidying can change what it covers.
//
// THE ONE EXCEPTION: the source PDFs name the site domain as cracker.global in
// both scope sentences. That domain was never registered and does not resolve.
// The site ships on crackerglobal.com, which is also where the two mailboxes
// these documents give for data rights already live. Both sentences now read
// crackerglobal.com, so the documents name the site they actually govern.
// This is a factual correction to a binding document rather than a copy edit,
// and LegalByte should reissue the PDFs to match, instead of leaving the
// signed source and this file disagreeing.
//
// NOTE ON SCOPE: past that domain, both documents still describe themselves as
// covering "the Cracker Wallet mobile applications, browser extensions and
// related websites" at crackerglobal.com and crackerwallet.fun. They are
// linked from the footer of a site that also fronts the Launchpad, CrackerSwap
// and Egg Bot, which those definitions do not name. Broadening them is a legal
// change, so it is left to LegalByte to reissue the documents with an
// ecosystem-wide definition rather than done here.
//
// The two contact emails were "[insert ...]" placeholders in the source. The
// addresses the documents themselves suggested are used here and are marked
// TODO — they must be live mailboxes before this ships, since the Terms give
// them as the route for exercising data rights.

const LAST_UPDATED = "12 November 2025";

export const termsDocument = {
  id: "terms",
  title: "Terms and Conditions",
  lastUpdated: LAST_UPDATED,
  sections: [
    {
      heading: "1. Agreement to terms",
      blocks: [
        {
          type: "p",
          text: 'These Terms and Conditions ("Terms") govern your access to and use of the Cracker Wallet mobile applications, browser extensions and related websites, including but not limited to crackerglobal.com, crackerwallet.fun and associated sub-domains (together, the "Services"), provided by Cracker Limited Liability Co. ("Cracker", "we", "us" or "our").',
        },
        {
          type: "p",
          text: "By installing, accessing or using the Services, you agree to be bound by these Terms. If you do not agree, you must not use the Services.",
        },
      ],
    },
    {
      heading: "2. Eligibility",
      blocks: [
        { type: "p", text: "You may use the Services only if you:" },
        {
          type: "ul",
          items: [
            "are at least 18 years old;",
            "have the legal capacity to enter into a binding contract; and",
            "are not located in, ordinarily resident in, or a national of any country or territory subject to comprehensive US sanctions, and are not a person listed on any US or other applicable sanctions list.",
          ],
        },
        {
          type: "p",
          text: "By using the Services, you represent and warrant that you meet these requirements.",
        },
      ],
    },
    {
      heading: "3. Nature of the Services",
      blocks: [
        {
          type: "p",
          text: "Cracker Wallet is a non-custodial software application that enables you to generate cryptographic key pairs, create and manage digital asset wallets, view balances and submit transactions on supported blockchains.",
        },
        { type: "p", text: "The Services:" },
        {
          type: "ul",
          items: [
            "do not hold or control your digital assets or private keys on your behalf;",
            "do not provide fiat currency services, card processing or bank accounts;",
            "do not operate an exchange order book, brokerage or investment service; and",
            "do not guarantee the completion, validity or outcome of any transaction you submit.",
          ],
        },
      ],
    },
    {
      heading: "4. Non-custodial nature and your responsibilities",
      blocks: [
        { type: "p", text: "You are solely responsible for:" },
        {
          type: "ul",
          items: [
            "generating, storing and backing up your seed phrases, private keys and any passwords or PINs associated with the Services;",
            "all transactions initiated using the Services, including their accuracy and security;",
            "ensuring that your devices and software are kept secure and free from malware; and",
            "maintaining up-to-date backups of your wallets in accordance with your own risk appetite.",
          ],
        },
        {
          type: "p",
          text: "If you lose access to your device, seed phrases, private keys or passwords, you may permanently lose access to your digital assets. Cracker does not have access to your private keys and cannot recover them for you.",
        },
      ],
    },
    {
      heading: "5. Prohibited use",
      blocks: [
        { type: "p", text: "You must not use the Services:" },
        {
          type: "ul",
          items: [
            "in violation of any applicable law, regulation or order;",
            "to evade sanctions, commit fraud, launder money or finance terrorism;",
            "to interfere with or disrupt the security or integrity of any network, system or service;",
            "to harm, threaten or harass others; or",
            "in any manner that could damage, disable, overburden or impair the Services.",
          ],
        },
        {
          type: "p",
          text: "We may suspend or terminate your access to the Services at any time where we reasonably believe that you have breached these Terms or that your use presents a legal, regulatory or security risk.",
        },
      ],
    },
    {
      heading: "6. Third-party services and content",
      blocks: [
        {
          type: "p",
          text: "The Services may allow you to access or interact with third-party websites, applications, smart contracts, protocols, exchanges, KYC providers, analytics tools or other services that are not owned or controlled by Cracker.",
        },
        {
          type: "p",
          text: "When you access third-party services, you do so at your own risk. Cracker is not responsible for, and does not endorse, any third-party services, content, products or smart contracts, and shall have no liability arising from your use of them.",
        },
      ],
    },
    {
      heading: "7. Fees",
      blocks: [
        {
          type: "p",
          text: "Cracker may charge fees for certain features or services within the Cracker ecosystem. You will be informed of any applicable fees before they are incurred. Network fees charged by the relevant blockchain (such as gas or transaction fees) are separate and are determined by the underlying protocols, not by Cracker.",
        },
      ],
    },
    {
      heading: "8. No investment, legal or tax advice",
      blocks: [
        {
          type: "p",
          text: "Information provided through the Services, on our websites, or in communications with you is for general information only and does not constitute investment, legal, tax or other professional advice. You are solely responsible for evaluating the merits and risks associated with the use of any information or assets accessed through the Services, and for obtaining your own professional advice where appropriate.",
        },
      ],
    },
    {
      heading: "9. Digital asset risks",
      blocks: [
        {
          type: "p",
          text: "Digital assets and blockchain technologies involve significant risks, including but not limited to:",
        },
        {
          type: "ul",
          items: [
            "extreme price volatility and potential loss of value;",
            "technical failures, bugs or vulnerabilities in protocols, smart logic or infrastructure;",
            "irreversible transactions and permanent loss of assets;",
            "network congestion, forks or changes in consensus mechanisms;",
            "cyber-attacks, phishing and unauthorised access; and",
            "legal and regulatory changes that may affect the use, transfer or value of digital assets.",
          ],
        },
        { type: "p", text: "By using the Services, you accept and assume all such risks." },
      ],
    },
    {
      heading: "10. Intellectual property",
      blocks: [
        {
          type: "p",
          text: "The Services and all related content, software, logos and branding are owned by or licensed to Cracker and are protected by intellectual property laws. Subject to your compliance with these Terms, we grant you a limited, non-exclusive, non-transferable licence to install and use the wallet software solely for your personal or internal business purposes.",
        },
        { type: "p", text: "You must not:" },
        {
          type: "ul",
          items: [
            "copy, modify, distribute, sell or lease any part of the Services;",
            "reverse engineer, decompile or attempt to extract the source code, except to the extent permitted by law; or",
            "remove or alter any proprietary notices or marks.",
          ],
        },
      ],
    },
    {
      heading: "11. App Store terms",
      blocks: [
        {
          type: "p",
          text: "If you download the mobile application from the Apple App Store or another app marketplace, your use of the app is also subject to the terms and policies of that marketplace.",
        },
        { type: "p", text: "In the case of Apple:" },
        {
          type: "ul",
          items: [
            "These Terms are between you and Cracker, not Apple.",
            "Apple has no responsibility for the app or its content.",
            "Apple has no obligation to provide maintenance or support services for the app.",
            "To the maximum extent permitted by law, Apple has no warranty obligations with respect to the app.",
            "Apple and its affiliates are third-party beneficiaries of these Terms and may enforce them against you.",
          ],
        },
      ],
    },
    {
      heading: "12. Limitation of liability",
      blocks: [
        { type: "p", text: "To the fullest extent permitted by law:" },
        {
          type: "ul",
          items: [
            'the Services are provided "as is" and "as available" without any warranties of any kind, whether express, implied or statutory, including any implied warranties of merchantability, fitness for a particular purpose, non-infringement or availability;',
            "Cracker shall not be liable for any indirect, incidental, special, consequential or punitive damages, or for any loss of profits, revenue, data or goodwill, arising out of or in connection with the Services or these Terms; and",
            "Cracker's total aggregate liability to you for all claims arising out of or relating to the Services or these Terms shall not exceed the greater of (i) the amount of fees you have paid to Cracker for the Services in the twelve months preceding the event giving rise to the claim, or (ii) one hundred US dollars (USD 100).",
          ],
        },
        {
          type: "p",
          text: "Nothing in these Terms excludes or limits liability that cannot be excluded or limited under applicable law.",
        },
      ],
    },
    {
      heading: "13. Indemnity",
      blocks: [
        {
          type: "p",
          text: "You agree to indemnify, defend and hold harmless Cracker, its members, officers, employees and contractors from and against any claims, liabilities, damages, losses and expenses, including reasonable legal fees, arising out of or related to your use of the Services, your violation of these Terms, or your violation of any law or third-party rights.",
        },
      ],
    },
    {
      heading: "14. Changes to the Services and Terms",
      blocks: [
        {
          type: "p",
          text: 'We may modify or discontinue any part of the Services at any time. We may also update these Terms from time to time. When we do, we will revise the "Last updated" date at the top and may provide additional notice as appropriate.',
        },
        {
          type: "p",
          text: "Your continued use of the Services after any changes to the Terms constitutes your acceptance of the updated Terms. If you do not agree to the changes, you must stop using the Services.",
        },
      ],
    },
    {
      heading: "15. Term and termination",
      blocks: [
        {
          type: "p",
          text: "These Terms remain in effect while you access or use the Services. We may suspend or terminate your access at any time, with or without notice, if we reasonably believe that you have breached these Terms or that your use may create risk or liability for us or others.",
        },
        {
          type: "p",
          text: "You may stop using the Services at any time. Termination does not affect provisions that by their nature should survive, including those relating to intellectual property, disclaimers, limitation of liability, indemnity and governing law.",
        },
      ],
    },
    {
      heading: "16. Governing law and dispute resolution",
      blocks: [
        {
          type: "p",
          text: "These Terms and any dispute or claim arising out of or in connection with them or the Services shall be governed by and construed in accordance with the laws of the State of Wyoming and, where applicable, the federal laws of the United States, without reference to conflict-of-laws principles.",
        },
        {
          type: "p",
          text: "Any dispute arising out of or relating to these Terms or the Services shall be subject to the exclusive jurisdiction of the state and federal courts located in Wyoming, and you consent to the personal jurisdiction of those courts.",
        },
      ],
    },
    {
      heading: "17. Contact",
      blocks: [
        {
          type: "p",
          text: "For questions about these Terms or the Services, you may contact us at:",
        },
        {
          type: "address",
          lines: [
            "Cracker Limited Liability Co.",
            "30 N Gould St, Ste N",
            "Sheridan, WY 82801",
            "United States",
          ],
          // TODO: confirm this mailbox is live before launch.
          email: "contact@crackerglobal.com",
        },
      ],
    },
  ],
};

export const privacyDocument = {
  id: "privacy",
  title: "Privacy Policy",
  lastUpdated: LAST_UPDATED,
  sections: [
    {
      heading: "1. Who we are",
      blocks: [
        {
          type: "p",
          text: 'This Privacy Policy explains how Cracker Limited Liability Co. ("Cracker", "we", "us" or "our") collects, uses, shares and protects information in connection with the Cracker Wallet mobile applications, browser extensions and related websites, including but not limited to crackerglobal.com, crackerwallet.fun and associated sub-domains (together, the "Services").',
        },
        {
          type: "p",
          text: "Cracker Limited Liability Co. is a Wyoming limited liability company with its registered office at 30 N Gould St, Ste N, Sheridan, WY 82801, United States.",
        },
        {
          type: "p",
          text: "By using the Services, you acknowledge that you have read and understood this Privacy Policy.",
        },
      ],
    },
    {
      heading: "2. Scope",
      blocks: [
        { type: "p", text: "This Privacy Policy applies to information we collect when you:" },
        {
          type: "ul",
          items: [
            "install, access or use the Cracker Wallet mobile app or browser extension;",
            "visit our websites;",
            "contact us by email or other channels; or",
            "otherwise interact with us in connection with the wallet.",
          ],
        },
        {
          type: "p",
          text: "It does not apply to any third-party websites, services or applications that are not owned or controlled by Cracker, including blockchain networks, decentralised applications, exchanges or KYC providers you may choose to use.",
        },
      ],
    },
    {
      heading: "3. Information we collect",
      blocks: [
        { type: "h", text: "a) Information you provide directly" },
        {
          type: "p",
          text: "When you use the Services or communicate with us, we may collect:",
        },
        {
          type: "ul",
          items: [
            "Contact information such as your name and email address.",
            "Account information such as username or other identifiers you choose.",
            "Support information such as messages, attachments and other content you send to us.",
            "KYC information (if and when implemented) such as identity documents, date of birth, address, photographs or video, and any other information required by our KYC provider to verify your identity.",
          ],
        },
        { type: "h", text: "b) Information collected automatically" },
        { type: "p", text: "When you access or use the Services, we may automatically collect:" },
        {
          type: "ul",
          items: [
            "Device and usage data, including IP address, device identifiers, operating system, app version, browser type, language settings and time zone.",
            "Log information, including access times, pages viewed, in-app actions and error reports.",
            "Approximate location information derived from your IP address, used primarily for security and sanctions-related controls.",
          ],
        },
        {
          type: "p",
          text: "We do not collect or store your private keys or seed phrases on our servers. Those remain on your device under your control, except where you explicitly choose to use an encrypted backup option that keeps decryption keys solely in your possession.",
        },
        { type: "h", text: "c) Blockchain data" },
        {
          type: "p",
          text: "Blockchains are public, distributed ledgers. Transactions you submit using the Cracker Wallet will be recorded on the relevant blockchain and may be publicly accessible. This information may include wallet addresses, transaction hashes and amounts. Although this data is public, we may associate one or more wallet addresses with your account or device for security and support purposes.",
        },
      ],
    },
    {
      heading: "4. How we use information",
      blocks: [
        { type: "p", text: "We use the information we collect for the following purposes:" },
        {
          type: "ul",
          items: [
            "To provide, operate and maintain the Services, including enabling you to create and manage wallets, view balances and submit transactions.",
            "To secure the Services, including monitoring for fraud, abuse and suspicious activity and enforcing our Terms and Conditions.",
            "To comply with legal and regulatory obligations, including sanctions screening and, if implemented, KYC/AML checks.",
            "To communicate with you about the Services, including sending administrative messages, updates, security alerts and responses to your enquiries.",
            "To improve and develop the Services, including performing analytics, debugging and quality assurance.",
            "To protect our rights, property and the safety of users and the public.",
          ],
        },
      ],
    },
    {
      heading: "5. Legal bases for processing",
      blocks: [
        {
          type: "p",
          text: "Where applicable data protection laws require a legal basis, we rely on:",
        },
        {
          type: "ul",
          items: [
            "Performance of a contract, to provide the Services and fulfil our obligations under the Terms and Conditions.",
            "Our legitimate interests, including operating, securing and improving the Services, preventing abuse and responding to your queries.",
            "Compliance with legal obligations, including anti-money laundering and sanctions regulations.",
            "Your consent, where required by law, for specific uses such as certain cookies, marketing communications or optional features.",
          ],
        },
      ],
    },
    {
      heading: "6. How we share information",
      blocks: [
        { type: "p", text: "We may share information with:" },
        {
          type: "ul",
          items: [
            // Verbatim, including "as described in your technical documentation" —
      // that phrase addresses the client, not the reader, and looks like a
      // drafting artifact. Flagged for LegalByte rather than removed here.
      "Service providers who assist us with infrastructure, hosting, analytics, email delivery, customer support, KYC/AML checks and similar functions. This includes cloud providers such as Amazon Web Services, as described in your technical documentation.",
            "Professional advisers such as lawyers, auditors and consultants where reasonably necessary.",
            "Law enforcement, regulators or courts where we are legally required to do so, or where we consider it necessary to protect our rights or the rights of others.",
            "Another entity in connection with a merger, acquisition, reorganisation or sale of assets, subject to appropriate safeguards.",
          ],
        },
        { type: "p", text: "We do not sell personal information." },
      ],
    },
    {
      heading: "7. International transfers",
      blocks: [
        {
          type: "p",
          text: "The information we collect may be stored and processed in the United States and other countries where we or our service providers operate. These countries may have data protection laws that differ from those in your jurisdiction.",
        },
        {
          type: "p",
          text: "Where required by law, we will implement appropriate safeguards for international transfers, such as contractual protections and technical measures designed to protect your information.",
        },
      ],
    },
    {
      heading: "8. Data retention",
      blocks: [
        {
          type: "p",
          text: "We retain personal information for as long as necessary to fulfil the purposes described in this Privacy Policy, including providing the Services, complying with legal obligations, resolving disputes and enforcing our agreements.",
        },
        {
          type: "p",
          text: "Retention periods vary depending on the type of data and the context in which it was collected. When information is no longer needed, we will delete or anonymise it, subject to any legal retention requirements.",
        },
      ],
    },
    {
      heading: "9. Security",
      blocks: [
        {
          type: "p",
          text: "We use appropriate technical and organisational measures to protect personal information, including encryption in transit and at rest, access controls, logging and regular security review of our systems.",
        },
        {
          type: "p",
          text: "No method of transmission over the internet or electronic storage is completely secure. You are responsible for maintaining the security of your devices and your seed phrases, private keys and passwords.",
        },
      ],
    },
    {
      heading: "10. Your rights",
      blocks: [
        {
          type: "p",
          text: "Depending on your jurisdiction, you may have rights in relation to your personal information, including the right to:",
        },
        {
          type: "ul",
          items: [
            "access a copy of your personal information;",
            "request correction of inaccurate or incomplete information;",
            "request deletion of your information, subject to legal obligations to retain certain data;",
            "object to or restrict certain processing; and",
            "obtain a copy of information you have provided to us in a portable format.",
          ],
        },
        {
          type: "p",
          text: "To exercise these rights, you may contact us using the contact details below. We may request additional information to verify your identity before responding.",
        },
      ],
    },
    {
      heading: "11. Children",
      blocks: [
        {
          type: "p",
          text: "The Services are not directed to, and may not be used by, anyone under the age of 18. We do not knowingly collect personal information from children. If we become aware that a child has provided us with personal information, we will take steps to delete it.",
        },
      ],
    },
    {
      heading: "12. Changes to this Privacy Policy",
      blocks: [
        {
          type: "p",
          text: 'We may update this Privacy Policy from time to time. When we do, we will revise the "Last updated" date at the top. In some cases we may provide additional notice, such as by email or in-app notification.',
        },
      ],
    },
    {
      heading: "13. Contact us",
      blocks: [
        {
          type: "p",
          text: "If you have any questions about this Privacy Policy or our data practices, you may contact us at:",
        },
        {
          type: "address",
          lines: [
            "Cracker Limited Liability Co.",
            "30 N Gould St, Ste N",
            "Sheridan, WY 82801",
            "United States",
          ],
          // TODO: confirm this mailbox is live before launch.
          email: "info@crackerglobal.com",
        },
      ],
    },
  ],
};

export const legalDocuments = {
  terms: termsDocument,
  privacy: privacyDocument,
};
