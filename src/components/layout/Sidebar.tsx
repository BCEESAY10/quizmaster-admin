"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FolderOpen,
  BarChart3,
  LogOut,
  User2,
} from "lucide-react";
import { signOut } from "next-auth/react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Users", href: "/users", icon: Users },
  { name: "Questions", href: "/questions", icon: BookOpen },
  { name: "Categories", href: "/categories", icon: FolderOpen },
  { name: "Admins", href: "/admins", icon: User2 },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
];

interface SidebarProps {
  isMobileOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isMobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200",
          "transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          {
            "translate-x-0": isMobileOpen,
            "-translate-x-full": !isMobileOpen,
          }
        )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-primary-500">
              🧠 QuizMaster
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => onClose()}
                  className={clsx(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                    {
                      "bg-primary-50 text-primary-700": active,
                      "text-gray-700 hover:bg-gray-100": !active,
                    }
                  )}>
                  <Icon
                    className={clsx("mr-3 h-5 w-5", {
                      "text-primary-500": active,
                      "text-gray-500": !active,
                    })}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="px-4 py-4 border-t border-gray-200">
            <button
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              onClick={() => signOut({ callbackUrl: "/login" })}>
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
