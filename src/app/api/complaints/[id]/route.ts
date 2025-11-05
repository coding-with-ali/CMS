


import { NextResponse } from 'next/server'
import { sanityClient } from '@/sanity/lib/sanity'

export async function GET(request: Request, { params }: any) {
  const id = params.id
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  // Fetch complaint with comments fully populated
  const q = `*[_type=="complaint" && _id==$id][0]{
    _id,
    complaintNo,
    title,
    description,
    reporterName,
    reporterContact,
    authorizedName,
    department->{name},
    priority,
    status,
    fieldType,
    dateTime,
    comments[]->{_id, text, authorName, createdAt}
  }`
  const data = await sanityClient.fetch(q, { id })
  return NextResponse.json(data)
}

export async function PATCH(request: Request, { params }: any) {
  const id = params.id
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const body = await request.json()

  try {
    const patchData: any = { updatedAt: new Date().toISOString() }

    if (body.status) patchData.status = body.status
    if (body.assignedTo) patchData.assignedTo = body.assignedTo

    // Update complaint fields
    if (Object.keys(patchData).length > 0) {
      await sanityClient.patch(id).set(patchData).commit()
    }

    // Add comment
    if (body.comment) {
      const commentDoc = {
        _type: 'comment',
        text: body.comment.text,
        authorName: body.comment.authorName,
        createdAt: body.comment.createdAt || new Date().toISOString(),
      }

      // Create comment in Sanity
      const createdComment = await sanityClient.create(commentDoc)

      // Append reference to complaint
      await sanityClient
        .patch(id)
        .append('comments', [{ _type: 'reference', _ref: createdComment._id }])
        .commit()
    }

    // Append history
    if (body.historyEntry) {
      await sanityClient
        .patch(id)
        .append('history', [body.historyEntry])
        .commit()
    }

    // Audit log
    await sanityClient.create({
      _type: 'audit',
      action: body.comment ? 'comment_added' : 'complaint_updated',
      actor: body.actor || 'system',
      timestamp: new Date().toISOString(),
      meta: { id, changes: body },
    })

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('PATCH error:', err)
    return NextResponse.json({ error: 'Failed to update complaint' }, { status: 500 })
  }
}
