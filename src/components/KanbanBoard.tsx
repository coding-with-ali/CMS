'use client'
import React, { useState } from 'react'

export default function KanbanBoard({ items }: { items: any[] }) {
  const columns = ['Open','Assigned','In Progress','Completed']
  const [cards, setCards] = useState(items)

  function onDrop(e: any, status: string) {
    const id = e.dataTransfer.getData('text/plain')
    setCards(prev => prev.map(c => c._id === id ? { ...c, status } : c))
    // Ideally call API to persist status change
  }

  function onDragStart(e: any, id: string) {
    e.dataTransfer.setData('text/plain', id)
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      {columns.map(col => (
        <div key={col} className="p-2 bg-gray-50 rounded" onDragOver={(e)=>e.preventDefault()} onDrop={(e)=>onDrop(e,col)}>
          <h4 className="font-semibold mb-2">{col}</h4>
          <div className="space-y-2">
            {cards.filter(c=>c.status===col).map(c=>(
              <div key={c._id} draggable onDragStart={(e)=>onDragStart(e,c._id)} className="p-3 bg-white border rounded">
                <div className="font-medium">{c.title}</div>
                <div className="text-xs text-gray-500">{c.reporterName}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
