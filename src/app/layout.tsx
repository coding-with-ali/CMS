import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Complaint Management System",
    template: "%s | Complaint Management System",
  },
  description:
    "A modern Complaint Management System to track, manage, and resolve complaints efficiently using Sanity CMS and Next.js.",
  keywords: [
    "Complaint Management System",
    "CMS",
    "Next.js",
    "Sanity CMS",
    "Complaint Tracker",
    "Customer Support",
    "Issue Management",
  ],
  authors: [{ name: "Muhammad Ali" }],
  creator: "Complaint Management System",
  publisher: "CMS Team",
  metadataBase: new URL("https://your-domain.com"), // 🔁 Replace with your production URL
  openGraph: {
    title: "Complaint Management System",
    description:
      "Easily manage and resolve complaints with a smart, AI-powered complaint tracking dashboard.",
    url: "https://your-domain.com",
    siteName: "Complaint Management System",
    locale: "en_US",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col bg-gray-50 text-gray-900 antialiased">
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
