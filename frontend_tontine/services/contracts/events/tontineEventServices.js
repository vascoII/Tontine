"use client";

// WAGMI
import {
  prepareWriteContract,
  writeContract,
  waitForTransaction,
  readContract,
  getPublicClient,
} from "@wagmi/core";
import { useAccount } from "wagmi";

// VIEM (pour les events)
import { createPublicClient, http, parseAbiItem } from "viem";
import { hardhat } from "viem/chains";

// Créer un client `viem`
const client = createPublicClient({
  chain: hardhat,
  transport: http(),
});

export const fetchTontineContractEvents = async (
  contractAddressTontine,
  abiTontine
) => {
  try {
    // Récupérer les logs des événements AddUserEvent
    const addUserLogs = await client.getLogs({
      event: parseAbiItem(
        "event AddUserEvent(address _userAddress, uint256 _amountInSilverVault, uint256 _amountInGoldVault)"
      ),
      fromBlock: "earliest",
      toBlock: "latest",
    });

    // Récupérer les logs des événements DepositEvent
    const depositLogs = await client.getLogs({
      event: parseAbiItem(
        "event DepositEvent(address indexed _user, uint256 _amount, bool _isGoldVault)"
      ),
      fromBlock: "earliest",
      toBlock: "latest",
    });

    // Récupérer les logs des événements WithdrawEvent
    const withdrawLogs = await client.getLogs({
      event: parseAbiItem(
        "event WithdrawEvent(address _user, uint256 _amount, bool _isGoldVault)"
      ),
      fromBlock: "earliest",
      toBlock: "latest",
    });

    // Récupérer les logs des événements CalculateDailyInterestsEvent
    const calculateDailyInterestsLogs = await client.getLogs({
      event: parseAbiItem(
        "event CalculateDailyInterestsEvent(uint256 _lastInterestCalculationDate)"
      ),
      fromBlock: "earliest",
      toBlock: "latest",
    });

    // Compilation des logs dans un objet events
    const events = {
      addUser: addUserLogs.map((log) => ({
        ...log.args,
        eventName: "AddUserEvent",
      })),
      deposit: depositLogs.map((log) => ({
        ...log.args,
        eventName: "DepositEvent",
      })),
      withdraw: withdrawLogs.map((log) => ({
        ...log.args,
        eventName: "WithdrawEvent",
      })),
      calculateDailyInterests: calculateDailyInterestsLogs.map((log) => ({
        ...log.args,
        eventName: "CalculateDailyInterestsEvent",
      })),
    };

    return events;
  } catch (err) {
    console.error("Event Tontine contract loading error :", err);
    throw err;
  }
};
