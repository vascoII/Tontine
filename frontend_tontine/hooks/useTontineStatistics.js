import { useMemo } from "react";
import { useTontineStats } from "@/context/TontineStatsContext";
import { ethers } from "ethers"; // Importe ethers pour utiliser formatEther

export const useTontineStatistics = () => {
  const { events } = useTontineStats();

  const statistics = useMemo(() => {
    const depositEvents = events.deposit || [];
    const withdrawEvents = events.withdraw || [];

    /*********** DEPOSIT ********************/
    const totalDepositsSilver = depositEvents
      .filter((event) => !event._isGoldVault)
      .reduce(
        (acc, event) =>
          acc + parseFloat(ethers.utils.formatEther(event._amount)),
        0
      );

    const totalDepositsGold = depositEvents
      .filter((event) => event._isGoldVault)
      .reduce(
        (acc, event) =>
          acc + parseFloat(ethers.utils.formatEther(event._amount)),
        0
      );

    const totalDepositsCountSilver = depositEvents.filter(
      (event) => !event._isGoldVault
    ).length;

    const totalDepositsCountGold = depositEvents.filter(
      (event) => event._isGoldVault
    ).length;

    const averageDepositsSilver = depositEvents
      .filter((event) => !event._isGoldVault)
      .reduce(
        (acc, event, _, arr) =>
          acc +
          parseFloat(ethers.utils.formatEther(event._amount)) / arr.length,
        0
      );

    const averageDepositsGold = depositEvents
      .filter((event) => event._isGoldVault)
      .reduce(
        (acc, event, _, arr) =>
          acc +
          parseFloat(ethers.utils.formatEther(event._amount)) / arr.length,
        0
      );

    /*********** WITHDRAW ********************/
    const totalWithdrawsSilver = withdrawEvents
      .filter((event) => !event._isGoldVault)
      .reduce(
        (acc, event) =>
          acc + parseFloat(ethers.utils.formatEther(event._amount)),
        0
      );

    const totalWithdrawsGold = withdrawEvents
      .filter((event) => event._isGoldVault)
      .reduce(
        (acc, event) =>
          acc + parseFloat(ethers.utils.formatEther(event._amount)),
        0
      );

    const totalWithdrawsCountSilver = withdrawEvents.filter(
      (event) => !event._isGoldVault
    ).length;

    const totalWithdrawsCountGold = withdrawEvents.filter(
      (event) => event._isGoldVault
    ).length;

    const averageWithdrawsSilver = withdrawEvents
      .filter((event) => !event._isGoldVault)
      .reduce(
        (acc, event, _, arr) =>
          acc +
          parseFloat(ethers.utils.formatEther(event._amount)) / arr.length,
        0
      );

    const averageWithdrawsGold = withdrawEvents
      .filter((event) => event._isGoldVault)
      .reduce(
        (acc, event, _, arr) =>
          acc +
          parseFloat(ethers.utils.formatEther(event._amount)) / arr.length,
        0
      );

    return {
      totalDepositsSilver,
      totalDepositsGold,
      totalDepositsCountSilver,
      totalDepositsCountGold,
      averageDepositsSilver,
      averageDepositsGold,
      totalWithdrawsSilver,
      totalWithdrawsGold,
      totalWithdrawsCountSilver,
      totalWithdrawsCountGold,
      averageWithdrawsSilver,
      averageWithdrawsGold,
    };
  }, [events]);

  return statistics;
};
