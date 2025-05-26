"use client";

import { useEffect, useRef } from "react";
import DashboardLayout from "./layout";
import Chart from "chart.js/auto";

export default function Statistics() {
  const chartRef = useRef(null);

  const revenueData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Revenue ($)",
        data: [12000, 15000, 14000, 17000, 19000, 22000],
        backgroundColor: "#3b82f6", 
        borderRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `$${value.toLocaleString()}`,
        },
      },
    },
  };

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext("2d");
    const chartInstance = new Chart(ctx, {
      type: "bar",
      data: revenueData,
      options,
    });

    return () => {
      chartInstance.destroy();
    };
  }, []);

  const stats = [
    { title: "Total Revenue", value: "$90,000" },
    { title: "Monthly Growth", value: "15%" },
    { title: "Active Customers", value: "1,250" },
  ];

  return (
    <DashboardLayout>
      <div>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Revenue Overview
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map(({ title, value }) => (
            <div
              key={title}
              className="bg-white rounded-lg shadow p-5 flex flex-col justify-center"
            >
              <p className="text-gray-500 font-medium">{title}</p>
              <p className="text-3xl font-semibold text-blue-600">{value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <canvas ref={chartRef} />
        </div>
      </div>
    </DashboardLayout>
  );
}
