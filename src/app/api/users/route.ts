import { NextResponse } from 'next/server'
import { sanityClient } from '@/sanity/lib/sanity'

export async function GET() {
  const q = `*[_type=="companyUser"]{_id, name, email, role}`
  const data = await sanityClient.fetch(q)
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const body = await request.json()
  const doc = { _type: 'companyUser', name: body.name, email: body.email, role: body.role }
  const created = await sanityClient.create(doc)
  await sanityClient.create({ _type: 'audit', action: 'user_created', actor: 'admin', timestamp: new Date().toISOString(), meta: { id: created._id } })
  return NextResponse.json(created)
}
