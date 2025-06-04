import React from "react";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", revenue: 2000 },
  { month: "Feb", revenue: 2500 },
  { month: "Mar", revenue: 3000 },
  { month: "Apr", revenue: 3500 },
  { month: "May", revenue: 4000 },
  { month: "Jun", revenue: 4500 },
];

export default function RevenueTrendChart() {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Revenue Trends (Last 6 Months)</h3>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#16a34a"
            fill="#bbf7d0"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}