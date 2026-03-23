"use client";

import { useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export default function VerifyEmailPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const router = useRouter();

  const verifyOtpMutation = useMutation({
    mutationFn: async ({ otp, email }: { otp: string; email: string }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/verify-code`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            email,
          },
          body: JSON.stringify({ otp, email }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Failed to verify code. Please try again."
        );
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("OTP verified successfully!");
      if (email) {
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      }
    },
    onError: (error: Error) => {
      toast.error("Something went wrong", {
        description: error.message || "Failed to verify code",
      });
    },
  });

  const handleVerify = () => {
    const otpValue = otp.join("");

    if (!email) {
      toast.warning("Email not found. Please go back and try again.");
      return;
    }

    if (otpValue.length !== 6) {
      toast.warning("Please enter the 6-digit OTP");
      return;
    }

    verifyOtpMutation.mutate({ otp: otpValue, email });
  };

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // move next
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    index: number
  ) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text");
    if (!pasted) return;

    const digits = pasted.replace(/\D/g, "").split("");
    if (digits.length === 0) return;

    const newOtp = [...otp];
    let cursor = index;

    for (let i = 0; i < digits.length && cursor < 6; i += 1) {
      newOtp[cursor] = digits[i];
      cursor += 1;
    }

    setOtp(newOtp);

    const focusIndex = Math.min(cursor, 5);
    inputsRef.current[focusIndex]?.focus();
  };

  return (
    <div className="min-h-screen bg-[#f6f6f6]">
      <div className="mx-auto flex min-h-screen w-full flex-col px-6 py-3 md:px-10">
        {/* Logo */}
        <div className="flex items-start gap-3">
          <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[2px] bg-[#f4bf24] text-[24px] font-semibold text-[#1f1f1f]">
            AI
          </div>

          <div className="pt-[1px]">
            <h1 className="text-[18px] font-semibold uppercase text-[#1f1f1f]">
              AUTO INTEL
            </h1>
            <p className="mt-1 text-[11px] text-[#8d8d8d]">
              Pre-Purchase inspection Experts
            </p>
          </div>
        </div>

        {/* Center */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-[496px] -translate-y-14 text-center">
            <h2 className="text-[32px] font-bold text-[#131313]">
              Verify Email
            </h2>

            <p className="mt-2 text-[14px] text-[#6b6b6b]">
              {email
                ? `Enter the OTP sent to ${email}`
                : "Enter the OTP to verify your email"}
            </p>

            {/* OTP */}
            <div className="mt-6 flex justify-center gap-10">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputsRef.current[index] = el;
                  }}
                  type="text"
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={(e) => handlePaste(e, index)}
                  maxLength={1}
                  className="h-[48px] w-[48px] rounded-[4px] border border-[#BFC1BF] bg-white text-center text-[18px] font-semibold text-[#1f1f1f] outline-none focus:border-[#f4bf24]"
                  disabled={verifyOtpMutation.isPending}
                />
              ))}
            </div>

            {/* Resend */}
            <div className="mt-3 text-[12px] text-[#8a8a8a]">
              Don’t get a code?{" "}
              <button className="font-medium text-[#f4bf24] hover:underline">
                Resend
              </button>
            </div>

            {/* Button */}
            <button
              onClick={handleVerify}
              disabled={verifyOtpMutation.isPending}
              className="mt-6 h-[48px] w-full rounded-[4px] bg-[#FBBF24] text-[16px] font-bold text-[#1f1f1f] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {verifyOtpMutation.isPending ? "Verifying..." : "Verify"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
