"use client";

import { Eye, EyeOff, Save, X } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

export default function ChangePasswordPage() {
  const { data: session, status } = useSession();

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const token = session?.accessToken as string | undefined;

  const changePasswordMutation = useMutation({
    mutationFn: async () => {
      if (!token) {
        throw new Error("Not authenticated. Please log in again.");
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword: currentPassword,
          newPassword: newPassword,
        }),
      });

      if (!res.ok) {
        let errorMessage = "Failed to change password";
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // silent fail — use default message
        }
        throw new Error(errorMessage);
      }
      return res.json().catch(() => ({})); // safe if no body
    },

    onSuccess: () => {
      toast.success("Password updated successfully", {
        description: "Your new password is now active.",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },

    onError: (error: Error) => {
      toast.error("Could not change password", {
        description: error.message || "Please try again later.",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (status === "loading") {
      toast.info("Session is still loading...");
      return;
    }

    if (status !== "authenticated" || !token) {
      toast.error("You must be logged in to change password");
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.warning("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match");
      return;
    }

    if (newPassword.length < 8) {
      toast.warning("New password must be at least 8 characters long");
      return;
    }

    changePasswordMutation.mutate();
  };

  const isLoading = status === "loading" || changePasswordMutation.isPending;
  const isDisabled = isLoading || status !== "authenticated";

  return (
    <div className="min-h-screen bg-[#f7f7f7] px-4 py-3 md:px-4">
      <div className="w-full  mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-[24px] font-bold text-[#131313]">Setting</h1>
          <div className="mt-2 flex items-center gap-2 text-[16px] text-[#9b9b9b]">
            <span>Dashboard</span>
            <span>›</span>
            <span>Setting</span>
          </div>
        </div>

        {/* Card */}
        <div className="mt-6 border border-[#F2C94C] bg-[#FDF8EA] px-6 py-6 rounded-lg">
          <h2 className="text-[20px] font-semibold text-[#131313]">
            Change Password
          </h2>

          <form onSubmit={handleSubmit} className="mt-6">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {/* Current Password */}
              <div>
                <label className="mb-2 block text-[12px] uppercase tracking-wide text-[#9B9B9B]">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    disabled={isDisabled}
                    className="h-12 w-full rounded border border-[#BDBDBD] bg-white px-4 pr-11 text-[15px] text-[#131313] outline-none placeholder:text-gray-400 disabled:opacity-60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    disabled={isDisabled}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                  >
                    {showCurrent ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="mb-2 block text-[12px] uppercase tracking-wide text-[#9B9B9B]">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    disabled={isDisabled}
                    className="h-12 w-full rounded border border-[#BDBDBD] bg-white px-4 pr-11 text-[15px] text-[#131313] outline-none placeholder:text-gray-400 disabled:opacity-60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    disabled={isDisabled}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                  >
                    {showNew ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="mb-2 block text-[12px] uppercase tracking-wide text-[#9B9B9B]">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    disabled={isDisabled}
                    className="h-12 w-full rounded border border-[#BDBDBD] bg-white px-4 pr-11 text-[15px] text-[#131313] outline-none placeholder:text-gray-400 disabled:opacity-60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    disabled={isDisabled}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                  >
                    {showConfirm ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
                disabled={isDisabled}
                className="flex h-10 min-w-[100px] items-center justify-center gap-2 rounded border border-gray-300 bg-white px-5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
              >
                <X size={16} />
                Cancel
              </button>

              <button
                type="submit"
                disabled={isDisabled}
                className="flex h-10 min-w-[100px] items-center justify-center gap-2 rounded bg-[#F5BF1D] px-5 text-sm font-medium text-[#131313] hover:opacity-90 disabled:opacity-60"
              >
                <Save size={16} />
                {changePasswordMutation.isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}