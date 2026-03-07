import { createContext, useContext, useState, useMemo, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Api from "@/services/Api";

const HomeDataContext = createContext();

export const HomeDataProvider = ({ children }) => {
  const [journals, setJournals] = useState({});
  const [routineNotifications, setRoutineNotifications] = useState([]);
  const [routineLogs, setRoutineLogs] = useState({});
  const [analysisLogs, setAnalysisLogs] = useState({});

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("authToken");
      console.log(
        "HomeDataContext: token check:",
        token ? "found" : "not found",
      );
      if (token) fetchAll();
    };
    checkToken();
  }, []);

  const fetchJournals = async () => {
    try {
      console.log("fetchJournals: calling API");
      const res = await Api.getAllJournalsAPI();
      console.log("fetchJournals result:", res.data);

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
    } catch (err) {
      console.error("Journals fetch error:", err);
    }
  };

  const fetchRoutineNotifications = async () => {
    try {
      console.log("fetchRoutineNotifications: calling API");
      const res = await Api.getRoutineNotificationsAPI();
      console.log("fetchRoutineNotifications result:", res.data);
      setRoutineNotifications(res.data);
    } catch (err) {
      console.error("Routine notifications fetch error:", err);
    }
  };

  const fetchRoutineLogs = async () => {
    try {
      console.log("fetchRoutineLogs: calling API");
      const res = await Api.getRoutineLogsAPI();
      console.log("fetchRoutineLogs result:", res.data);
      const normalized = {};
      res.data.forEach((log) => {
        if (!normalized[log.completedDate]) {
          normalized[log.completedDate] = [];
        }
        normalized[log.completedDate].push(log);
      });
      setRoutineLogs(normalized);
    } catch (err) {
      console.error("Routine logs fetch error:", err);
    }
  };

  const fetchAnalysisLogs = async () => {
    try {
      console.log("fetchAnalysisLogs: calling API");
      const res = await Api.getHistoryAPI();
      console.log("fetchAnalysisLogs result:", res.data);
      const normalized = {};
      res.data.forEach((entry) => {
        const date = entry.createdAt.slice(0, 10);
        if (!normalized[date]) normalized[date] = [];
        normalized[date].push(entry);
      });
      setAnalysisLogs(normalized);
    } catch (err) {
      console.error("Analysis logs fetch error:", err);
    }
  };

  const fetchAll = () => {
    console.log("HomeDataContext: fetchAll triggered");
    fetchJournals();
    fetchRoutineNotifications();
    fetchRoutineLogs();
    fetchAnalysisLogs();
  };

  const value = useMemo(
    () => ({
      journals,
      routineNotifications,
      routineLogs,
      analysisLogs,
      fetchJournals,
      fetchRoutineNotifications,
      fetchRoutineLogs,
      fetchAnalysisLogs,
      fetchAll,
    }),
    [journals, routineNotifications, routineLogs, analysisLogs],
  );

  return (
    <HomeDataContext.Provider value={value}>
      {children}
    </HomeDataContext.Provider>
  );
};

export const useHomeData = () => useContext(HomeDataContext);
