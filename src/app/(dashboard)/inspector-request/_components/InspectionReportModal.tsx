"use client";

import { useMemo, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, CheckCircle2, ImageOff, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

type ChecklistStatus = "ok" | "report" | "pending";

type TextChecklistItem = {
  title: string;
  status: ChecklistStatus;
  note?: string;
};

type ReportPhotoItem = {
  id: string;
  title: string;
  fileName?: string;
  preview?: string;
};

type ReportData = {
  requiredPhotos: ReportPhotoItem[];
  additionalPhotos: ReportPhotoItem[];
  vehicleRepresentation: TextChecklistItem[];
  tiresBrakes: TextChecklistItem[];
  exterior: TextChecklistItem[];
  engine: TextChecklistItem[];
  interior: TextChecklistItem[];
  fluidCheck: TextChecklistItem[];
  roadTest: TextChecklistItem[];
  scanTool: TextChecklistItem[];
  focusAreas: TextChecklistItem[];
  finalSummary: {
    note: string;
  };
  submittedAt?: string;
  title?: string;
  notes?: string;
};

type InspectionReportResponse = {
  status?: boolean;
  message?: string;
  data?: {
    _id?: string;
    title?: string;
    notes?: string;
    photos?: Record<string, string | string[] | undefined>;
    vehicleDocumentation?: Record<string, { status?: boolean; notes?: string }>;
    vehicleTiresBrakes?: Record<string, { status?: boolean; notes?: string }>;
    vehicleExterior?: Record<string, { status?: boolean; notes?: string }>;
    vehicleEngine?: Record<string, { status?: boolean; notes?: string }>;
    vehicleInterior?: Record<string, { status?: boolean; notes?: string }>;
    vehicleRoadTest?: Record<string, { status?: boolean; notes?: string }>;
    vehicleFluids?: Record<string, { status?: boolean; notes?: string }>;
    vehicleScanTool?: Record<string, { status?: boolean; notes?: string }>;
    vehicleFocusAreas?: Record<string, { status?: boolean; notes?: string }>;
    finalSummary?: { notes?: string };
    createdAt?: string;
    updatedAt?: string;
  };
};

type InspectionReportModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  checklistId?: string | null;
  token?: string | null;
};

const emptyReportData: ReportData = {
  requiredPhotos: [],
  additionalPhotos: [],
  vehicleRepresentation: [],
  tiresBrakes: [],
  exterior: [],
  engine: [],
  interior: [],
  fluidCheck: [],
  roadTest: [],
  scanTool: [],
  focusAreas: [],
  finalSummary: { note: "" },
};

type ProgressStyle = CSSProperties & { "--progress"?: string };

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="py-6 text-center">
      <h2 className="text-[16px] font-semibold uppercase tracking-[0.22em] text-[#131313]">
        {title}
      </h2>
    </div>
  );
}

function Divider() {
  return <div className="my-6 h-px w-full bg-[#d7d7d7]" />;
}

function InfoGrid({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-4 md:grid-cols-3">
      {rows.map((row) => (
        <div key={row.label}>
          <p className="text-[16px] font-medium uppercase tracking-wide text-[#131313]">
            {row.label}
          </p>
          <p className="mt-1 text-[16px] font-semibold text-[#131313]">
            {row.value}
          </p>
        </div>
      ))}
    </div>
  );
}

