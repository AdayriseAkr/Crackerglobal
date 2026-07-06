import "./AiBot.css";
import { useEffect, useState , useRef } from "react";
import aiLoading from "../../assets/aiLoading.gif"
import {motion} from "framer-motion"

export default function AiBot() {
  const [botTab, setBotTab] = useState(true);
  const [minimize , setMinimize] = useState(false);
  const [userPrompt,setUserPrompt] = useState("");
  const [aiResposne,setAiResponse] = useState("")
  const [scrollToBottom,setScrollToBottom] = useState(false)
  const [waiting , setWaiting] = useState(false);

const chatRef = useRef(null);
const inputRef = useRef(null);

const API_KEY = 'AIzaSyA4gQKuahddjZm5RwE9XmsklzKm0C12Ydo'; // ⚠️ Unsafe for public sites
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

const askGemini = async (prompt) => {
  if(prompt === undefined) return;
  setWaiting(true);
  try {
    const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: `${prompt} Note:Adayrise — Company Profile

<b>About Adayrise</b><br>
Adayrise is a full-stack digital innovation company delivering world-class Web2 and Web3 solutions. We specialize in high-end UI/UX design, enterprise-grade security audits, and scalable product development. Our goal is simple: to provide the best software solutions within your budget—without compromising on quality.<br><br>

<b>Vision</b><br>
To empower businesses with modern, secure, and beautifully designed digital products that create real impact.<br><br>

<b>What We Do</b><br>
• <b>Web2 Development</b><br>
  • High-performance websites and web applications<br>
  • Custom business dashboards<br>
  • E-commerce development<br>
  • SaaS platforms and automation systems<br><br>

• <b>Web3 Development</b><br>
  • Smart contract development<br>
  • Token launches and utilities<br>
  • Blockchain-based platforms<br>
  • DApps and ecosystem tools<br><br>

• <b>UI/UX Design</b><br>
We focus on interactive, modern, and visually stunning designs that enhance user experience and brand value.<br><br>

• <b>Security Audits</b><br>
  • Smart contract audits<br>
  • Platform penetration testing<br>
  • Risk assessment & vulnerability analysis<br>
  • Compliance readiness<br><br>

<b>Why Choose Adayrise?</b><br>
• Top-tier engineering and creative team<br>
• End-to-end development—from idea to deployment<br>
• Budget-friendly without sacrificing quality<br>
• Transparent communication and agile workflow<br>
• Proven track record across global clients<br><br>

<b>Leadership Team</b><br>
• Founder — Ayoub Swaze<br>
• Partner & CTO — Amresh Kumar Roy<br>
• Product Manager — Vikash Shukla<br><br>

<b>Core Strengths</b><br>
• Highly professional top-level team<br>
• Fast turnaround time<br>
• Reliability and transparency<br>
• Dedicated post-launch support<br>
• Strong understanding of global markets<br><br>

<b>Highlighted Projects</b><br>
for a tag us ul and li
 <a href="https://xsquad.fun" target="_blank" rel="noopener noreferrer">xsquad.fun</a><br>
 <a href="https://weso.io" target="_blank" rel="noopener noreferrer">weso.io</a><br>
 <a href="https://pashx.com" target="_blank" rel="noopener noreferrer">pashx.com</a><br>
 <a href="https://ultrashilajit.com" target="_blank" rel="noopener noreferrer">ultrashilajit.com</a><br><br>

<b>Get in Touch</b><br>
Interested in working with Adayrise? We help you turn your idea into a polished, scalable, and market-ready product.<br>
Let’s build something extraordinary together.<br><br>

<b>STRICT BOUNDARY RULES — APPLY TO THE ASSISTANT</b><br>
1) Only use the information provided above to answer user questions. Do not add, invent, or infer facts beyond this profile.<br>
2) If asked about topics outside Adayrise (market data, competitor specifics, general blockchain news, etc.), respond exactly: <b>"I can only answer questions about Adayrise based on the provided company profile."</b><br>
3) Do not browse external sources or introduce up-to-date facts unless explicitly given in the prompt.<br>
4) If the user requests opinionated strategy outside the stated profile, limit suggestions to what is reasonable from the provided profile and clearly label them as <b>inferred suggestions</b> (kept very short).<br><br>

<b>OUTPUT FORMAT RULES — MUST BE FOLLOWED</b><br>
• Use clean and readable sentence structure.<br>
• Highlight key words using <b>bold</b> only.<br>
• Use <br> for line breaks (2–3 lines max per section).<br>
• Use simple bullet points: <br>  • point one <br>  • point two<br>
• For steps, use numbered format: <br>  1) step one <br>  2) step two<br>
• Do NOT use headings like <h1>, <h2>, etc.<br>
• Do NOT use tables.<br>
• Keep paragraphs short and premium-looking.<br>
• Maintain a professional, minimal, ChatGPT-style tone.<br>
• Avoid emojis unless necessary.<br>
• No inline CSS or HTML except <b>, <br>, and <a> for links.<br>
• Avoid long blocks of text by adding breaks between ideas.<br><br>

<b>CONCISE RESPONSE RULE (NEW)</b><br>
• Always keep replies extremely short — main answer only (prefer 1–2 short lines or 1–2 bullet points).<br>
• If more detail is requested, ask for permission before expanding.<br><br>

Use the profile above as the single authoritative source for answers. Always follow the boundary and output format rules.

 ` }]
      }]
    })
  });

  const data = await response.json();
  if(!data.candidates[0].content.parts[0].text) return;
  const fData = data.candidates[0].content.parts[0].text;
  

 setAiResponse(fData);

  return;
  } catch (error) {
    console.log(error)
    return;
  }
}

