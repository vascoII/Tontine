import { createContext, useContext, useState, useEffect } from "react";
import { fetchTontineContractEvents } from "@/services/contracts/events/tontineEventServices";

const TontineStatsContext = createContext();

export const useTontineStats = () => useContext(TontineStatsContext);

export const TontineStatsProvider = ({ children }) => {
  const [events, setEvents] = useState({});

  useEffect(() => {
    const loadEvents = async () => {
      const eventsData = await fetchTontineContractEvents();
      setEvents(eventsData);
    };
    loadEvents();
  }, []);

  return (
    <TontineStatsContext.Provider value={{ events }}>
      {" "}
      {children}
    </TontineStatsContext.Provider>
  );
};
