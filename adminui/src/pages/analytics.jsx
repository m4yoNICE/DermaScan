import React, { use } from 'react'
import { Line, Pie, Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";
import API from "../services/Api";

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

  const [Oily, setOily] = useState(0);
const [Dry, setDry] = useState(0);
const [Combination, setCombination] = useState(0);
const [Normal, setNormal] = useState(0);
  useEffect(() => {
  
  const fetchSkinTypeData = async () => {
    try {
      const response = await API.fetchSkinUsersAPI();
      const data = response.data || response;
      console.log("Fetched skin type data:", data);

      let oilyCount = 0;
      let dryCount = 0;
      let combinationCount = 0;
      let normalCount = 0;

      data.forEach(user => {
        switch(user.skinType) {
          case 'Oily':
            oilyCount++;
            break;
          case 'Dry':
            dryCount++;
            break;
          case 'Combination':
            combinationCount++;
            break;
          case 'Normal':
            normalCount++;
            break;
        }
      });

      setOily(oilyCount);
      setDry(dryCount);
      setCombination(combinationCount);
      setNormal(normalCount);

    } catch (error) {
      console.error("Error fetching skin type data:", error);
    }

  };
  fetchSkinTypeData();
}, []);

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
            data: [Oily, Dry, Combination, Normal],
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
