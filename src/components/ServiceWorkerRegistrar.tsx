"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => console.log("[JobPing] SW registered:", reg.scope))
        .catch((err) => console.warn("[JobPing] SW registration failed:", err));
    }
  }, []);

  return null;
}
