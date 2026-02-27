import { createContext, useContext, useMemo, useState } from "react";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [product, setProduct] = useState([
    {
      id: null,
      productName: null,
      productImage: null,
      ingredient: null,
      description: null,
      productType: null,
      locality: null,
      skinType: null,
      dermaTested: null,
      timeRoutine: null,
      score: null,
    },
  ]);
  const value = useMemo(() => ({ product, setProduct }), [product]);
  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};

export const useProduct = () => useContext(ProductContext);
