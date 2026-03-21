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
    top3: null,
  });

  const [analysisDescription, setAnalysisDescription] = useState(null);
  const [recommendDescription, setRecommendDescription] = useState(null);

  const [recommendation, setRecommendation] = useState([]);

  const clearAnalysis = () => {
    setAnalysis({
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
      top3: null,
    });
    setRecommendation([]);
    setAnalysisDescription(null);
    setRecommendDescription(null);
  };

  const value = useMemo(
    () => ({
      analysis,
      setAnalysis,
      recommendation,
      setRecommendation,
      analysisDescription,
      setAnalysisDescription,
      recommendDescription,
      setRecommendDescription,
      clearAnalysis,
    }),
    [analysis, recommendation, analysisDescription, recommendDescription],
  );
  return (
    <AnalysisContext.Provider value={value}>
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysis = () => useContext(AnalysisContext);
