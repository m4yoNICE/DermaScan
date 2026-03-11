import { createContext, useContext, useState, useMemo, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Api from "@/services/Api";

const HomeDataContext = createContext();

export const HomeDataProvider = ({ children }) => {
  const [journals, setJournals] = useState({});
  const [routineProducts, setRoutineProducts] = useState([]);
  const [reminderLogs, setReminderLogs] = useState({});
  const [analysisLogs, setAnalysisLogs] = useState({});

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("authToken");

      if (token) {
        fetchAll();
      } else {
        console.log("No token. Skipping fetch.");
      }
    };

    checkToken();
  }, []);

  const fetchJournals = async () => {
    try {
      const res = await Api.getAllJournalsAPI();
      const normalized = {};
      res.data.forEach((j) => {
        normalized[j.journalDate] = {
          id: j.id,
          date: j.journalDate,
          text: j.journalText,
          mood: j.mood,
        };
      });
      setJournals(normalized);
      console.log("[HomeData] journals:", normalized);
    } catch (err) {
      console.error("[HomeData] journals error:", err);
    }
  };

  const fetchRoutineProducts = async () => {
    try {
      const res = await Api.getRoutineProductsAPI();
      setRoutineProducts(res.data);
      console.log("[HomeData] routineProducts:", res.data);
    } catch (err) {
      console.error("[HomeData] routineProducts error:", err);
    }
  };

  const fetchReminderLogs = async () => {
    try {
      const res = await Api.getReminderLogsAPI();
      const normalized = {};
      res.data.forEach((log) => {
        if (!normalized[log.completedDate]) normalized[log.completedDate] = [];
        normalized[log.completedDate].push(log.schedule);
      });
      setReminderLogs(normalized);
      console.log("[HomeData] reminderLogs:", normalized);
    } catch (err) {
      console.error("[HomeData] reminderLogs error:", err);
    }
  };

  const fetchAnalysisLogs = async () => {
    try {
      const res = await Api.getHistoryAPI();
      const normalized = {};
      res.data.forEach((entry) => {
        const date = entry.rawDate;
        if (!normalized[date]) normalized[date] = [];
        normalized[date].push(entry);
      });
      setAnalysisLogs(normalized);
      console.log("[HomeData] analysisLogs:", normalized);
    } catch (err) {
      console.error("[HomeData] analysisLogs error:", err);
    }
  };

  const fetchAll = async () => {
    await Promise.all([
      fetchJournals(),
      fetchRoutineProducts(),
      fetchReminderLogs(),
      fetchAnalysisLogs(),
    ]);
  };

  const value = useMemo(
    () => ({
      journals,
      routineProducts,
      reminderLogs,
      analysisLogs,
      fetchJournals,
      fetchRoutineProducts,
      fetchReminderLogs,
      fetchAnalysisLogs,
      fetchAll,
    }),
    [journals, routineProducts, reminderLogs, analysisLogs],
  );

  return (
    <HomeDataContext.Provider value={value}>
      {children}
    </HomeDataContext.Provider>
  );
};

export const useHomeData = () => useContext(HomeDataContext);
