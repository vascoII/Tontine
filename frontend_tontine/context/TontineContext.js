// TontineContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { useChainId } from "wagmi";
import { getContractInfo } from "@/services/contracts/contractInfo";

const TontineContext = createContext();

export const useTontine = () => useContext(TontineContext);

import {
  getSilverVaultDataService,
  getGoldVaultDataService,
} from "@/services/contracts/public/tontineServices";

import {
  getSimpleStakeAPR,
  getNodeStakeAPR,
} from "@/services/api/RocketPoolAPI";

export const TontineProvider = ({ children }) => {
  const chainId = useChainId();

  const [silverVaultData, setSilverVaultData] = useState({
    ethLocked: 0,
    apr: 0,
    activeUsers: 0,
    interestGenerated: 0,
  });

  const [goldVaultData, setGoldVaultData] = useState({
    ethLocked: 0,
    apr: 0,
    activeUsers: 0,
    interestGenerated: 0,
  });

  const [rpSimpleAPR, setRpSimpleAPR] = useState(0);
  const [rpNodeAPR, setRpNodeAPR] = useState(0);

  const {
    contractAddressTontine: contractAddressTontine,
    abiTontine: abiTontine,
  } = getContractInfo(chainId);

  /** VAULT  *****/
  const fetchVaultData = async () => {
    try {
      const silverData = await getSilverVaultDataService(
        contractAddressTontine,
        abiTontine
      );
      setSilverVaultData({
        ethLocked: silverData.ethLocked,
        apr: silverData.apr,
        activeUsers: silverData.activeUsers,
        interestGenerated: silverData.interestGenerated,
      });
      const goldData = await getGoldVaultDataService(
        contractAddressTontine,
        abiTontine
      );
      setGoldVaultData({
        ethLocked: goldData.ethLocked,
        apr: goldData.apr,
        activeUsers: goldData.activeUsers,
        interestGenerated: goldData.interestGenerated,
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

  /** VAULT  *****/
  const fetchAprData = async () => {
    try {
      const simpleAPR = await getSimpleStakeAPR();
      setRpSimpleAPR(simpleAPR);

      const nodeAPR = await getNodeStakeAPR();
      setRpNodeAPR(nodeAPR);
    } catch (err) {
      toast({
        title: "Error!",
        description: "An error occured when trying to fetch APR.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const toast = useToast();

  useEffect(() => {
    fetchVaultData();
    fetchAprData();
  }, []);

  return (
    <TontineContext.Provider
      value={{
        silverVaultData,
        goldVaultData,
        rpSimpleAPR,
        rpNodeAPR,
        fetchVaultData,
      }}
    >
      {children}
    </TontineContext.Provider>
  );
};
