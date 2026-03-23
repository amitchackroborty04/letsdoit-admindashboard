"use client";

import { Mail } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const forgotPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/forget-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Failed to send OTP. Please try again."
        );
      }

      return res.json(); 
    },

    onSuccess: () => {
      toast.success("OTP sent successfully!", {
        description: "Please check your email",
      });
      const trimmedEmail = email.trim();
      if (trimmedEmail) {
        router.push(`/verify-otp?email=${encodeURIComponent(trimmedEmail)}`);
      }
    },

    onError: (error: Error) => {
      toast.error("Something went wrong", {
        description: error.message || "Failed to send reset link",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.warning("Please enter your email");
      return;
    }

    forgotPasswordMutation.mutate(email);
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
              Forgot Password
            </h2>

            <p className="mt-2 text-[16px] text-[#424242]">
              Enter your email to recover your password
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-[24px]">
              {/* Email */}
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#b7b7b7]" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-[48px] w-full rounded-[4px] border border-[#BFC1BF] bg-white pl-11 pr-3 text-[16px] text-[#1f1f1f] outline-none placeholder:text-[#b7b7b7] disabled:opacity-60"
                  disabled={forgotPasswordMutation.isPending}
                />
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={forgotPasswordMutation.isPending}
                className="h-[48px] w-full rounded-[4px] bg-[#FBBF24] text-[16px] font-bold text-[#1f1f1f] transition hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {forgotPasswordMutation.isPending ? "Sending..." : "Send OTP"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
