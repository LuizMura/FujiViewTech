"use client";
import { useEffect } from "react";

export default function AdSense({
  client,
  slot,
}: {
  client?: string;
  slot?: string;
}) {
  const adClient = client || process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "";

  useEffect(() => {
    if (!adClient || !slot) return;

    try {
      const w = window as unknown as { adsbygoogle: unknown[] };
      w.adsbygoogle = w.adsbygoogle || [];
      w.adsbygoogle.push({});
    } catch {
      // ignore
    }
  }, [adClient, slot]);

  if (!adClient || !slot) return null;

  return (
    <div style={{ display: "block", textAlign: "center", margin: "16px 0" }}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={adClient}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}