useEffect(()=>{
  
   insertDataInChat(aiResposne,"aiResposne",chatRef)
    setWaiting(false);
   setScrollToBottom(!scrollToBottom)
},[aiResposne])






useEffect(()=>{
  chatRef.current.scrollTo({
  top: chatRef.current.scrollHeight,
  behavior: "smooth"
});

},[scrollToBottom])



useEffect(()=>{
  if(waiting=== false) inputRef.current.focus();
},[waiting])








const insertDataInChat  = (chats , dataFrom , chatRef) => {
  if (!chatRef || !chatRef.current) return false;
if(chats.length <=0) return false;
const allowed = new Set(["userQ","aiResposne"])
if(!allowed.has(dataFrom)) return false;
  const div = document.createElement("div");
  div.className = dataFrom;

  const p = document.createElement("p");
p.innerHTML = chats;   // ← tags will render

div.appendChild(p);
chatRef.current.appendChild(div);
  return true;
}



const userPromptHandel = (data ,chatRef) =>{
if(data.length <= 0) return;
const insertDataCheck = insertDataInChat(data , "userQ" , chatRef);
if(!insertDataCheck) return;
askGemini(data , chatRef);
setUserPrompt("");
return;
}









  const icons = [
    {
      id: "minimize",
      svg: (
        <svg
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
          fill="#ffffff"
          style={{ width: "18px", height: "18px" }}
        >
          <path d="M14 8v1H3V8h11z" />
        </svg>
      ),
    },
    {
      id: "maxsize",
      svg: (
        <svg
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          style={{ width: "18px", height: "18px" }}
        >
          <path
            fill="#ffffff"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1 3.25A2.25 2.25 0 013.25 1h2.047a.75.75 0 010 1.5H3.25a.75.75 0 00-.75.75v2.047a.75.75 0 01-1.5 0V3.25zm8.953-1.5a.75.75 0 01.75-.75h2.047A2.25 2.25 0 0115 3.25v2.047a.75.75 0 01-1.5 0V3.25a.75.75 0 00-.75-.75h-2.047a.75.75 0 01-.75-.75zM1.75 9.953a.75.75 0 01.75.75v2.047c0 .414.336.75.75.75h2.047a.75.75 0 010 1.5H3.25A2.25 2.25 0 011 12.75v-2.047a.75.75 0 01.75-.75zm12.5 0a.75.75 0 01.75.75v2.047A2.25 2.25 0 0112.75 15h-2.047a.75.75 0 010-1.5h2.047a.75.75 0 00.75-.75v-2.047a.75.75 0 01.75-.75z"
          />
        </svg>
      ),
    },
    {
      id: "closeTab",
      svg: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: "18px", height: "18px" }}
        >
          <path
            d="M18 18L12 12M12 12L6 6M12 12L18 6M12 12L6 18"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  // central click handler for icon clicks
  const handleIconClick = (id) => {
    if (id === "minimize") {
      setMinimize(true)
    } else if ( id === "closeTab") {
      setBotTab(true); // close/minimize
    }
    else{
      setMinimize(false)
    }
  };

  return (
    <>
      {/* Toggle container - clicking toggles the botTab */}
      <div
        style={
          !botTab
            ? {
                top: "22%",
                right: "11%",
                width: "15rem",
                background: "rgba(222, 222, 248, 0.47)",
                border: "2px solid rgba(255, 255, 255, 0.21)",
              }
            : {}
        }
        className="botActiveButton"
        onClick={() => setBotTab((prev) => !prev)} // toggle
      >
        {icons.map((item, index) => {
          return (
            <div
              key={item.id}
              id={item.id}
              onClick={(e) => {
                // prevent parent toggle when clicking icon
                e.stopPropagation();
                handleIconClick(item.id);
              }}
              style={
                !botTab
                  ? {
                      animation:
                        "iconView 1s cubic-bezier(0.65, 0, 0.35, 1) forwards",
                      animationDelay: `${0.15 * index}s`,
                    } 
                  : { marginTop: "150%", animation: "none", opacity: 0 }
                  
              }
              className="tabTools"
            >
              {item.svg}
            </div>
          );
        })}
      </div>

      <div
        style={{
          transform: botTab
            ? "translateY(120%) translateX(-50%)"
            : "translateY(0) translateX(-50%)",
          backgroundPosition: botTab ? "0% 50%" : "200% 100%",
          left:minimize ? "84%" : "50%",
          width:minimize ? "28%" : "80%"
        }}
        className="mainAiChatBox"
      >
        <div className="liquidGlass-effect"></div>
        <div className="liquidGlass-tint"></div>
        <div className="liquidGlass-shine" id="liquidGlass-shine-border"></div>

        <div className="aiContentDiv">
          <div ref={chatRef} className="mainChatDataParent">
        

          </div>
          <div className="promptBoxParent">
            <div className="promptBox">
<input
ref={inputRef}
  disabled={waiting}
  onChange={(e) => setUserPrompt(e.target.value)}
  value={userPrompt}
  type="text"
  placeholder={waiting ? "Typing..." : "Ask anything"}
  onKeyDown={(e) => {
    if (e.key === "Enter" && !waiting) {
      askGemini();
      userPromptHandel(userPrompt, chatRef);
      setScrollToBottom((prev) => !prev);
    }
  }}
/>
              <div disabled={waiting?true:false} onClick={() => {askGemini(); userPromptHandel(userPrompt , chatRef); setScrollToBottom(!scrollToBottom)}} className="sendButton">
                {
                  waiting ?<img src={aiLoading} alt="" srcset="" /> 
                  :<svg
  width="44"
  height="32"
  viewBox="0 0 24 24"
  xmlns="http://www.w3.org/2000/svg"
  id="send"
  className="icon glyph"
>
  <path
    d="M21.66,12a2,2,0,0,1-1.14,1.81L5.87,20.75A2.08,2.08,0,0,1,5,21a2,2,0,0,1-1.82-2.82L5.46,13H11a1,1,0,0,0,0-2H5.46L3.18,5.87A2,2,0,0,1,5.86,3.25h0l14.65,6.94A2,2,0,0,1,21.66,12Z"
    style={{ fill: "#ffffffff" }}
  />
</svg>
                }
{/* <img src={aiLoading} alt="" srcset="" /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
