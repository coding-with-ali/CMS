import { NextResponse } from 'next/server'
import { sanityClient } from '@/sanity/lib/sanity'

export async function GET() {
  const q = `
    *[_type=="complaint"]{
      _id,
      title,
      status,
      priority,
      dateTime,
      department->{name}
    }
  `
  const data = await sanityClient.fetch(q)
  return NextResponse.json(data)
}
