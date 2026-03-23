"use client";

import { useState } from "react";
import { Eye, Lock } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") ?? "";

  const resetPasswordMutation = useMutation({
    mutationFn: async ({
      email,
      newPassword,
    }: {
      email: string;
      newPassword: string;
    }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, newPassword }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Failed to reset password. Please try again."
        );
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("Password reset successfully!");
      router.push("/login");
    },
    onError: (error: Error) => {
      toast.error("Something went wrong", {
        description: error.message || "Failed to reset password",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.warning("Email not found. Please restart the flow.");
      return;
    }

    if (!newPassword.trim()) {
      toast.warning("Please enter a new password");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.warning("Passwords do not match");
      return;
    }

    resetPasswordMutation.mutate({ email, newPassword });
  };

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

            <form onSubmit={handleSubmit} className="mt-6 space-y-[16px]">
              {/* Create New Password */}
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#b7b7b7]" />
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Create New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="h-[48px] w-full rounded-[4px] border border-[#BFC1BF] bg-white pl-11 pr-10 text-[16px] text-[#1f1f1f] outline-none placeholder:text-[#b7b7b7]"
                  disabled={resetPasswordMutation.isPending}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b7b7b7]"
                  disabled={resetPasswordMutation.isPending}
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
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-[48px] w-full rounded-[4px] border border-[#BFC1BF] bg-white pl-11 pr-10 text-[16px] text-[#1f1f1f] outline-none placeholder:text-[#b7b7b7]"
                  disabled={resetPasswordMutation.isPending}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b7b7b7]"
                  disabled={resetPasswordMutation.isPending}
                >
                  <Eye size={16} strokeWidth={1.8} />
                </button>
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={resetPasswordMutation.isPending}
                className="mt-2 h-[48px] w-full rounded-[4px] bg-[#FBBF24] text-[16px] font-bold text-[#1f1f1f] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {resetPasswordMutation.isPending
                  ? "Changing..."
                  : "Change Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
