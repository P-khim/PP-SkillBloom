import DashboardLayout from "./layout";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { useState, useMemo } from "react";

const initialUsers = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", role: "User" },
  { id: 3, name: "Carol Davis", email: "carol@example.com", role: "User" },
  { id: 4, name: "David Brown", email: "david@example.com", role: "Moderator" },
  { id: 5, name: "Eva Green", email: "eva@example.com", role: "User" },
  { id: 6, name: "Frank Wilson", email: "frank@example.com", role: "Admin" },
  { id: 7, name: "Grace Lee", email: "grace@example.com", role: "User" },
  { id: 8, name: "Henry Miller", email: "henry@example.com", role: "User" },
  {
    id: 9,
    name: "Isabella Moore",
    email: "isabella@example.com",
    role: "User",
  },
  { id: 10, name: "Jack Taylor", email: "jack@example.com", role: "Moderator" },
];

const USERS_PER_PAGE = 5;

export default function UserList() {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter users by name or email
  const filteredUsers = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
    );
  }, [searchTerm, users]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

  // Get users to show on current page
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  const handleEdit = (id) => {
    alert(`Edit user with id ${id}`);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers((prev) => prev.filter((user) => user.id !== id));
      if ((currentPage - 1) * USERS_PER_PAGE >= filteredUsers.length - 1) {
        setCurrentPage(Math.max(currentPage - 1, 1));
      }
    }
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <DashboardLayout>
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h2 className="text-2xl font-bold">Manage Users</h2>
          <div className="flex flex-1 justify-between sm:justify-end gap-4">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full max-w-md px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={() => alert("Open Create User Modal or Navigate")}
              className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
            >
              + Create User
            </button>
          </div>
        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200 rounded-lg">
            <thead className="bg-gray-50 rounded-t-lg">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">
                  No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedUsers.map(({ id, name, email, role }, index) => (
                <tr key={id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                    {(currentPage - 1) * USERS_PER_PAGE + index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                    {name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                    <button
                      onClick={() => handleEdit(id)}
                      className="inline-flex items-center px-3 py-1 rounded text-blue-600 hover:bg-blue-100 focus:outline-none"
                      aria-label={`Edit user ${name}`}
                    >
                      <FiEdit2 className="mr-1" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(id)}
                      className="inline-flex items-center px-3 py-1 rounded text-red-600 hover:bg-red-100 focus:outline-none"
                      aria-label={`Delete user ${name}`}
                    >
                      <FiTrash2 className="mr-1" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="mt-4 flex justify-center space-x-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 disabled:opacity-50 hover:bg-gray-100"
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => goToPage(i + 1)}
                className={`px-3 py-1 rounded border ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
                aria-current={currentPage === i + 1 ? "page" : undefined}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 disabled:opacity-50 hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}