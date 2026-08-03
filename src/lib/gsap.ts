"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export const DUR = {
  fast: 0.14,
  control: 0.18,
  standard: 0.26,
  layout: 0.36,
  section: 0.52,
  cinematic: 0.76,
} as const;

export { gsap, ScrollTrigger, useGSAP };
