'use client'
import React, { useEffect, useState } from 'react'

export default function UsersAdmin() {
  const [users, setUsers] = useState<any[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('maintenance')

  useEffect(()=>{ fetchUsers() }, [])

  async function fetchUsers() {
    const res = await fetch('/api/users')
    setUsers(await res.json())
  }

  async function addUser(e:any) {
    e.preventDefault()
    await fetch('/api/users', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ name, email, role }) })
    setName(''); setEmail(''); setRole('maintenance')
    fetchUsers()
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-3">Users</h2>
      <form onSubmit={addUser} className="mb-4 flex gap-2">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" className="p-2 border rounded" />
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="p-2 border rounded" />
        <select value={role} onChange={e=>setRole(e.target.value)} className="p-2 border rounded">
          <option value="maintenance">Maintenance</option>
          <option value="admin">Admin</option>
        </select>
        <button className="px-3 py-1 bg-sky-600 text-white rounded">Add</button>
      </form>
      <ul>
        {users.map(u=> <li key={u._id} className="p-2 border rounded mb-2">{u.name} — {u.email} ({u.role})</li>)}
      </ul>
    </div>
  )
}
