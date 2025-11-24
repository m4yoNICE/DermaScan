import React from 'react'
import { Line, Pie, Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip
} from "chart.js";

ChartJS.register(
  LineElement,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip
);

export default function analytics() {
  return (
      <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-xl font-bold mb-4">Daily Scan Activity</h3>
  
  <div className="h-48">  {/* shrink chart height here */}
    <Line
      data={{
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "Scans per Day",
            data: [12, 19, 7, 14, 22, 30, 25],
            borderWidth: 2,
          },
        ],
      }}
      options={{ maintainAspectRatio: false }}
    />
  </div>

{/* Pie Chart Example */}
<div className="bg-white p-6 rounded-xl shadow">
  <h3 className="text-xl font-bold mb-4">Skin Type Distribution</h3>

  <div className="h-48">  {/* shrink chart height here */}
    <Pie
      data={{
        labels: ["Oily", "Dry", "Combination", "Normal"],
        datasets: [
          {
            data: [40, 20, 25, 15],
          },
        ],
      }}
      options={{ maintainAspectRatio: false }}
    />
      </div>
    </div>
</div>
  )
}
