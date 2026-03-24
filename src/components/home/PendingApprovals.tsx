import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MoreVertical } from 'lucide-react';
import Link from 'next/link';

interface ApprovalItem {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

const approvals: ApprovalItem[] = [
  {
    id: '1',
    name: 'Cameron Williamson',
    role: 'Product Designer',
  },
  {
    id: '2',
    name: 'Cameron Williamson',
    role: 'Product Designer',
  },
  {
    id: '3',
    name: 'Cameron Williamson',
    role: 'Product Designer',
  },
  {
    id: '4',
    name: 'Cameron Williamson',
    role: 'Product Designer',
  },
  {
    id: '5',
    name: 'Cameron Williamson',
    role: 'Product Designer',
  },
];

export function PendingApprovals() {
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
        {approvals.map((approval) => (
          <div key={approval.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={approval.avatar} />
                <AvatarFallback>{approval.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-gray-900">{approval.name}</p>
                <p className="text-xs text-gray-500">{approval.role}</p>
              </div>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreVertical size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
