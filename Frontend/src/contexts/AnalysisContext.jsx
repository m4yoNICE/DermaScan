import { createContext, useContext, useState } from "react";

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

  const [recommendation, setRecommendation] = useState(null);

  return (
    <AnalysisContext.Provider
      value={{ analysis, setAnalysis, recommendation, setRecommendation }}
    >
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysis = () => useContext(AnalysisContext);
