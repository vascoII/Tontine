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
import {
  createPublicClient,
  http,
  parseAbiItem,
  parseEther,
  parseUnits,
} from "viem";
import { hardhat } from "viem/chains";

// Créer un client `viem`
const client = createPublicClient({
  chain: hardhat,
  transport: http(),
});

export const fetchTineContractEvents = async () => {
  try {
    // Récupérer les logs des événements BuyTineEvent
    const buyTineLogs = await client.getLogs({
      event: parseAbiItem(
        "event BuyTineEvent(address userAddress, uint256 tineAmount, uint256 ethAmount)"
      ),
      fromBlock: "0n",
      toBlock: "latest",
    });

    // Récupérer les logs des événements LockTineEvent
    const lockTineLogs = await client.getLogs({
      event: parseAbiItem("event LockTineEvent(address userAddress)"),
      fromBlock: "0n",
      toBlock: "latest",
    });

    // Récupérer les logs des événements UnlockTineEvent
    const unlockTineLogs = await client.getLogs({
      event: parseAbiItem("event UnlockTineEvent(address userAddress)"),
      fromBlock: "0n",
      toBlock: "latest",
    });

    // Récupérer les logs des événements SellTineEvent
    const sellTineLogs = await client.getLogs({
      event: parseAbiItem(
        "event SellTineEvent(address userAddress, uint256 tineAmount, uint256 ethAmount)"
      ),
      fromBlock: "0n",
      toBlock: "latest",
    });

    // Compilation des logs dans un objet events
    const events = {
      buyTine: buyTineLogs.map((log) => ({
        ...log.args,
        eventName: "BuyTineEvent",
      })),
      lockTine: lockTineLogs.map((log) => ({
        ...log.args,
        eventName: "LockTineEvent",
      })),
      unlockTine: unlockTineLogs.map((log) => ({
        ...log.args,
        eventName: "UnlockTineEvent",
      })),
      sellTine: sellTineLogs.map((log) => ({
        ...log.args,
        eventName: "SellTineEvent",
      })),
    };

    return events;
  } catch (err) {
    console.error("Event Tine contract loading error :", err);
    throw err;
  }
};
