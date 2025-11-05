'use client'
import React from "react";

export default function WorkActions({
  id,
  onChange,
}: {
  id: string;
  onChange?: () => void;
}) {
  // 🟡 Assign to me → Status: In Progress
  async function assignToMe() {
    await fetch("/api/complaints/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        status: "In Progress",
        assignedTo: "maintenance-1", // current logged in user / static for demo
        actor: "Maintenance", // actor name
        note: "Work started by me",
      }),
    });

    onChange && onChange();
  }

  // 🟢 Mark as Completed → Status: Completed
  async function markComplete() {
    await fetch("/api/complaints/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        status: "Completed",
        actor: "Maintenance",
        note: "Work completed successfully",
      }),
    });

    onChange && onChange();
  }

  return (
    <div className="flex gap-2 mt-4">
      <button
        onClick={assignToMe}
        className="px-3 py-1 bg-black  text-white rounded-md cursor-pointer transition"
      >
        Assign to me
      </button>
      <button
        onClick={markComplete}
        className="px-3 py-1 bg-white text-black rounded-md border-2 cursor-pointer transition"
      >
        Mark Completed
      </button>
    </div>
  );
}
