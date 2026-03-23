"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Plus, ChevronDown } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import axios from "axios"; 
import { useSession } from "next-auth/react";

interface PlanFormData {
  name: string;
  price: number | string;
  billingCycle: string;
  title: string;
  features: string[];
}

export default function AddSubscriptionPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.accessToken;

  const [form, setForm] = useState<PlanFormData>({
    name: "",
    price: "",
    billingCycle: "yearly",
    title: "",
    features: [""],
  });

  // Update single field
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Features handlers
  const handleAddFeature = () => {
    setForm((prev) => ({ ...prev, features: [...prev.features, ""] }));
  };

  const handleRemoveFeature = (index: number) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    setForm((prev) => {
      const newFeatures = [...prev.features];
      newFeatures[index] = value;
      return { ...prev, features: newFeatures };
    });
  };

  // API mutation
  const createPlanMutation = useMutation({
    mutationFn: async (data: PlanFormData) => {
      const payload = {
        name: data.name.trim(),
        price: Number(data.price),
        billingCycle: data.billingCycle,
        title: data.title.trim(),
        features: data.features
          .map((f) => f.trim())
          .filter((f) => f.length > 0), 
      };

      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/plan`, payload, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
      });

      return res.data;
    },

    onSuccess: () => {
      toast.success("Plan created successfully!");
      router.push("/subscription-management");
    },

    //eslint-disable-next-line
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to create plan";
      toast.error(message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (form.features.every((f) => f.trim() === "")) {
      toast.error("Please add at least one feature");
      return;
    }

    if (!form.name.trim() || !form.title.trim()) {
      toast.error("Name and title are required");
      return;
    }

    createPlanMutation.mutate(form);
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <div className="px-4 py-5 md:px-6 lg:px-4">
        <div className="w-full">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-[16px] font-bold text-[#131313] md:text-[24px]">
                Subscription Management
              </h1>
              <div className="mt-2 flex items-center gap-2 text-[16px] text-[#929292]">
                <span>Dashboard</span>
                <span>{">"}</span>
                <span>Create New Subscription</span>
              </div>
            </div>
          </div>

          {/* Pricing button */}
          <div className="mt-5">
            <Link href="/subscription-management">
              <button className="rounded-[4px] bg-[#f4b81f] px-6 py-3 text-[16px] font-semibold text-[#111]">
                Pricing Plans
              </button>
            </Link>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="mt-7 rounded-[12px] bg-white px-4 py-6 shadow-[0_0_0_1px_rgba(0,0,0,0.03)] md:px-6 md:py-6">
              {/* Top Row */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                {/* Plan Name */}
                <div>
                  <label className="mb-2 block text-[16px] font-medium text-[#343A40]">
                    Select Plan Name
                  </label>
                  <div className="relative">
                    <select
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="h-[50px] w-full appearance-none rounded-[4px] border border-[#C0C3C1] bg-white px-3 pr-10 text-[16px] text-[#343A40] outline-none focus:border-[#f4b81f]"
                      required
                    >
                      <option value="" disabled hidden>
                        Select a plan
                      </option>
                      <option value="Basic Inspection!">Basic Inspection!</option>
                      <option value="Plus Inspection!">Plus Inspection!</option>
                      <option value="Complete Inspection!">Complete Inspection!</option>
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center rounded-[2px] bg-[#f4b81f] text-black">
                      <ChevronDown size={12} />
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div>
                  <label className="mb-2 block text-[16px] font-medium text-[#343A40]">
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    min="0"
                    placeholder="enter price..."
                    className="h-[50px] w-full rounded-[4px] border border-[#C0C3C1] px-3 text-[16px] text-[#343A40] outline-none focus:border-[#f4b81f]"
                    required
                  />
                </div>

                {/* Title */}
                <div>
                  <label className="mb-2 block text-[16px] font-medium text-[#343A40]">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="enter title..."
                    className="h-[50px] w-full rounded-[4px] border border-[#C0C3C1] px-3 text-[16px] text-[#343A40] outline-none focus:border-[#f4b81f]"
                    required
                  />
                </div>
              </div>

              {/* Features */}
              <div className="mt-8">
                <label className="mb-2 block text-[16px] font-medium text-[#343A40]">
                  This Package Includes
                </label>

                <div className="space-y-3">
                  {form.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        placeholder="Enter feature..."
                        className="h-[50px] flex-1 rounded-[4px] border border-[#C0C3C1] px-3 text-[16px] outline-none focus:border-[#f4b81f]"
                      />
                      {form.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(index)}
                          className="h-[38px] rounded-[4px] border border-red-300 px-4 text-sm text-red-600 hover:bg-red-50"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex justify-center">
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-black text-black hover:bg-gray-100 active:scale-95"
                  >
                    <Plus size={18} strokeWidth={2.5} />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-10 flex items-center justify-end gap-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="h-[44px] min-w-[140px] rounded-[6px] border border-[#ff7f7f] bg-white text-[#ff5e5e] hover:bg-red-50"
                  disabled={createPlanMutation.isPending}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={createPlanMutation.isPending}
                  className="h-[44px] min-w-[140px] rounded-[6px] bg-[#f4b81f] font-medium text-white hover:bg-[#e0a51a] disabled:opacity-60"
                >
                  {createPlanMutation.isPending ? "Saving..." : "Create Plan"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
