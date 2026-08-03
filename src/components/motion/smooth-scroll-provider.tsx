"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Lenis owns scroll interpolation and nothing else. It drives the GSAP ticker so
 * ScrollTrigger stays in step, and it is never constructed when the visitor asks
 * for reduced motion.
 */
export function SmoothScrollProvider() {
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (query.matches) return;

    const lenis = new Lenis({
      duration: 0.9,
      lerp: 0.12,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
      // Native scrolling on touch keeps input response immediate.
      syncTouch: false,
      anchors: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const refresh = () => ScrollTrigger.refresh();
    if (document.fonts?.ready) void document.fonts.ready.then(refresh);
    window.addEventListener("load", refresh);

    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      window.removeEventListener("load", refresh);
      lenis.destroy();
    };
  }, []);

  return null;
}
