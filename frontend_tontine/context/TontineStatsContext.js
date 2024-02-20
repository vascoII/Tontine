import { createContext, useContext, useState, useEffect } from "react";
import { fetchTontineContractEvents } from "@/services/contracts/events/tontineEventServices";
import { getContractInfo } from "@/services/contracts/contractInfo";
import { useChainId } from "wagmi";

const TontineStatsContext = createContext();

export const useTontineStats = () => useContext(TontineStatsContext);

export const TontineStatsProvider = ({ children }) => {
  const chainId = useChainId();
  const [events, setEvents] = useState({});

  const {
    contractAddressTontine: contractAddressTontine,
    abiTontine: abiTontine,
  } = getContractInfo(chainId);

  useEffect(() => {
    const loadEvents = async () => {
      const eventsData = await fetchTontineContractEvents(
        contractAddressTontine,
        abiTontine
      );
      setEvents(eventsData);
    };
    loadEvents();
  }, [chainId]);

  return (
    <TontineStatsContext.Provider value={{ events }}>
      {" "}
      {children}
    </TontineStatsContext.Provider>
  );
};