function ResultBadge({ value }: { value: string }) {
  const normalized = value.toLowerCase();

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[16px] font-semibold text-[#131313] ${
        normalized === "ok"
          ? "bg-green-100"
          : normalized === "report"
          ? "bg-amber-100"
          : "bg-[#f2f2f2]"
      }`}
    >
      {value}
    </span>
  );
}

function InspectionTable({
  title,
  rows,
}: {
  title: string;
  rows: { item: string; result: string; comment: string }[];
}) {
  const tableRows =
    rows.length > 0
      ? rows
      : [
          {
            item: "No items available",
            result: "Pending",
            comment: "—",
          },
        ];

  return (
    <section>
      <SectionTitle title={title} />

      <div className="overflow-hidden rounded-[10px] border border-[#d8d8d8] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse">
            <thead>
              <tr className="border-b border-[#d8d8d8] bg-[#fafafa]">
                <th className="px-4 py-3 text-left text-[16px] font-semibold text-[#131313]">
                  Area
                </th>
                <th className="px-4 py-3 text-left text-[16px] font-semibold text-[#131313]">
                  Result
                </th>
                <th className="px-4 py-3 text-left text-[16px] font-semibold text-[#131313]">
                  Comments
                </th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row, i) => (
                <tr key={i} className="border-b border-[#ececec] last:border-b-0">
                  <td className="px-4 py-3 text-[16px] text-[#131313]">
                    {row.item}
                  </td>
                  <td className="px-4 py-3">
                    <ResultBadge value={row.result} />
                  </td>
                  <td className="px-4 py-3 text-[16px] text-[#131313]">
                    {row.comment}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function GallerySection({
  title,
  items,
}: {
  title: string;
  items: ReportPhotoItem[];
}) {
  const galleryItems =
    items.length > 0
      ? items
      : [
          {
            id: "empty",
            title: "No photos uploaded",
          },
        ];

  return (
    <section>
      <SectionTitle title={title} />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {galleryItems.map((image) => {
          const isDynamic =
            image.preview?.startsWith("data:") ||
            image.preview?.startsWith("blob:");
          const hasPreview = Boolean(image.preview);

          return (
            <div
              key={image.id}
              className="overflow-hidden rounded-[6px] border border-[#d8d8d8] bg-white"
            >
              {hasPreview ? (
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={image.preview as string}
                    alt={image.title}
                    fill
                    className="object-cover"
                    unoptimized={Boolean(isDynamic)}
                  />
                </div>
              ) : (
                <div className="flex aspect-[4/3] w-full items-center justify-center bg-[#f4f4f4]">
                  <div className="flex flex-col items-center gap-2">
                    <ImageOff className="h-6 w-6 text-[#9a9a9a]" />
                    <p className="text-[16px] font-medium text-[#131313]">
                      No image uploaded
                    </p>
                  </div>
                </div>
              )}
              <div className="px-2 py-1">
                <p className="truncate text-[16px] font-medium text-[#131313]">
                  {image.title}
                </p>
                {image.fileName ? (
                  <p className="truncate text-[16px] text-[#131313]">
                    {image.fileName}
                  </p>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function formatReportDate(value?: string) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function getResultLabel(status: TextChecklistItem["status"]) {
  if (status === "ok") return "OK";
  if (status === "report") return "Report";
  return "Pending";
}

function buildTableRows(items: TextChecklistItem[]) {
  return items.map((item) => ({
    item: item.title,
    result: getResultLabel(item.status),
    comment: item.note?.trim() ? item.note : "—",
  }));
}

function humanizeKey(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function mapChecklistSection(
  section?: Record<string, { status?: boolean; notes?: string }>
): TextChecklistItem[] {
  if (!section) return [];
  return Object.entries(section).map(([key, item]) => {
    const status: ChecklistStatus =
      item?.status === true
        ? "ok"
        : item?.status === false
        ? "report"
        : "pending";

    return {
      title: humanizeKey(key),
      status,
      note: item?.notes ?? "",
    };
  });
}

function normalizeReportData(payload?: InspectionReportResponse | null): ReportData {
  if (!payload?.data) return emptyReportData;

  const photos = payload.data.photos ?? {};
  const additional =
    Array.isArray(photos.additionalPhotos) && photos.additionalPhotos.length > 0
      ? photos.additionalPhotos
      : [];

  const requiredPhotos = Object.entries(photos)
    .filter(([key]) => key !== "additionalPhotos")
    .map(([key, value]) => ({
      id: key,
      title: humanizeKey(key),
      preview: typeof value === "string" && value ? value : undefined,
    }));

  const additionalPhotos = additional.map((item, index) => ({
    id: `additional-${index + 1}`,
    title: `Additional Photo ${index + 1}`,
    preview: typeof item === "string" && item ? item : undefined,
  }));

  return {
    ...emptyReportData,
    title: payload.data.title,
    notes: payload.data.notes,
    submittedAt: payload.data.updatedAt ?? payload.data.createdAt,
    requiredPhotos,
    additionalPhotos,
    vehicleRepresentation: mapChecklistSection(payload.data.vehicleDocumentation),
    tiresBrakes: mapChecklistSection(payload.data.vehicleTiresBrakes),
    exterior: mapChecklistSection(payload.data.vehicleExterior),
    engine: mapChecklistSection(payload.data.vehicleEngine),
    interior: mapChecklistSection(payload.data.vehicleInterior),
    roadTest: mapChecklistSection(payload.data.vehicleRoadTest),
    fluidCheck: mapChecklistSection(payload.data.vehicleFluids),
    scanTool: mapChecklistSection(payload.data.vehicleScanTool),
    focusAreas: mapChecklistSection(payload.data.vehicleFocusAreas),
    finalSummary: { note: payload.data.finalSummary?.notes ?? "" },
  };
}

export default function InspectionReportModal({
  open,
  onOpenChange,
  checklistId,
  token,
}: InspectionReportModalProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const { data, isLoading, error } = useQuery<InspectionReportResponse>({
    queryKey: ["inspection-report", checklistId, token],
    enabled: Boolean(open && checklistId && token),
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/inspection-checklists/vehicle-documentation/${checklistId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch inspection report");
      }

      return res.json();
    },
  });

  const reportData = useMemo(() => normalizeReportData(data), [data]);

  const {
    overviewRows,
    reportDate,
    percent,
    summaryText,
    heroPhoto,
    overviewPhoto,
  } = useMemo(() => {
    const requiredUploaded = reportData.requiredPhotos.filter(
      (item) => item.preview || item.fileName
    ).length;
    const additionalUploaded = reportData.additionalPhotos.filter(
      (item) => item.preview || item.fileName
    ).length;
    const totalPhotos =
      reportData.requiredPhotos.length + reportData.additionalPhotos.length;
    const uploadedPhotos = requiredUploaded + additionalUploaded;

    const allTextItems = [
      ...reportData.vehicleRepresentation,
      ...reportData.tiresBrakes,
      ...reportData.exterior,
      ...reportData.engine,
      ...reportData.interior,
      ...reportData.fluidCheck,
      ...reportData.roadTest,
      ...reportData.scanTool,
      ...reportData.focusAreas,
    ];

    const okCount = allTextItems.filter((item) => item.status === "ok").length;
    const reportCount = allTextItems.filter(
      (item) => item.status === "report"
    ).length;
    const pendingCount = allTextItems.length - okCount - reportCount;

    const summaryNote = reportData.finalSummary?.note?.trim() ?? "";
    const summaryText = summaryNote || "No final summary provided.";

    const totalItems = allTextItems.length + totalPhotos + 1;
    const completedItems =
      okCount + reportCount + uploadedPhotos + (summaryNote ? 1 : 0);
    const percent = totalItems
      ? Math.round((completedItems / totalItems) * 100)
      : 0;

    const reportDate = formatReportDate(reportData.submittedAt);
    const heroPhoto =
      reportData.requiredPhotos.find((item) => item.preview)?.preview || "";
    const overviewPhoto =
      reportData.additionalPhotos.find((item) => item.preview)?.preview ||
      heroPhoto;

    const overviewRows = [
      {
        label: "Required photos",
        value: `${requiredUploaded}/${reportData.requiredPhotos.length}`,
      },
      {
        label: "Additional photos",
        value: `${additionalUploaded}/${reportData.additionalPhotos.length}`,
      },
      { label: "OK items", value: `${okCount}` },
      { label: "Reported items", value: `${reportCount}` },
      { label: "Pending items", value: `${pendingCount}` },
      { label: "Completion", value: `${percent}%` },
    ];

    return {
      overviewRows,
      reportDate,
      percent,
      summaryText,
      heroPhoto,
      overviewPhoto,
    };
  }, [reportData]);

  const progressStyle: ProgressStyle = {
    "--progress": `${percent * 3.6}deg`,
  };

  const handleDownloadPdf = async () => {
    if (!contentRef.current) return;

    setIsDownloading(true);
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "pt", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position -= pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(
        reportData.title
          ? `${reportData.title.replace(/\s+/g, "-").toLowerCase()}.pdf`
          : "inspection-report.pdf"
      );
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-[1100px] overflow-y-auto border border-[#d6d6d6] bg-[#f7f7f5] p-0">
        <DialogHeader className="border-b border-[#e1e1e1] bg-white px-4 py-3 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <DialogTitle className="text-[18px] font-semibold text-[#1f1f1f]">
              Inspection Report
            </DialogTitle>
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isDownloading || isLoading || !data?.data}
              className={`rounded-[6px] px-4 py-2 text-[14px] font-semibold ${
                isDownloading || isLoading || !data?.data
                  ? "cursor-not-allowed bg-[#e6e6e6] text-[#8c8c8c]"
                  : "bg-[#111111] text-white"
              }`}
            >
              {isDownloading ? "Preparing PDF..." : "Download PDF"}
            </button>
          </div>
        </DialogHeader>

        <div ref={contentRef} className="px-4 py-4 sm:px-6 sm:py-6">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-6 w-56" />
              <Skeleton className="h-64 w-full" />
            </div>
          ) : error ? (
            <div className="rounded-md border border-[#f2c4c4] bg-[#fff5f5] p-4 text-[14px] text-[#9f2d2d]">
              {(error as Error).message || "Failed to load report"}
            </div>
          ) : (
            <div className="overflow-hidden rounded-[10px] border border-[#dadada] bg-white shadow-sm">
              <CardContent className="p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col items-center gap-3">
                  <div className="rounded border border-[#d9d9d9] bg-white px-3 py-2 text-[16px] font-semibold text-[#131313]">
                    VEHICLE REPORT
                  </div>

                  <div className="text-center">
                    <h1 className="text-[20px] font-bold uppercase tracking-[0.16em] text-[#111] sm:text-[28px]">
                      {reportData.title || "Inspection Report"}
                    </h1>
                    {reportData.notes ? (
                      <p className="mt-2 text-[14px] text-[#5c5c5c]">
                        {reportData.notes}
                      </p>
                    ) : null}
                  </div>
                </div>

                <Divider />

                <div className="mx-auto max-w-[320px]">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[4px] border border-[#ddd]">
                    {heroPhoto ? (
                      <Image
                        src={heroPhoto}
                        alt="Inspection hero"
                        fill
                        className="object-cover"
                        unoptimized={
                          heroPhoto.startsWith("data:") ||
                          heroPhoto.startsWith("blob:")
                        }
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[#f4f4f4]">
                        <div className="flex flex-col items-center gap-2">
                          <ImageOff className="h-7 w-7 text-[#9a9a9a]" />
                          <p className="text-[16px] font-medium text-[#131313]">
                            No image uploaded
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <div className="inline-flex items-center gap-1 text-[16px] font-medium uppercase tracking-[0.18em] text-[#131313]">
                    <Star className="h-3.5 w-3.5 fill-[#f0b400] text-[#f0b400]" />
                    {reportDate || "—"}
                  </div>
                </div>

                <Divider />

                <div className="flex flex-col items-center justify-center">
                  <div
                    className="relative flex h-[120px] w-[120px] items-center justify-center rounded-full bg-[conic-gradient(#1f7a1f_var(--progress),#e5e5e5_0)] p-[10px]"
                    style={progressStyle}
                  >
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-white">
                      <span className="text-[16px] font-bold text-[#131313]">
                        {percent}%
                      </span>
                    </div>
                  </div>

                  <Card className="mt-6 max-w-[520px] border border-[#eadfbf] bg-[#fbf4df] shadow-none">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="mt-0.5 h-4 w-4 text-[#7b5b00]" />
                        <p className="text-[16px] leading-6 text-[#131313]">
                          {summaryText}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Divider />

                <SectionTitle title="Overview" />

                <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
                  <div>
                    <InfoGrid rows={overviewRows} />
                  </div>

                  <div className="rounded-[10px] border border-[#d8d8d8] bg-white p-4">
                    <div className="relative aspect-[16/10] overflow-hidden rounded-[6px]">
                      {overviewPhoto ? (
                        <Image
                          src={overviewPhoto}
                          alt="Vehicle overview"
                          fill
                          className="object-cover"
                          unoptimized={
                            overviewPhoto.startsWith("data:") ||
                            overviewPhoto.startsWith("blob:")
                          }
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[#f4f4f4]">
                          <div className="flex flex-col items-center gap-2">
                            <ImageOff className="h-6 w-6 text-[#9a9a9a]" />
                            <p className="text-[16px] font-medium text-[#131313]">
                              No image uploaded
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-3">
                      <div className="flex items-center justify-between text-[16px] text-[#131313]">
                        <span>Overall score</span>
                        <span className="font-semibold">{percent}%</span>
                      </div>
                      <Progress value={percent} className="mt-2 h-2" />
                    </div>
                  </div>
                </div>

                <Divider />

                <InspectionTable
                  title="Vehicle Documentation"
                  rows={buildTableRows(reportData.vehicleRepresentation)}
                />

                <Divider />

                <InspectionTable
                  title="Tires & Brakes"
                  rows={buildTableRows(reportData.tiresBrakes)}
                />

                <Divider />

                <InspectionTable
                  title="Exterior"
                  rows={buildTableRows(reportData.exterior)}
                />

                <Divider />

                <GallerySection
                  title="Required Photos"
                  items={reportData.requiredPhotos}
                />

                <Divider />

                <GallerySection
                  title="Additional Photos"
                  items={reportData.additionalPhotos}
                />

                <Divider />

                <InspectionTable
                  title="Interior"
                  rows={buildTableRows(reportData.interior)}
                />

                <Divider />

                <InspectionTable
                  title="Engine"
                  rows={buildTableRows(reportData.engine)}
                />

                <Divider />

                <InspectionTable
                  title="Road Test"
                  rows={buildTableRows(reportData.roadTest)}
                />

                <Divider />

                <InspectionTable
                  title="Fluid Check"
                  rows={buildTableRows(reportData.fluidCheck)}
                />

                <Divider />

                <InspectionTable
                  title="Scan Tool"
                  rows={buildTableRows(reportData.scanTool)}
                />

                <Divider />

                <InspectionTable
                  title="Focus Areas"
                  rows={buildTableRows(reportData.focusAreas)}
                />

                <Divider />

                <section>
                  <SectionTitle title="Final Summary" />

                  <div className="rounded-[10px] border border-[#d8d8d8] bg-white p-4 sm:p-5">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-700" />
                      <p className="text-[16px] leading-6 text-[#131313]">
                        {summaryText}
                      </p>
                    </div>
                  </div>
                </section>
              </CardContent>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
