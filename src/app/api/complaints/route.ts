import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

export async function GET() {
  try {
    const complaints = await client.fetch(
      `*[_type == "complaint"] | order(_createdAt desc){
        _id,
        complaintNo,
        title,
        description,
        priority,
        status,
        fieldType,
        dateTime,
        authorizedName,
        reporterName,
        reporterContact,
        attachments[]{asset->{url}},
        department->{name}
      }`
    );

    return NextResponse.json(complaints);
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ error: "Failed to fetch complaints" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const {
      complaintNo,
      title,
      description,
      departmentId,
      authorizedName,
      reporterName,
      reporterContact,
      priority,
      fieldType,
      dateTime,
      attachments = [],
    } = data;

    const newComplaint = {
      _type: "complaint",
      complaintNo,
      title,
      description,
      department: { _type: "reference", _ref: departmentId },
      authorizedName,
      reporterName,
      reporterContact,
      priority,
      fieldType,
      dateTime: new Date(dateTime).toISOString(),
      attachments,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "New",
    };

    const created = await client.create(newComplaint);
    return NextResponse.json(created);
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ error: "Failed to create complaint" }, { status: 500 });
  }
}
