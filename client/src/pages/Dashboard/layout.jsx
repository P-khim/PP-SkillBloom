import Navbar from "./components/Navbar";
import Sidebar from "./components/Siderbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 overflow-auto p-12 pt-28 bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
}
