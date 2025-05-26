import { FiUsers, FiClipboard, FiDollarSign } from "react-icons/fi";
import DashboardLayout from "./layout";
import React from "react";

export default function DashboardHome() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <h1 className="text-4xl font-bold text-blue-500 tracking-tight">
          Welcome to SkillBloom Dashboard
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <StatCard
            title="Total Users"
            value="123"
            icon={<FiUsers />}
            color="sky"
          />
          <StatCard
            title="Pending Gigs"
            value="5"
            icon={<FiClipboard />}
            color="yellow"
          />
          <StatCard
            title="Total Revenue"
            value="$4,500"
            icon={<FiDollarSign />}
            color="green"
          />
        </div>
      </div>
    </DashboardLayout>
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
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-lg font-semibold ${text}`}>{title}</h2>
        <div
          className={`${iconBg} rounded-lg p-3 flex items-center justify-center`}
          aria-hidden="true"
        >
          {React.cloneElement(icon, { className: "w-7 h-7" })}
        </div>
      </div>
      <p className={`text-4xl font-extrabold ${text} tracking-tight`}>
        {value}
      </p>
    </div>
  );
}
