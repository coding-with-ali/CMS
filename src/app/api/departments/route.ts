import { NextResponse } from 'next/server'
import { sanityClient } from '@/sanity/lib/sanity'

export async function GET() {
  const q = `*[_type=='department']{_id, name, code, description}`
  const data = await sanityClient.fetch(q)
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const body = await request.json()
  const doc = { _type: 'department', name: body.name, code: body.code || '', description: body.description || '' }
  const created = await sanityClient.create(doc)
  await sanityClient.create({ _type: 'audit', action: 'department_created', actor: body.actor || 'admin', timestamp: new Date().toISOString(), meta: { id: created._id } })
  return NextResponse.json(created)
}
