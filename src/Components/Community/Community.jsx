import "./Community.css"
import communityRobot from "../../assets/community.mp4"
import Telegram from "../../assets/telegram.png"
import X from "../../assets/X.png"
import { useMemo } from "react"
export default function Community(){
    const openX = useMemo(() => () => { window.open("https://x.com/globalcracker?s=21", "_blank"); }, []);
    const highlightStyle = useMemo(() => ({ color: "#FE6C25" }), []);
    return(
        <>
        <div className="communityParent">
            <div className="contentParent">
                <video preload="none" autoPlay loop muted playsInline src={communityRobot}></video>
                <div className="cummunityContentCard">
                    <div className="communityTag"><span>Community</span></div>
                    <p>Join Our Growing <span style={highlightStyle}>Community</span></p>
                    <p id="CommunityLastChild">Connect, collaborate, and grow with creators shaping the future together.</p>
                    <div className="communityIcon">
                        <img loading="lazy" src={Telegram} alt="" srcset="" />
                        <img loading="lazy" src={X} onClick={openX} alt="" srcset="" />
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}