'use client'

import React, { useEffect, useState } from 'react'
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
  open: number
  inProgress: number
  completed: number
  critical: number
  high: number
  medium: number
  low: number
}

export default function StatsCards() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 🧠 Fetch stats from API
  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/complaints/status')
        if (!res.ok) throw new Error('Failed to fetch stats')
        const data = await res.json()
        setStats(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) return <div className="text-center py-6">Loading stats...</div>
  if (error || !stats)
    return (
      <div className="text-center py-6 text-red-500">
        Error loading stats: {error}
      </div>
    )

  // Chart Data 1: Complaint Status
  const statusData = [
    { name: 'Open', value: stats.open },
    { name: 'In Progress', value: stats.inProgress },
    { name: 'Completed', value: stats.completed },
  ]

  // Chart Data 2: Priority Levels
  const priorityLevels = {
    critical: stats.critical,
    high: stats.high,
    medium: stats.medium,
    low: stats.low,
  }

  const totalPriorities =
    priorityLevels.critical +
    priorityLevels.high +
    priorityLevels.medium +
    priorityLevels.low

  const safeTotal = totalPriorities || 1 // Prevent divide by zero

  const priorityData = [
    {
      name: 'Critical',
      value: Number(((priorityLevels.critical / safeTotal) * 100).toFixed(1)),
      color: '#EF4444',
    },
    {
      name: 'High',
      value: Number(((priorityLevels.high / safeTotal) * 100).toFixed(1)),
      color: '#F97316',
    },
    {
      name: 'Medium',
      value: Number(((priorityLevels.medium / safeTotal) * 100).toFixed(1)),
      color: '#FACC15',
    },
    {
      name: 'Low',
      value: Number(((priorityLevels.low / safeTotal) * 100).toFixed(1)),
      color: '#10B981',
    },
  ]

  return (
    <div className="space-y-6">
      {/* === Stats Cards === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-xl shadow-md hover:shadow-lg transition">
          <div className="text-sm text-gray-500">Open</div>
          <div className="text-3xl font-bold text-gray-800 mt-1">{stats.open}</div>
        </div>

        <div className="p-5 bg-white rounded-xl shadow-md hover:shadow-lg transition">
          <div className="text-sm text-gray-500">In Progress</div>
          <div className="text-3xl font-bold text-gray-800 mt-1">
            {stats.inProgress}
          </div>
        </div>

        <div className="p-5 bg-white rounded-xl shadow-md hover:shadow-lg transition">
          <div className="text-sm text-gray-500">Completed</div>
          <div className="text-3xl font-bold text-gray-800 mt-1">
            {stats.completed}
          </div>
        </div>

        <div className="p-5 bg-white rounded-xl shadow-md hover:shadow-lg transition">
          <div className="text-sm text-gray-500">Total Complaints</div>
          <div className="text-3xl font-bold text-gray-800 mt-1">
            {totalPriorities}
          </div>
        </div>
      </div>

      {/* === Charts Section === */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Complaints Status Overview
          </h3>
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
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Complaint Priority Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={priorityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${name} ${value}%`}
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
    </div>
  )
}
