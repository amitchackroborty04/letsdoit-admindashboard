"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Building2,
  ClipboardCheck,
  CircleDollarSign,
  Settings,
  CreditCard,
  Mail,
  Menu,
  X
} from "lucide-react";
import LogoutModal from "./LogoutModal";

const navigation = [
  { name: "Dashboard Overview", href: "/", icon: LayoutDashboard },
  { name: "Inspector Request", href: "/inspector-request", icon: ClipboardCheck },
  { name: "Inspector Management", href: "/inspector-management", icon: Users },
  { name: "Dealership Management", href: "/dealership-management", icon: Building2 },
  { name: "Revenue", href: "/revenue", icon: CircleDollarSign },
  { name: "Subscription Management", href: "/subscription-management", icon: CreditCard },
  { name: "Contact Management", href: "/contact-management", icon: Mail },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {!isMobileMenuOpen && (
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-lg bg-white text-[#F7B500] shadow-lg border border-[#F0D27A] transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      )}

      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={toggleMobileMenu}
        />
      )}

      <div
        className={cn(
          "flex h-screen flex-col overflow-hidden bg-white border-r border-[#E7E7E7] z-50 transition-transform duration-300",
          "fixed lg:sticky lg:top-0 lg:self-start",
          "w-[240px] sm:w-[260px] lg:w-[360px]",
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="h-[110px] flex items-center justify-center relative px-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[#F7B500] text-lg font-semibold text-[#1A1A1A] shadow-sm">
            AI
          </div>

          {isMobileMenuOpen && (
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg text-[#F7B500] hover:bg-[#FFF6D8] transition-colors"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          )}
        </div>

        <nav className="flex-1 space-y-6 flex flex-col items-center justify-start px-3 overflow-hidden">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex w-full items-center justify-start gap-3 rounded-md px-3 py-2.5 text-sm font-normal transition-all duration-200",
                  isActive
                    ? "bg-[#F7B500] text-[#131313] shadow-[0px_3px_8px_rgba(247,181,0,0.3)]"
                    : "text-[#2B2B2B] hover:bg-[#FFF6D8] hover:text-[#1A1A1A]"
                )}
              >
                <item.icon
                  className="h-5 w-5 flex-shrink-0 text-[#131313] transition-colors duration-200"
                />
                <span
                  className={cn(
                    "font-normal text-[16px] leading-[120%] transition-colors duration-200",
                    isActive ? "text-[#131313]" : "text-[#616161]"
                  )}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 sm:p-5 border-t border-[#E7E7E7]">
          <LogoutModal />
        </div>
      </div>
    </>
  );
}
