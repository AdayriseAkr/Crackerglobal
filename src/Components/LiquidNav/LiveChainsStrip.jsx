import React from "react";
import "./LiveChainsStrip.css";
import rocketArt from "../../assets/navRocket.webp";
import { LIVE_CHAINS } from "./liveChains.js";

/* How long the strip waits before its first appearance, how long it stays, and
   how long it rests before coming back.

   The rest is deliberately shorter than the show: this is a standing fact
   about the product ("the launchpad is live on these chains"), not an alert,
   so it should read as something the dock surfaces periodically rather than
   something nagging for attention. Long enough on screen to actually be read
   at a glance and then looked at properly. */
const FIRST_APPEARANCE_MS = 5000;
const VISIBLE_MS = 30000;
const RESTING_MS = 15000;

/* Drives the show/hide cycle. Lives here rather than in LiquidNav so the
   timing constants sit next to the thing they time, and LiquidNav only has to
   know "is it on duty right now".

   Note this is the CYCLE, not the final visibility: the nav suppresses the
   strip while its own panels are open, and it does so without touching this
   timer. That is on purpose. If hovering Products reset the cycle, someone
   moving the mouse across the dock would keep restarting the clock and the
   strip would either never appear or reappear at random. The cycle runs to its
   own schedule underneath; the nav just covers it up. So dismissing it by
   opening a panel and closing it again brings the strip back for whatever is
   left of its window, which is the behaviour that feels least arbitrary. */
export function useLiveChainsCycle() {
  const [onDuty, setOnDuty] = React.useState(false);

  React.useEffect(() => {
    let timer;
    // Self-rescheduling rather than setInterval: the two phases have different
    // lengths, so there is no single interval to set.
    const queue = (next, delay) => {
      timer = setTimeout(() => {
        setOnDuty(next);
        queue(!next, next ? VISIBLE_MS : RESTING_MS);
      }, delay);
    };
    queue(true, FIRST_APPEARANCE_MS);
    return () => clearTimeout(timer);
  }, []);

  return onDuty;
}

/* How many times the chain list is repeated along the rail.

   The rail scrolls left by exactly ONE set and then starts over, so the loop is
   seamless as long as what is on screen at that moment is indistinguishable
   from what was on screen at the start. That needs the rendered rail to be
   wider than the visible window by at least one set — otherwise the tail runs
   out mid-scroll and a blank gap crosses the strip before it resets, which
   reads as the loop breaking rather than repeating.

   Four chains at 4.4rem of pitch is a 17.6rem set, against a window of roughly
   28rem inside the 44rem dock. Two sets would technically cover it; six is
   cheap insurance so the strip cannot develop a gap if the dock is ever
   widened or a chain is removed from the list. The images are four unique URLs
   however many times they appear, so the repeats cost DOM nodes and nothing
   else. */
const RAIL_SETS = 6;

export default function LiveChainsStrip({ visible }) {
  const rail = Array.from({ length: RAIL_SETS }, () => LIVE_CHAINS).flat();

  return (
    <div
      className={`liveChains${visible ? " is-visible" : ""}`}
      // Hidden from the accessibility tree AND from the tab order while it is
      // away, so the sentence below is not read out to a screen reader during
      // the 15 seconds the strip is resting. Boolean rather than the old
      // inert="" string form: React 19 handles inert as a real boolean prop,
      // and passing a string here would be the pre-19 workaround.
      inert={!visible}
    >
      <div className="liveChainsInner">
        {/* One sentence for a screen reader, in place of a rocket, a dot and
            eight logo images announcing themselves one at a time — twice,
            because the rail is duplicated. Everything visual below is
            aria-hidden so this is the only thing that reaches the buffer. */}
        <p className="liveChainsSrOnly">
          Cracker Launchpad is live on{" "}
          {LIVE_CHAINS.map((c) => c.name).join(", ")}.
        </p>

        <div className="liveChainsLead" aria-hidden="true">
          <span className="liveChainsRocket">
            <img src={rocketArt} alt="" />
          </span>
          <span className="liveChainsStatus">
            <span className="liveChainsDot"></span>
            <span className="liveChainsLive">Live on</span>
          </span>
        </div>

        {/* The clipper. It also carries the edge mask, so logos dissolve as
            they arrive and leave instead of being sliced off at a hard border
            — without it the loop reads as a filmstrip behind a window. */}
        <div className="liveChainsViewport" aria-hidden="true">
          {/* The CSS scrolls by one set, and one set is however many chains
              the data file holds — so the length has to reach the stylesheet.
              Passing it as a custom property keeps the distance derived from
              the list instead of a number that goes stale the moment a chain
              is added or dropped. */}
          <div
            className="liveChainsRail"
            style={{ "--chains-count": LIVE_CHAINS.length }}
          >
            {rail.map((chain, i) => (
              <span
                className="liveChainsChain"
                // Index is in the key on purpose: the same chain appears twice
                // by design, so name alone is not unique here.
                key={`${chain.name}-${i}`}
                title={chain.name}
              >
                <img src={chain.logo} alt="" loading="lazy" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
