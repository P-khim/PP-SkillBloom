"use client";

import Link from "next/link";
import { useState } from "react";
import {
  FiHome,
  FiUsers,
  FiBell,
  FiBarChart2,
  FiMenu,
  FiX,
} from "react-icons/fi";

const navItems = [
  { name: "Dashboard", href: "/Dashboard", icon: FiHome },
  { name: "Users", href: "/Dashboard/users", icon: FiUsers },
  { name: "Notifications", href: "/Dashboard/notifications", icon: FiBell },
  { name: "Statistics", href: "/Dashboard/statistics", icon: FiBarChart2 },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const renderLinks = () =>
    navItems.map(({ name, href, icon: Icon }) => (
      <Link
        key={name}
        href={href}
        className="flex items-center gap-3 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-black transition-colors duration-150 group"
        onClick={() => setIsOpen(false)}
      >
        <Icon className="w-5 h-5 text-gray-500 group-hover:text-black" />
        <span className="text-base font-medium">{name}</span>
      </Link>
    ));

  return (
    <>
      <div className="flex md:hidden items-center justify-between bg-white p-4 shadow-sm fixed top-0 left-0 right-0 z-40">
        <div className="text-xl font-semibold text-gray-800">SkillBloom</div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-600"
          aria-label="Toggle sidebar"
        >
          {isOpen ? (
            <FiX className="w-6 h-6" />
          ) : (
            <FiMenu className="w-6 h-6" />
          )}
        </button>
      </div>

      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-white border-r shadow-sm z-30 transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:flex md:flex-col`}
      >
        <div className="px-6 py-5 text-2xl font-bold border-b border-gray-100 text-gray-800">
          SkillBloom
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">{renderLinks()}</nav>
        <div className="px-4 py-4 border-t text-sm text-gray-500">
          © 2025 SkillBloom
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
