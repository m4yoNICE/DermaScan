import {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import { UserContext } from "./UserContext";
import Api from "@/services/Api";
import { scheduleAllRoutineNotifications } from "@/utils/scheduleNotifications";

const HomeDataContext = createContext();

export const HomeDataProvider = ({ children }) => {
  const { token, loading } = useContext(UserContext);

  const [journals, setJournals] = useState({});
  const [routineProducts, setRoutineProducts] = useState([]);
  const [reminderLogs, setReminderLogs] = useState({});
  const [analysisLogs, setAnalysisLogs] = useState({});
  const [historyList, setHistoryList] = useState([]);
  const [routineSchedule, setRoutineSchedule] = useState(null);
  const [initialLoaded, setInitialLoaded] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!token) {
      setJournals({});
      setRoutineProducts([]);
      setReminderLogs({});
      setAnalysisLogs({});
      setHistoryList([]);
      setRoutineSchedule(null);
      setInitialLoaded(false);
      return;
    }

    fetchAll();
  }, [token, loading]);

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
    } catch (err) {
      console.error("[HomeData] journals error:", err);
    }
  };

  const fetchRoutineProducts = async () => {
    try {
      const res = await Api.getRoutineProductsAPI();
      console.log("[HomeData] routineProducts:", res.data);
      setRoutineProducts(res.data);
    } catch (err) {
      console.error("[HomeData] routineProducts error:", err);
    }
  };

  const fetchRoutineSchedule = async () => {
    try {
      const res = await Api.getRoutineScheduleAPI();
      setRoutineSchedule(res.data);
      await scheduleAllRoutineNotifications(res.data);
    } catch (err) {
      console.error("[HomeData] routineSchedule error:", err);
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
    } catch (err) {
      console.error("[HomeData] reminderLogs error:", err);
    }
  };

  const fetchAnalysisLogs = async () => {
    try {
      const res = await Api.getHistoryAPI();
      setHistoryList(res.data);
      const normalized = {};
      res.data.forEach((entry) => {
        const date = entry.rawDate;
        if (!normalized[date]) normalized[date] = [];
        normalized[date].push(entry);
      });
      setAnalysisLogs(normalized);
    } catch (err) {
      console.error("[HomeData] analysisLogs error:", err);
    }
  };

  const fetchAll = useCallback(async () => {
    if (!token) {
      setInitialLoaded(false);
      return;
    }
    try {
      await Promise.all([
        fetchJournals(),
        fetchRoutineProducts(),
        fetchReminderLogs(),
        fetchAnalysisLogs(),
        fetchRoutineSchedule(),
      ]);
    } finally {
      setInitialLoaded(true);
    }
  }, [token]);

  const value = useMemo(
    () => ({
      journals,
      routineProducts,
      reminderLogs,
      analysisLogs,
      historyList,
      routineSchedule,
      initialLoaded,
      fetchJournals,
      fetchRoutineProducts,
      fetchReminderLogs,
      fetchAnalysisLogs,
      fetchRoutineSchedule,
      fetchAll,
      dismissLoading: () => setInitialLoaded(true),
    }),
    [
      journals,
      routineProducts,
      reminderLogs,
      analysisLogs,
      historyList,
      routineSchedule,
      initialLoaded,
      fetchAll,
    ],
  );

  return (
    <HomeDataContext.Provider value={value}>
      {children}
    </HomeDataContext.Provider>
  );
};

export const useHomeData = () => useContext(HomeDataContext);
