'use client'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(e: any) {
    e.preventDefault()
    setError('')
    const res = await signIn('credentials', { redirect: false, username, password })
    if ((res as any)?.error) setError('Invalid credentials')
    else router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-6 border rounded">
        <h2 className="text-xl font-semibold mb-4">Maintenance Login</h2>
        <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="Username" className="w-full p-3 border rounded mb-3" />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full p-3 border rounded mb-3" />
        <button className="w-full py-2 rounded bg-sky-600 text-white">Login</button>
        {error && <p className="mt-2 text-red-600">{error}</p>}
      </form>
    </div>
  )
}
