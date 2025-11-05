import { NextResponse } from 'next/server'
import { sanityClient } from '@/sanity/lib/sanity'


export async function POST(request: Request) {
  const body = await request.json()
  const { id, assignedTo, actor } = body
  await sanityClient.patch(id).set({ assignedTo, status: 'Assigned', updatedAt: new Date().toISOString() }).commit()
  await sanityClient.patch(id).append('history', [{ action: 'Assigned', by: actor || 'system', at: new Date().toISOString(), note: `Assigned to ${assignedTo}` }]).commit()
  await sanityClient.create({ _type: 'audit', action: 'assigned', actor: actor || 'system', timestamp: new Date().toISOString(), meta: { id, assignedTo } })
  
  return NextResponse.json({ ok: true })
}
