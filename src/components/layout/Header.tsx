"use client";

import { Menu, Bell, Search } from "lucide-react";
import { Input } from "@/src/components/ui/Input";
import { Session } from "next-auth";
import { Avatar } from "../ui/Avatar";

interface HeaderProps {
  onMenuClick: () => void;
  session: Session;
}

export function Header({ onMenuClick, session }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg lg:hidden">
            <Menu className="h-6 w-6" />
          </button>

          {/* Search */}
          <div className="hidden md:block w-80">
            <Input
              placeholder="Search..."
              leftIcon={<Search className="h-5 w-5 text-gray-400" />}
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Bell className="h-6 w-6" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
          </button>

          {/* User menu */}
          <div className="flex items-center space-x-3">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-gray-900">
                {session?.user?.fullName || "Admin Name"}
              </p>
              <p className="text-xs text-gray-500">
                {session.user?.email || "admin@example.com"}
              </p>
            </div>
            <Avatar fullName={session?.user?.fullName || "Admin Name"} />
          </div>
        </div>
      </div>
    </header>
  );
}
