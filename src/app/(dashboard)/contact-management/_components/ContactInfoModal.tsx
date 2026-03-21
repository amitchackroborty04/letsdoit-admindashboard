"use client";

import { X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
} from "@/components/ui/dialog";

type ContactInfo = {
  name?: string;
  userName?: string;
  phone: string;
  email: string;
  message: string;
};

type ContactInfoModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact?: ContactInfo | null;
};

function InputField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <label className="space-y-2 text-[18px] font-semibold text-[#4f4f4f]">
      <span className="block">{label}</span>
      <input
        readOnly
        value={value}
        className="h-[48px] w-full rounded-[6px] border border-[#5A5A5A] bg-[#f6f6f6] px-4 text-base font-normal text-[#474747] outline-none"
      />
    </label>
  );
}

function TextareaField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <label className="space-y-2 text-[18px] font-semibold text-[#4f4f4f]">
      <span className="block">{label}</span>
      <textarea
        readOnly
        rows={4}
        value={value}
        className="w-full resize-none rounded-[6px] border border-[#5A5A5A] bg-[#f6f6f6] px-4 py-3 text-base font-normal leading-relaxed text-[#5a5a5a] outline-none"
      />
    </label>
  );
}

export default function ContactInfoModal({
  open,
  onOpenChange,
  contact,
}: ContactInfoModalProps) {
  const fullName = contact?.userName ?? contact?.name ?? "Sarah Jeff";
  const phoneNumber = contact?.phone ?? "+025465256";
  const emailAddress = contact?.email ?? "sarah@example.com";
  const message =
    contact?.message ??
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry.";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[92vw] max-w-[860px] rounded-[14px] border-0 bg-[#eeeeee] p-6 shadow-xl sm:p-8 [&>button]:hidden">
        
        {/* Close Button */}
        <DialogClose className="absolute right-6 top-6 inline-flex h-8 w-8 items-center justify-center rounded-full text-red-500 transition hover:bg-red-50">
          <X className="h-5 w-5" />
        </DialogClose>

        <div className="space-y-6">
          
          {/* Header */}
          <div className="space-y-3">
            <h2 className="text-[28px] font-semibold text-[#3f3f3f]">
              Contact Info
            </h2>
            <p className="text-[20px] font-semibold text-[#4a4a4a]">
              Customer Information
            </p>
          </div>

          {/* Inputs */}
          <div className="grid gap-5 sm:grid-cols-2">
            <InputField label="Full Name *" value={fullName} />
            <InputField label="Phone Number *" value={phoneNumber} />
          </div>

          <InputField label="Email Address *" value={emailAddress} />

          <TextareaField label="Message" value={message} />
        </div>
      </DialogContent>
    </Dialog>
  );
}