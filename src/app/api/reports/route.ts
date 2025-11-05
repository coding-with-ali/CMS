import { NextResponse } from 'next/server'
import { sanityClient } from '@/sanity/lib/sanity'

export async function GET() {
  const q = `*[_type=="complaint"]{_id, title, status, priority, createdAt, department->{name}}`
  const data = await sanityClient.fetch(q)
  // Could aggregate here and return CSV or JSON
  return NextResponse.json(data)
}
