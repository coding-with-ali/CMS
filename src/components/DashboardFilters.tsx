'use client'
import React from 'react'

export default function DashboardFilters(){
  return (
    <div className="flex gap-3 mb-4">
      <input placeholder="Search title..." className="p-2 border rounded" />
      <select className="p-2 border rounded"><option>All Status</option><option>Open</option><option>In Progress</option><option>Completed</option></select>
      <select className="p-2 border rounded"><option>All Priority</option><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></select>
    </div>
  )
}
