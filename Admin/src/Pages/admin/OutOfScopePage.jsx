import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Table from "@/components/Table";
import SearchBar from "@/components/SearchBar";
import DeleteModal from "@/components/DeleteModal";
import {
  fetchOutOfScope,
  deleteOutOfScope,
} from "@/redux/slices/outOfScopeSlice";
import { Trash2 } from "lucide-react";

const OutOfScopePage = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState(null);

  const {
    outOfScope,
    loading,
    error,
    deleteError,
    deleteLoading,
  } = useSelector((state) => state.outOfScope);

  // Fetch on mount
  useEffect(() => {
    dispatch(fetchOutOfScope());
  }, [dispatch]);

  // Search filter
  const filteredData = useMemo(() => {
    if (!searchQuery) return outOfScope;

    const searchLower = searchQuery.toLowerCase();

    return outOfScope.filter((item) =>
      item.conditionName?.toLowerCase().includes(searchLower)
    );
  }, [searchQuery, outOfScope]);

  // Open delete modal
  const handleDeleteClick = (item) => {
    setSelectedCondition(item);
    setIsDeleteModalOpen(true);
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (selectedCondition?.id) {
      await dispatch(deleteOutOfScope(selectedCondition.id));
      setIsDeleteModalOpen(false);
      setSelectedCondition(null);
    }
  };

  const handleCloseModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedCondition(null);
  };

  // Table columns
  const columns = [
    {
      key: "id",
      label: "ID",
      width: "80px",
    },
    {
      key: "conditionName",
      label: "Condition Name",
      width: "200px",
      render: (value) => (
        <span className="capitalize">{value}</span>
      ),
    },
    {
      key: "canRecommend",
      label: "Can Recommend?",
      width: "150px",
      render: (value) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            value === "No"
              ? "bg-red-100 text-red-600"
              : "bg-green-100 text-green-600"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      width: "100px",
      sortable: false,
      render: (value, row) => (
        <button
          onClick={() => handleDeleteClick(row)}
          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
          title="Delete condition"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Out of Scope Conditions
        </h1>
      </div>

      {/* Search */}
      <div className="mb-6">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search condition..."
          className="max-w-md"
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00CC99]"></div>
        </div>
      )}

      {/* Fetch Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Delete Error */}
      {deleteError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {deleteError}
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <Table data={filteredData} columns={columns} itemsPerPage={10} />
      )}

      {/* Delete Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        userName={selectedCondition?.conditionName || ""}
        userEmail=""
        title="Condition"
        isLoading={deleteLoading}
      />
    </div>
  );
};

export default OutOfScopePage;