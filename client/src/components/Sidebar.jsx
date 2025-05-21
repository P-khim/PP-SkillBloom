import { FaPlus } from "react-icons/fa";

export default function Sidebar() {
  return (
    <div className="w-full md:w-1/4 bg-gradient-to-b from-gray-900 to-gray-700 rounded-l-2xl p-6 shadow-md">
      <div className="flex flex-col items-center text-center relative">
        <div className="relative w-32 h-32 mb-2">
          <img
            src="/service1.png"
            alt="Profile"
            className="w-32 h-32 rounded-full border-2"
          />
          <button
            className="absolute bottom-1 right-1 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg"
            title="Add Profile Picture"
            onClick={() => alert("Add profile picture clicked")}
          >
            <FaPlus size={12} />
          </button>
        </div>
        <span className="text-lg font-semibold text-white">Jessie Lane</span>
        <small className="text-sm text-gray-500">
          (Click to change your photo)
        </small>
      </div>

      <ul className="mt-10 space-y-4 text-left font-medium">
        <li className="text-white">Account</li>
        <li className="text-gray-600  hover:text-white cursor-pointer">
          Security & privacy
        </li>
        <li className="text-gray-600 hover:text-white cursor-pointer">
          History
        </li>
      </ul>
    </div>
  );
}
