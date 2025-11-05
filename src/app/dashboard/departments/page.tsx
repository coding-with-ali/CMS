'use client'

import React, { useEffect, useState } from 'react'

export default function DepartmentsAdmin() {
  const [depts, setDepts] = useState<any[]>([])
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  // 🧠 Fetch departments
  async function fetchDepts() {
    try {
      setLoading(true)
      const res = await fetch('/api/departments')
      const data = await res.json()
      setDepts(data)
    } catch (err) {
      console.error('Error fetching departments:', err)
    } finally {
      setLoading(false)
    }
  }

  // ➕ Add new department
  async function addDept(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    await fetch('/api/departments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    setName('')
    fetchDepts()
  }

  useEffect(() => {
    fetchDepts()
  }, [])

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        🏢 Manage Departments
      </h2>

      {/* Add Department Form */}
      <form
        onSubmit={addDept}
        className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8"
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter department name"
          className="p-2 border border-gray-300 rounded-lg w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition"
        >
          Add Department
        </button>
      </form>

      {/* Department List */}
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-4">
        {loading ? (
          <p className="text-center text-gray-500">Loading departments...</p>
        ) : depts.length === 0 ? (
          <p className="text-center text-gray-400">No departments found.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {depts.map((d) => (
              <li
                key={d._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition"
              >
                <div>
                  <p className="font-medium text-gray-800">{d.name}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
