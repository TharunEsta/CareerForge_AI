"use client";

import { useEffect } from "react";
// @ts-ignore
import plausible from "plausible-tracker";

export default function AnalyticsWrapper() {
  useEffect(() => {
    const { trackPageview } = plausible({ domain: "careerforge.ai" });
    trackPageview();
    // @ts-ignore
    window.plausible = plausible;
  }, []);

  return null;
}
