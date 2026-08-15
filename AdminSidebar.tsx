"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  UploadCloud,
  Images,
  FileText,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase";

const ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/upload", label: "Upload PDF", icon: UploadCloud },
  { href: "/admin/media", label: "Upload Images", icon: Images },
  { href: "/admin/documents", label: "Documents", icon: FileText },
  { href: "/admin/media", label: "Media", icon: Images },
  { href: "/admin/dashboard#analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/dashboard#settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="w-full md:w-64 shrink-0 md:min-h-screen glass md:border-r md:border-purple-bright/10 px-4 py-6">
      <div className="font-[var(--font-cursive)] italic text-2xl text-gradient px-2 mb-8">
        Top Headlines
      </div>
      <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href.split("#")[0];
          return (
            <Link
              key={label}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm whitespace-nowrap transition-colors ${
                active
                  ? "bg-purple-bright/20 text-purple-bright"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/60 hover:bg-red-500/10 hover:text-red-400 transition-colors mt-2 md:mt-4"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </nav>
    </aside>
  );
}
