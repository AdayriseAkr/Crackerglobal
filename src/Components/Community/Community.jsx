import "./Community.css"
import communityRobot from "../../assets/community.min.mp4"
import Telegram from "../../assets/telegram.webp"
import X from "../../assets/X.webp"
import { useMemo } from "react"
import { X_URL, TELEGRAM_URL } from "../Join/joinLinks.js"
export default function Community(){
    // Both icons are real links now. The Telegram one has never had a handler:
    // it looked identical to the X icon and did nothing when tapped.
    // window.open with noopener, not a bare _blank, so the opened tab cannot
    // reach back through window.opener.
    const openX = useMemo(() => () => { window.open(X_URL, "_blank", "noopener"); }, []);
    const openTelegram = useMemo(() => () => { window.open(TELEGRAM_URL, "_blank", "noopener"); }, []);
    const highlightStyle = useMemo(() => ({ color: "#FE6C25" }), []);
    return(
        <>
        <div className="communityParent">
            <div className="contentParent">
                {/* Decorative background only. No `controls` attribute, but that alone
                    is not enough: browsers add their own start-playback button when
                    autoplay is blocked or the file is not loaded yet, which is where
                    the play button was coming from. `preload="auto"` removes the
                    second cause, .bgVideo in index.css hides the control itself, and
                    pointer-events:none there makes the whole element unclickable.
                    disablePictureInPicture and controlsList close the right-click and
                    long-press routes to a player. */}
                <video
                  className="bgVideo"
                  src={communityRobot}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  disablePictureInPicture
                  controlsList="nodownload noplaybackrate noremoteplayback"
                  tabIndex={-1}
                  aria-hidden="true"
                ></video>
                <div className="cummunityContentCard">
                    <div className="communityTag"><span>Community</span></div>
                    <p>Join Our Growing <span style={highlightStyle}>Community</span></p>
                    <p id="CommunityLastChild">Connect, collaborate, and grow with creators shaping the future together.</p>
                    <div className="communityIcon">
                        <img loading="lazy" src={Telegram} onClick={openTelegram} alt="Telegram" />
                        <img loading="lazy" src={X} onClick={openX} alt="X" />
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}