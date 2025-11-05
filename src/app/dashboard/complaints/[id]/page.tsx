

'use client'

import { urlFor } from "@/sanity/lib/image";
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { client } from '@/sanity/lib/client'
import dynamic from 'next/dynamic'
import { MessageCircle, Clock, User, Phone, FileText, Tag, CheckCircle } from 'lucide-react'

// Dynamic imports
// const CommentBox = dynamic(() => import('@/components/CommentBox'), { ssr: false })
const WorkActions = dynamic(() => import('@/components/WorkActions'), { ssr: false })

export default function ComplaintDetail() {
  const { id } = useParams()
  const [complaint, setComplaint] = useState<any>(null)
  const [refresh, setRefresh] = useState(false)

  async function fetchComplaint() {
    if (!id) return
    const data = await client.fetch(
      `*[_type=="complaint" && _id==$id][0]{
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
        attachments[]{asset->{_id, url}},
        fieldType,
        dateTime,
        comments[]->{_id, text, authorName, createdAt}
      }`,
      { id }
    )
    setComplaint(data)
  }

  useEffect(() => {
    fetchComplaint()
  }, [id, refresh])

  if (!complaint)
    return <div className="p-10 text-center text-gray-500">Loading complaint details...</div>

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-xl rounded-2xl mt-6 space-y-8 border border-gray-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900">{complaint.title}</h1>
        <span className="mt-2 sm:mt-0 text-sm bg-blue-100 text-blue-700 px-4 py-1 rounded-full font-medium">
          #{complaint.complaintNo}
        </span>
      </div>

      {/* Info Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
        <p className="flex items-center gap-2">
          <User size={18} className="text-gray-500"/> Reporter: <span className="font-medium">{complaint.reporterName}</span>
        </p>
        <p className="flex items-center gap-2">
          <Phone size={18} className="text-gray-500"/> Contact: <span className="font-medium">{complaint.reporterContact}</span>
        </p>
        <p className="flex items-center gap-2">
          <Tag size={18} className="text-gray-500"/> Department: <span className="font-medium">{complaint.department?.name ?? 'N/A'}</span>
        </p>
        <p className="flex items-center gap-2">
          <CheckCircle size={18} className="text-gray-500"/> Status: <span className="font-medium">{complaint.status}</span>
        </p>
        <p className="flex items-center gap-2">
          <Clock size={18} className="text-gray-500"/> Date: <span className="font-medium">{complaint.dateTime ? new Date(complaint.dateTime).toLocaleString() : 'N/A'}</span>
        </p>
        <p className="flex items-center gap-2">
          <Tag size={18} className="text-gray-500"/> Priority: <span className="font-medium">{complaint.priority}</span>
        </p>
        <p className="flex items-center gap-2">
          <FileText size={18} className="text-gray-500"/> Field: <span className="font-medium">{complaint.fieldType}</span>
        </p>
        <p className="flex items-center gap-2">
          <User size={18} className="text-gray-500"/> Authorized By: <span className="font-medium">{complaint.authorizedName ?? 'N/A'}</span>
        </p>
      </div>

      {/* Description */}
      <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <FileText size={20}/> Complaint Description
        </h3>
        <p className="text-gray-700 whitespace-pre-wrap">{complaint.description}</p>
      </div>

      {/* Work Actions */}
      <div className="border-t pt-4">
        <WorkActions id={id as string} onChange={() => setRefresh(!refresh)} />
      </div>


        {/* Attachments */}
{complaint.attachments && complaint.attachments.length > 0 && (
  <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
    <h3 className="font-semibold text-gray-800 mb-3">Attached Images</h3>
    <div className="flex flex-wrap gap-3">
      {complaint.attachments.map((img: any, i: number) => (
        <img
          key={i}
          src={urlFor(img).width(900).height(900).url()}
          alt={`attachment-${i}`}
          className="w-[400px] h-auto object-cover rounded-lg border"
        />
      ))}
    </div>
  </div>
)}


      
    </div>
  )
}
