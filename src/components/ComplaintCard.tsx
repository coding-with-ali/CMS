
'use client'
import Link from 'next/link'

export default function ComplaintCard({ complaint }: { complaint: any }) {
  return (
    <div className="p-4 bg-white border rounded flex justify-between items-start">
      <div>
        <h3 className="font-semibold">{complaint.title}</h3>
        <p className="text-sm text-gray-600">
          Complaint No: <strong>{complaint.complaintNo}</strong>
        </p>
        <p className="text-sm text-gray-600">
          {complaint.reporterName} — {complaint.department?.name}
        </p>
        <div className="mt-2 text-sm">
          Priority: <strong>{complaint.priority}</strong>
        </div>
      </div>
      <Link
        href={`/dashboard/complaints/${complaint._id}`}
        className="px-3 py-1 border rounded hover:bg-sky-100"
      >
        Open
      </Link>
    </div>
  )
}
