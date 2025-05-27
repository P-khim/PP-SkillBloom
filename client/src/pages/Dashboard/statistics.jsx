"use client";

import { useEffect, useRef, useState } from "react";
import DashboardLayout from "./layout";
import Chart from "chart.js/auto";
import jsPDF from "jspdf";
import {
  FiDollarSign,
  FiTrendingUp,
  FiUsers,
  FiCalendar,
  FiDownload,
  FiRepeat,
} from "react-icons/fi";

export default function Statistics() {
  const chartRef = useRef(null);
  const [chartType, setChartType] = useState("bar");
  const [chartInstance, setChartInstance] = useState(null);
  const [revenueData, setRevenueData] = useState({
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Revenue ($)",
        data: [12000, 15000, 14000, 17000, 19000, 22000],
        backgroundColor: "#3b82f6",
        borderRadius: 5,
        fill: true,
      },
    ],
  });

  const chartOptions = {
    responsive: true,
    animation: { duration: 1000 },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        categoryPercentage: 0.6,
        barPercentage: 0.7,
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `$${value.toLocaleString()}`,
        },
      },
    },
  };

  const downloadPDF = () => {
    if (!chartRef.current) return;

    const canvas = chartRef.current;
    const image = canvas.toDataURL("image/png");

    const pdf = new jsPDF("landscape");
    pdf.setFontSize(20);
    pdf.text("Revenue Chart", 14, 20);
    pdf.addImage(image, "PNG", 10, 30, 270, 120);
    pdf.save("revenue_chart.pdf");
  };

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext("2d");
    if (chartInstance) chartInstance.destroy();

    const newChart = new Chart(ctx, {
      type: chartType,
      data: revenueData,
      options: chartOptions,
    });

    setChartInstance(newChart);

    return () => {
      newChart.destroy();
    };
  }, [chartType, revenueData]);

  const downloadCSV = () => {
    const rows = [["Month", "Revenue"]];
    revenueData.labels.forEach((label, i) => {
      rows.push([label, revenueData.datasets[0].data[i]]);
    });

    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "revenue.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const fetchData = () => {
    // Mocked: Replace with real API call
    const newData = {
      labels: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [
        {
          label: "Revenue ($)",
          data: Array.from({ length: 6 }, () =>
            Math.floor(Math.random() * 10000 + 15000)
          ),
          backgroundColor: "#10b981",
          borderRadius: 5,
          fill: true,
        },
      ],
    };
    setRevenueData(newData);
  };

  const stats = [
    {
      title: "Total Revenue",
      value: "$90,000",
      icon: <FiDollarSign className="text-blue-500" />,
    },
    {
      title: "Monthly Growth",
      value: "15%",
      icon: <FiTrendingUp className="text-green-500" />,
    },
    {
      title: "Active Customers",
      value: "1,250",
      icon: <FiUsers className="text-purple-500" />,
    },
  ];

  return (
    <DashboardLayout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Revenue Overview</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setChartType(chartType === "bar" ? "line" : "bar")}
              className="text-sm px-3 py-1.5 border rounded hover:bg-gray-100 flex items-center gap-1"
            >
              Toggle Chart
            </button>
            <button
              onClick={downloadCSV}
              className="text-sm px-3 py-1.5 border rounded hover:bg-gray-100 flex items-center gap-1"
            >
              <FiDownload /> CSV
            </button>
            <button
              onClick={downloadPDF}
              className="text-sm px-3 py-1.5 border rounded hover:bg-gray-100 flex items-center gap-1"
            >
              <FiDownload /> PDF
            </button>
            <button
              onClick={fetchData}
              className="text-sm px-3 py-1.5 border rounded hover:bg-gray-100 flex items-center gap-1"
            >
              <FiRepeat /> Fetch
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map(({ title, value, icon }) => (
            <div
              key={title}
              className="bg-white rounded-lg shadow p-5 flex gap-4 items-center"
            >
              <div className="p-2 bg-gray-100 rounded-full">{icon}</div>
              <div>
                <p className="text-gray-500 text-sm">{title}</p>
                <p className="text-2xl font-semibold text-gray-800">{value}</p>
              </div>
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
