import { createContext, useContext, useMemo, useState } from "react";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  /**
   * @typedef {Object} Product
   * @property {number} id
   * @property {string} productName
   * @property {string} productImage
   * @property {string} ingredient
   * @property {string} description
   * @property {string} productType
   * @property {string} locality
   * @property {string} skinType
   * @property {boolean} dermaTested
   * @property {string} timeRoutine
   * @property {number} score
   */

  /** @type {Product[]} */
  const [product, setProduct] = useState([]);

  const value = useMemo(() => ({ product, setProduct }), [product]);
  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};

export const useProduct = () => useContext(ProductContext);
