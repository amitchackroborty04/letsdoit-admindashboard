"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    const savedPassword = localStorage.getItem("savedPassword");

    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!password.trim()) {
      toast.error("Password is required");
      return;
    }

    try {
      setLoading(true);

      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (!result) {
        toast.error("Something went wrong. Please try again.");
        return;
      }

      if (result.error) {
        if (result.error === "admin_only") {
          toast.error("Only admin users can sign in.");
        } else {
          toast.error("Invalid email or password");
        }
        return;
      }

      if (rememberMe) {
        localStorage.setItem("savedEmail", email);
        localStorage.setItem("savedPassword", password);
      } else {
        localStorage.removeItem("savedEmail");
        localStorage.removeItem("savedPassword");
      }

      toast.success("Login successful");

      router.replace("/");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
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
          <div className="w-full max-w-[496px] -translate-y-10">
            <h2 className="text-[36px] font-bold leading-none text-[#131313]">
              Welcome
            </h2>

            <p className="mt-2 text-[16px] text-[#424242]">
              Sign in to continue your beauty journey
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
                  className="h-[48px] w-full rounded-[4px] border border-[#BFC1BF] bg-white pl-10 pr-3 text-[16px] text-[#1f1f1f] outline-none placeholder:text-[#b7b7b7]"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#b7b7b7]" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-[48px] w-full rounded-[4px] border border-[#BFC1BF] bg-white pl-10 pr-10 text-[16px] text-[#1f1f1f] outline-none placeholder:text-[#b7b7b7]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b7b7b7]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Remember / Forgot */}
              <div className="flex items-center justify-between pt-[1px]">
                <label className="flex items-center gap-2 text-[14px] text-[#9a9a9a]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-[15px] w-[15px] rounded-[1px] border border-[#cfcfcf]"
                  />
                  Remember me
                </label>

                <Link
                  href="/forgot-password"
                  className="text-[14px] font-normal text-[#ff4d4f]"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="mt-1 h-[48px] w-full rounded-[2px] bg-[#FBBF24] text-[16px] font-bold text-[#1f1f1f] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Logging in..." : "Log In"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
