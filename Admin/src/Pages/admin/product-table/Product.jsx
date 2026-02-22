import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Table from "@/components/Table";
import SearchBar from "@/components/SearchBar";
import DeleteModal from "@/components/DeleteModal";
import {
  fetchProducts,
  getProductById,
  deleteProduct,
} from "@/redux/slices/skinProductSlice";
import { Trash2, Plus, Pencil } from "lucide-react";
import AddProduct from "./AddProductModal";
import EditProductModal from "./EditProductModal";

const Product = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEditProduct, setSelectedEditProduct] = useState(null);

  const {
    products,
    loading,
    error,
    createLoading,
    createError,
    updateLoading,
    updateError,
    deleteLoading,
    deleteError,
    productByIdLoading,
    productByIdError,
  } = useSelector((state) => state.products);

  //fetch data when component mount
  useEffect(() => {
    const abortController = new AbortController();
    dispatch(fetchProducts());

    return () => {
      abortController.abort();
    };
  }, [dispatch]);

  //filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery) return products;

    return products.filter((product) => {
      const searchLower = searchQuery.toLowerCase();

      return (
        product.productName?.toLowerCase().includes(searchLower) ||
        product.productType?.toLowerCase().includes(searchLower) ||
        product.skinType?.toLowerCase().includes(searchLower) ||
        product.locality?.toLowerCase().includes(searchLower)
      );
    });
  }, [products, searchQuery]);

  //handle delete button click
  const handleData = (product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  //handle confirm delete
  const handleConfirmDelete = async () => {
    if (selectedProduct?.id) {
      await dispatch(deleteProduct(selectedProduct.id));
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
    }
  };

  const handleCloseModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedProduct(null);
  };

  const handleEdit = (product) => {
    setSelectedEditProduct(product);
    setIsEditModalOpen(true);
  };

  //table columns config
  const columns = [
    {
      key: "productName",
      label: "Product Name",
      width: "160px",
      render: (value) => (
        <span className="block truncate max-w-[140px]" title={value}>
          {value || "N/A"}
        </span>
      ),
    },
    {
      key: "productImage",
      label: "Image",
      width: "80px",
      render: (value) =>
        value && value !== "NULL" ? (
          <img
            src={value}
            alt="product"
            className="w-10 h-10 object-cover rounded"
          />
        ) : (
          "-"
        ),
    },
    {
      key: "ingredient",
      label: "Ingredient",
      width: "150px",
      render: (value) => (
        <span className="block truncate max-w-[140px]" title={value}>
          {value || "N/A"}
        </span>
      ),
    },
    {
      key: "description",
      label: "Description",
      width: "150px",
      render: (value) => (
        <span className="block truncate max-w-[140px]" title={value}>
          {value || "N/A"}
        </span>
      ),
    },
    {
      key: "productType",
      label: "Type",
      width: "100px",
    },
    {
      key: "skinType",
      label: "Skin Type",
      width: "180px",
      render: (value) => {
        if (!value || value === "NULL") return <span>N/A</span>;
        const types = value.split(",").map((s) => s.trim());
        const visible = types.slice(0, 2);
        const remaining = types.length - 2;
        return (
          <div className="flex flex-wrap gap-1">
            {visible.map((type, i) => (
              <span
                key={i}
                className="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs rounded-full capitalize"
              >
                {type}
              </span>
            ))}
            {remaining > 0 && (
              <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">
                +{remaining} more
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: "locality",
      label: "Locality",
      width: "90px",
      render: (value) => <span className="capitalize">{value || "N/A"}</span>,
    },
    {
      key: "dermaTested",
      label: "Derma Tested",
      width: "110px",
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${value ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}
        >
          {value ? "Yes" : "No"}
        </span>
      ),
    },
    {
      key: "timeRoutine",
      label: "Routine",
      width: "100px",
    },
    {
      key: "createdAt",
      label: "Created At",
      width: "110px",
      render: (value, row) => {
        if (!row.createdAt || row.createdAt === "0001-01-01 00:00:00.000")
          return "-";
        const date = new Date(row.createdAt);
        return `${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}/${date.getFullYear()}`;
      },
    },
    {
      key: "updatedAt",
      label: "Last Updated",
      width: "110px",
      render: (value, row) => {
        if (!row.updatedAt || row.updatedAt === "0001-01-01 00:00:00.000")
          return "-";
        const date = new Date(row.updatedAt);
        return `${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}/${date.getFullYear()}`;
      },
    },
    {
      key: "actions",
      label: "Actions",
      width: "80px",
      sortable: false,
      render: (value, row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleEdit(row)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Edit product"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleData(row)}
            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Delete product"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];
  return (
    <div>
      {/* page header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Products</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#00CC99] text-white text-sm font-medium rounded-lg hover:bg-[#00b389] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* search bar */}
      <div className="mb-6">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search..."
          className="max-w-md"
        />
      </div>

      {/* loading state */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00CC99]"></div>
        </div>
      )}

      {/* error state */}
      {error && (
        <div className="bg-red-50 border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* delete error state */}
      {deleteError && (
        <div className="bg-red-50 border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {deleteError}
        </div>
      )}

      {/* products table */}
      {!loading && !error && (
        <Table data={filteredData} columns={columns} itemsPerPage={10} />
      )}

      <AddProduct
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedEditProduct(null);
        }}
        product={selectedEditProduct}
      />

      {/* deleteModal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        isLoading={deleteLoading}
        title="Product"
      />
    </div>
  );
};

export default Product;
