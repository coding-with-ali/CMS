



export default {
  name: "complaint",
  title: "Complaints",
  type: "document",
  fields: [
    { name: "complaintNo", title: "Complaint No", type: "string" },
    { name: "title", title: "Title", type: "string" },
    { name: "description", title: "Description", type: "text" },
    {
      name: "department",
      title: "Department",
      type: "reference",
      to: [{ type: "department" }],
    },
    { name: "authorizedName", title: "Authorized Name", type: "string" },
    { name: "reporterName", title: "Reporter Name", type: "string" },
    { name: "reporterContact", title: "Reporter Contact", type: "string" },
    {
      name: "priority",
      title: "Priority",
      type: "string",
      options: { list: ["Low", "Medium", "High", "Critical"] },
    },
    { name: "fieldType", title: "Field Type", type: "string" },
    { name: "dateTime", title: "Date Time", type: "datetime" },
    {
      name: "attachments",
      title: "Attachments",
      type: "array",
      of: [{ type: "image" }],
    },
    {
      name: "status",
      title: "Status",
      type: "string",
      options: { list: ["New", "In Progress", "Completed"] },
      initialValue: "New",
    },
    { name: "createdAt", title: "Created At", type: "datetime" },
    { name: "updatedAt", title: "Updated At", type: "datetime" },
  ],
};
