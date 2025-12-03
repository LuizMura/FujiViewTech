'use client'
import { useEffect } from 'react'

export default function AdSense({ client = 'ca-pub-XXXXXXXXXXXX', slot }: { client?: string, slot?: string }) {
  useEffect(() => {
    try {
      const w = window as unknown as { adsbygoogle: unknown[] };
      w.adsbygoogle = w.adsbygoogle || []
      w.adsbygoogle.push({})
    } catch {
      // ignore
    }
  }, [])
  return (
    <div style={{display:'block', textAlign:'center', margin:'16px 0'}}>
      {/* Replace data-ad-client with your ca-pub id */}
      <ins className="adsbygoogle"
        style={{display:'block'}}
        data-ad-client={client}
        data-ad-slot={slot || '0000000'}
        data-ad-format="auto"
        data-full-width-responsive="true"></ins>
    </div>
  )
}
