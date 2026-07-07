"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboardIcon,
  CarIcon,
  FileTextIcon,
  ImageIcon,
  StoreIcon,
  HelpCircleIcon,
  LogOutIcon,
  StarIcon,
  SearchIcon,
} from "lucide-react";

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
  { href: "/dashboard/hero", label: "Hero Slides", icon: ImageIcon },
  { href: "/dashboard/cars", label: "Mobil", icon: CarIcon },
  { href: "/dashboard/articles", label: "Artikel", icon: FileTextIcon },
  { href: "/dashboard/testimonials", label: "Ulasan", icon: StarIcon },
  { href: "/dashboard/media", label: "Media", icon: ImageIcon },
  { href: "/dashboard/dealers", label: "Dealer", icon: StoreIcon },
  { href: "/dashboard/faqs", label: "FAQ", icon: HelpCircleIcon },
  { href: "/dashboard/seo", label: "SEO", icon: SearchIcon },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-gray-200 px-6">
          <Link href="/dashboard" className="text-xl font-bold text-brand-deep">
            Chery CMS
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-brand-deep text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="size-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="border-t border-gray-200 p-4">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-gray-700 hover:bg-gray-100"
            onClick={handleLogout}
          >
            <LogOutIcon className="size-5" />
            Keluar
          </Button>
        </div>
      </div>
    </aside>
  );
}