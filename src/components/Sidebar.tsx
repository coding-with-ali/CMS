'use client'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white p-4 border-r">
      <div className="mb-6">
        <h2 className="text-lg font-bold">MMC — Maintenance</h2>
      </div>
      <nav className="space-y-2">
        <Link href="/dashboard" className="block p-2 rounded hover:bg-gray-100">Overview</Link>
        <Link href="/dashboard/complaints" className="block p-2 rounded hover:bg-gray-100">Complaints</Link>
        <Link href="/dashboard/reports" className="block p-2 rounded hover:bg-gray-100">Reports</Link>
        <Link href="/admin/departments" className="block p-2 rounded hover:bg-gray-100">Departments</Link>
      </nav>
      <div className="mt-6">
        <button onClick={()=>signOut({ callbackUrl: '/login' })} className="text-sm text-red-600">Logout</button>
      </div>
    </aside>
  )
}


