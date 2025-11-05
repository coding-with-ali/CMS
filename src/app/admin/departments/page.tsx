'use client'
import React, { useEffect, useState } from 'react'

export default function DepartmentsAdmin() {
  const [depts, setDepts] = useState<any[]>([])
  const [name, setName] = useState('')

  async function fetchDepts() {
    const res = await fetch('/api/departments')
    const data = await res.json()
    setDepts(data)
  }

  async function addDept(e: any) {
    e.preventDefault()
    await fetch('/api/departments', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ name }) })
    setName('')
    fetchDepts()
  }

  useEffect(()=>{ fetchDepts() }, [])

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-3">Manage Departments</h2>
      <form onSubmit={addDept} className="mb-4">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Department name" className="p-2 border rounded mr-2" />
        <button className="px-3 py-1 bg-sky-600 text-white rounded">Add</button>
      </form>
      <ul>
        {depts.map(d=> <li key={d._id} className="p-2 border rounded mb-2">{d.name} ({d.code || '-'})</li>)}
      </ul>
    </div>
  )
}
