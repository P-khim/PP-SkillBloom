"use client";

import { useState, useRef, useEffect } from "react";
import { FiMenu, FiUser, FiLogOut, FiSettings } from "react-icons/fi";
import SkillBloomLogo from "../../../components/SkillBloomLogo";

export default function Navbar({ onToggleSidebar }) {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b px-4 py-5 flex justify-between items-center shadow-sm fixed top-0 left-0 right-0 z-40">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded hover:bg-gray-100 transition md:hidden"
          aria-label="Toggle sidebar"
        >
          <FiMenu className="h-5 w-5 text-gray-600" />
        </button>
        <SkillBloomLogo fillColor={"#404145"} />
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!isDropdownOpen)}
          className="p-2 rounded-full hover:bg-gray-100 transition"
          aria-label="User menu"
        >
          <FiUser className="h-5 w-5 text-gray-600" />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50">
            <a
              href="#"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <FiSettings className="mr-2" /> Settings
            </a>
            <a
              href="#"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <FiLogOut className="mr-2" /> Logout
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
