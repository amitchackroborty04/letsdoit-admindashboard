import { ChevronRight } from "lucide-react";
import Link from "next/link";

const settingsItems = [
  {
    title: "Personal Information",
    href: "/settings/personal-information",
  },
  {
    title: "Change Password",
    href: "/settings/change-password",
  },
];

export default function SettingPage() {
  return (
    <div className="min-h-screen bg-[#f8f8f8] px-4 py-2 md:px-2 md:py-2">
      <div className="mx-auto w-full ">
        {/* Header */}
        <div className="pt-3">
          <h1 className="text-[24px] font-bold text-[#131313]">Setting</h1>

          <div className="mt-2 flex items-center gap-2 text-[16px] text-[#929292]">
            <span>Dashboard</span>
            <span>{">"}</span>
            <span>Setting</span>
          </div>
        </div>

        {/* Setting Items */}
        <div className="mt-6 space-y-3">
          {settingsItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="flex h-[48px] items-center justify-between rounded-[4px] border border-[#B6B6B6]  px-4 text-[16px] text-[#131313] transition hover:bg-[#fcfcfc]"
            >
              <span>{item.title}</span>
              <ChevronRight size={14} className="text-[#7d7d7d]" strokeWidth={1.6} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}