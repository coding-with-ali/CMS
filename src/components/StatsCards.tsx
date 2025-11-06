

'use client'

import { useEffect, useState } from 'react'
import ComplaintCard from '@/components/ComplaintCard'
import { client } from '@/sanity/lib/client'
import { Search, Calendar, RefreshCcw } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

interface Stats {
  new: number
  inProgress: number
  completed: number
  critical: number
  high: number
  medium: number
  low: number
}

export default function ComplaintsDashboard() {
  const [complaints, setComplaints] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<Stats | null>(null)

  // ✅ Fetch complaints list
  useEffect(() => {
    async function fetchComplaints() {
      setLoading(true)
      try {
        const data = await client.fetch(`
          *[_type=="complaint"] | order(dateTime desc)[0..500]{
            _id,
            complaintNo,
            title,
            reporterName,
            authorizedName,
            department->{name},
            field,
            priority,
            status,
            dateTime
          }
        `)
        setComplaints(data)
        setFiltered(data)
      } catch (error) {
        console.error('Error fetching complaints:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchComplaints()
  }, [])

  // ✅ Fetch statistics for chart and counters
  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/complaints/status')
        const data = await res.json()

        // ✅ Normalize keys
        const normalized = {
          new: data.new ?? data.open ?? 0, // prefer 'new'
          inProgress: data.inProgress ?? 0,
          completed: data.completed ?? 0,
          critical: data.critical ?? 0,
          high: data.high ?? 0,
          medium: data.medium ?? 0,
          low: data.low ?? 0,
        }
        setStats(normalized)
      } catch (err) {
        console.error('Error loading stats:', err)
      }
    }
    fetchStats()
  }, [])

  // ✅ Normalize status
  const normalizeStatus = (status: string) => {
    if (!status) return ''
    const s = status.toLowerCase()
    if (s.includes('progress')) return 'in progress'
    if (s.includes('complete') || s.includes('resolved')) return 'completed'
    if (s.includes('new') || s.includes('open') || s.includes('pending')) return 'new'
    return s
  }

  // 🔍 Filtering logic
  useEffect(() => {
    let temp = complaints

    if (selectedDate) {
      const dateOnly = selectedDate
      temp = temp.filter((c) => {
        const cDate = new Date(c.dateTime).toISOString().split('T')[0]
        return cDate === dateOnly
      })
    }

    if (search) {
      const s = search.toLowerCase()
      temp = temp.filter((c) => c.complaintNo?.toString().toLowerCase().includes(s))
    }

    if (selectedStatus) {
      temp = temp.filter((c) => normalizeStatus(c.status) === selectedStatus)
    }

    setFiltered(temp)
  }, [search, selectedDate, complaints, selectedStatus])

  const resetFilters = () => {
    setSearch('')
    setSelectedDate('')
    setSelectedStatus('')
    setFiltered(complaints)
  }

  const handleStatusClick = (status: string) => {
    setSelectedStatus((prev) => (prev === status ? '' : status))
  }

  // === Derived Counts ===
  const totalNew = complaints.filter((c) => normalizeStatus(c.status) === 'new').length
  const totalProgress = complaints.filter((c) => normalizeStatus(c.status) === 'in progress').length
  const totalComplete = complaints.filter((c) => normalizeStatus(c.status) === 'completed').length
  const totalComplaints = complaints.length

  // === Chart Data ===
  const statusData = [
    { name: 'New', value: stats?.new ?? totalNew },
    { name: 'In Progress', value: stats?.inProgress ?? totalProgress },
    { name: 'Completed', value: stats?.completed ?? totalComplete },
  ]

  const priorityData = stats
    ? [
        { name: 'Critical', value: stats.critical, color: '#EF4444' },
        { name: 'High', value: stats.high, color: '#F97316' },
        { name: 'Medium', value: stats.medium, color: '#FACC15' },
        { name: 'Low', value: stats.low, color: '#10B981' },
      ]
    : []

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen space-y-8">
  
      {/* === Status Boxes === */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        {/* 🟥 New Complaints */}
        <div
          onClick={() => handleStatusClick('new')}
          className={`cursor-pointer rounded-xl shadow-md p-4 text-center font-semibold transition transform hover:scale-[1.02] ${
            selectedStatus === 'new'
              ? 'bg-red-600 text-white ring-2 ring-red-400'
              : 'bg-white text-red-600 hover:bg-red-100'
          }`}
        >
          <h2 className="text-lg">New Complaints</h2>
          <p className="text-2xl mt-2">{totalNew}</p>
        </div>

        {/* 🟨 In Progress */}
        <div
          onClick={() => handleStatusClick('in progress')}
          className={`cursor-pointer rounded-xl shadow-md p-4 text-center font-semibold transition transform hover:scale-[1.02] ${
            selectedStatus === 'in progress'
              ? 'bg-yellow-500 text-white ring-2 ring-yellow-300'
              : 'bg-white text-yellow-600 hover:bg-yellow-100'
          }`}
        >
          <h2 className="text-lg">In Progress</h2>
          <p className="text-2xl mt-2">{totalProgress}</p>
        </div>

        {/* 🟩 Completed */}
        <div
          onClick={() => handleStatusClick('completed')}
          className={`cursor-pointer rounded-xl shadow-md p-4 text-center font-semibold transition transform hover:scale-[1.02] ${
            selectedStatus === 'completed'
              ? 'bg-green-600 text-white ring-2 ring-green-400'
              : 'bg-white text-green-600 hover:bg-green-100'
          }`}
        >
          <h2 className="text-lg">Completed</h2>
          <p className="text-2xl mt-2">{totalComplete}</p>
        </div>

        {/* ⚙️ Total Complaints */}
        <div className="rounded-xl shadow-md p-4 text-center font-semibold bg-white text-blue-700 hover:bg-blue-100 transition transform hover:scale-[1.02]">
          <h2 className="text-lg">Total Complaints</h2>
          <p className="text-2xl mt-2">{totalComplaints}</p>
        </div>
      </div>

      {/* === Chart Section === */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {/* Bar Chart */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Complaints Status Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#3B82F6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Complaint Priority Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name} (${value})`}
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}
