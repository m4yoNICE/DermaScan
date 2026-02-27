import * as skinCareService from "../services/skinCareProductsService.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await skinCareService.getAllProducts();
    res.status(200).json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await skinCareService.getProductById(Number(req.params.id));
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found." });
    }
    res.status(200).json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const data = {
      ...req.body,
      productImage: req.file ? req.file.filename : null,
      dermaTested: req.body.dermaTested === "true",
    };
    console.log(data);
    const result = await skinCareService.createProduct(data);
    console.log(result);
    res.status(201).json({
      success: true,
      message: "Product created successfully.",
      data: result,
    });

    console.log("Created product:", result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await skinCareService.getProductById(Number(req.params.id));
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found." });
    }

    const data = {
      ...req.body,
      productImage: req.file ? req.file.filename : product.productImage,
      dermaTested: req.body.dermaTested === "true",
    };

    const result = await skinCareService.updateProduct(
      Number(req.params.id),
      data,
    );
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: result,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await skinCareService.getProductById(Number(req.params.id));
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found. " });
    }
    await skinCareService.deleteProduct(Number(req.params.id));
    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
