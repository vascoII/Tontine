// TontineContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import { useToast } from "@chakra-ui/react";

const TontineContext = createContext();

export const useTontine = () => useContext(TontineContext);

import {
  getSilverVaultDataService,
  getGoldVaultDataService,
} from "@/services/contracts/public/tontineServices";

export const TontineProvider = ({ children }) => {
  const [silverVaultData, setSilverVaultData] = useState({
    ethLocked: 0,
    apr: 0,
    activeUsers: 0,
  });

  const [goldVaultData, setGoldVaultData] = useState({
    ethLocked: 0,
    apr: 0,
    activeUsers: 0,
  });

  /** VAULT  *****/
  const fetchVaultData = async () => {
    try {
      const silverData = await getSilverVaultDataService();
      setSilverVaultData({
        ethLocked: silverData.ethLocked,
        apr: silverData.apr,
        activeUsers: silverData.activeUsers,
      });
      const goldData = await getGoldVaultDataService();
      setGoldVaultData({
        ethLocked: goldData.ethLocked,
        apr: goldData.apr,
        activeUsers: goldData.activeUsers,
      });
    } catch (err) {
      toast({
        title: "Error!",
        description: "An error occured when trying to fetch vaults.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const toast = useToast();

  useEffect(() => {
    fetchVaultData();
  }, []);

  return (
    <TontineContext.Provider
      value={{
        silverVaultData,
        setSilverVaultData,
        goldVaultData,
        setGoldVaultData,
      }}
    >
      {children}
    </TontineContext.Provider>
  );
};
