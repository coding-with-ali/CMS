

'use client'

import React, { useEffect, useState, useRef } from 'react'
import { client } from '@/sanity/lib/client'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export default function ReportsPage() {
  const [chartData, setChartData] = useState<any[]>([])
  const chartRef = useRef<HTMLDivElement>(null)

  // 📦 Fetch Monthly Complaint Summary
  useEffect(() => {
    async function fetchData() {
      const data = await client.fetch(`
        *[_type=="complaint"]{
          status,
          dateTime
        }
      `)

      // Group data by month
      const monthly: Record<string, { new: number; inProgress: number; completed: number }> = {}

      data.forEach((item: any) => {
        const date = new Date(item.dateTime)
        const month = date.toLocaleString('default', { month: 'short', year: 'numeric' })

        if (!monthly[month]) {
          monthly[month] = { new: 0, inProgress: 0, completed: 0 }
        }

        const s = item.status?.toLowerCase() || ''

        if (s.includes('new') || s.includes('open') || s.includes('pending'))
          monthly[month].new++
        else if (s.includes('progress')) monthly[month].inProgress++
        else if (s.includes('complete') || s.includes('resolved')) monthly[month].completed++
      })

      const formatted = Object.entries(monthly).map(([month, values]) => ({
        month,
        ...values,
      }))

      setChartData(formatted)
    }

    fetchData()
  }, [])

  // 📥 Download as PDF
  const handleDownloadPDF = async () => {
    if (!chartRef.current) return
    const canvas = await html2canvas(chartRef.current)
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('landscape')
    const imgProps = pdf.getImageProperties(imgData)
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
    pdf.save('Monthly_Complaints_Report.pdf')
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">📈 Monthly Complaint Report</h1>

      <div className="mb-4 flex justify-end">
        <button
          onClick={handleDownloadPDF}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Download PDF
        </button>
      </div>

      {/* 📊 Chart Section */}
      <div ref={chartRef} className="bg-white p-4 rounded-xl shadow-md">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="new" stroke="#ef4444" strokeWidth={3} name="New" />
            <Line
              type="monotone"
              dataKey="inProgress"
              stroke="#3b82f6"
              strokeWidth={3}
              name="In Progress"
            />
            <Line
              type="monotone"
              dataKey="completed"
              stroke="#10b981"
              strokeWidth={3}
              name="Completed"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
