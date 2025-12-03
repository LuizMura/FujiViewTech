'use client'

import ImageCarousel from './ImageCarousel'
import ProductReview from './ProductReview'

export function Affiliate({ url, children }:{url:string, children:React.ReactNode}) {
  return <a href={url} target="_blank" rel="nofollow noopener noreferrer sponsored" className="inline-block px-3 py-1 border rounded">{children}</a>
}

export const components = { 
  a: (props:React.AnchorHTMLAttributes<HTMLAnchorElement>)=> <a {...props} className="text-accent underline"/>,
  ImageCarousel,
  ProductReview,
  Affiliate
}
