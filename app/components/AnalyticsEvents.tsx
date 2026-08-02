"use client";

import { useEffect, useRef } from "react";
import { track } from "@vercel/analytics/react";

type EventName = "home_view" | "primary_cta_click" | "case_study_view" | "audit_started" | "audit_submitted";

export function getTrackingContext() {
  if (typeof window === "undefined") {
    return {
      landing_page: "",
      referrer: "",
      utm_source: "",
      utm_medium: "",
      utm_campaign: "",
    };
  }

  const params = new URLSearchParams(window.location.search);
  return {
    landing_page: window.location.pathname,
    referrer: document.referrer || "",
    utm_source: params.get("utm_source") || "",
    utm_medium: params.get("utm_medium") || "",
    utm_campaign: params.get("utm_campaign") || "",
  };
}

export function trackFunnelEvent(name: EventName, properties: Record<string, string | boolean | number> = {}) {
  track(name, {
    ...getTrackingContext(),
    ...properties,
  });
}

export function PageViewEvent({ name, properties = {} }: { name: EventName; properties?: Record<string, string | boolean | number> }) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    trackFunnelEvent(name, properties);
  }, [name, properties]);

  return null;
}
