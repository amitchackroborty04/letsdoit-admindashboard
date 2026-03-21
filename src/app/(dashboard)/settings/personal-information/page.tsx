"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { CalendarDays, ChevronDown, Pencil, Save, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import Image from "next/image";

// ── Types ───────────────────────────────────────────────
type Address = {
  StreetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  taxId: string;
};

type UserProfile = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  dob: string | null;           
  address: Address;
  profileImage: string;
};

type ApiResponse<T> = {
  status: boolean;
  message: string;
  data: T;
};

type FormData = {
  fullName: string;
  userName?: string;      
  email: string;
  phoneNumber: string;
  gender: string;
  dateOfBirth: string;
  address: string;
};

// ── Skeleton Component ─────────────────────────────────
function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-[#f7f7f7] px-4 py-3 md:px-6">
      <div className="w-full">
        {/* Header skeleton */}
        <div className="space-y-2">
          <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
          <div className="flex items-center gap-2">
            <div className="h-5 w-20 animate-pulse rounded bg-gray-200" />
            <span className="text-gray-300">{">"}</span>
            <div className="h-5 w-16 animate-pulse rounded bg-gray-200" />
          </div>
        </div>

        {/* Profile area skeleton */}
        <div className="mt-7 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 animate-pulse rounded-full bg-gray-200" />
            <div className="h-6 w-32 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="h-12 w-36 animate-pulse rounded bg-gray-200" />
        </div>

        {/* Form skeleton */}
        <div className="mt-6 px-6">
          <div className="grid grid-cols-1 gap-x-5 gap-y-6 md:grid-cols-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i}>
                <div className="mb-1.5 h-5 w-24 animate-pulse rounded bg-gray-200" />
                <div className="h-[48px] w-full animate-pulse rounded bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────
export default function PersonalInformationPage() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState<FormData | null>(null);
  const session = useSession();
  const token = session.data?.accessToken;
  const sessionStatus = session.status;
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ── Fetch user profile ────────────────────────────────
  const { data, isLoading, isError } = useQuery<ApiResponse<UserProfile>>({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch profile");
      }

      return res.json();
    },
    enabled: !!token,
  });

  // ── Update mutation ───────────────────────────────────
  const updateMutation = useMutation({
    mutationFn: async (payload: Partial<UserProfile>) => {
      if (!token) {
        throw new Error("You are not authenticated.");
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to update profile");
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      setIsEditing(false);
      setTempData(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update profile");
    },
  });

  // ── Upload avatar mutation ────────────────────────────
  const uploadAvatarMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!token) {
        throw new Error("You are not authenticated.");
      }
      const formData = new FormData();
      formData.append("profileImage", file);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/upload-avatar`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result?.message || "Failed to upload profile image");
      }

      return result;
    },
    onSuccess: (result) => {
      toast.success(result?.message || "Profile image updated!");
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to upload profile image");
    },
  });

  // ── Prepare form data from API response ───────────────
  const profile = data?.data;

  const formDataFromApi: FormData = profile
    ? {
        fullName: `${profile.firstName} ${profile.lastName}`.trim(),
        email: profile.email,
        phoneNumber: profile.phone || "",
        gender: profile.gender || "",
        dateOfBirth: profile.dob || "",
        address:
          [
            profile.address.StreetAddress,
            profile.address.city,
            profile.address.state,
            profile.address.postalCode,
          ]
            .filter(Boolean)
            .join(", ") || "",
      }
    : {
        fullName: "",
        email: "",
        phoneNumber: "",
        gender: "",
        dateOfBirth: "",
        address: "",
      };

  // Initialize temp data when entering edit mode
  const handleEdit = () => {
    setTempData(formDataFromApi);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setTempData(null);
    setIsEditing(false);
  };

  const handleSave = () => {
    if (!tempData) return;

    // Prepare payload for API (you can adjust field names)
    const payload: Partial<UserProfile> = {
      firstName: tempData.fullName.split(" ")[0] || "",
      lastName: tempData.fullName.split(" ").slice(1).join(" ") || "",
      phone: tempData.phoneNumber,
      gender: tempData.gender,
      dob: tempData.dateOfBirth || null,
      // address: you may want to split it back or send full object
      // For simplicity sending flat string – adjust if backend expects object
    };

    updateMutation.mutate(payload);
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setTempData((prev) =>
      prev ? { ...prev, [field]: value } : null
    );
  };

  const displayData = isEditing && tempData ? tempData : formDataFromApi;

  const isFormLoading = isLoading || updateMutation.isPending;
  const isAvatarUploading = uploadAvatarMutation.isPending;
  const profileImageSrc = profile?.profileImage || "/assets/images/autoLogo.png";

  const handleAvatarClick = () => {
    if (isAvatarUploading) return;
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    uploadAvatarMutation.mutate(file);
    event.target.value = "";
  };

  // ── Render ─────────────────────────────────────────────
  if (sessionStatus === "loading") {
    return <ProfileSkeleton />;
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-[#f7f7f7] px-4 py-10 text-center">
        <p className="text-red-600">You must be logged in to view this page.</p>
      </div>
    );
  }
  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (isError || !profile) {
    return (
      <div className="min-h-screen bg-[#f7f7f7] px-4 py-10 text-center">
        <p className="text-red-600">Failed to load profile. Please try again later.</p>
      </div>
    );
  }

  const commonLabelClass = "mb-1.5 block text-[16px] text-[#929292]";
  const commonInputClass =
    "h-[48px] w-full rounded-[4px] border border-[#616161] bg-white px-3 text-[16px] text-[#444] outline-none read-only:bg-[#fafafa] read-only:text-[#444]";
  const commonDisabledInputClass =
    "h-[48px] w-full cursor-not-allowed rounded-[4px] border border-[#d5d5d5] bg-[#f1f1f1] px-3 text-[16px] text-[#9a9a9a] outline-none";
  const commonSelectClass =
    "h-[48px] w-full appearance-none rounded-[4px] border border-[#616161] bg-white px-3 pr-10 text-[16px] text-[#444] outline-none disabled:cursor-not-allowed disabled:bg-[#fafafa] disabled:text-[#9a9a9a]";

  return (
    <div className="min-h-screen bg-[#f7f7f7] px-4 py-3 md:px-6">
      <div className="w-full">
        {/* Header */}
        <div>
          <h1 className="text-[24px] font-bold text-[#131313]">Setting</h1>
          <div className="mt-2 flex items-center gap-2 text-[16px] text-[#9b9b9b]">
            <span>Dashboard</span>
            <span>{">"}</span>
            <span>Setting</span>
          </div>
        </div>

        {/* Profile Area */}
        <div className="mt-7 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="group relative h-[120px] w-[120px]">
              <Image
                src={profileImageSrc}
                width={120}
                height={120}
                alt="Profile"
                className="h-[120px] w-[120px] rounded-full object-cover"
              />
              <button
                type="button"
                onClick={handleAvatarClick}
                disabled={isAvatarUploading}
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 text-[13px] font-semibold text-white opacity-0 transition group-hover:opacity-100 disabled:cursor-not-allowed"
                aria-label="Edit profile image"
              >
                {isAvatarUploading ? "Uploading..." : "Edit"}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
            <p className="text-[24px] font-semibold text-[#131313]">
              {displayData.fullName || "User"}
            </p>
          </div>

          {!isEditing && (
            <button
              type="button"
              onClick={handleEdit}
              disabled={isFormLoading}
              className="inline-flex h-[48px] items-center gap-2 rounded-[4px] bg-[#FBBF24] px-5 text-[16px] font-semibold text-[#131313] shadow-sm transition hover:opacity-90 disabled:opacity-50"
            >
              <Pencil size={12} />
              Update Profile
            </button>
          )}
        </div>

        {/* Form */}
        <div className="mt-6 px-6">
          <div className="grid grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-2">
            {/* Full Name */}
            <div>
              <label className={commonLabelClass}>Full Name</label>
              <input
                type="text"
                value={displayData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                readOnly={!isEditing}
                className={commonInputClass}
              />
            </div>

            {/* Email - non editable */}
            <div>
              <label className={commonLabelClass}>Email</label>
              <input
                type="email"
                value={displayData.email}
                disabled
                className={commonDisabledInputClass}
              />
            </div>

            {/* Gender */}
            <div>
              <label className={commonLabelClass}>Gender</label>
              <div className="relative">
                <select
                  value={displayData.gender}
                  onChange={(e) => handleChange("gender", e.target.value)}
                  disabled={!isEditing}
                  className={commonSelectClass}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#9a9a9a]"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className={commonLabelClass}>Phone Number</label>
              <input
                type="text"
                value={displayData.phoneNumber}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
                readOnly={!isEditing}
                className={commonInputClass}
              />
            </div>

            {/* Address */}
            <div>
              <label className={commonLabelClass}>Address</label>
              <input
                type="text"
                value={displayData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                readOnly={!isEditing}
                className={commonInputClass}
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className={commonLabelClass}>Date of Birth</label>
              <div className="relative">
                <input
                  type="date"
                  value={displayData.dateOfBirth}
                  onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                  disabled={!isEditing}
                  className={commonSelectClass}
                />
                <CalendarDays
                  size={13}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#9a9a9a]"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="mt-8 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                disabled={updateMutation.isPending}
                className="inline-flex h-[48px] min-w-[110px] items-center justify-center gap-2 rounded-[4px] border border-[#ff6f6f] bg-white px-4 text-[16px] font-medium text-[#ff4d4f] disabled:opacity-50"
              >
                <X size={14} />
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={updateMutation.isPending}
                className="inline-flex h-[48px] min-w-[110px] items-center justify-center gap-2 rounded-[4px] bg-[#f5bf1d] px-4 text-[16px] font-medium text-[#1f1f1f] disabled:opacity-50"
              >
                {updateMutation.isPending ? (
                  "Saving..."
                ) : (
                  <>
                    <Save size={14} />
                    Save
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
