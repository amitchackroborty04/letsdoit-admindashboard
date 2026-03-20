"use client";

import { X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
} from "@/components/ui/dialog";

type DealershipItem = {
  name: string;
  email: string;
  date: string;
};

type DealershipDetailsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dealership?: DealershipItem | null;
};

function InfoBlock({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="space-y-1">
      <p className="text-[12px] font-semibold text-[#3b3b3b]">{label}</p>
      <p className="text-[14px] font-medium text-[#1f1f1f]">{value}</p>
    </div>
  );
}

function ParagraphBlock({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="space-y-2">
      <p className="text-[12px] font-semibold text-[#3b3b3b]">{label}</p>
      <p className="text-[12px] leading-relaxed text-[#6b6b6b]">{value}</p>
    </div>
  );
}

export default function DealershipDetailsModal({
  open,
  onOpenChange,
  dealership,
}: DealershipDetailsModalProps) {
  const name = dealership?.name ?? "Johnson";
  const email = dealership?.email ?? "example@gmail.com";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[980px] w-[95vw] h-[90vh] overflow-y-auto p-6 sm:p-8 lg:p-10 [&>button]:hidden">
        <DialogClose className="absolute right-5 top-5 inline-flex h-6 w-6 items-center justify-center rounded-sm border border-red-500 text-red-500 transition hover:bg-red-50">
          <X className="h-4 w-4" />
        </DialogClose>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <h3 className="text-[16px] font-semibold text-[#3f3f3f]">
              Personal Information:
            </h3>

            <div className="grid grid-cols-2 gap-6 border-b border-[#e5e5e5] pb-4">
              <InfoBlock label="First Name:" value={name.split(" ")[0] ?? name} />
              <InfoBlock label="Last Name:" value={name.split(" ")[1] ?? "Morris"} />
            </div>

            <div className="grid grid-cols-2 gap-6 border-b border-[#e5e5e5] pb-4">
              <InfoBlock label="Email:" value={email} />
              <InfoBlock label="Phone Number:" value="+2196412365" />
            </div>

            <div className="grid grid-cols-2 gap-6 border-b border-[#e5e5e5] pb-4">
              <InfoBlock label="Street Address:" value="USA,road 12" />
              <InfoBlock label="City:" value="Miami" />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <InfoBlock label="State:" value="Minnesota" />
              <InfoBlock label="ZIP Code:" value="154454" />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-[16px] font-semibold text-[#3f3f3f]">
              Professional Experience:
            </h3>

            <div className="grid grid-cols-2 gap-6 border-b border-[#e5e5e5] pb-4">
              <InfoBlock label="Years of Automotive Experience:" value="1-2 years" />
              <InfoBlock label="ASE Certification Number:" value="********" />
            </div>

            <ParagraphBlock
              label="Certifications & Training:"
              value="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry’s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it."
            />

            <div className="grid grid-cols-2 gap-6 border-b border-[#e5e5e5] pb-4">
              <InfoBlock label="Current/Most Recent Employer:" value="Lorem Ipsum" />
              <InfoBlock label="Contractor Status:" value="Part-time (10-20 hours)" />
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <h3 className="text-[16px] font-semibold text-[#3f3f3f]">
              Availability & Preferences:
            </h3>

            <div className="grid grid-cols-2 gap-6 border-b border-[#e5e5e5] pb-4">
              <InfoBlock label="Available Hours per Week:" value="12 hours" />
              <InfoBlock label="ASE Certification Number:" value="********" />
            </div>

            <ParagraphBlock
              label="Preferred Service Areas:"
              value="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry’s standard dummy text ever since the 1500s."
            />

            <div className="grid grid-cols-2 gap-6 text-[12px] text-[#3b3b3b]">
              <p>I have reliable transportation</p>
              <p>Available for weekend inspections</p>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-[16px] font-semibold text-[#3f3f3f]">
              Background Information:
            </h3>

            <div className="grid grid-cols-2 gap-6 border-b border-[#e5e5e5] pb-4">
              <InfoBlock label="Criminal Background:" value="No criminal background" />
              <InfoBlock label="Driving Record:" value="Clean driving record" />
            </div>

            <ParagraphBlock
              label="Professional References:"
              value="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry’s standard dummy text ever since the 1500s."
            />
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-[16px] font-semibold text-[#3f3f3f]">
            Additional Information:
          </h3>

          <ParagraphBlock
            label="Why are you interested in this position?"
            value="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry’s standard dummy text ever since the 1500s."
          />

          <ParagraphBlock
            label="Additional Skills or Experience"
            value="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry’s standard dummy text ever since the 1500s."
          />
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <button
            type="button"
            className="flex h-10 flex-1 items-center justify-center rounded-md bg-[#0a6b0a] text-sm font-semibold text-white transition hover:bg-[#085f08]"
          >
            Approve
          </button>
          <button
            type="button"
            className="flex h-10 flex-1 items-center justify-center rounded-md bg-[#ff1a1a] text-sm font-semibold text-white transition hover:bg-[#e51717]"
          >
            Reject
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
