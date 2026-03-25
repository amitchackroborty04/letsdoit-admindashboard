'use client';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const PAGE_SIZE = 5;

type PendingInspector = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string | null;
};

type PendingInspectorsResponse = {
  status: boolean;
  message?: string;
  data?: {
    inspectors: PendingInspector[];
  };
};

const fetchPendingInspectors = async (
  token?: string | null
): Promise<PendingInspectorsResponse> => {
  const { data } = await axios.get<PendingInspectorsResponse>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/all-inspectors`,
    {
      params: {
        page: 1,
        limit: PAGE_SIZE,
        isApproved: false,
      },
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    }
  );

  return data;
};

export function PendingApprovals() {
  const { data: session, status } = useSession();
  const token = session?.accessToken;

  const { data, isLoading, isError } = useQuery<PendingInspectorsResponse, Error>({
    queryKey: ['pending-inspectors', token],
    queryFn: () => fetchPendingInspectors(token),
    enabled: status !== 'loading',
    refetchOnWindowFocus: true,
  });

  const inspectors = data?.data?.inspectors ?? [];

  const SkeletonRow = () => (
    <div className="flex items-center justify-between p-4 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
        <div>
          <div className="h-4 w-32 rounded bg-gray-200 animate-pulse mb-2" />
          <div className="h-3 w-44 rounded bg-gray-200 animate-pulse" />
        </div>
      </div>
      <div className="h-5 w-5 rounded bg-gray-200 animate-pulse" />
    </div>
  );

  return (
    <div className="flex h-[514px] flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Pending Inspector Approvals</h3>
          <p className="text-sm text-gray-500">Approve pending professional profiles.</p>
        </div>
        <Link href="/inspector-management">
          <button className="text-sm text-green-600 hover:text-green-700 font-semibold">See all</button>
        </Link>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pr-1">
        {isLoading ? (
          <>
            {Array.from({ length: PAGE_SIZE }).map((_, index) => (
              <SkeletonRow key={`pending-skeleton-${index}`} />
            ))}
          </>
        ) : isError ? (
          <div className="flex h-full items-center justify-center text-sm text-red-600">
            Failed to load pending inspectors.
          </div>
        ) : inspectors.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-gray-500">
            No pending inspectors found.
          </div>
        ) : (
          inspectors.map((inspector) => {
            const initials = `${inspector.firstName?.[0] ?? ''}${inspector.lastName?.[0] ?? ''}`;
            return (
              <div
                key={inspector._id}
                className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={inspector.profileImage ?? ''} />
                    <AvatarFallback>{initials || 'I'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {inspector.firstName} {inspector.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{inspector.email}</p>
                  </div>
                </div>
                {/* <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical size={20} />
                </button> */}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
