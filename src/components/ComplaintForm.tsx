

"use client";
import React, { useState, useEffect } from "react";

export default function ComplaintForm({ departments }: { departments: any[] }) {
  const [complaintNo, setComplaintNo] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [authorizedName, setAuthorizedName] = useState("");
  const [reporterName, setReporterName] = useState("");
  const [reporterContact, setReporterContact] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [fieldType, setFieldType] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function generateComplaintNo() {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `CMP-${randomNum}`;
  }

  useEffect(() => {
    setComplaintNo(generateComplaintNo());
    setDateTime(new Date().toLocaleString());
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Upload images to Sanity first
      let uploadedImages: any[] = [];
      for (const img of images) {
        const formData = new FormData();
        formData.append("file", img);
        const res = await fetch("/api/uploads", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        uploadedImages.push({
          _type: "image",
          asset: { _type: "reference", _ref: data.assetId },
        });
      }

      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
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
          attachments: uploadedImages,
        }),
      });

      if (!res.ok) throw new Error("Failed");

      setMessage("✅ Complaint submitted successfully.");
      setComplaintNo(generateComplaintNo());
      setTitle("");
      setDescription("");
      setAuthorizedName("");
      setReporterName("");
      setReporterContact("");
      setDepartmentId("");
      setPriority("Medium");
      setFieldType("");
      setImages([]);
      setDateTime(new Date().toLocaleString());
    } catch (err) {
      setMessage("❌ Error submitting complaint.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 ">
      <form
        onSubmit={submit}
        className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 md:p-8 transition-all duration-300 hover:shadow-blue-100"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-black tracking-tight">
            Complaint Management Form
          </h1>
          <p className="text-gray-600 text-sm md:text-base mt-2">
            Please fill all details carefully before submitting.
          </p>
        </div>

        {/* Complaint Info */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Complaint No.
            </label>
            <input
              value={complaintNo}
              readOnly
              className="w-full p-3 rounded-lg border border-gray-300 bg-gray-100 text-gray-700 font-semibold"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Date & Time
            </label>
            <input
              value={dateTime}
              readOnly
              className="w-full p-3 rounded-lg border border-gray-300 bg-gray-100 text-gray-700"
            />
          </div>
        </div>

        {/* Title */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Complaint Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a short title"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue in detail..."
            className="w-full p-3 border border-gray-300 rounded-lg h-28 resize-none focus:ring-2 focus:ring-sky-500 outline-none"
            required
          />
        </div>

        {/* Attach Images */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Attach Images
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setImages(Array.from(e.target.files || []))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
          />
          {images.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={URL.createObjectURL(img)}
                  alt="preview"
                  className="w-20 h-20 rounded-lg object-cover border"
                />
              ))}
            </div>
          )}
        </div>

        {/* Department & Field */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Department
            </label>
            <select
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
              required
            >
              <option value="">Select Department</option>
              {departments.map((d: any) => (
                <option key={d._id} value={d._id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Field Type
            </label>
            <select
              value={fieldType}
              onChange={(e) => setFieldType(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
              required
            >
              <option value="">Select Field</option>
              <option value="Electrical">Electrical</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Civil">Civil</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Authorized & Priority */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Authorized Name
            </label>
            <input
              value={authorizedName}
              onChange={(e) => setAuthorizedName(e.target.value)}
              placeholder="Enter authorized person's name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Critical</option>
            </select>
          </div>
        </div>

        {/* Reporter Info */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Reporter Name
            </label>
            <input
              value={reporterName}
              onChange={(e) => setReporterName(e.target.value)}
              placeholder="Enter reporter name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Reporter Contact
            </label>
            <input
              value={reporterContact}
              onChange={(e) => setReporterContact(e.target.value)}
              placeholder="Phone or Email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          disabled={loading}
          className="w-full py-3 rounded-xl bg-sky-700 text-white font-semibold text-lg hover:bg-sky-800 transition-all duration-200 hover:scale-[1.02] shadow-md"
        >
          {loading ? "Submitting..." : "Submit Complaint"}
        </button>

        {message && (
          <p
            className={`mt-4 text-center font-medium ${
              message.includes("success") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
