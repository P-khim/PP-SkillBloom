"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FiUsers, FiClipboard, FiDollarSign } from "react-icons/fi";
import DashboardLayout from "./layout";
import RecentActivityTable from "./components/RecentActivityTable";
import { GET_USER_INFO, HOST } from "../../utils/constants";
import { useStateProvider } from "../../context/StateContext";
import { useCookies } from "react-cookie";
import axios from "axios";
import DashboardGuard from "./components/DashboardGuard";

export default function DashboardHome() {
  const router = useRouter();
  const [cookies] = useCookies(["jwt"]);
  const [formattedDate, setFormattedDate] = useState("");
  const [totalUsers, setTotalUsers] = useState(null);

  // Format current date
  useEffect(() => {
    const now = new Date();
    setFormattedDate(
      now.toLocaleString(undefined, {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  }, []);

  // Fetch user count
  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${HOST}/api/auth/get-all-users`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch users");

        const data = await res.json();
        const count = data.users ? data.users.length : 0;
        setTotalUsers(count);
      } catch (error) {
        console.error("Error fetching user count:", error);
        setTotalUsers("N/A");
      }
    };

    fetchUserCount();
  }, []);

  return (
    <DashboardGuard>
      <DashboardLayout>
      <div className="space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl sm:text-4xl font-bold text-blue-600 tracking-tight">
            Welcome to SkillBloom Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-2 sm:mt-0">{formattedDate}</p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Total Users"
            value={
              totalUsers !== null ? totalUsers.toLocaleString() : "Loading..."
            }
            icon={<FiUsers />}
            color="sky"
          />
          <StatCard
            title="Pending Gigs"
            value="12"
            icon={<FiClipboard />}
            color="yellow"
          />
          <StatCard
            title="Total Revenue"
            value="$24,850"
            icon={<FiDollarSign />}
            color="green"
          />
        </div>

        {/* Recent Activity Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Recent Activity
          </h2>
          <RecentActivityTable />
        </div>
      </div>
    </DashboardLayout>
    </DashboardGuard>
  );
}

function StatCard({ title, value, icon, color }) {
  const colors = {
    sky: {
      bg: "bg-sky-100",
      iconBg: "bg-sky-200 text-sky-700",
      text: "text-sky-900",
    },
    yellow: {
      bg: "bg-yellow-100",
      iconBg: "bg-yellow-200 text-yellow-700",
      text: "text-yellow-900",
    },
    green: {
      bg: "bg-green-100",
      iconBg: "bg-green-200 text-green-700",
      text: "text-green-900",
    },
  };

  const { bg, iconBg, text } = colors[color] || colors.sky;

  return (
    <div
      className={`${bg} rounded-xl border border-transparent shadow-sm hover:shadow-lg transition p-6 flex flex-col justify-between`}
      role="region"
      aria-label={title}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-lg font-semibold ${text}`}>{title}</h2>
        <div className={`${iconBg} rounded-lg p-3`} aria-hidden="true">
          {React.cloneElement(icon, { className: "w-6 h-6" })}
        </div>
      </div>
      <p className={`text-3xl font-bold ${text} tracking-tight`}>{value}</p>
    </div>
  );
}
