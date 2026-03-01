import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOutOfScope } from "../../../redux/slices/outOfScopeSlice.js"; // adjust path

const outOfScope = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.outOfScope);

  useEffect(() => {
    dispatch(fetchOutOfScope());
  }, [dispatch]);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Out of Scope Analysis</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && data.length === 0 && (
        <p>No out-of-scope records found.</p>
      )}

      {!loading && !error && data.length > 0 && (
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Skin Transaction ID</th>
              <th className="border px-4 py-2">Condition ID</th>
              <th className="border px-4 py-2">Condition Name</th>
              <th className="border px-4 py-2">Can Recommend</th>
              <th className="border px-4 py-2">Created At</th>
              <th className="border px-4 py-2">Updated At</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.skinAnalysisTransactionsId}>
                <td className="border px-4 py-2">{item.skinAnalysisTransactionsId}</td>
                <td className="border px-4 py-2">{item.skinConditionsId}</td>
                <td className="border px-4 py-2">{item.conditionName}</td>
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