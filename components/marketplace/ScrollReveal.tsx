"use client";

import { useEffect } from "react";

const revealTypes = ["up", "left", "right", "fade", "scale", "down"] as const;
const revealSelector = [
  "section",
  "article",
  "aside",
  "figure",
  "form",
  "img",
  "h1",
  "h2",
  "h3",
  "p",
  "ul",
  "ol",
  "li",
  "table",
  "tbody",
  "[class*='grid'] > *",
  "[class*='space-y'] > *",
  "[class*='flex'] > *",
  "a.rounded-lg",
  "div.rounded-lg",
  "span.rounded-full",
  "[data-reveal-item]",
].join(",");

function isRevealCandidate(element: HTMLElement) {
  if (element.dataset.revealReady === "true") return false;
  if (element.closest("[data-no-reveal]")) return false;
  if (element.matches("input, select, textarea, button, label, option")) return false;
  if (element.closest("svg")) return false;

  const rect = element.getBoundingClientRect();
  if (rect.width < 24 || rect.height < 14) return false;

  return true;
}

export default function ScrollReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll<HTMLVideoElement>("video[autoplay]").forEach((video) => {
        video.pause();
        video.removeAttribute("autoplay");
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            target.classList.add("is-revealed");
            observer.unobserve(target);
          }
        });
      },
      { threshold: 0 },
    );

    const prepareElement = (element: HTMLElement, index: number) => {
      if (!element.dataset.reveal) {
        const tagName = element.tagName.toLowerCase();
        if (tagName === "h1" || tagName === "h2") {
          element.dataset.reveal = "up";
        } else if (tagName === "img" || tagName === "figure") {
          element.dataset.reveal = index % 2 === 0 ? "scale" : "fade";
        } else if (tagName === "form" || tagName === "table") {
          element.dataset.reveal = "scale";
        } else if (tagName === "aside") {
          element.dataset.reveal = "right";
        } else {
          element.dataset.reveal = revealTypes[index % revealTypes.length];
        }
      }

      if (!element.style.getPropertyValue("--reveal-delay")) {
        const siblingIndex = Array.from(element.parentElement?.children ?? []).indexOf(element);
        const staggerIndex = siblingIndex >= 0 ? siblingIndex : index;
        element.style.setProperty("--reveal-delay", `${Math.min(staggerIndex % 6, 5) * 70}ms`);
      }

      element.dataset.revealReady = "true";
      observer.observe(element);
    };

    const scan = () => {
      const candidates = Array.from(document.querySelectorAll<HTMLElement>(revealSelector)).filter(isRevealCandidate);
      candidates.forEach(prepareElement);
    };

    document.documentElement.classList.add("reveal-ready");
    scan();

    const mutationObserver = new MutationObserver(() => {
      window.requestAnimationFrame(scan);
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutationObserver.disconnect();
      observer.disconnect();
      document.documentElement.classList.remove("reveal-ready");
    };
  }, []);

  return null;
}
