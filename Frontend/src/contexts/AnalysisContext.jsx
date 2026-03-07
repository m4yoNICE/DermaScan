import { createContext, useContext, useMemo, useState } from "react";

const AnalysisContext = createContext();

export const AnalysisProvider = ({ children }) => {
  const [analysis, setAnalysis] = useState({
    id: null,
    userId: null,
    imageId: null,
    conditionId: null,
    confidenceScores: null,
    status: null,
    condition_name: null,
    canRecommend: null,
    createdAt: null,
    updatedAt: null,
    image_url: null,
  });

  const [recommendation, setRecommendation] = useState([
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
  const value = useMemo(
    () => ({
      analysis,
      setAnalysis,
      recommendation,
      setRecommendation,
    }),
    [analysis, recommendation],
  );
  return (
    <AnalysisContext.Provider value={value}>
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysis = () => useContext(AnalysisContext);
