import { NextResponse } from 'next/server'
export async function GET(){
  const content = `User-agent: *
Sitemap: https://fujiviewtech.com/sitemap.xml
Allow: /`
  return new NextResponse(content, { headers: { 'Content-Type': 'text/plain' } })
}
