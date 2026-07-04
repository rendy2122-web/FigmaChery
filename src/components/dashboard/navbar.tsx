"use client";

import { useState } from "react";
import { MenuIcon, BellIcon, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface User {
  name?: string | null;
  email?: string | null;
  role?: string | null;
}

interface DashboardNavbarProps {
  user: User;
}

export function DashboardNavbar({ user }: DashboardNavbarProps) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-gray-200">
      <div className="flex h-full items-center justify-between px-6">
        {/* Left side - Mobile menu button */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <MenuIcon className="size-5" />
          </Button>

          {/* Search bar */}
          <div className="hidden md:flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
            <SearchIcon className="size-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari..."
              className="bg-transparent text-sm outline-none w-64"
            />
          </div>
        </div>

        {/* Right side - Notifications and User */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <BellIcon className="size-5" />
            <span className="absolute top-1 right-1 size-2 rounded-full bg-red-500" />
          </Button>

          {/* User info */}
          <div className="flex items-center gap-3">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-gray-900">
                {user.name || "User"}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {user.role || "Editor"}
              </p>
            </div>
            <div className="size-10 rounded-full bg-brand-deep flex items-center justify-center text-white font-medium">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}