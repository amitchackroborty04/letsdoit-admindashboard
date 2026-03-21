"use client";

import { useState } from "react";
import { Plus, ChevronDown } from "lucide-react";
import Link from "next/link";

export default function AddSubscriptionPage() {
  const [packageIncludes, setPackageIncludes] = useState(["Visual exterior inspection"]);

  const handleAddInclude = () => {
    setPackageIncludes((prev) => [...prev, ""]);
  };

  const handleRemoveInclude = (index: number) => {
    setPackageIncludes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleIncludeChange = (index: number, value: string) => {
    const updated = [...packageIncludes];
    updated[index] = value;
    setPackageIncludes(updated);
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

          {/* Form Card */}
          <div className="mt-7 rounded-[12px] bg-white px-4 py-4 shadow-[0_0_0_1px_rgba(0,0,0,0.03)] md:px-5 md:py-4">
            {/* Top Row */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {/* Select Plan Name */}
              <div>
                <label className="mb-2 block text-[16px] font-medium text-[#343A40]">
                  Select Plan Name
                </label>
                <div className="relative">
                  <select className="h-[50px] w-full appearance-none rounded-[4px] border border-[#C0C3C1] bg-white px-3 pr-10 text-[16px] text-[#8E938F] outline-none">
                    <option>Basic Inspection!</option>
                    <option>Plus Inspection!</option>
                    <option>Complete Inspection!</option>
                  </select>
                  <div className="pointer-events-none absolute right-2 top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center rounded-[2px] bg-[#f4b81f] text-black">
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
                  type="text"
                  defaultValue="$175"
                  className="h-[50px] w-full rounded-[4px] border border-[#C0C3C1] px-3 text-[16px] text-[#9a9a9a] outline-none"
                />
              </div>

              {/* Title */}
              <div>
                <label className="mb-2 block text-[16px] font-medium text-[#343A40]">
                  Title
                </label>
                <input
                  type="text"
                  defaultValue="Essential vehicle check"
                  className="h-[50px] w-full rounded-[4px] border border-[#C0C3C1] px-3 text-[16px] text-[#9a9a9a] outline-none"
                />
              </div>
            </div>

            {/* Package Include */}
            <div className="mt-4">
              <label className="mb-2 block text-[16px] font-medium text-[#343A40]">
                This Package Include
              </label>

              <div className="space-y-3">
                {packageIncludes.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleIncludeChange(index, e.target.value)}
                      placeholder="Visual exterior inspection"
                      className="h-[50px] w-full rounded-[4px] border border-[#C0C3C1] px-3 text-[16px] text-[#9a9a9a] outline-none"
                    />

                    {packageIncludes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveInclude(index)}
                        className="h-[38px] rounded-[4px] border border-red-300 px-3 text-[12px] text-red-500 hover:bg-red-50"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Add More */}
              <div className="mt-3 flex justify-center">
                <button
                  type="button"
                  onClick={handleAddInclude}
                  className="flex h-4 w-4 items-center justify-center rounded-[2px] border border-black text-black transition hover:scale-105"
                >
                  <Plus size={11} strokeWidth={2.2} />
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                className="h-[38px] min-w-[128px] rounded-[4px] border border-[#ff7f7f] bg-white px-6 text-[12px] font-medium text-[#ff5e5e]"
              >
                Cancel
              </button>

              <button
                type="button"
                className="h-[38px] min-w-[128px] rounded-[4px] bg-[#f4b81f] px-6 text-[12px] font-medium text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
