import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOutOfScope } from "../../../redux/slices/outOfScopeSlice.js"; 

const outOfScope = () => {
  const dispatch = useDispatch();
  const { data = [], loading, error } = useSelector((state) => state.outOfScope);
  const [sortConfig, setSortConfig] = useState({ 
    key: null, direction: "asc" 
  });

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchOutOfScope());
  }, [dispatch]);

  const processedData = useMemo(() => {
  let updated = [...data];

  // 🔍 filter
  if (searchQuery) {
    const searchLower = searchQuery.toLowerCase();
    updated = updated.filter((item) =>
      [
        item.email,
        item.conditionName,
        item.status,
        item.confidenceScores,
      ]
        .filter(Boolean)
        .some((field) =>
          field.toString().toLowerCase().includes(searchLower)
        )
    );
  }

  // ↕ sort
  if (sortConfig.key) {
    updated.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue == null) return 1;
      if (bValue == null) return -1;

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }

  return updated;
}, [data, searchQuery, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === "asc" 
        ? "desc" 
        : "asc",
    }))
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Out of Scope Analysis</h1>

      {/* 🔍 search input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border px-3 py-2 rounded w-full max-w-md"
        />
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && processedData.length === 0 && (
        <p>No out-of-scope records found.</p>
      )}

      {!loading && !error && processedData.length > 0 && (
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
              <tr>
                <th
                  className="border px-4 py-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort("skinAnalysisTransactionsId")}
                >
                  ID {sortConfig.key === "skinAnalysisTransactionsId" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                </th>
                <th
                  className="border px-4 py-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort("email")}
                >
                  Email {sortConfig.key === "email" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                </th>
                <th
                  className="border px-4 py-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort("conditionName")}
                >
                  Condition Name {sortConfig.key === "conditionName" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                </th>
                <th
                  className="border px-4 py-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort("status")}
                >
                  Status {sortConfig.key === "status" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                </th>
                <th
                  className="border px-4 py-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort("confidenceScores")}
                >
                  Confidence Scores {sortConfig.key === "confidenceScores" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                </th>
                <th
                  className="border px-4 py-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort("canRecommend")}
                >
                  Can Recommend {sortConfig.key === "canRecommend" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                </th>
                <th
                  className="border px-4 py-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort("createdAt")}
                >
                  Created At {sortConfig.key === "createdAt" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                </th>
                <th
                  className="border px-4 py-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort("updatedAt")}
                >
                  Updated At {sortConfig.key === "updatedAt" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                </th>
              </tr>
            </thead>
          <tbody>
            {processedData.map((item) => (
              <tr key={item.skinAnalysisTransactionsId}>
                <td className="border px-4 py-2">{item.skinAnalysisTransactionsId}</td>
                <td className="border px-4 py-2">{item.email}</td>
                <td className="border px-4 py-2">{item.conditionName}</td>
                <td className="border px-4 py-2">{item.status}</td>
                <td className="border px-4 py-2">{item.confidenceScores}</td>
                <td className="border px-4 py-2">{item.canRecommend}</td>
                <td className="border px-4 py-2">{item.createdAt}</td>
                <td className="border px-4 py-2">{item.updatedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default outOfScope;