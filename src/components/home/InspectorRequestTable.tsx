import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface RequestItem {
  id: string;
  name: string;
  email: string;
  status: 'Pending' | 'Completed' | 'Cancel';
  date: string;
  avatar?: string;
}

const requests: RequestItem[] = [
  {
    id: '1',
    name: 'Olivia Rhye',
    email: 'example@example.com',
    status: 'Pending',
    date: 'Jan 6, 2022',
  },
  {
    id: '2',
    name: 'Olivia Rhye',
    email: 'example@example.com',
    status: 'Cancel',
    date: 'Jan 5, 2022',
  },
  {
    id: '3',
    name: 'Olivia Rhye',
    email: 'example@example.com',
    status: 'Completed',
    date: 'Jan 5, 2022',
  },
  {
    id: '4',
    name: 'Olivia Rhye',
    email: 'example@example.com',
    status: 'Completed',
    date: 'Jan 6, 2022',
  },
  {
    id: '5',
    name: 'Olivia Rhye',
    email: 'example@example.com',
    status: 'Completed',
    date: 'Jan 6, 2022',
  },
];

const statusStyles = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Completed: 'bg-green-100 text-green-800',
  Cancel: 'bg-red-100 text-red-800',
};

export function InspectorRequestTable() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Recent Inspector Request</h3>
          <p className="text-sm text-gray-500">View the latest customer appointments and their current status.</p>
        </div>
        <button className="text-sm text-green-600 hover:text-green-700 font-semibold">See all</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left text-sm font-semibold text-gray-600 py-4 px-4">Customer</th>
              <th className="text-left text-sm font-semibold text-gray-600 py-4 px-4">Status</th>
              <th className="text-left text-sm font-semibold text-gray-600 py-4 px-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={request.avatar} />
                      <AvatarFallback>{request.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{request.name}</p>
                      <p className="text-xs text-gray-500">{request.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      statusStyles[request.status]
                    }`}
                  >
                    {request.status}
                  </span>
                </td>
                <td className="py-4 px-4 text-sm text-gray-500">{request.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
