"use client";

import { useState } from "react";
import { Eye, Lock } from "lucide-react";

export default function ResetPasswordPage() {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen bg-[#f6f6f6]">
      <div className="mx-auto flex min-h-screen w-full flex-col px-6 py-3 md:px-10">
        {/* Logo */}
        <div className="flex items-start gap-3">
          <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[2px] bg-[#f4bf24] text-[24px] font-semibold leading-none text-[#1f1f1f]">
            AI
          </div>

          <div className="pt-[1px]">
            <h1 className="text-[18px] font-semibold uppercase leading-none text-[#1f1f1f]">
              AUTO INTEL
            </h1>
            <p className="mt-1 text-[11px] font-normal text-[#8d8d8d]">
              Pre-Purchase inspection Experts
            </p>
          </div>
        </div>

        {/* Center form */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-[496px] -translate-y-14">
            <h2 className="text-[36px] font-bold leading-none text-[#131313]">
              Reset Password
            </h2>

            <p className="mt-2 text-[16px] text-[#424242]">
              Create a new password
            </p>

            <form className="mt-6 space-y-[16px]">
              {/* Create New Password */}
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#b7b7b7]" />
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Create New Password"
                  className="h-[48px] w-full rounded-[4px] border border-[#BFC1BF] bg-white pl-11 pr-10 text-[16px] text-[#1f1f1f] outline-none placeholder:text-[#b7b7b7]"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b7b7b7]"
                >
                  <Eye size={16} strokeWidth={1.8} />
                </button>
              </div>

              {/* Confirm New Password */}
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#b7b7b7]" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm New Password"
                  className="h-[48px] w-full rounded-[4px] border border-[#BFC1BF] bg-white pl-11 pr-10 text-[16px] text-[#1f1f1f] outline-none placeholder:text-[#b7b7b7]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b7b7b7]"
                >
                  <Eye size={16} strokeWidth={1.8} />
                </button>
              </div>

              {/* Button */}
              <button
                type="submit"
                className="mt-2 h-[48px] w-full rounded-[4px] bg-[#FBBF24] text-[16px] font-bold text-[#1f1f1f] transition hover:opacity-90"
              >
                Change Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}