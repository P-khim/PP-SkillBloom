import React, { useState, useMemo } from "react";

const activityData = [
  {
    id: 1,
    user: "Jane Doe",
    activity: "Created Gig #452",
    status: "Pending",
    date: "2025-05-27",
  },
  {
    id: 2,
    user: "John Smith",
    activity: "Completed Gig #420",
    status: "Completed",
    date: "2025-05-26",
  },
  {
    id: 3,
    user: "Alice Chen",
    activity: "Joined SkillBloom",
    status: "New",
    date: "2025-05-25",
  },
  {
    id: 4,
    user: "Bob Lee",
    activity: "Updated profile",
    status: "Completed",
    date: "2025-05-24",
  },
  {
    id: 5,
    user: "Emma Watson",
    activity: "Applied for Gig #460",
    status: "Pending",
    date: "2025-05-23",
  },
  {
    id: 6,
    user: "David Miller",
    activity: "Withdrawn Gig #419",
    status: "Completed",
    date: "2025-05-22",
  },
  {
    id: 7,
    user: "Lara Croft",
    activity: "Created Gig #461",
    status: "Pending",
    date: "2025-05-21",
  },
  {
    id: 8,
    user: "Bruce Wayne",
    activity: "Verified Email",
    status: "Completed",
    date: "2025-05-20",
  },
  {
    id: 9,
    user: "Clark Kent",
    activity: "Joined SkillBloom",
    status: "New",
    date: "2025-05-19",
  },
  {
    id: 10,
    user: "Diana Prince",
    activity: "Completed Gig #450",
    status: "Completed",
    date: "2025-05-18",
  },
  {
    id: 11,
    user: "Peter Parker",
    activity: "Requested refund",
    status: "Pending",
    date: "2025-05-17",
  },
];

export default function RecentActivityTable() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const filteredData = useMemo(() => {
    return activityData.filter(
      (item) =>
        item.user.toLowerCase().includes(search.toLowerCase()) ||
        item.activity.toLowerCase().includes(search.toLowerCase()) ||
        item.status.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h2 className="text-xl font-semibold text-gray-800">Recent Activity</h2>
        <input
          type="text"
          placeholder="Search activity..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full sm:w-64 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wide">
            <tr>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">User</th>
              <th className="px-6 py-3 text-left">Activity</th>
              <th className="px-6 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm divide-y divide-gray-200">
            {paginatedData.length > 0 ? (
              paginatedData.map(({ id, user, activity, status, date }) => (
                <tr key={id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{date}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    {user}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{activity}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-500">
                  No matching activity found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-600">
          Page {page} of {totalPages}
        </p>
        <div className="space-x-2">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              page === 1
                ? "bg-gray-200 text-gray-400"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Previous
          </button>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              page === totalPages
                ? "bg-gray-200 text-gray-400"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
