// // // import { NextResponse } from 'next/server'
// // // import { sanityClient } from '@/sanity/lib/sanity'

// // // export async function POST(request: Request) {
// // //   const body = await request.json()
// // //   const { id, status, assignedTo, actor, note } = body
// // //   const patch: any = { status, updatedAt: new Date().toISOString() }
// // //   if (assignedTo) patch.assignedTo = assignedTo
// // //   await sanityClient.patch(id).set(patch).commit()
// // //   // append history entry
// // //   const historyEntry = { action: `Status -> ${status}`, by: actor || 'system', at: new Date().toISOString(), note: note || '' }
// // //   await sanityClient.patch(id).append('history', [historyEntry]).commit()
// // //   await sanityClient.create({ _type: 'audit', action: 'status_changed', actor: actor || 'system', timestamp: new Date().toISOString(), meta: { id, status } })
// // //   return NextResponse.json({ ok: true })
// // // }




// // import { NextResponse } from 'next/server'
// // import { sanityClient } from '@/sanity/lib/sanity'

// // /* 🟩 GET: Complaint Statistics */
// // export async function GET() {
// //   const query = `
// //     {
// //       "open": count(*[_type == "complaint" && status == "Open"]),
// //       "inProgress": count(*[_type == "complaint" && status == "In Progress"]),
// //       "completed": count(*[_type == "complaint" && status == "Completed"]),
// //       "critical": count(*[_type == "complaint" && priority == "Critical"]),
// //       "high": count(*[_type == "complaint" && priority == "High"]),
// //       "medium": count(*[_type == "complaint" && priority == "Medium"]),
// //       "low": count(*[_type == "complaint" && priority == "Low"])
// //     }
// //   `
// //   const stats = await sanityClient.fetch(query)
// //   return NextResponse.json(stats)
// // }

// // /* 🟨 POST: Update Complaint Status */
// // export async function POST(request: Request) {
// //   const body = await request.json()
// //   const { id, status, assignedTo, actor, note } = body

// //   const patch: any = { status, updatedAt: new Date().toISOString() }
// //   if (assignedTo) patch.assignedTo = assignedTo

// //   // ✅ Update main complaint
// //   await sanityClient.patch(id).set(patch).commit()

// //   // ✅ Add history entry
// //   const historyEntry = {
// //     action: `Status -> ${status}`,
// //     by: actor || 'system',
// //     at: new Date().toISOString(),
// //     note: note || '',
// //   }
// //   await sanityClient.patch(id).append('history', [historyEntry]).commit()

// //   // ✅ Create audit record
// //   await sanityClient.create({
// //     _type: 'audit',
// //     action: 'status_changed',
// //     actor: actor || 'system',
// //     timestamp: new Date().toISOString(),
// //     meta: { id, status, assignedTo },
// //   })

// //   return NextResponse.json({ ok: true })
// // }




// import { NextResponse } from 'next/server'
// import { sanityClient } from '@/sanity/lib/sanity'

// /* 🟩 GET: Complaint Statistics */
// export async function GET() {
//   const query = `
//     {
//       "open": count(*[_type == "complaint" && lower(status) == "open"]),
//       "inProgress": count(*[_type == "complaint" && lower(status) == "in progress"]),
//       "completed": count(*[_type == "complaint" && lower(status) == "completed"]),
//       "critical": count(*[_type == "complaint" && lower(priority) == "critical"]),
//       "high": count(*[_type == "complaint" && lower(priority) == "high"]),
//       "medium": count(*[_type == "complaint" && lower(priority) == "medium"]),
//       "low": count(*[_type == "complaint" && lower(priority) == "low"])
//     }
//   `

//   const stats = await sanityClient.fetch(query)
//   return NextResponse.json(stats)
// }

// /* 🟨 POST: Update Complaint Status */
// export async function POST(request: Request) {
//   const body = await request.json()
//   const { id, status, assignedTo, actor, note } = body

//   const patch: any = { status, updatedAt: new Date().toISOString() }
//   if (assignedTo) patch.assignedTo = assignedTo

//   // ✅ Update main complaint
//   await sanityClient.patch(id).set(patch).commit()

//   // ✅ Add history entry
//   const historyEntry = {
//     action: `Status -> ${status}`,
//     by: actor || 'system',
//     at: new Date().toISOString(),
//     note: note || '',
//   }
//   await sanityClient.patch(id).append('history', [historyEntry]).commit()

//   // ✅ Create audit record
//   await sanityClient.create({
//     _type: 'audit',
//     action: 'status_changed',
//     actor: actor || 'system',
//     timestamp: new Date().toISOString(),
//     meta: { id, status, assignedTo },
//   })

//   return NextResponse.json({ ok: true })
// }




import { NextResponse } from "next/server";
import { sanityClient } from "@/sanity/lib/sanity";

// ✅ GET: Fetch complaint statistics
export async function GET() {
  try {
    const query = `
      {
        "open": count(*[_type == "complaint" && status == "Open"]),
        "inProgress": count(*[_type == "complaint" && status == "In Progress"]),
        "completed": count(*[_type == "complaint" && status == "Completed"]),
        "critical": count(*[_type == "complaint" && priority == "Critical"]),
        "high": count(*[_type == "complaint" && priority == "High"]),
        "medium": count(*[_type == "complaint" && priority == "Medium"]),
        "low": count(*[_type == "complaint" && priority == "Low"])
      }
    `;

    const stats = await sanityClient.fetch(query);
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
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
    const patch: any = {
      status,
      updatedAt: new Date().toISOString(),
    };
    if (assignedTo) patch.assignedTo = assignedTo;

    await sanityClient.patch(id).set(patch).commit();

    // 🧠 Step 2: Append history log
    const historyEntry = {
      action: `Status -> ${status}`,
      by: actor || "system",
      at: new Date().toISOString(),
      note: note || "",
    };
    await sanityClient.patch(id).append("history", [historyEntry]).commit();

    // 🧠 Step 3: Create audit entry
    await sanityClient.create({
      _type: "audit",
      action: "status_changed",
      actor: actor || "system",
      timestamp: new Date().toISOString(),
      meta: { id, status },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error updating complaint:", error);
    return NextResponse.json(
      { error: "Failed to update complaint" },
      { status: 500 }
    );
  }
}
