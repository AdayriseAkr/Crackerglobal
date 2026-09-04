import baseLogo from "../../assets/chainBase.webp";
import inkLogo from "../../assets/chainInk.webp";
import monadLogo from "../../assets/chainMonad.webp";
import hoodLogo from "../../assets/chainHood.webp";

// The chains the launchpad is live on, in the order they scroll past. Adding
// one here is the whole change — the rail duplicates whatever this array holds
// (see LiveChainsStrip.jsx) and the marquee keeps working at any length.
//
// `name` is not decoration: it is what the screen-reader sentence is built
// from, so it has to read as the chain's actual name rather than a slug.
export const LIVE_CHAINS = [
  { name: "Base", logo: baseLogo },
  { name: "Ink", logo: inkLogo },
  { name: "Monad", logo: monadLogo },
  { name: "Robinhood", logo: hoodLogo },
];
