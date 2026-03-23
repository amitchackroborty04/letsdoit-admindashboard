"use client";

import { X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
} from "@/components/ui/dialog";
import type { Inspector } from "../_types";

type InspectorDetailsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inspector?: Inspector | null;
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

export default function InspectorDetailsModal({
  open,
  onOpenChange,
  inspector,
}: InspectorDetailsModalProps) {
  const profile = inspector?.inspectorProfile;
  const address = inspector?.address;

  const firstName = inspector?.firstName || "—";
  const lastName = inspector?.lastName || "—";
  const email = inspector?.email || "—";
  const phone = inspector?.phone || "—";

  const street = address?.StreetAddress || "—";
  const city = address?.city || "—";
  const state = address?.state || "—";
  const postalCode = address?.postalCode || "—";

  const yearsOfExperience = profile?.yearsOfExperience || "—";
  const aseCertificationNumber = profile?.aseCertificationNumber || "—";
  const certificationsAndTraining = profile?.certificationsAndTraining || "—";
  const currentEmployer = profile?.currentEmployer || "—";
  const contractorStatus = profile?.contractorStatus || "—";
  const availableHoursPerWeek = profile?.availableHoursPerWeek || "—";
  const preferredServiceAreas = profile?.preferredServiceAreas?.length
    ? profile.preferredServiceAreas.join(", ")
    : "—";
  const yesNo = (value?: boolean | null) =>
    value === true ? "Yes" : value === false ? "No" : "—";
  const hasReliableTransportation = yesNo(profile?.hasReliableTransportation);
  const availableOnWeekends = yesNo(profile?.availableOnWeekends);
  const criminalBackground = profile?.criminalBackground || "—";
  const drivingRecord = profile?.drivingRecord || "—";
  const professionalReferences = profile?.professionalReferences || "—";
  const motivation = profile?.motivation || "—";
  const additionalSkills = profile?.additionalSkills || "—";

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
              <InfoBlock label="First Name:" value={firstName} />
              <InfoBlock label="Last Name:" value={lastName} />
            </div>

            <div className="grid grid-cols-2 gap-6 border-b border-[#e5e5e5] pb-4">
              <InfoBlock label="Email:" value={email} />
              <InfoBlock label="Phone Number:" value={phone} />
            </div>

            <div className="grid grid-cols-2 gap-6 border-b border-[#e5e5e5] pb-4">
              <InfoBlock label="Street Address:" value={street} />
              <InfoBlock label="City:" value={city} />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <InfoBlock label="State:" value={state} />
              <InfoBlock label="ZIP Code:" value={postalCode} />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-[16px] font-semibold text-[#3f3f3f]">
              Professional Experience:
            </h3>

            <div className="grid grid-cols-2 gap-6 border-b border-[#e5e5e5] pb-4">
              <InfoBlock
                label="Years of Automotive Experience:"
                value={yearsOfExperience}
              />
              <InfoBlock
                label="ASE Certification Number:"
                value={aseCertificationNumber}
              />
            </div>

            <ParagraphBlock
              label="Certifications & Training:"
              value={certificationsAndTraining}
            />

            <div className="grid grid-cols-2 gap-6 border-b border-[#e5e5e5] pb-4">
              <InfoBlock
                label="Current/Most Recent Employer:"
                value={currentEmployer}
              />
              <InfoBlock label="Contractor Status:" value={contractorStatus} />
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <h3 className="text-[16px] font-semibold text-[#3f3f3f]">
              Availability & Preferences:
            </h3>

            <div className="grid grid-cols-2 gap-6 border-b border-[#e5e5e5] pb-4">
              <InfoBlock
                label="Available Hours per Week:"
                value={availableHoursPerWeek}
              />
              <InfoBlock label="Contractor Status:" value={contractorStatus} />
            </div>

            <ParagraphBlock
              label="Preferred Service Areas:"
              value={preferredServiceAreas}
            />

            <div className="grid grid-cols-2 gap-6 text-[12px] text-[#3b3b3b]">
              <p>Reliable transportation: {hasReliableTransportation}</p>
              <p>Available on weekends: {availableOnWeekends}</p>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-[16px] font-semibold text-[#3f3f3f]">
              Background Information:
            </h3>

            <div className="grid grid-cols-2 gap-6 border-b border-[#e5e5e5] pb-4">
              <InfoBlock label="Criminal Background:" value={criminalBackground} />
              <InfoBlock label="Driving Record:" value={drivingRecord} />
            </div>

            <ParagraphBlock
              label="Professional References:"
              value={professionalReferences}
            />
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-[16px] font-semibold text-[#3f3f3f]">
            Additional Information:
          </h3>

          <ParagraphBlock
            label="Why are you interested in this position?"
            value={motivation}
          />

          <ParagraphBlock
            label="Additional Skills or Experience"
            value={additionalSkills}
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
