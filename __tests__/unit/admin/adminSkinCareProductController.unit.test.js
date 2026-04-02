import { jest } from "@jest/globals";

const mockGetProductById = jest.fn();
const mockCreateProduct = jest.fn();
const mockUpdateProduct = jest.fn();
const mockDeleteProduct = jest.fn();

jest.unstable_mockModule(
  "../../../AdminBE/services/skinCareProductsService.js",
  () => ({
    getAllProducts: jest.fn(),
    getProductById: mockGetProductById,
    createProduct: mockCreateProduct,
    updateProduct: mockUpdateProduct,
    deleteProduct: mockDeleteProduct,
  })
);

const skinCareProductController = await import(
  "../../../AdminBE/controllers/skinCareProductController.js"
);

const createResMock = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
});

describe("adminSkinCareProductController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createProduct", () => {
    test("returns 201 with product when creation succeeds", async () => {
      const newProduct = {
        id: 1,
        productName: "Cleanser",
        productImage: "cleanser.jpg",
        productType: "Cleanser",
        ingredient: "Salicylic Acid",
        description: "Gentle cleanser",
        locality: "Local",
        skinType: "Oily",
        dermaTested: true,
        timeRoutine: "morning",
      };
      mockCreateProduct.mockResolvedValue(newProduct);
      const req = {
        body: {
          productName: "Cleanser",
          productType: "Cleanser",
          ingredient: "Salicylic Acid",
          description: "Gentle cleanser",
          locality: "Local",
          skinType: "Oily",
          dermaTested: "true",
          timeRoutine: "morning",
          conditionIds: "[1, 2]",
        },
        file: { filename: "cleanser.jpg" },
      };
      const res = createResMock();

      await skinCareProductController.createProduct(req, res);

      expect(mockCreateProduct).toHaveBeenCalledWith(
        expect.objectContaining({
          productName: "Cleanser",
          productImage: "cleanser.jpg",
          dermaTested: true,
        })
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Product created successfully.",
        data: newProduct,
      });
    });

    test("uses null productImage when no file uploaded", async () => {
      const newProduct = { id: 1, productName: "Serum", productImage: null };
      mockCreateProduct.mockResolvedValue(newProduct);
      const req = {
        body: {
          productName: "Serum",
          productType: "Serum",
          dermaTested: "false",
          conditionIds: "[]",
        },
        file: null,
      };
      const res = createResMock();

      await skinCareProductController.createProduct(req, res);

      expect(mockCreateProduct).toHaveBeenCalledWith(
        expect.objectContaining({
          productImage: null,
          dermaTested: false,
        })
      );
      expect(res.status).toHaveBeenCalledWith(201);
    });

    test("returns 500 on error", async () => {
      mockCreateProduct.mockRejectedValue(new Error("DB insert failed"));
      const req = {
        body: { productName: "Product", dermaTested: "false", conditionIds: "[]" },
        file: null,
      };
      const res = createResMock();

      await skinCareProductController.createProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "DB insert failed",
      });
    });
  });

  describe("updateProduct", () => {
    test("returns 200 with updated product when update succeeds", async () => {
      const existingProduct = {
        id: 2,
        productName: "Old Name",
        productImage: "old.jpg",
        productType: "Moisturizer",
      };
      const updatedProduct = {
        id: 2,
        productName: "Updated Moisturizer",
        productImage: "new.jpg",
        productType: "Moisturizer",
      };
      mockGetProductById.mockResolvedValue(existingProduct);
      mockUpdateProduct.mockResolvedValue(updatedProduct);
      const req = {
        params: { id: "2" },
        body: {
          productName: "Updated Moisturizer",
          productType: "Moisturizer",
          dermaTested: "true",
          conditionIds: "[1]",
        },
        file: { filename: "new.jpg" },
      };
      const res = createResMock();

      await skinCareProductController.updateProduct(req, res);

      expect(mockGetProductById).toHaveBeenCalledWith(2);
      expect(mockUpdateProduct).toHaveBeenCalledWith(
        2,
        expect.objectContaining({
          productName: "Updated Moisturizer",
          productImage: "new.jpg",
          dermaTested: true,
        })
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Product updated successfully",
        data: updatedProduct,
      });
    });

    test("keeps existing productImage when no new file uploaded", async () => {
      const existingProduct = {
        id: 3,
        productName: "Product",
        productImage: "existing.jpg",
      };
      const updatedProduct = { id: 3, productName: "Product Updated", productImage: "existing.jpg" };
      mockGetProductById.mockResolvedValue(existingProduct);
      mockUpdateProduct.mockResolvedValue(updatedProduct);
      const req = {
        params: { id: "3" },
        body: { productName: "Product Updated", dermaTested: "false", conditionIds: "[]" },
        file: null,
      };
      const res = createResMock();

      await skinCareProductController.updateProduct(req, res);

      expect(mockUpdateProduct).toHaveBeenCalledWith(
        3,
        expect.objectContaining({
          productImage: "existing.jpg",
        })
      );
    });

    test("returns 404 when product not found", async () => {
      mockGetProductById.mockResolvedValue(null);
      const req = {
        params: { id: "999" },
        body: { productName: "X", conditionIds: "[]" },
        file: null,
      };
      const res = createResMock();

      await skinCareProductController.updateProduct(req, res);

      expect(mockGetProductById).toHaveBeenCalledWith(999);
      expect(mockUpdateProduct).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Product not found.",
      });
    });

    test("returns 500 on error", async () => {
      mockGetProductById.mockResolvedValue({ id: 1 });
      mockUpdateProduct.mockRejectedValue(new Error("Update failed"));
      const req = {
        params: { id: "1" },
        body: { productName: "X", conditionIds: "[]" },
        file: null,
      };
      const res = createResMock();

      await skinCareProductController.updateProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Update failed",
      });
    });
  });

  describe("deleteProduct", () => {
    test("returns 200 with success message when delete succeeds", async () => {
      const existingProduct = { id: 5, productName: "To Delete" };
      mockGetProductById.mockResolvedValue(existingProduct);
      mockDeleteProduct.mockResolvedValue(undefined);
      const req = { params: { id: "5" } };
      const res = createResMock();

      await skinCareProductController.deleteProduct(req, res);

      expect(mockGetProductById).toHaveBeenCalledWith(5);
      expect(mockDeleteProduct).toHaveBeenCalledWith(5);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Product deleted successfully",
      });
    });

    test("returns 404 when product not found", async () => {
      mockGetProductById.mockResolvedValue(null);
      const req = { params: { id: "999" } };
      const res = createResMock();

      await skinCareProductController.deleteProduct(req, res);

      expect(mockGetProductById).toHaveBeenCalledWith(999);
      expect(mockDeleteProduct).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Product not found. ",
      });
    });

    test("returns 500 on error", async () => {
      mockGetProductById.mockResolvedValue({ id: 1 });
      mockDeleteProduct.mockRejectedValue(new Error("Delete failed"));
      const req = { params: { id: "1" } };
      const res = createResMock();

      await skinCareProductController.deleteProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Delete failed",
      });
    });
  });
});
