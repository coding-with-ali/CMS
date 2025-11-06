import { NextResponse } from "next/server";
import { sanityClient } from "@/sanity/lib/sanity";

// ✅ GET: Fetch complaint statistics
// ✅ GET: Fetch complaint statistics
export async function GET() {
  try {
    const query = `
      {
        "new": count(*[_type == "complaint" && (status == "New" || status == "Open" || !defined(status))]),
        "inProgress": count(*[_type == "complaint" && status == "In Progress"]),
        "completed": count(*[_type == "complaint" && status == "Completed"]),
        "critical": count(*[_type == "complaint" && priority == "Critical"]),
        "high": count(*[_type == "complaint" && priority == "High"]),
        "medium": count(*[_type == "complaint" && priority == "Medium"]),
        "low": count(*[_type == "complaint" && priority == "Low"])
      }
    `
    const stats = await sanityClient.fetch(query)
    return NextResponse.json(stats, { status: 200 })
  } catch (error) {
    console.error("❌ Error fetching stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    )
  }
}

// ✅ POST: Update complaint status and append history
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, status, assignedTo, actor, note } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "Missing required fields (id or status)" },
        { status: 400 }
      );
    }

    // 🧠 Step 1: Update complaint fields
    const patch: Record<string, any> = {
      status,
      updatedAt: new Date().toISOString(),
    };

    if (assignedTo) patch.assignedTo = assignedTo;

    await sanityClient.patch(id).set(patch).commit({ autoGenerateArrayKeys: true });

    // 🧠 Step 2: Append history log safely
    const historyEntry = {
      action: `Status → ${status}`,
      by: actor || "system",
      at: new Date().toISOString(),
      note: note || "",
    };

    await sanityClient
      .patch(id)
      .setIfMissing({ history: [] })
      .append("history", [historyEntry])
      .commit({ autoGenerateArrayKeys: true });

    // 🧠 Step 3: Create audit entry
    await sanityClient.create({
      _type: "audit",
      action: "status_changed",
      actor: actor || "system",
      timestamp: new Date().toISOString(),
      meta: { id, status },
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("❌ Error updating complaint:", error);
    return NextResponse.json(
      { error: "Failed to update complaint" },
      { status: 500 }
    );
  }
}
