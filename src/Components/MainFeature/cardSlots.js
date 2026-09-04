/* Which feature sits in which card position, in the order they are written in
   MainFeature.jsx.

   This exists because that mapping was duplicated: MainFeature.jsx decided it
   in JSX, and CardArtTuner.jsx repeated it as a hand-typed list of labels. When
   cards 2 and 3 were reordered, only the first copy changed — so the tuner went
   on calling the bottom-left slot "Zero Price Gap" while it was showing Snipers
   Pay the Most, and tuning it would have framed the wrong illustration.

   `cls` is the position (which is layout: topLeft and bottomRight are the full
   height cards). `key` is the feature in it, and indexes featureDialogData, so
   titles are read from there rather than typed a third time.

   Reordering the cards means editing the keys here AND the JSX in
   MainFeature.jsx. The two still have to agree — but the tuner, and anything
   else that needs to know, now reads this one. */
export const CARD_SLOTS = [
  { cls: "topLeftCard", key: "lockedLiquidity" },
  { cls: "bottomLeftCard", key: "botsPay" },
  { cls: "topRightCard", key: "zeroPriceGap" },
  { cls: "bottomRightCard", key: "creatorFees" },
];
