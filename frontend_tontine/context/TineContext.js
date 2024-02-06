// TineContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import { useToast } from "@chakra-ui/react";

const TineContext = createContext();

export const useTine = () => useContext(TineContext);

import {
  fetchTokenBalanceService,
  fetchEthBalanceService,
  fetchMaxSupplyService,
  fetchCurrentSupplyService,
  fetchMaxBalanceService,
  fetchMinLockTimeService,
  fetchMinLockAmountService,
} from "@/services/contracts/public/tineServices";

export const TineProvider = ({ children }) => {
  const [smartContractTokenBalance, setSmartContractTokenBalance] = useState(0);
  const [smartContractEthBalance, setSmartContractEthBalance] = useState(0);
  const [smartContractMaxSupply, setSmartContractMaxSupply] = useState(0);
  const [smartContractMaxBalance, setSmartContractMaxBalance] = useState(0);
  const [smartContractCurrentSupply, setSmartContractCurrentSupply] =
    useState(0);
  const [smartContractMintMonthly, setSmartContractMintMonthly] = useState(0);
  const [smartContractMinLockTime, setSmartContractMinLockTime] = useState(0);
  const [smartContractMinLockAmount, setSmartContractMinLockAmount] =
    useState(0);

  const toast = useToast();

  useEffect(() => {
    const checkTineStatus = async () => {
      try {
        const smartContractTineBalance = await fetchTokenBalanceService();
        setSmartContractTokenBalance(smartContractTineBalance);
        const smartContractEthBalance = await fetchEthBalanceService();
        setSmartContractEthBalance(smartContractEthBalance);
        const totalSupply = await fetchCurrentSupplyService();
        setSmartContractCurrentSupply(totalSupply);
        const maxSupply = await fetchMaxSupplyService();
        setSmartContractMaxSupply(Math.round(maxSupply.toString() / 10 ** 18));
        const maxBalance = await fetchMaxBalanceService();
        setSmartContractMaxBalance(maxBalance);
        const smartContractMinLockTimeService = await fetchMinLockTimeService();
        setSmartContractMinLockTime(smartContractMinLockTimeService);
        const smartContractMinLockAmountService =
          await fetchMinLockAmountService();
        setSmartContractMinLockAmount(smartContractMinLockAmountService);
      } catch (err) {
        toast({
          title: "Error!",
          description: "An error occured on Tine Context",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };
    checkTineStatus();
  }, []);

  return (
    <TineContext.Provider
      value={{
        smartContractTokenBalance,
        setSmartContractTokenBalance,
        smartContractEthBalance,
        setSmartContractEthBalance,
        smartContractMaxSupply,
        setSmartContractMaxSupply,
        smartContractMaxBalance,
        setSmartContractMaxBalance,
        smartContractCurrentSupply,
        setSmartContractCurrentSupply,
        smartContractMintMonthly,
        setSmartContractMintMonthly,
        smartContractMinLockTime,
        setSmartContractMinLockTime,
        smartContractMinLockAmount,
        setSmartContractMinLockAmount,
      }}
    >
      {children}
    </TineContext.Provider>
  );
};
