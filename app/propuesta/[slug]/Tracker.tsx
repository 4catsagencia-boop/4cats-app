"use client";

import { useEffect, useRef } from "react";

export default function Tracker({ id }: { id: string }) {
  const accesoIdRef = useRef<string | null>(null);
  const startRef = useRef<number>(Date.now());
  const ctaClickedRef = useRef<boolean>(false);

  useEffect(() => {
    const dispositivo = window.innerWidth < 768 ? 'mobile' : 'desktop';

    fetch('/api/propuesta/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ propuesta_id: id, dispositivo }),
    })
      .then(r => r.json())
      .then(data => { accesoIdRef.current = data.acceso_id ?? null; })
      .catch(() => {});

    const handleCTAClick = () => { ctaClickedRef.current = true; };
    window.addEventListener('cta-propuesta-click', handleCTAClick);

    const sendExit = () => {
      if (!accesoIdRef.current) return;
      const tiempo_permanencia = Math.round((Date.now() - startRef.current) / 1000);
      navigator.sendBeacon(
        '/api/propuesta/track',
        JSON.stringify({
          acceso_id: accesoIdRef.current,
          tiempo_permanencia,
          cta_click: ctaClickedRef.current,
        })
      );
    };

    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') sendExit();
    };

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('cta-propuesta-click', handleCTAClick);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [id]);

  return null;
}
