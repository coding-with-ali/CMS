
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navLinks = [
    { name: "Overview", href: "/dashboard" },
    { name: "Complaints", href: "/dashboard/complaints" },
    { name: "Reports", href: "/dashboard/reports" },
    { name: "Users", href: "/dashboard/users" },
    { name: "Departments", href: "/dashboard/departments" },
  ];

  function cn(...classes: (string | boolean | undefined)[]): string {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* ===== Sidebar ===== */}
      <aside
  className={`fixed md:static top-[60px] md:top-0 left-0 h-[calc(100%-60px)] md:h-full w-64 bg-[#0B1623] text-white z-60 
  transform transition-transform duration-300 ease-in-out 
  ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
>
        <div className="flex flex-col justify-between h-full">
          <div>
            {/* Logo Section */}
            <div className="hidden md:flex flex-col items-center justify-center py-6 border-b border-gray-800">
              <Image
                src="/logo.png"
                alt="Master Motor Logo"
                width={90}
                height={90}
                className="object-contain mb-3"
              />
              <h1 className="text-base font-semibold tracking-wide text-gray-100">
                Master Motor Corp.
              </h1>
            </div>

            {/* Nav Links */}
            <nav className="mt-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block px-6 py-3 text-sm font-medium hover:bg-[#1F3A5F] transition-colors",
                    pathname === link.href && "bg-[#1F3A5F] font-semibold"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Logout */}
          <div className="px-6 py-5 border-t border-gray-800">
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="w-full text-sm font-medium text-red-400 hover:text-red-300 transition"
            >
              Logout
            </button>
            <p className="text-xs text-gray-500 text-center mt-3">
              © 2025 Master Motor
            </p>
          </div>
        </div>
      </aside>

      {/* ===== Overlay for Mobile ===== */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
        />
      )}

      {/* ===== Main Content ===== */}
     <main className="flex-1 bg-[#F5F7FA] h-full overflow-y-auto pt-16 md:pt-0">
  <div className="p-4 md:p-6">{children}</div>
</main>

      {/* ===== Mobile Navbar ===== */}
      <div className="md:hidden fixed top-0 left-0 w-full flex items-center justify-between bg-white px-4 py-3 border-b z-50 shadow-sm">
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-md hover:bg-gray-100 transition"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Master Motor"
            width={36}
            height={36}
            className="object-contain"
          />
          <h2 className="text-lg font-bold text-gray-800">MASTER MOTOR</h2>
        </div>

        <div className="w-8" />
      </div>
    </div>
  );
}

