"use client";

import { useEffect } from "react";

export default function Tracker({ id }: { id: string }) {
  useEffect(() => {
    const trackView = async () => {
      try {
        await fetch('/api/propuesta/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ propuesta_id: id }),
        });
      } catch (error) {
        console.error('Error tracking view:', error);
      }
    };

    trackView();
  }, [id]);

  return null;
}
