import { useRef, useEffect, useState, useCallback } from "react";
import useInView from "./useInView";

export default function useTextSplitAnim(passedRef, options = {}) {
  const {
    stagger = 40,
    startDelay = 0,
    threshold = 0.5,
    autoPlay = true,
    initialOffset = "100%",
    useOpacity = true,
  } = options;

  const autoCreatedRef = useRef(null);
  const targetRef = passedRef || autoCreatedRef;

  const isInView = useInView(targetRef, threshold);
  const [animationPlayed, setAnimationPlayed] = useState(false);

  const timeoutIds = useRef([]);

  const wrapTextWithSpans = useCallback(() => {
    const targetNode = targetRef.current;
    if (!targetNode) return;

    if (targetNode.dataset.isSplit === "true") return;

    const serializeAttributes = (node) => {
      if (!node.attributes || node.attributes.length === 0) return "";
      const parts = [];
      for (let i = 0; i < node.attributes.length; i++) {
        const a = node.attributes[i];
        if (a.name === "data-is-split") continue;
        parts.push(`${a.name}="${a.value.replace(/"/g, "&quot;")}"`);
      }
      return parts.length ? " " + parts.join(" ") : "";
    };

    const processNode = (node) => {
      // ===== TEXT NODE =====
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent || "";

        return text
          .split(/(\s+)/)
          .map((part) => {
            // preserve spaces
            if (part.trim() === "") {
              return part.replace(/ /g, "&nbsp;");
            }

            // wrap WORD so it never breaks mid-word
            const chars = part
              .split("")
              .map(
                (ch) =>
                  `<span class="char">
                    <span class="innerChar" style="
                      display:inline-block;
                      transform: translateY(${initialOffset}) rotateZ(30deg);
                      filter: blur(4px);
                      ${useOpacity ? "opacity:0;" : ""}
                      transition: transform 400ms ease, filter 400ms ease${
                        useOpacity ? ", opacity 300ms ease" : ""
                      };
                    ">${ch}</span>
                  </span>`
              )
              .join("");

            return `<span class="word">${chars}</span>`;
          })
          .join("");
      }

      // ===== ELEMENT NODE =====
      if (node.nodeType === Node.ELEMENT_NODE) {
        const tag = node.tagName.toLowerCase();
        if (tag === "br") return "<br/>";

        const attrs = serializeAttributes(node);
        const children = Array.from(node.childNodes)
          .map(processNode)
          .join("");

        return `<${tag}${attrs}>${children}</${tag}>`;
      }

      return "";
    };

    const content = Array.from(targetNode.childNodes)
      .map(processNode)
      .join("");

    targetNode.innerHTML = content;
    targetNode.dataset.isSplit = "true";
  }, [targetRef, initialOffset, useOpacity]);

  useEffect(() => {
    if (!targetRef.current) return;
    wrapTextWithSpans();
  }, [wrapTextWithSpans]);

  const playAnimation = useCallback(() => {
    const targetNode = targetRef.current;
    if (!targetNode) return;

    const innerCharacters = Array.from(
      targetNode.querySelectorAll(".innerChar")
    );

    timeoutIds.current.forEach(clearTimeout);
    timeoutIds.current = [];

    innerCharacters.forEach((characterNode, index) => {
      const timerId = setTimeout(() => {
        characterNode.style.transform = "translateY(0%) rotateZ(0deg)";
        characterNode.style.filter = "blur(0px)";
        if (useOpacity) characterNode.style.opacity = "1";
      }, startDelay + index * stagger);

      timeoutIds.current.push(timerId);
    });

    setAnimationPlayed(true);
  }, [targetRef, stagger, startDelay, useOpacity]);

  const resetAnimation = useCallback(() => {
    const targetNode = targetRef.current;
    if (!targetNode) return;

    timeoutIds.current.forEach(clearTimeout);
    timeoutIds.current = [];

    const innerCharacters = Array.from(
      targetNode.querySelectorAll(".innerChar")
    );

    innerCharacters.forEach((characterNode) => {
      characterNode.style.transform = `translateY(${initialOffset}) rotateZ(30deg)`;
      characterNode.style.filter = "blur(4px)";
      if (useOpacity) characterNode.style.opacity = "0";
    });

    setAnimationPlayed(false);
  }, [targetRef, initialOffset, useOpacity]);

  useEffect(() => {
    if (!autoPlay) return;
    if (isInView && !animationPlayed) playAnimation();
  }, [isInView, animationPlayed, autoPlay, playAnimation]);

  useEffect(() => {
    return () => {
      timeoutIds.current.forEach(clearTimeout);
    };
  }, []);

  return {
    ref: targetRef,
    play: playAnimation,
    reset: resetAnimation,
    played: animationPlayed,
  };
}
